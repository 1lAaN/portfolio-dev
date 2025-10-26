<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <span class="text-xl font-bold">Portfolio</span>
        </div>

        <!-- Navigation desktop - CENTREE -->
        <div class="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <div class="flex items-center space-x-8">
            <button
              v-for="item in navigation"
              :key="item.name"
              @click="scrollToSection(item.href)"
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
const navigation = [
  { name: 'Accueil', href: 'home' },
  { name: 'À propos', href: 'about' },
  { name: 'Projets', href: 'projects' },
  { name: 'Contact', href: 'contact' }
]

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 2
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>