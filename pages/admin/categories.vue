<template>
  <div>
    <!-- Message de succès -->
    <div
      v-if="successMessage"
      class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between"
    >
      <div class="flex items-center">
        <Icon name="mdi:check-circle" class="h-5 w-5 text-green-600 mr-2" />
        <p class="text-sm text-green-800">{{ successMessage }}</p>
      </div>
      <button @click="successMessage = ''" class="text-green-600 hover:text-green-800">
        <Icon name="mdi:close" class="h-5 w-5" />
      </button>
    </div>

    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestion des catégories</h1>
        <p class="mt-2 text-gray-600">Gérez les catégories de vos projets et leur affichage</p>
      </div>
      <button
        v-if="!showForm"
        @click="openCreateForm"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
      >
        <Icon name="mdi:plus" class="h-5 w-5 mr-2" />
        Nouvelle catégorie
      </button>
    </div>

    <!-- Formulaire modal -->
    <div v-if="showForm" class="mb-8">
      <AdminCategoryForm
        :category="editingCategory"
        @success="handleFormSuccess"
        @cancel="handleFormCancel"
      />
    </div>

    <!-- Liste des catégories -->
    <div v-if="!showForm">
      <div v-if="loading" class="text-center py-12">
        <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <div v-else-if="categories.length === 0" class="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Icon name="mdi:shape-outline" class="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p class="text-gray-500 mb-4">Aucune catégorie trouvée</p>
        <button
          @click="openCreateForm"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
        >
          <Icon name="mdi:plus" class="h-5 w-5 mr-2" />
          Créer votre première catégorie
        </button>
      </div>

      <div v-else>
        <!-- Info sur l'affichage -->
        <div class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <Icon name="mdi:information" class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
            <div class="text-sm text-blue-800">
              <p class="font-medium mb-1">À propos de l'affichage des filtres :</p>
              <ul class="list-disc list-inside space-y-1">
                <li><strong>Visible dans les filtres principaux</strong> : Affiché directement sur la page projets</li>
                <li><strong>Masqué</strong> : Accessible via le bouton "Afficher toutes les catégories"</li>
                <li><strong>Ordre d'affichage</strong> : Contrôle l'ordre des boutons de filtres (0 en premier)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Tableau des catégories -->
        <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordre affichage
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affichage filtre
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projets
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">
                    {{ category.display_order }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                      <div class="text-xs text-gray-500">{{ category.slug }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500">{{ category.description || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="category.visible_in_filters"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    <Icon name="mdi:eye" class="h-4 w-4 mr-1" />
                    Visible
                  </span>
                  <span
                    v-else
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600"
                  >
                    <Icon name="mdi:eye-off" class="h-4 w-4 mr-1" />
                    Masqué
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getProjectCount(category.name) }} projet(s)
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editCategory(category)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                    title="Modifier"
                  >
                    <Icon name="mdi:pencil" class="h-5 w-5" />
                  </button>
                  <button
                    @click="deleteCategory(category)"
                    class="text-red-600 hover:text-red-900"
                    :disabled="getProjectCount(category.name) > 0"
                    :class="{ 'opacity-50 cursor-not-allowed': getProjectCount(category.name) > 0 }"
                    title="Supprimer"
                  >
                    <Icon name="mdi:delete" class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Note sur la suppression -->
        <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex">
            <Icon name="mdi:alert" class="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
            <p class="text-sm text-yellow-800">
              <strong>Note :</strong> Vous ne pouvez pas supprimer une catégorie qui contient des projets. Déplacez d'abord les projets vers une autre catégorie.
            </p>
          </div>
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
const categories = ref([])
const projects = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingCategory = ref(null)
const successMessage = ref('')

// Charger les catégories
const loadCategories = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    categories.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// Charger les projets pour compter
const loadProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, category')

    if (error) throw error
    projects.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  }
}

// Compter les projets par catégorie
const getProjectCount = (categoryName) => {
  return projects.value.filter(p => p.category === categoryName).length
}

// Ouvrir le formulaire de création
const openCreateForm = () => {
  editingCategory.value = null
  showForm.value = true
}

// Éditer une catégorie
const editCategory = (category) => {
  editingCategory.value = category
  showForm.value = true
}

// Supprimer une catégorie
const deleteCategory = async (category) => {
  const projectCount = getProjectCount(category.name)
  
  if (projectCount > 0) {
    alert(`Impossible de supprimer cette catégorie car elle contient ${projectCount} projet(s).`)
    return
  }

  if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
    return
  }

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id)

    if (error) throw error
    
    successMessage.value = `La catégorie "${category.name}" a été supprimée avec succès`
    await loadCategories()
    
    // Cacher le message après 5 secondes
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la suppression')
  }
}

// Gestion du formulaire
const handleFormSuccess = async () => {
  const action = editingCategory.value ? 'modifiée' : 'créée'
  const categoryName = editingCategory.value?.name || 'La catégorie'
  
  showForm.value = false
  editingCategory.value = null
  
  await loadCategories()
  
  successMessage.value = `${categoryName} a été ${action} avec succès`
  
  // Cacher le message après 5 secondes
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

const handleFormCancel = () => {
  showForm.value = false
  editingCategory.value = null
}

onMounted(() => {
  loadCategories()
  loadProjects()
})
</script>