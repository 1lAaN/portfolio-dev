<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestion de la veille techno</h1>
        <p class="mt-2 text-gray-600">Gérez les articles de votre veille technologique sur le Cloud Gaming</p>
      </div>
      <div class="flex gap-3">
        <button
          v-if="!showForm"
          @click="openSyncModal"
          class="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md shadow-sm text-sm font-medium hover:bg-blue-50"
        >
          <Icon name="mdi:sync" class="h-5 w-5 mr-2" />
          Synchroniser RSS
        </button>
        <button
          v-if="!showForm"
          @click="showForm = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
        >
          <Icon name="mdi:plus" class="h-5 w-5 mr-2" />
          Nouvel article
        </button>
      </div>
    </div>

    <!-- Modal de synchronisation RSS -->
    <div
      v-if="showSyncModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="closeSyncModal"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Synchronisation RSS - Cloud Gaming</h3>
            <button
              @click="closeSyncModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="mdi:close" class="h-6 w-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- État initial -->
          <div v-if="!syncing && !syncResults" class="text-center py-8">
            <Icon name="mdi:rss" class="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h4 class="text-lg font-medium text-gray-900 mb-2">Prêt à synchroniser</h4>
            <p class="text-sm text-gray-600 mb-6">
              Choisissez le mode de synchronisation pour trouver de nouveaux articles sur le cloud gaming.
            </p>
            
            <!-- Choix du mode -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <button
                @click="syncMode = 'quick'"
                :class="[
                  'p-4 border-2 rounded-lg text-left transition-all',
                  syncMode === 'quick' 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-center mb-2">
                  <Icon name="mdi:flash" class="h-5 w-5 mr-2" />
                  <span class="font-medium">Rapide</span>
                </div>
                <p class="text-xs text-gray-600">Sources officielles uniquement ({{ directFeeds.length }} sources)</p>
                <p class="text-xs text-gray-500 mt-1">~30 secondes</p>
              </button>

              <button
                @click="syncMode = 'full'"
                :class="[
                  'p-4 border-2 rounded-lg text-left transition-all',
                  syncMode === 'full' 
                    ? 'border-black bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-center mb-2">
                  <Icon name="mdi:earth" class="h-5 w-5 mr-2" />
                  <span class="font-medium">Complète</span>
                </div>
                <p class="text-xs text-gray-600">Toutes les sources + recherche par mots-clés</p>
                <p class="text-xs text-gray-500 mt-1">~2-3 minutes</p>
              </button>
            </div>

            <!-- Détails des sources -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div v-if="syncMode === 'quick'">
                <p class="text-sm font-medium text-gray-700 mb-2">Sources officielles :</p>
                <ul class="space-y-1 text-xs text-gray-600">
                  <li v-for="feed in directFeeds" :key="feed.url" class="flex items-center">
                    <Icon name="mdi:check-circle" class="h-4 w-4 text-green-600 mr-2" />
                    {{ feed.name }}
                  </li>
                </ul>
              </div>
              
              <div v-else>
                <p class="text-sm font-medium text-gray-700 mb-2">Sources complètes :</p>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs font-medium text-gray-600 mb-1">Flux RSS officiels ({{ directFeeds.length }}) :</p>
                    <ul class="space-y-1 text-xs text-gray-600 ml-4">
                      <li v-for="feed in directFeeds.slice(0, 3)" :key="feed.url" class="flex items-center">
                        <Icon name="mdi:check-circle" class="h-3 w-3 text-green-600 mr-2" />
                        {{ feed.name }}
                      </li>
                      <li class="text-gray-500">+ {{ directFeeds.length - 3 }} autres...</li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-gray-600 mb-1">Recherche Google News ({{ keywords.length }} mots-clés) :</p>
                    <div class="flex flex-wrap gap-1 ml-4">
                      <span 
                        v-for="keyword in keywords.slice(0, 5)" 
                        :key="keyword"
                        class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {{ keyword }}
                      </span>
                      <span class="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                        +{{ keywords.length - 5 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="startSync"
              class="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 font-medium"
            >
              {{ syncMode === 'quick' ? 'Synchronisation rapide' : 'Synchronisation complète' }}
            </button>
          </div>

          <!-- En cours de synchronisation -->
          <div v-if="syncing" class="py-8">
            <div class="text-center mb-6">
              <Icon name="mdi:loading" class="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h4 class="text-lg font-medium text-gray-900">Synchronisation en cours...</h4>
            </div>

            <!-- Log des opérations -->
            <div class="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-xs">
              <div
                v-for="(log, index) in syncLogs"
                :key="index"
                class="text-green-400 mb-1"
              >
                {{ log }}
              </div>
            </div>
          </div>

          <!-- Résultats -->
          <div v-if="syncResults && !syncing" class="py-8">
            <div class="text-center mb-6">
              <Icon name="mdi:check-circle" class="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h4 class="text-lg font-medium text-gray-900 mb-2">Synchronisation terminée !</h4>
            </div>

            <!-- Statistiques globales -->
            <div class="grid grid-cols-4 gap-4 mb-6">
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-green-600">{{ syncResults.totalSuccess }}</p>
                <p class="text-xs text-green-800">Ajoutés</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-gray-600">{{ syncResults.totalSkipped }}</p>
                <p class="text-xs text-gray-800">Ignorés</p>
              </div>
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-blue-600">{{ syncResults.totalFiltered }}</p>
                <p class="text-xs text-blue-800">Filtrés</p>
              </div>
              <div class="bg-red-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-red-600">{{ syncResults.totalErrors }}</p>
                <p class="text-xs text-red-800">Erreurs</p>
              </div>
            </div>

            <!-- Détails par feed -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <p class="text-sm font-medium text-gray-700 mb-3">Détails par source :</p>
              <div class="space-y-2">
                <div
                  v-for="result in syncResults.feedResults"
                  :key="result.feed"
                  class="flex items-center justify-between text-xs"
                >
                  <span class="font-medium text-gray-900">{{ result.feed }}</span>
                  <span class="text-gray-600">
                    {{ result.success }} ajouté(s), {{ result.skipped }} ignoré(s)
                  </span>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="closeSyncModal"
                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              >
                Fermer
              </button>
              <button
                @click="startSync"
                class="flex-1 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 font-medium"
              >
                Resynchroniser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-8 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">
        {{ isEditing ? 'Modifier l\'article' : 'Nouvel article' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Titre -->
          <div class="md:col-span-2">
            <label for="title" class="block text-sm font-medium text-gray-700">
              Titre *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
            >
          </div>

          <!-- URL -->
          <div>
            <label for="url" class="block text-sm font-medium text-gray-700">
              URL *
            </label>
            <input
              id="url"
              v-model="form.url"
              type="url"
              required
              placeholder="https://..."
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
            >
          </div>

          <!-- Source -->
          <div>
            <label for="source" class="block text-sm font-medium text-gray-700">
              Source *
            </label>
            <input
              id="source"
              v-model="form.source"
              type="text"
              required
              placeholder="Dev.to, Medium..."
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
            >
          </div>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        <!-- Image URL -->
        <div>
          <label for="image_url" class="block text-sm font-medium text-gray-700">
            URL de l'image
          </label>
          <input
            id="image_url"
            v-model="form.image_url"
            type="url"
            placeholder="https://..."
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700">
              Tags (séparés par des virgules)
            </label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              placeholder="nvidia, geforce-now, cloud-gaming"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
            >
          </div>

          <!-- Date de publication -->
          <div>
            <label for="published_at" class="block text-sm font-medium text-gray-700">
              Date de publication
            </label>
            <input
              id="published_at"
              :value="formatDatetimeLocal(form.published_at)"
              @input="form.published_at = $event.target.value"
              type="datetime-local"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
            >
          </div>
        </div>

        <!-- En vedette -->
        <div class="flex items-center">
          <input
            id="is_featured"
            v-model="form.is_featured"
            type="checkbox"
            class="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
          >
          <label for="is_featured" class="ml-2 block text-sm text-gray-700">
            Mettre en vedette (affiché en haut de la page)
          </label>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50"
          >
            {{ loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des articles -->
    <div v-if="!showForm" class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div v-if="loadingList" class="p-8 text-center">
        <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <div v-else-if="articles.length === 0" class="p-8 text-center">
        <Icon name="mdi:newspaper-variant-outline" class="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p class="text-gray-500">Aucun article trouvé</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Article
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Source
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tags
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="article in articles" :key="article.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div v-if="article.image_url" class="flex-shrink-0 h-10 w-10 mr-3">
                    <img :src="article.image_url" :alt="article.title" class="h-10 w-10 rounded object-cover">
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ article.title }}</div>
                    <a :href="article.url" target="_blank" class="text-xs text-blue-600 hover:underline">
                      Voir l'article →
                    </a>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                  {{ article.source }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in article.tags?.slice(0, 3)"
                    :key="tag"
                    class="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(article.published_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="article.is_featured"
                  class="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded"
                >
                  En vedette
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editArticle(article)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Icon name="mdi:pencil" class="h-5 w-5" />
                </button>
                <button
                  @click="deleteArticle(article)"
                  class="text-red-600 hover:text-red-900"
                >
                  <Icon name="mdi:delete" class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const supabase = useSupabase()
const { feeds, directFeeds, keywords, quickSync, fullSync } = useRSSFeed()

const articles = ref([])
const loadingList = ref(true)
const loading = ref(false)
const showForm = ref(false)
const editingArticle = ref(null)

// Variables pour la synchronisation RSS
const showSyncModal = ref(false)
const syncing = ref(false)
const syncLogs = ref([])
const syncResults = ref(null)
const syncMode = ref('quick') // 'quick' ou 'full'

const isEditing = computed(() => !!editingArticle.value)

const form = ref({
  title: '',
  description: '',
  url: '',
  source: '',
  image_url: '',
  tags: [],
  published_at: new Date().toISOString().slice(0, 16),
  is_featured: false
})

const tagsInput = ref('')

// Charger les articles
const loadArticles = async () => {
  loadingList.value = true
  try {
    const { data, error } = await supabase
      .from('tech_watch')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    articles.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loadingList.value = false
  }
}

// Éditer
const editArticle = (article) => {
  editingArticle.value = article
  form.value = { ...article }
  tagsInput.value = article.tags?.join(', ') || ''
  showForm.value = true
}

// Supprimer
const deleteArticle = async (article) => {
  if (!confirm(`Supprimer "${article.title}" ?`)) return

  try {
    const { error } = await supabase
      .from('tech_watch')
      .delete()
      .eq('id', article.id)

    if (error) throw error
    await loadArticles()
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la suppression')
  }
}

// Submit
const handleSubmit = async () => {
  loading.value = true

  try {
    form.value.tags = tagsInput.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    if (isEditing.value) {
      const { error } = await supabase
        .from('tech_watch')
        .update(form.value)
        .eq('id', editingArticle.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('tech_watch')
        .insert([form.value])

      if (error) throw error
    }

    handleCancel()
    await loadArticles()
  } catch (error) {
    console.error('Erreur:', error)
    alert('Une erreur est survenue')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  showForm.value = false
  editingArticle.value = null
  form.value = {
    title: '',
    description: '',
    url: '',
    source: '',
    image_url: '',
    tags: [],
    published_at: new Date().toISOString().slice(0, 16),
    is_featured: false
  }
  tagsInput.value = ''
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

// Gestion de la synchronisation RSS
const openSyncModal = () => {
  showSyncModal.value = true
  syncResults.value = null
  syncLogs.value = []
}

const closeSyncModal = () => {
  if (!syncing.value) {
    showSyncModal.value = false
    // Recharger les articles si des articles ont été ajoutés
    if (syncResults.value && syncResults.value.totalSuccess > 0) {
      loadArticles()
    }
  }
}

const startSync = async () => {
  syncing.value = true
  syncLogs.value = []
  syncResults.value = null

  const onProgress = (message) => {
    syncLogs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
  }

  try {
    let results
    
    if (syncMode.value === 'quick') {
      results = await quickSync(onProgress)
    } else {
      results = await fullSync(onProgress)
    }
    
    syncResults.value = results
  } catch (error) {
    console.error('Erreur sync:', error)
    syncLogs.value.push(`❌ Erreur: ${error.message}`)
  } finally {
    syncing.value = false
  }
}

onMounted(() => {
  loadArticles()
})

// Fonction pour formater la date au bon format pour datetime-local
const formatDatetimeLocal = (dateString) => {
  if (!dateString) return ''
  
  // Convertir en format YYYY-MM-DDTHH:mm (sans secondes)
  const date = new Date(dateString)
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
</script>