// composables/useRSSFeed.js
export const useRSSFeed = () => {
  const supabase = useSupabase()

  /* ----------------------------------------------------------
    📌 1. Mots-clés pour les recherches (Google News RSS)
  ---------------------------------------------------------- */
  const keywords = [
    'cloud gaming',
    'game streaming',
    'GeForce NOW',
    'Xbox Cloud Gaming',
    'xCloud',
    'PlayStation Plus Premium',
    'Amazon Luna',
    'Shadow PC',
    'Google Stadia'
  ]

  /* ----------------------------------------------------------
    📌 2. Flux RSS directs (sources officielles)
  ---------------------------------------------------------- */
  const directFeeds = [
    {
      name: 'NVIDIA GeForce NOW Blog',
      url: 'https://blogs.nvidia.com/blog/category/gaming/feed/',
      tags: ['nvidia', 'geforce-now', 'streaming'],
      cloudGamingOnly: false // Filtre les articles non-cloud gaming
    },
    {
      name: 'Xbox Wire',
      url: 'https://news.xbox.com/en-us/feed/',
      tags: ['xbox', 'microsoft', 'xcloud'],
      cloudGamingOnly: false // Filtre les articles non-cloud gaming
    },
    {
      name: 'PlayStation Blog',
      url: 'https://blog.playstation.com/feed/',
      tags: ['playstation', 'sony', 'ps-plus'],
      cloudGamingOnly: false // Filtre les articles non-cloud gaming
    },
    {
      name: 'The Verge Gaming',
      url: 'https://www.theverge.com/rss/gaming/index.xml',
      tags: ['actualites', 'technologie'],
      cloudGamingOnly: false // Filtre les articles non-cloud gaming
    },
    {
      name: 'IGN Tech',
      url: 'https://www.ign.com/articles?tags=tech&feed=rss',
      tags: ['actualites', 'gaming'],
      cloudGamingOnly: false // Filtre les articles non-cloud gaming
    },
    {
      name: 'Cloud Gaming News - Reddit',
      url: 'https://www.reddit.com/r/cloudygamer/.rss',
      tags: ['reddit', 'cloud-gaming', 'communaute'],
      cloudGamingOnly: true // Tous les articles sont OK (déjà du cloud gaming)
    },
    {
      name: 'Cloud Gaming Report',
      url: 'https://cloud-gaming.com/feed/',
      tags: ['cloud-gaming', 'actualites', 'industrie'],
      cloudGamingOnly: true // Tous les articles sont OK (déjà du cloud gaming)
    }
  ]

  /* ----------------------------------------------------------
    📌 3. Génération dynamique des flux Google News
  ---------------------------------------------------------- */
  const generateKeywordFeeds = () => {
    const feeds = []

    keywords.forEach(keyword => {
      feeds.push({
        name: `Google News: ${keyword}`,
        url: `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=fr&gl=FR&ceid=FR:fr`,
        tags: ['google-news', 'actualites', keyword.toLowerCase().replace(/\s+/g, '-')],
        isKeywordSearch: true
      })
    })

    return feeds
  }

  /* ----------------------------------------------------------
    📌 4. Combine toutes les sources en un tableau
  ---------------------------------------------------------- */
  const getAllFeeds = () => {
    return [...directFeeds, ...generateKeywordFeeds()]
  }

  const feeds = getAllFeeds()

  /* ----------------------------------------------------------
    📌 5. Parser un flux RSS via rss2json
  ---------------------------------------------------------- */
  const parseRSSFeed = async (feedUrl) => {
    try {
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=10`
      )

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)

      const data = await response.json()
      if (data.status !== 'ok') throw new Error(data.message || 'Erreur parsing RSS')

      return data.items || []
    } catch (error) {
      console.error(`Erreur parsing feed ${feedUrl}:`, error)
      return []
    }
  }

  /* ----------------------------------------------------------
    📌 6. Nettoyer le HTML des descriptions
  ---------------------------------------------------------- */
  const cleanDescription = (html) => {
    if (!html) return ''

    const temp = document.createElement('div')
    temp.innerHTML = html

    const text = temp.textContent || temp.innerText || ''
    return text.substring(0, 300).trim()
  }

  /* ----------------------------------------------------------
    📌 7. Trouver l'image associée à un article
  ---------------------------------------------------------- */
  const extractImage = (item) => {
    if (item.thumbnail) return item.thumbnail
    if (item.enclosure?.link) return item.enclosure.link

    if (item.content) {
      const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/)
      if (imgMatch) return imgMatch[1]
    }

    return null
  }

  /* ----------------------------------------------------------
    📌 8. Filtrage STRICT des articles cloud gaming
  ---------------------------------------------------------- */
  const isRelevantToCloudGaming = (article) => {
    const text = `${article.title} ${article.description}`.toLowerCase()

    // Mots-clés OBLIGATOIRES - au moins un doit être présent
    const cloudGamingKeywords = [
      'cloud gaming',
      'game streaming',
      'geforce now',
      'geforcenow',
      'xcloud',
      'xbox cloud gaming',
      'xbox cloud',
      'playstation plus premium',
      'playstation premium',
      'ps plus premium',
      'ps premium',
      'amazon luna',
      'shadow pc',
      'shadow.tech',
      'google stadia',
      'streaming de jeux',
      'jeux en streaming',
      'cloud games',
      'jeu en cloud',
      'remote gaming',
      'jeux à distance',
      'stream',
      'streamer des jeux'
    ]

    const hasCloudGamingKeyword = cloudGamingKeywords.some(k => text.includes(k))

    // Si aucun mot-clé cloud gaming trouvé, rejeter immédiatement
    if (!hasCloudGamingKeyword) return false

    // Mots-clés à EXCLURE (même si contient un mot-clé cloud gaming)
    const excludeKeywords = [
      'podcast',
      'recrutement',
      'emploi',
      'carriere',
      'formation',
      'cours en ligne',
      'webinar',
      'conference',
      'investment',
      'stock price',
      'action',
      'crypto',
      // Exclure articles sur du gaming local
      'download',
      'telecharger',
      'installer',
      'physical copy',
      'copie physique',
      'disc version',
      'version disque',
      // Nouveaux jeux PS Plus SANS cloud
      'jeux gratuits du mois',
      'free games of',
      'monthly games',
      'essential tier', // PS Plus Essential = pas de cloud
      'extra tier' // PS Plus Extra = pas de cloud non plus
    ]

    const hasExcludedKeyword = excludeKeywords.some(k => text.includes(k))

    // Pour PlayStation, accepter UNIQUEMENT si mentionne explicitement Premium ou Cloud
    if (text.includes('playstation') || text.includes('ps plus') || text.includes('ps+')) {
      const isPremiumOrCloud = text.includes('premium') || 
                               text.includes('cloud') || 
                               text.includes('streaming')
      if (!isPremiumOrCloud) return false
    }

    // Article valide si : contient mot-clé cloud gaming ET pas de mot exclu
    return !hasExcludedKeyword
  }

  /* ----------------------------------------------------------
    📌 9. Vérifier si un article existe déjà dans Supabase
  ---------------------------------------------------------- */
  const articleExists = async (url) => {
    try {
      const { data, error } = await supabase
        .from('tech_watch')
        .select('id')
        .eq('url', url)
        .single()

      return !error && !!data
    } catch {
      return false
    }
  }

  /* ----------------------------------------------------------
    📌 10. Synchroniser un seul flux
  ---------------------------------------------------------- */
  const syncFeed = async (feed, onProgress) => {
    try {
      onProgress?.(`📡 Lecture du flux ${feed.name}...`)

      const items = await parseRSSFeed(feed.url)
      if (items.length === 0) {
        onProgress?.(`⚠️ Aucun article trouvé dans ${feed.name}`)
        return { success: 0, skipped: 0, errors: 0, filtered: 0 }
      }

      let successCount = 0
      let skippedCount = 0
      let errorCount = 0
      let filteredCount = 0

      for (const item of items) {
        try {
          // FILTRAGE STRICT pour les recherches par mot-clé
          // Les flux directs marqués cloudGamingOnly passent toujours
          if (feed.isKeywordSearch && !isRelevantToCloudGaming(item)) {
            filteredCount++
            onProgress?.(`⏭️ Filtré (hors sujet): ${item.title.substring(0, 60)}...`)
            continue
          }

          // Pour les flux officiels NON cloud gaming only, filtrer aussi
          if (!feed.cloudGamingOnly && !feed.isKeywordSearch && !isRelevantToCloudGaming(item)) {
            filteredCount++
            onProgress?.(`⏭️ Filtré (hors cloud gaming): ${item.title.substring(0, 60)}...`)
            continue
          }

          if (await articleExists(item.link)) {
            skippedCount++
            continue
          }

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

          const { error } = await supabase.from('tech_watch').insert([article])
          if (error) {
            errorCount++
            console.error(`Erreur insertion "${item.title}"`, error)
          } else {
            successCount++
            onProgress?.(`✅ Ajouté: ${item.title}`)
          }
        } catch (err) {
          console.error('Erreur traitement article:', err)
          errorCount++
        }
      }

      return { success: successCount, skipped: skippedCount, errors: errorCount, filtered: filteredCount }
    } catch (err) {
      console.error(`Erreur sync feed ${feed.name}:`, err)
      return { success: 0, skipped: 0, errors: 1, filtered: 0 }
    }
  }

  /* ----------------------------------------------------------
    📌 11. Synchronisation de TOUS les feeds
  ---------------------------------------------------------- */
  const syncAllFeeds = async (onProgress, options = {}) => {
    const {
      includeDirectFeeds = true,
      includeKeywordFeeds = true,
      maxFeeds = null
    } = options

    let selectedFeeds = []

    if (includeDirectFeeds) selectedFeeds.push(...directFeeds)
    if (includeKeywordFeeds) selectedFeeds.push(...generateKeywordFeeds())
    if (maxFeeds) selectedFeeds = selectedFeeds.slice(0, maxFeeds)

    const results = {
      totalSuccess: 0,
      totalSkipped: 0,
      totalErrors: 0,
      totalFiltered: 0,
      feedResults: []
    }

    onProgress?.('🚀 Démarrage de la synchronisation RSS...')
    onProgress?.(`📊 ${selectedFeeds.length} sources à consulter`)

    for (const feed of selectedFeeds) {
      const result = await syncFeed(feed, onProgress)

      results.totalSuccess += result.success
      results.totalSkipped += result.skipped
      results.totalErrors += result.errors
      results.totalFiltered += result.filtered

      results.feedResults.push({ feed: feed.name, ...result })

      await new Promise(res => setTimeout(res, 500))
    }

    onProgress?.('✅ Synchronisation terminée!')
    onProgress?.(`📈 Résultats: ${results.totalSuccess} ajoutés, ${results.totalSkipped} ignorés, ${results.totalFiltered} filtrés`)

    return results
  }

  /* ----------------------------------------------------------
    📌 12. Raccourcis
  ---------------------------------------------------------- */
  const quickSync = (onProgress) =>
    syncAllFeeds(onProgress, { includeDirectFeeds: true, includeKeywordFeeds: false })

  const fullSync = (onProgress) =>
    syncAllFeeds(onProgress, { includeDirectFeeds: true, includeKeywordFeeds: true })

  /* ----------------------------------------------------------
    📌 13. Retour
  ---------------------------------------------------------- */
  return {
    feeds,
    directFeeds,
    keywords,
    syncAllFeeds,
    quickSync,
    fullSync,
    syncFeed
  }
}