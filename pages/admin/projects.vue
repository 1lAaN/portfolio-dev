<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestion des projets</h1>
        <p class="mt-2 text-gray-600">Gérez tous vos projets depuis cet espace</p>
      </div>
      <button
        v-if="!showForm"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
      >
        <Icon name="mdi:plus" class="h-5 w-5 mr-2" />
        Nouveau projet
      </button>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-8">
      <AdminProjectForm
        :project="editingProject"
        @success="handleFormSuccess"
        @cancel="handleFormCancel"
      />
    </div>

    <!-- Recherche et filtres -->
    <div v-if="!showForm" class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un projet..."
          class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
      </div>
      <select
        v-model="filterCategory"
        class="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
      >
        <option value="">Toutes les catégories</option>
        <option value="Web App">Web App</option>
        <option value="E-commerce">E-commerce</option>
        <option value="Mobile">Mobile</option>
        <option value="API">API</option>
        <option value="Open Source">Open Source</option>
      </select>
    </div>

    <!-- Tableau des projets -->
    <div v-if="!showForm" class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="p-8 text-center">
        <Icon name="mdi:folder-open-outline" class="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p class="text-gray-500">Aucun projet trouvé</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projet
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technologies
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="project in filteredProjects" :key="project.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="project.image_url"
                      :src="project.image_url"
                      :alt="project.title"
                      class="h-10 w-10 rounded object-cover"
                    >
                    <div
                      v-else
                      class="h-10 w-10 rounded bg-gray-200 flex items-center justify-center"
                    >
                      <Icon name="mdi:image-outline" class="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ project.title }}</div>
                    <div class="text-sm text-gray-500">{{ truncate(project.description, 50) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ project.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(project.status)"
                >
                  {{ project.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tech in project.technologies?.slice(0, 3)"
                    :key="tech"
                    class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {{ tech }}
                  </span>
                  <span
                    v-if="project.technologies?.length > 3"
                    class="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded"
                  >
                    +{{ project.technologies.length - 3 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editProject(project)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Icon name="mdi:pencil" class="h-5 w-5" />
                </button>
                <button
                  @click="deleteProject(project)"
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
const projects = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingProject = ref(null)
const searchQuery = ref('')
const filterCategory = ref('')

// Charger les projets
const loadProjects = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    projects.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// Projets filtrés
const filteredProjects = computed(() => {
  let filtered = projects.value

  if (searchQuery.value) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterCategory.value) {
    filtered = filtered.filter(p => p.category === filterCategory.value)
  }

  return filtered
})

// Éditer un projet
const editProject = (project) => {
  editingProject.value = project
  showForm.value = true
}

// Supprimer un projet
const deleteProject = async (project) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer "${project.title}" ?`)) {
    return
  }

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)

    if (error) throw error
    await loadProjects()
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la suppression')
  }
}

// Gestion du formulaire
const handleFormSuccess = async () => {
  showForm.value = false
  editingProject.value = null
  await loadProjects()
}

const handleFormCancel = () => {
  showForm.value = false
  editingProject.value = null
}

// Utilitaires
const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getStatusClass = (status) => {
  const classes = {
    'Terminé': 'bg-green-100 text-green-800',
    'En cours': 'bg-blue-100 text-blue-800',
    'En pause': 'bg-yellow-100 text-yellow-800',
    'Archivé': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  loadProjects()
})
</script>
