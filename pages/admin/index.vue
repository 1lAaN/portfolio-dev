<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">Bienvenue dans votre panneau d'administration</p>
      </div>
      <button
        @click="handleLogout"
        class="inline-flex items-center px-4 py-2 border border-red-600 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
      >
        <Icon name="mdi:logout" class="h-5 w-5 mr-2" />
        Se déconnecter
      </button>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <Icon name="mdi:folder-multiple" class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Projets</dt>
                <dd class="text-3xl font-bold text-gray-900">{{ stats.totalProjects }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <Icon name="mdi:tools" class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Skills</dt>
                <dd class="text-3xl font-bold text-gray-900">{{ stats.totalSkills }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <Icon name="mdi:newspaper-variant" class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Articles</dt>
                <dd class="text-3xl font-bold text-gray-900">{{ stats.totalArticles }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-orange-100 rounded-lg p-3">
              <Icon name="mdi:file-document" class="h-6 w-6 text-orange-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Documents</dt>
                <dd class="text-3xl font-bold text-gray-900">{{ stats.totalDocuments }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          to="/admin/projects"
          class="flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
        >
          <Icon name="mdi:plus-circle" class="h-6 w-6 mr-3" />
          <span class="font-medium">Ajouter un projet</span>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/skills"
          class="flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
        >
          <Icon name="mdi:plus-circle" class="h-6 w-6 mr-3" />
          <span class="font-medium">Ajouter un skill</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/veille"
          class="flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
        >
          <Icon name="mdi:newspaper-plus" class="h-6 w-6 mr-3" />
          <span class="font-medium">Ajouter un article</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/documents"
          class="flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
        >
          <Icon name="mdi:file-upload" class="h-6 w-6 mr-3" />
          <span class="font-medium">Gérer documents</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Projets récents -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900">Projets récents</h2>
        <NuxtLink
          to="/admin/projects"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Voir tous →
        </NuxtLink>
      </div>

      <div v-if="recentProjects.length === 0" class="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p class="text-gray-500">Aucun projet récent</p>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="project in recentProjects"
            :key="project.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded">
                  <img
                    v-if="project.image_url"
                    :src="project.image_url"
                    :alt="project.title"
                    class="h-10 w-10 rounded object-cover"
                  >
                  <Icon v-else name="mdi:image" class="h-10 w-10 text-gray-400" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ project.title }}</p>
                  <p class="text-xs text-gray-500">{{ project.category }}</p>
                </div>
              </div>
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  project.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ project.status }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Articles récents de veille -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900">Articles de veille récents</h2>
        <NuxtLink
          to="/admin/veille"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Voir tous →
        </NuxtLink>
      </div>

      <div v-if="recentArticles.length === 0" class="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p class="text-gray-500 mb-4">Aucun article de veille</p>
        <NuxtLink
          to="/admin/veille"
          class="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
        >
          <Icon name="mdi:plus" class="h-4 w-4 mr-2" />
          Créer votre premier article
        </NuxtLink>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="article in recentArticles"
            :key="article.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded">
                  <img
                    v-if="article.image_url"
                    :src="article.image_url"
                    :alt="article.title"
                    class="h-10 w-10 rounded object-cover"
                  >
                  <Icon v-else name="mdi:newspaper" class="h-10 w-10 text-gray-400" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ article.title }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-gray-500">{{ article.source }}</span>
                    <span v-if="article.is_featured" class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                      En vedette
                    </span>
                  </div>
                </div>
              </div>
              <a
                :href="article.url"
                target="_blank"
                class="text-blue-600 hover:text-blue-800"
              >
                <Icon name="mdi:open-in-new" class="h-5 w-5" />
              </a>
            </div>
          </li>
        </ul>
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
const { logout } = useAuth()

const stats = ref({
  totalProjects: 0,
  totalSkills: 0,
  totalArticles: 0,
  totalDocuments: 0
})

const recentProjects = ref([])
const recentArticles = ref([])

// Charger les statistiques
const loadStats = async () => {
  try {
    const [projectsRes, skillsRes, articlesRes, documentsRes] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact' }),
      supabase.from('skills').select('id', { count: 'exact' }),
      supabase.from('tech_watch').select('id', { count: 'exact' }),
      supabase.from('documents').select('id', { count: 'exact' })
    ])

    stats.value = {
      totalProjects: projectsRes.count || 0,
      totalSkills: skillsRes.count || 0,
      totalArticles: articlesRes.count || 0,
      totalDocuments: documentsRes.count || 0
    }
  } catch (error) {
    console.error('Erreur:', error)
  }
}

// Charger les projets récents
const loadRecentProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error
    recentProjects.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  }
}

// Charger les articles récents
const loadRecentArticles = async () => {
  try {
    const { data, error } = await supabase
      .from('tech_watch')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error
    recentArticles.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const handleLogout = () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    logout()
  }
}

onMounted(() => {
  loadStats()
  loadRecentProjects()
  loadRecentArticles()
})
</script>