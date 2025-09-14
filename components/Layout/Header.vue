<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Nom -->
        <div class="flex-shrink-0">
          <NuxtLink 
            to="/" 
            class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Portfolio
          </NuxtLink>
        </div>

        <!-- Navigation desktop -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-8">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors relative group"
              :class="{ 'text-blue-600': isActive(item.href) }"
            >
              {{ item.name }}
              <span 
                class="absolute inset-x-0 -bottom-px h-px bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform"
                :class="{ 'scale-x-100': isActive(item.href) }"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- Bouton CTA -->
        <div class="hidden md:block">
          <UI-Button
            to="/contact"
            variant="primary"
            size="sm"
            class="w-full"
            @click="mobileMenuOpen = false"
            >
            Contact
          </UI-Button>
        </div>

        <!-- Menu mobile -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Icon 
              :name="mobileMenuOpen ? 'mdi:close' : 'mdi:menu'" 
              class="w-6 h-6" 
            />
          </button>
        </div>
      </div>

      <!-- Menu mobile -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div v-show="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': isActive(item.href) }"
            >
              {{ item.name }}
            </NuxtLink>
            
            <UI-Button
                to="/contact"
                variant="primary"
                size="sm"
                icon-right="mdi:arrow-right"
              >
                Contact
              </UI-Button>
            </div>
          </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup>
// State
const mobileMenuOpen = ref(false)
const route = useRoute()

// Navigation items
const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/about' },
  { name: 'Projets', href: '/projects' },
  { name: 'Contact', href: '/contact' }
]

// Méthodes
const isActive = (href) => {
  if (href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(href)
}

// Fermer le menu mobile quand on change de route
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// Fermer le menu mobile si on clique ailleurs
onMounted(() => {
  const handleClickOutside = (event) => {
    if (mobileMenuOpen.value && !event.target.closest('nav')) {
      mobileMenuOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>