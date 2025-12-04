<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-xl font-bold hover:text-gray-700 transition-colors">
            Portfolio
          </NuxtLink>
        </div>

        <!-- Navigation desktop - CENTREE -->
        <div class="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <div class="flex items-center space-x-8">
            <button
              v-for="item in navigation"
              :key="item.name"
              @click="handleNavigation(item)"
              class="nav-btn"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- Espace vide pour équilibrer -->
        <div class="flex-shrink-0 w-20 hidden md:block"></div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav-btn {
  background: none !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  padding: 0.5rem 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
  cursor: pointer;
  font-family: inherit;
}

.nav-btn:hover {
  color: #000000 !important;
  text-decoration: underline;
}

.nav-btn:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>

<script setup>
const router = useRouter()
const route = useRoute()

const navigation = [
  { name: 'Accueil', href: 'home', type: 'scroll' },
  { name: 'À propos', href: 'about', type: 'scroll' },
  { name: 'Projets', href: 'projects', type: 'scroll' },
  { name: 'Veille Techno', href: '/veille', type: 'link' },
  { name: 'Synthèse', href: '/synthese', type: 'link' },
  { name: 'Contact', href: 'contact', type: 'scroll' }
]

const handleNavigation = async (item) => {
  if (item.type === 'link') {
    // Navigation vers une page
    await navigateTo(item.href)
  } else {
    // Scroll vers section
    await scrollToSection(item.href)
  }
}

const scrollToSection = async (sectionId) => {
  // Si on est sur la page projects, redirige vers l'accueil
  if (route.path !== '/') {
    await navigateTo('/')
    // Attends que la navigation soit terminée
    await nextTick()
  }
  
  // Puis scroll vers la section
  setTimeout(() => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 120
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, 100)
}
</script>