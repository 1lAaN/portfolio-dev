<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Tous mes projets
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez l'ensemble de mes réalisations, des projets personnels aux collaborations professionnelles
          </p>
        </div>
      </div>
    </section>

    <!-- Filtres de catégories -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-wrap gap-3 mb-12">
        <!-- Filtres visibles -->
        <button
          v-for="category in visibleCategories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-6 py-2 rounded-full font-medium transition-all duration-200',
            selectedCategory === category
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          ]"
        >
          {{ category }}
        </button>

        <!-- Bouton "Afficher toutes les catégories" -->
        <div v-if="hiddenCategories.length > 0" class="relative">
          <button
            @click="toggleAllCategories"
            class="px-6 py-2 rounded-full font-medium transition-all duration-200 flex items-center bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          >
            Afficher toutes les catégories
            <Icon 
              :name="showAllCategories ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
              class="ml-2 h-5 w-5" 
            />
          </button>

          <!-- Dropdown avec les catégories cachées -->
          <div
            v-if="showAllCategories"
            class="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[250px]"
          >
            <button
              v-for="category in hiddenCategories"
              :key="category"
              @click="selectedCategory = category; showAllCategories = false"
              :class="[
                'w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors',
                selectedCategory === category ? 'bg-gray-100 font-medium' : ''
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>

      <!-- Compteur de projets -->
      <div class="text-center mb-8">
        <p class="text-gray-600">
          {{ filteredProjects.length }} projet{{ filteredProjects.length > 1 ? 's' : '' }} trouvé{{ filteredProjects.length > 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Grille de projets -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Chargement des projets...</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
        <Icon name="mdi:folder-open-outline" class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-500">Aucun projet trouvé dans cette catégorie</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          @click="openProjectModal(project)"
          class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
        >
          <!-- Image -->
          <div class="relative h-48 bg-gray-200 overflow-hidden">
            <img
              v-if="project.image_url"
              :src="project.image_url"
              :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div v-else class="flex items-center justify-center h-full">
              <Icon name="mdi:image" class="h-16 w-16 text-gray-400" />
            </div>
            
            <!-- Badge catégorie -->
            <div class="absolute top-4 right-4">
              <span class="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                {{ project.category }}
              </span>
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-black">
              {{ project.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ project.description }}
            </p>

            <!-- Technologies -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tech in project.technologies?.slice(0, 3)"
                :key="tech"
                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.technologies?.length > 3"
                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                +{{ project.technologies.length - 3 }}
              </span>
            </div>

            <!-- Statut -->
            <div class="flex items-center justify-between">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded',
                  project.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ project.status }}
              </span>
              <span class="text-sm text-gray-500 group-hover:text-black transition-colors">
                Voir plus →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal détails projet -->
    <div
      v-if="selectedProject"
      @click.self="closeProjectModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Image -->
        <div class="relative h-64 bg-gray-200">
          <img
            v-if="selectedProject.image_url"
            :src="selectedProject.image_url"
            :alt="selectedProject.title"
            class="w-full h-full object-cover"
          >
          <div v-else class="flex items-center justify-center h-full">
            <Icon name="mdi:image" class="h-20 w-20 text-gray-400" />
          </div>
          
          <!-- Bouton fermer -->
          <button
            @click="closeProjectModal"
            class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
          >
            <Icon name="mdi:close" class="h-6 w-6" />
          </button>
        </div>

        <!-- Contenu -->
        <div class="p-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-3xl font-bold text-gray-900">{{ selectedProject.title }}</h2>
            <span class="px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
              {{ selectedProject.category }}
            </span>
          </div>

          <p class="text-gray-600 mb-6">{{ selectedProject.full_description || selectedProject.description }}</p>

          <!-- Technologies -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Technologies utilisées</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in selectedProject.technologies"
                :key="tech"
                class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Liens -->
          <div class="flex gap-4">
            <a
              v-if="selectedProject.demo_url"
              :href="selectedProject.demo_url"
              target="_blank"
              class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
            >
              <Icon name="mdi:open-in-new" class="h-5 w-5 mr-2" />
              Voir la démo
            </a>
            <a
              v-if="selectedProject.github_url"
              :href="selectedProject.github_url"
              target="_blank"
              class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Icon name="mdi:github" class="h-5 w-5 mr-2" />
              Code source
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Configuration SEO
useSeoMeta({
  title: 'Tous mes projets - Portfolio',
  description: 'Découvrez l\'ensemble de mes réalisations en développement web, des projets personnels aux collaborations professionnelles.',
})

const supabase = useSupabase()

// État
const loading = ref(true)
const selectedCategory = ref('Tous')
const selectedProject = ref(null)
const showAllCategories = ref(false)

// Catégories depuis la BDD
const visibleCategories = ref(['Tous'])
const hiddenCategories = ref([])

// Projets
const allProjects = ref([])

// Charger les catégories depuis la BDD
const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    
    // Séparer les catégories visibles et cachées
    const visible = data?.filter(c => c.visible_in_filters).map(c => c.name) || []
    const hidden = data?.filter(c => !c.visible_in_filters).map(c => c.name) || []
    
    visibleCategories.value = ['Tous', ...visible]
    hiddenCategories.value = hidden
    
    console.log('✅ Catégories chargées depuis la BDD:', { visible, hidden })
  } catch (error) {
    console.error('❌ Erreur lors du chargement des catégories:', error)
  }
}

// Charger tous les projets
const loadProjects = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    allProjects.value = data || []
    
    console.log('✅ Projets chargés:', allProjects.value.length)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des projets:', error)
  } finally {
    loading.value = false
  }
}

// Projets filtrés
const filteredProjects = computed(() => {
  if (selectedCategory.value === 'Tous') {
    return allProjects.value
  }
  return allProjects.value.filter(p => p.category === selectedCategory.value)
})

// Modal
const openProjectModal = (project) => {
  selectedProject.value = project
}

const closeProjectModal = () => {
  selectedProject.value = null
}

// Basculer dropdown
const toggleAllCategories = () => {
  showAllCategories.value = !showAllCategories.value
}

// Charger au montage
onMounted(() => {
  loadCategories()
  loadProjects()
})
</script>