<!-- pages/index.vue -->
<template>
  <div class="portfolio-home">
    <!-- Section Hero -->
    <section id="home" class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Ihlane Ambroise</h1>
          <p class="hero-subtitle">
            Développeur Full Stack spécialisé dans la création d'expériences digitales modernes et performantes
          </p>
          <div class="hero-actions">
            <button @click="scrollToSection('projects')" class="btn-primary">
              Voir mes projets
            </button>
            <button @click="scrollToSection('contact')" class="btn-secondary">
              Me contacter
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Section À propos -->
    <section id="about" class="about-section">
      <div class="container">
        <div class="section-content">
          <h2 class="section-title">À propos</h2>
          <div class="about-text">
            <p>
              Développeur passionné avec plus de 3 ans d'expérience dans le developpement. 
              Je combine expertise technique et sens du design pour créer des solutions digitales qui font la différence.
            </p>
            <p>
              Spécialisé en Vue.js, Nuxt.js et Node.js, j'accompagne les entreprises dans leur transformation digitale 
              en développant des applications performantes et intuitives.
            </p>
          </div>
          
         <!-- Remplace la section compétences dans ton code -->
    <!-- Compétences -->
    <div class="skills-section">
      <h3 class="skills-title">Skills/tools</h3>
      <p class="skills-subtitle">
        Voici la liste des langages de programmation, frameworks, outils... que je maîtrise.
      </p>
      
      <div class="skills-grid-large">
        <div v-for="skill in detailedSkills" :key="skill.name" class="skill-card-detailed">
          <div class="skill-icon-wrapper">
            <Icon :name="skill.icon" class="skill-icon-large" />
          </div>
          <h4 class="skill-name-large">{{ skill.name }}</h4>
          <p class="skill-description">{{ skill.description }}</p>
          <div class="skill-tags">
            <span 
              v-for="tag in skill.tags" 
              :key="tag" 
              class="skill-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </section>

    <!-- Section Projets récents -->
    <section id="projects" class="projects-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Projets récents</h2>
          <p class="section-subtitle">
            Découvrez mes dernières réalisations, des applications web aux solutions digitales complètes
          </p>
        </div>

        <div class="projects-grid">
          <article v-for="project in recentProjects" :key="project.id" class="project-card">
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
            </div>

            <!-- Contenu -->
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>

              <!-- Technologies -->
              <div class="project-technologies">
                <span v-for="tech in project.technologies" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>

              <!-- Actions -->
              <div class="project-actions">
                <a
                  v-if="project.demoUrl"
                  :href="project.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-demo"
                >
                  <Icon name="mdi:external-link" class="btn-icon" />
                  Démo
                </a>
                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-code"
                >
                  <Icon name="mdi:github" class="btn-icon" />
                  Code
                </a>
              </div>
            </div>
          </article>
        </div>

        <!-- Lien vers tous les projets -->
        <div class="projects-cta">
          <NuxtLink to="/projects" class="btn-all-projects">
            Voir tous les projets
            <Icon name="mdi:arrow-right" class="btn-icon" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section Contact -->
    <section id="contact" class="contact-section">
      <div class="container">
        <h2 class="section-title">Contact</h2>
        <p class="section-subtitle">
          N'hésitez pas à me contacter si vous êtes intéressé par mes services !
        </p>

        <div class="bento-grid">
          <!-- Email -->
          <a href="mailto:ihlane.ambroise@gmail.com" class="bento-item">
            <div class="bento-icon-wrapper">
              <Icon name="mdi:email" class="bento-icon" />
            </div>
            <div class="bento-content">
              <h3>Email</h3>
              <p>ihlane.ambroise@gmail.com</p>
            </div>
          </a>

          <!-- LinkedIn -->
          <a href="https://www.linkedin.com/in/ihlane-ambroise-b3b427329/" target="_blank" class="bento-item">
            <div class="bento-icon-wrapper">
              <Icon name="mdi:linkedin" class="bento-icon" />
            </div>
            <div class="bento-content">
              <h3>LinkedIn</h3>
              <p>Suivre</p>
            </div>
          </a>

          <!-- GitHub -->
          <a href="https://github.com/1laan" target="_blank" class="bento-item">
            <div class="bento-icon-wrapper">
              <Icon name="mdi:github" class="bento-icon" />
            </div>
            <div class="bento-content">
              <h3>GitHub</h3>
              <p>@1laan</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Configuration SEO
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

