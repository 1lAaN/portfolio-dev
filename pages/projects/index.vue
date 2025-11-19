<!-- pages/projects/index.vue -->
<template>
  <div class="projects-page">
    <!-- Header de la page -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">Tous mes projets</h1>
          <p class="page-subtitle">
            Découvrez l'ensemble de mes réalisations, des projets personnels aux collaborations professionnelles
          </p>
          
          <!-- Filtres -->
          <div class="filters">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              class="filter-btn"
              :class="{ 'active': selectedCategory === category }"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Grille des projets -->
    <section class="projects-grid-section">
      <div class="container">
        <!-- Compteur de projets -->
        <div class="projects-count">
          <p>{{ filteredProjects.length }} projet{{ filteredProjects.length > 1 ? 's' : '' }} trouvé{{ filteredProjects.length > 1 ? 's' : '' }}</p>
        </div>

        <!-- Grille -->
        <div class="projects-grid">
          <article
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
            @click="openProjectModal(project)"
          >
            <!-- Image -->
            <div class="project-image">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                class="project-img"
              >
              <div v-else class="project-placeholder">
                <Icon name="mdi:image-outline" class="placeholder-icon" />
              </div>
              
              <!-- Overlay -->
              <div class="project-overlay">
                <div class="overlay-content">
                  <button class="overlay-btn">
                    <Icon name="mdi:eye" class="w-5 h-5" />
                    Voir le projet
                  </button>
                </div>
              </div>
            </div>

            <!-- Contenu -->
            <div class="project-content">
              <div class="project-header">
                <h3 class="project-title">{{ project.title }}</h3>
                <span class="project-category">{{ project.category }}</span>
              </div>
              
              <p class="project-description">{{ project.description }}</p>

              <!-- Technologies -->
              <div class="project-technologies">
                <span
                  v-for="tech in project.technologies.slice(0, 4)"
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
                <span
                  v-if="project.technologies.length > 4"
                  class="tech-more"
                >
                  +{{ project.technologies.length - 4 }}
                </span>
              </div>

              <!-- Date et liens -->
              <div class="project-footer">
                <span class="project-date">{{ formatDate(project.date) }}</span>
                <div class="project-links">
                  <a
                    v-if="project.demoUrl"
                    :href="project.demoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link demo"
                    @click.stop
                  >
                    <Icon name="mdi:external-link" class="w-4 h-4" />
                  </a>
                  <a
                    v-if="project.githubUrl"
                    :href="project.githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link github"
                    @click.stop
                  >
                    <Icon name="mdi:github" class="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Message si aucun projet -->
        <div v-if="filteredProjects.length === 0" class="no-projects">
          <Icon name="mdi:folder-open-outline" class="no-projects-icon" />
          <h3 class="no-projects-title">Aucun projet trouvé</h3>
          <p class="no-projects-text">Essayez de changer de catégorie ou revenez plus tard !</p>
        </div>
      </div>
    </section>

    <!-- Modal détail projet -->
    <div v-if="selectedProject" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <Icon name="mdi:close" class="w-6 h-6" />
        </button>
        
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedProject.title }}</h2>
          <span class="modal-category">{{ selectedProject.category }}</span>
        </div>

        <div class="modal-image">
          <img
            v-if="selectedProject.image"
            :src="selectedProject.image"
            :alt="selectedProject.title"
            class="modal-img"
          >
          <div v-else class="modal-placeholder">
            <Icon name="mdi:image-outline" class="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <div class="modal-body">
          <div class="modal-description">
            <h3>Description</h3>
            <p>{{ selectedProject.fullDescription || selectedProject.description }}</p>
          </div>

          <div class="modal-technologies">
            <h3>Technologies utilisées</h3>
            <div class="tech-list">
              <span
                v-for="tech in selectedProject.technologies"
                :key="tech"
                class="tech-tag-modal"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <div class="modal-actions">
            <a
              v-if="selectedProject.demoUrl"
              :href="selectedProject.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="modal-btn primary"
            >
              <Icon name="mdi:external-link" class="w-5 h-5" />
              Voir la démo
            </a>
            <a
              v-if="selectedProject.githubUrl"
              :href="selectedProject.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="modal-btn secondary"
            >
              <Icon name="mdi:github" class="w-5 h-5" />
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
  title: 'Tous mes projets - Portfolio John Doe',
  description: 'Découvrez l\'ensemble de mes réalisations en développement web, des projets personnels aux collaborations professionnelles.',
})

