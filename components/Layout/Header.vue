<template>
  <!-- ... ton header existant ... -->
  <div class="hidden md:block">
    <div class="flex items-center space-x-8">
      <button
        v-for="item in navigation"
        :key="item.name"
        @click="scrollToSection(item.href)"
        class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors relative group"
      >
        {{ item.name }}
        <span class="absolute inset-x-0 -bottom-px h-px bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
      </button>
    </div>
  </div>
</template>

<script setup>
// ... ton code existant ...

// Navigation items modifiés pour le scroll
const navigation = [
  { name: 'Accueil', href: 'home' },
  { name: 'À propos', href: 'about' },
  { name: 'Projets', href: 'projects' },
  { name: 'Contact', href: 'contact' }
]

// Ajoute cette fonction
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>