<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white py-20 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Veille Technologique
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Les dernières actualités et tendances du développement web que je suis
          </p>
        </div>
      </div>
    </section>

    <!-- Filtres par tags -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-wrap gap-3 mb-8">
        <button
          @click="selectedTag = 'Tous'"
          :class="[
            'px-4 py-2 rounded-full font-medium transition-all',
            selectedTag === 'Tous'
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          ]"
        >
          Tous
        </button>
        <button
          v-for="tag in availableTags"
          :key="tag"
          @click="selectedTag = tag"
          :class="[
            'px-4 py-2 rounded-full font-medium transition-all',
            selectedTag === tag
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          ]"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Articles en vedette -->
      <div v-if="featuredArticles.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">À la une</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article
            v-for="article in featuredArticles"
            :key="article.id"
            class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
          >
            <div v-if="article.image_url" class="h-48 bg-gray-200 overflow-hidden">
              <img
                :src="article.image_url"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xs font-medium text-gray-500">{{ article.source }}</span>
                <span class="text-gray-300">•</span>
                <span class="text-xs text-gray-500">{{ formatDate(article.published_at) }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-black">
                {{ article.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-4">
                {{ article.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {{ tag }}
                </span>
              </div>
              <a
                :href="article.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center text-sm font-medium text-black hover:underline"
              >
                Lire l'article
                <Icon name="mdi:arrow-right" class="ml-1 h-4 w-4" />
              </a>
            </div>
          </article>
        </div>
      </div>

      <!-- Tous les articles -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ selectedTag === 'Tous' ? 'Tous les articles' : `Articles: ${selectedTag}` }}
        </h2>

        <div v-if="loading" class="text-center py-12">
          <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
          <p class="mt-2 text-gray-500">Chargement...</p>
        </div>

        <div v-else-if="filteredArticles.length === 0" class="text-center py-12">
          <Icon name="mdi:newspaper-variant-outline" class="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500">Aucun article trouvé</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
          >
            <div v-if="article.image_url" class="h-40 bg-gray-200 overflow-hidden">
              <img
                :src="article.image_url"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            <div class="p-5">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium text-gray-500">{{ article.source }}</span>
                <span class="text-gray-300">•</span>
                <span class="text-xs text-gray-500">{{ formatDate(article.published_at) }}</span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-black line-clamp-2">
                {{ article.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ article.description }}
              </p>
              <div class="flex flex-wrap gap-1 mb-3">
                <span
                  v-for="tag in article.tags?.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {{ tag }}
                </span>
              </div>
              <a
                :href="article.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center text-sm font-medium text-black hover:underline"
              >
                Lire l'article
                <Icon name="mdi:arrow-right" class="ml-1 h-4 w-4" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Veille Technologique - Portfolio',
  description: 'Découvrez ma veille technologique et les dernières actualités du développement web que je suis',
})

const supabase = useSupabase()
const loading = ref(true)
const allArticles = ref([])
const selectedTag = ref('Tous')

// Charger les articles
const loadArticles = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('tech_watch')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    allArticles.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// Articles en vedette
const featuredArticles = computed(() => {
  return allArticles.value.filter(a => a.is_featured)
})

// Articles filtrés (hors vedette)
const filteredArticles = computed(() => {
  let articles = allArticles.value.filter(a => !a.is_featured)
  
  if (selectedTag.value !== 'Tous') {
    articles = articles.filter(a => a.tags?.includes(selectedTag.value))
  }
  
  return articles
})

// Tags disponibles
const availableTags = computed(() => {
  const tags = new Set()
  allArticles.value.forEach(article => {
    article.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

// Formater la date
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Aujourd\'hui'
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>