// État réactif
const selectedCategory = ref('Tous')
const selectedProject = ref(null)

// Catégories
const categories = ['Tous', 'Web App', 'E-commerce', 'Mobile', 'API', 'Open Source']

const supabase = useSupabase()

// Charger les projets
const recentProjects = ref([])
const loadProjects = async () => {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)
  recentProjects.value = data || []
}

// Charger les skills
const detailedSkills = ref([])
const loadSkills = async () => {
  const { data } = await supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true })
  detailedSkills.value = data || []
}

onMounted(() => {
  loadProjects()
  loadSkills()
})

// Computed
const filteredProjects = computed(() => {
  if (selectedCategory.value === 'Tous') {
    return allProjects
  }
  return allProjects.filter(project => project.category === selectedCategory.value)
})

// Méthodes
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

const openProjectModal = (project) => {
  selectedProject.value = project
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedProject.value = null
  document.body.style.overflow = 'auto'
}

// Cleanup
onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.projects-page {
  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  
  font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif;
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

/* Header */
.page-header {
  padding: 6rem 0 4rem;
  background-color: var(--color-gray-50);
}

.header-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

@media (min-width: 768px) {
  .page-title {
    font-size: 3.5rem;
  }
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  margin-bottom: 3rem;
  line-height: 1.6;
}

/* Filtres */
.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: var(--color-secondary);
  color: var(--color-gray-600);
  border: 1px solid var(--color-gray-300);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.filter-btn:hover {
  background-color: var(--color-gray-50);
  color: var(--color-primary);
}

.filter-btn.active {
  background-color: var(--color-primary);
  color: var(--color-secondary);
  border-color: var(--color-primary);
}

/* Section grille */
.projects-grid-section {
  padding: 4rem 0;
}

.projects-count {
  margin-bottom: 2rem;
  text-align: center;
}

.projects-count p {
  color: var(--color-gray-600);
  font-size: 0.875rem;
}

/* Grille */
.projects-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Cards */
.project-card {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-gray-200);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.project-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.project-image {
  position: relative;
  aspect-ratio: 16 / 9;
  background-color: var(--color-gray-100);
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.project-card:hover .project-img {
  transform: scale(1.05);
}

.project-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 3rem;
  height: 3rem;
  color: var(--color-gray-600);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
}

.overlay-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-secondary);
  color: var(--color-primary);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.overlay-btn:hover {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

/* Contenu card */
.project-content {
  padding: 1.5rem;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.project-category {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  white-space: nowrap;
}

.project-description {
  color: var(--color-gray-600);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-tag {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  font-weight: 500;
}

.tech-more {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: var(--color-gray-200);
  color: var(--color-gray-600);
  font-weight: 500;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-100);
}

.project-date {
  font-size: 0.875rem;
  color: var(--color-gray-600);
}

.project-links {
  display: flex;
  gap: 0.5rem;
}

.project-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-gray-600);
  transition: all 0.2s;
}

.project-link:hover {
  color: var(--color-primary);
  background-color: var(--color-gray-50);
}

/* No projects */
.no-projects {
  text-align: center;
  padding: 4rem 2rem;
}

.no-projects-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: var(--color-gray-600);
}

.no-projects-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
}

.no-projects-text {
  color: var(--color-gray-600);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--color-secondary);
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  width: 100%;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.modal-header {
  padding: 2rem 2rem 1rem;
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
}

.modal-category {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.modal-image {
  aspect-ratio: 16 / 9;
  background-color: var(--color-gray-100);
  overflow: hidden;
}

.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 2rem;
}

.modal-description {
  margin-bottom: 2rem;
}

.modal-description h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-primary);
}

.modal-description p {
  color: var(--color-gray-600);
  line-height: 1.6;
}

.modal-technologies {
  margin-bottom: 2rem;
}

.modal-technologies h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-primary);
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag-modal {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.modal-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  font-family: inherit;
}

.modal-btn.primary {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

.modal-btn.primary:hover {
  background-color: var(--color-gray-800);
}

.modal-btn.secondary {
  border: 1px solid var(--color-gray-300);
  color: var(--color-gray-700);
}

.modal-btn.secondary:hover {
  background-color: var(--color-gray-50);
}
</style>