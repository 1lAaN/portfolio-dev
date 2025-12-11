<template>
<!-- Footer -->
    <footer class="bg-white border-t border-gray-100 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Colonne 1: Info -->
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
            <p class="text-gray-600 text-sm mb-4">
              Développeur passionné spécialisé dans le développement web moderne. 
              Créateur d'expériences digitales innovantes.
            </p>
            <div class="flex space-x-4">
              <a 
                href="https://github.com/1laan" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="mdi:github" class="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/in/ihlane-ambroise-b3b427329/" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="mdi:linkedin" class="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <!-- Colonne 2: Navigation -->
           <div>
    <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
      Navigation
    </h4>
    <ul class="space-y-2">
      <li>
        <button 
          @click="scrollToSection('home')" 
          class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Accueil
        </button>
      </li>
      <li>
        <button 
          @click="scrollToSection('about')" 
          class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          À propos
        </button>
      </li>
      <li>
        <button 
          @click="scrollToSection('projects')" 
          class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Projets
        </button>
      </li>
      <li>
        <button 
          @click="scrollToSection('contact')" 
          class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Contact
        </button>
      </li>
      <li>
        <NuxtLink to="/veille" class="text-sm text-gray-600 hover:text-gray-900 transition-colors no-underline"> 
          Veille Techno
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/synthese" class="text-sm text-gray-600 hover:text-gray-900 transition-colors no-underline"> 
          Synthèse
        </NuxtLink>
      </li>
    </ul>
  </div>
          
          <!-- Colonne 3: Contact -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <Icon name="mdi:email" class="w-4 h-4 mr-2" />
                ihlane.ambroise@gmail.com
              </li>
              <li class="flex items-center">
                <Icon name="mdi:map-marker" class="w-4 h-4 mr-2" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Copyright avec lien admin -->
        <div class="border-t border-gray-200 mt-8 pt-6 text-center">
          <p class="text-sm text-gray-500">
            © {{ currentYear }} Ihlane. Tous droits réservés.
            <span class="mx-2">•</span>
            <NuxtLink to="/admin/login" class="text-gray-400 hover:text-gray-600 transition-colors text-xs">
              Admin
            </NuxtLink>
          </p>
        </div>
      </div>
    </footer>

</template>
<script setup>
const router = useRouter()
const route = useRoute()

// Computed
const currentYear = computed(() => new Date().getFullYear())

// Méthode de scroll
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

<style scoped>
/* Pour que les boutons ressemblent à des liens */
button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
}

/* Pour que les liens NuxtLink ne soient pas soulignés */
a {
  text-decoration: none;
}
</style>