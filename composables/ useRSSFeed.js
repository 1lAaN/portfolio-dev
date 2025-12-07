// composables/useRSSFeed.js
export const useRSSFeed = () => {
  const supabase = useSupabase()
  
  // Sources RSS pour Cloud Gaming
  const feeds = [
    {
      name: 'NVIDIA GeForce NOW',
      url: 'https://blogs.nvidia.com/blog/category/gaming/feed/',
      tags: ['nvidia', 'geforce-now', 'streaming']
    },
    {
      name: 'Xbox Wire',
      url: 'https://news.xbox.com/en-us/feed/',
      tags: ['xbox', 'microsoft', 'xcloud']
    },
    {
      name: 'PlayStation Blog',
      url: 'https://blog.playstation.com/feed/',
      tags: ['playstation', 'sony', 'ps-plus']
    },
    {
      name: 'The Verge Gaming',
      url: 'https://www.theverge.com/rss/gaming/index.xml',
      tags: ['actualites', 'technologie']
    },
    {
      name: 'IGN Tech',
      url: 'https://www.ign.com/articles?tags=tech&feed=rss',
      tags: ['actualites', 'gaming']
    }
  ]

  // Parser RSS avec rss2json (gratuit, pas besoin d'install)
  const parseRSSFeed = async (feedUrl) => {
    try {
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=10`
      )
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status !== 'ok') {
        throw new Error(data.message || 'Erreur parsing RSS')
      }
      
      return data.items || []
    } catch (error) {
      console.error(`Erreur parsing feed ${feedUrl}:`, error)
      return []
    }
  }

  // Nettoyer la description HTML
  const cleanDescription = (html) => {
    if (!html) return ''
    
    // Créer un élément temporaire pour parser le HTML
    const temp = document.createElement('div')
    temp.innerHTML = html
    
    // Extraire le texte et limiter à 300 caractères
    const text = temp.textContent || temp.innerText || ''
    return text.substring(0, 300).trim()
  }

  // Extraire l'image depuis le contenu
  const extractImage = (item) => {
    // Essayer différentes sources d'images
    if (item.thumbnail) return item.thumbnail
    if (item.enclosure?.link) return item.enclosure.link
    
    // Essayer de trouver une image dans le contenu HTML
    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/)
      if (imgMatch) return imgMatch[1]
    }
    
    return null
  }

  // Vérifier si un article existe déjà
  const articleExists = async (url) => {
    try {
      const { data, error } = await supabase
        .from('tech_watch')
        .select('id')
        .eq('url', url)
        .single()
      
      return !error && !!data
    } catch (error) {
      return false
    }
  }

  // Synchroniser un feed
  const syncFeed = async (feed, onProgress) => {
    try {
      onProgress?.(`Lecture du flux ${feed.name}...`)
      
      const items = await parseRSSFeed(feed.url)
      
      if (items.length === 0) {
        onProgress?.(`Aucun article trouvé dans ${feed.name}`)
        return { success: 0, skipped: 0, errors: 0 }
      }
      
      let successCount = 0
      let skippedCount = 0
      let errorCount = 0
      
      for (const item of items) {
        try {
          // Vérifier si l'article existe déjà
          const exists = await articleExists(item.link)
          
          if (exists) {
            skippedCount++
            continue
          }
          
          // Préparer l'article
          const article = {
            title: item.title,
            description: cleanDescription(item.description),
            url: item.link,
            source: feed.name,
            image_url: extractImage(item),
            tags: feed.tags,
            published_at: item.pubDate || new Date().toISOString(),
            is_featured: false
          }
          
          // Insérer l'article
          const { error } = await supabase
            .from('tech_watch')
            .insert([article])
          
          if (error) {
            console.error(`Erreur insertion article "${item.title}":`, error)
            errorCount++
          } else {
            successCount++
            onProgress?.(`✅ Ajouté: ${item.title}`)
          }
        } catch (error) {
          console.error('Erreur traitement article:', error)
          errorCount++
        }
      }
      
      return { success: successCount, skipped: skippedCount, errors: errorCount }
    } catch (error) {
      console.error(`Erreur sync feed ${feed.name}:`, error)
      return { success: 0, skipped: 0, errors: 1 }
    }
  }

  // Synchroniser tous les feeds
  const syncAllFeeds = async (onProgress) => {
    const results = {
      totalSuccess: 0,
      totalSkipped: 0,
      totalErrors: 0,
      feedResults: []
    }
    
    onProgress?.('🚀 Démarrage de la synchronisation RSS...')
    
    for (const feed of feeds) {
      const result = await syncFeed(feed, onProgress)
      
      results.totalSuccess += result.success
      results.totalSkipped += result.skipped
      results.totalErrors += result.errors
      
      results.feedResults.push({
        feed: feed.name,
        ...result
      })
      
      // Petit délai entre chaque feed pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    onProgress?.('✅ Synchronisation terminée!')
    
    return results
  }

  return {
    feeds,
    syncAllFeeds,
    syncFeed
  }
}