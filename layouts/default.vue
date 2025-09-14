<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <LayoutHeader />
    
    <!-- Contenu principal -->
    <main class="flex-1">
      <slot />
    </main>
    
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
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="mdi:github" class="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="mdi:linkedin" class="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="mdi:twitter" class="w-5 h-5" />
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
                <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Accueil
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/about" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  À propos
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/projects" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Projets
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
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
                hello@portfolio.dev
              </li>
              <li class="flex items-center">
                <Icon name="mdi:map-marker" class="w-4 h-4 mr-2" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="border-t border-gray-200 mt-8 pt-6 text-center">
          <p class="text-sm text-gray-500">
            © {{ currentYear }} Portfolio. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Computed
const currentYear = computed(() => new Date().getFullYear())
</script>