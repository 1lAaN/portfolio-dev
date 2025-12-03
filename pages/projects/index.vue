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

      <!-- Grille de projets avec ProjectCard -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PortfolioProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @click="openProjectModal(project)"
        />
      </div>
    </section>

    <!-- Modal détails projet avec carrousel -->
    <PortfolioProjectModal
      :project="selectedProject"
      @close="closeProjectModal"
    />
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