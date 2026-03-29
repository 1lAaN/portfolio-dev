<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section id="home" class="bg-white min-h-screen flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-6xl font-bold text-gray-900 mb-6">
            Bonjour, je suis Ihlane
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Développeur junior en 2eme année de BTS SIO SLAM
          </p>
          <div class="flex justify-center gap-4">
            <a
              href="#projets"
              class="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Voir mes projets
            </a>
            <a
              href="#contact"
              class="px-8 py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
            >
              Me contacter
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Expériences -->
    <section id="experiences" class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Expériences</h2>
          <p class="text-xl text-gray-600">Mon parcours en formation et en entreprise</p>
        </div>

        <div v-if="loadingExperiences" class="text-center py-12">
          <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
        </div>

        <div v-else-if="experiences.length === 0" class="text-center py-12">
          <p class="text-gray-500">Aucune expérience à afficher pour le moment</p>
        </div>

        <!-- Frise chronologique -->
        <div v-else class="relative">
          <!-- Ligne centrale -->
          <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden md:block" />

          <div class="space-y-12">
            <div
              v-for="(exp, index) in experiences"
              :key="exp.id"
              :ref="el => { if (el) timelineItems[index] = el }"
              class="timeline-item relative flex items-start gap-8"
              :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
              style="opacity: 0; transition: opacity 0.6s ease, transform 0.6s ease;"
            >
              <!-- Contenu -->
              <div class="flex-1 md:max-w-[calc(50%-2rem)]">
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <!-- Badge type -->
                  <span
                    class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                    :class="typeColor(exp.type)"
                  >
                    {{ exp.type }}
                  </span>

                  <h3 class="text-lg font-bold text-gray-900 mb-1">{{ exp.title }}</h3>
                  <p class="text-sm font-medium text-gray-600 mb-1">{{ exp.organization }}</p>
                  <p v-if="exp.location" class="text-xs text-gray-400 flex items-center gap-1 mb-3">
                    <Icon name="mdi:map-marker" class="w-3 h-3" />
                    {{ exp.location }}
                  </p>
                  <p class="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <Icon name="mdi:calendar" class="w-3 h-3" />
                    {{ formatDate(exp.start_date, exp.exact_date) }} — {{ exp.is_current ? 'Aujourd\'hui' : formatDate(exp.end_date, exp.exact_date) }}
                  </p>
                  <p v-if="exp.description" class="text-sm text-gray-600 leading-relaxed">{{ exp.description }}</p>
                </div>
              </div>

              <!-- Point central -->
              <div class="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                <div class="w-4 h-4 rounded-full bg-black border-4 border-white shadow-md" />
              </div>

              <!-- Espaceur côté opposé -->
              <div class="hidden md:block flex-1 md:max-w-[calc(50%-2rem)]" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section À propos -->
    <section id="about" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">À propos</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionné par le développement web, je transforme vos idées en applications fonctionnelles et esthétiques
          </p>
        </div>
        
        <!-- Skills -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="skill in detailedSkills"
            :key="skill.id"
            class="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors"
          >
            <Icon :name="skill.icon" class="h-12 w-12 mx-auto mb-3 text-gray-900" />
            <h3 class="font-semibold text-gray-900">{{ skill.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Projets récents -->
    <section id="projets" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Projets récents</h2>
          <p class="text-xl text-gray-600">Découvrez mes dernières réalisations !</p>
        </div>

        <!-- Chargement -->
        <div v-if="loading" class="text-center py-12">
          <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
          <p class="mt-2 text-gray-500">Chargement des projets...</p>
        </div>

        <!-- Aucun projet -->
        <div v-else-if="recentProjects.length === 0" class="text-center py-12">
          <Icon name="mdi:folder-open-outline" class="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500">Aucun projet disponible pour le moment</p>
        </div>

        <!-- Grille de projets avec ProjectCard -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <PortfolioProjectCard
            v-for="project in recentProjects"
            :key="project.id"
            :project="project"
            @click="openProjectModal(project)"
          />
        </div>

        <!-- Bouton voir tous les projets -->
        <div class="text-center">
          <NuxtLink
            to="/projects"
            class="inline-flex items-center px-8 py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
          >
            Voir tous les projets
            <Icon name="mdi:arrow-right" class="ml-2 h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section Contact -->
    <section id="contact" class="py-20 bg-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Contactez-moi</h2>
        <p class="text-xl text-gray-600 mb-8">
          Un projet en tête ? Discutons-en !
        </p>
        <a
          href="mailto:ihlane.ambroise@gmail.com"
          class="inline-flex items-center px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Icon name="mdi:email" class="mr-2 h-5 w-5" />
          ihlane.ambroise@gmail.com
        </a>
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
  title: 'Portfolio - Développeur Full-Stack',
  description: 'Portfolio de développeur web spécialisé en Nuxt.js, Vue.js et applications modernes.',
})

const supabase = useSupabase()

// État
const loading = ref(true)
const recentProjects = ref([])
const detailedSkills = ref([])
const selectedProject = ref(null)
const loadingExperiences = ref(true)
const experiences = ref([])
const timelineItems = ref([])
let observer = null

// Charger les projets récents depuis Supabase
const loadRecentProjects = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3) // Seulement les 3 derniers

    if (error) throw error
    recentProjects.value = data || []
    
    console.log('✅ Projets récents chargés:', recentProjects.value)
  } catch (error) {
    console.error('❌ Erreur chargement projets:', error)
  } finally {
    loading.value = false
  }
}

// Charger les skills depuis Supabase
const loadSkills = async () => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true })
      .limit(8) // Limiter à 8 skills pour l'affichage

    if (error) throw error
    detailedSkills.value = data || []
    
    console.log('✅ Skills chargés:', detailedSkills.value.length)
  } catch (error) {
    console.error('❌ Erreur chargement skills:', error)
  }
}

// Modal projet
const openProjectModal = (project) => {
  selectedProject.value = project
}

const closeProjectModal = () => {
  selectedProject.value = null
}

// Charger les expériences depuis Supabase
const loadExperiences = async () => {
  loadingExperiences.value = true
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error
    experiences.value = data || []
  } catch (error) {
    console.error('❌ Erreur chargement expériences:', error)
  } finally {
    loadingExperiences.value = false
  }
}

const formatDate = (dateStr, exact = false) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (exact) return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

const typeColor = (type) => {
  const map = {
    'Stage': 'bg-blue-100 text-blue-700',
    'Diplôme': 'bg-green-100 text-green-700',
    'Formation': 'bg-purple-100 text-purple-700',
    'Emploi': 'bg-orange-100 text-orange-700',
  }
  return map[type] || 'bg-gray-100 text-gray-600'
}

const initScrollObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const index = Number(el.dataset.index)
          const fromLeft = index % 2 === 0
          el.style.opacity = '1'
          el.style.transform = 'translateX(0)'
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.15 }
  )
}

watch(experiences, async () => {
  await nextTick()
  timelineItems.value.forEach((el, index) => {
    if (!el) return
    el.dataset.index = index
    const fromLeft = index % 2 === 0
    el.style.transform = `translateX(${fromLeft ? '-40px' : '40px'})`
    observer?.observe(el)
  })
})

// Charger au montage du composant
onMounted(() => {
  loadRecentProjects()
  loadSkills()
  loadExperiences()
  initScrollObserver()
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
/* Scroll smooth pour les ancres */
html {
  scroll-behavior: smooth;
}
</style>