// Méthodes
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 80 // hauteur du header fixe
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const submitForm = async () => {
  submitting.value = true
  
  try {
    // Simulation d'envoi - remplace par ton API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset du formulaire
    Object.keys(form).forEach(key => form[key] = '')
    
    // Tu peux ajouter une notification de succès ici
    console.log('Message envoyé avec succès!')
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Skills Section détaillée */
.skills-section {
  margin-top: 4rem;
}

.skills-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
}

.skills-subtitle {
  text-align: center;
  color: var(--color-gray-600);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Modifier la largeur du container pour la section skills */
.skills-section .container {
  max-width: 1400px; /* Augmentation de la largeur maximale (au lieu de 1200px) */
}

/* Ajuster la grille pour profiter de l'espace supplémentaire */
.skills-grid-large {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

/* Ajuster les breakpoints pour un meilleur responsive */
@media (min-width: 1200px) {
  .skills-grid-large {
    grid-template-columns: repeat(3, 1fr); /* Force 3 colonnes sur grands écrans */
  }
}

@media (min-width: 1600px) {
  .skills-section .container {
    max-width: 1600px; /* Encore plus large sur très grands écrans */
  }
}

@media (min-width: 768px) {
  .skills-grid-large {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .skills-grid-large {
    grid-template-columns: repeat(3, 1fr);
  }
}

.skill-card-detailed {
  /* background-color: rgba(17, 24, 39, 0.8); */ 
  border: 1px solid rgba(55, 65, 81, 0.5);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  height: 400px; /* Hauteur fixe pour toutes les cartes */
}

.skill-card-detailed:hover {
  border-color: rgba(96, 104, 250, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Pousse les tags en bas */
.skill-description {
  color: var(--color-gray-800);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1; /* Prend l'espace restant */
  display: flex;
  align-items: center; /* Centre verticalement le texte */
}

.skill-icon-wrapper {
  height: 80px; /* Hauteur fixe pour la zone d'icône */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.skill-icon-large {
  width: 4rem;
  height: 4rem;
  color: var(--color-primary)
}

.skill-name-large {
  height: 60px; /* Hauteur fixe pour le titre */
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.skill-tags {
  height: 40px; /* Hauteur fixe pour les tags */
  display: flex;
  align-items: flex-end;

}

/* Modifier la classe skill-tag existante ou l'ajouter */
.skill-tag {
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  background-color: var(--color-gray-300); /* Fond légèrement transparent */
  border: 1px solid rgba(255, 255, 255, 0.2); /* Contour subtil */
  color: var(--color-primary); /* Texte clair */
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background-color: var(--color-gray-800);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--color-gray-100);
}

/* Variables CSS */
.portfolio-home {
  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  
  --container-width: 1200px;
  --section-padding: 5rem 0;
  --border-radius: 0;
  
  font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif;
}

/* Container */
.container {
  max-width: var(--container-width);
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

/* Sections */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 4rem;
}

.about-section,
.projects-section,
.contact-section {
  padding: var(--section-padding);
}

.about-section,
.contact-section {
  background-color: var(--color-gray-50);
}

/* Hero */
.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 4.5rem;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-gray-600);
  margin-bottom: 2rem;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .hero-subtitle {
    font-size: 1.5rem;
  }
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 640px) {
  .hero-actions {
    flex-direction: row;
  }
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

.btn-primary:hover {
  background-color: var(--color-gray-800);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn-secondary:hover {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

/* Sections communes */
.section-content {
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: var(--color-gray-600);
  max-width: 32rem;
  margin: 0 auto;
  line-height: 1.6;
}

/* About */
.about-text {
  margin-bottom: 3rem;
}

.about-text p {
  margin-bottom: 1.5rem;
  color: var(--color-gray-600);
  line-height: 1.7;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}

@media (min-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.skill-card {
  background-color: var(--color-secondary);
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.skill-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.skill-icon {
  width: 2rem;
  height: 2rem;
  margin: 0 auto 0.75rem;
}

.skill-name {
  font-weight: 600;
}

/* Projects */
.projects-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
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

.project-card {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-gray-200);
  transition: box-shadow 0.3s;
}

.project-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.project-image {
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

.project-content {
  padding: 1.5rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  transition: color 0.2s;
}

.project-card:hover .project-title {
  color: var(--color-gray-600);
}

.project-description {
  color: var(--color-gray-600);
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  font-weight: 500;
}

.project-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-demo,
.btn-code {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-demo {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

.btn-demo:hover {
  background-color: var(--color-gray-800);
}

.btn-code {
  border: 1px solid var(--color-gray-300);
  color: var(--color-gray-700);
}

.btn-code:hover {
  background-color: var(--color-gray-50);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.projects-cta {
  text-align: center;
}

.btn-all-projects {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-all-projects:hover {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

/* Contact */
.contact-content {
  display: grid;
  gap: 3rem;
}

@media (min-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-info {
  space-y: 2rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.contact-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 0.25rem;
  color: var(--color-gray-600);
}

.contact-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.contact-link {
  color: var(--color-gray-600);
  text-decoration: none;
  transition: color 0.2s;
}

.contact-link:hover {
  color: var(--color-primary);
}

.contact-text {
  color: var(--color-gray-600);
}

/* Formulaire */
.contact-form {
  space-y: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-gray-300);
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.form-textarea {
  resize: none;
}

.form-submit {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.form-submit:hover:not(:disabled) {
  background-color: var(--color-gray-800);
}

.form-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Ajouter ces styles */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
}

.bento-item {
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.bento-item:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bento-icon-wrapper {
  flex-shrink: 0;
}

.bento-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-primary);
}

.bento-content h3 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-gray-800);
}

.bento-content p {
  color: var(--color-gray-600);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}
</style>