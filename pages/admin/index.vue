<template>
  <div>
    <!-- Header avec bouton déconnexion -->
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">Bienvenue dans votre panneau d'administration</p>
      </div>
      
      <!-- Bouton de déconnexion visible -->
      <button
        @click="handleLogout"
        class="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
      >
        <Icon name="mdi:logout" class="h-5 w-5 mr-2" />
        Se déconnecter
      </button>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Icon name="mdi:folder-multiple" class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Projets
                </dt>
                <dd class="text-3xl font-bold text-gray-900">
                  {{ stats.totalProjects }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
              <Icon name="mdi:tools" class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Skills
                </dt>
                <dd class="text-3xl font-bold text-gray-900">
                  {{ stats.totalSkills }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <Icon name="mdi:clock-outline" class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Dernière mise à jour
                </dt>
                <dd class="text-lg font-semibold text-gray-900">
                  {{ stats.lastUpdate }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 mb-8">
      <div class="px-6 py-5 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Actions rapides</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            @click="navigateTo('/admin/projects')"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon name="mdi:plus-circle" class="h-5 w-5 mr-2 text-gray-600" />
            <span class="text-sm font-medium text-gray-700">Ajouter un projet</span>
          </button>
          <button
            @click="navigateTo('/admin/skills')"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon name="mdi:plus-circle" class="h-5 w-5 mr-2 text-gray-600" />
            <span class="text-sm font-medium text-gray-700">Ajouter un skill</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Projets récents -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200">
      <div class="px-6 py-5 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Projets récents</h3>
      </div>
      <div class="overflow-hidden">
        <ul v-if="recentProjects.length > 0" class="divide-y divide-gray-200">
          <li v-for="project in recentProjects" :key="project.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ project.title }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ project.description?.substring(0, 100) }}...</p>
              </div>
              <NuxtLink
                to="/admin/projects"
                class="ml-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Gérer
              </NuxtLink>
            </div>
          </li>
        </ul>
        <div v-else class="px-6 py-8 text-center text-gray-500">
          <Icon name="mdi:folder-open-outline" class="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>Aucun projet pour le moment</p>
        </div>
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
  lastUpdate: 'Aujourd\'hui'
})
const recentProjects = ref([])

// Charger les statistiques
const loadStats = async () => {
  try {
    // Compter les projets
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
    
    // Compter les skills
    const { count: skillCount } = await supabase
      .from('skills')
      .select('*', { count: 'exact', head: true })

    stats.value.totalProjects = projectCount || 0
    stats.value.totalSkills = skillCount || 0

    // Charger les 5 derniers projets
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    recentProjects.value = projects || []
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

// Gestion de la déconnexion
const handleLogout = () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    logout()
  }
}

onMounted(() => {
  loadStats()
})
</script>