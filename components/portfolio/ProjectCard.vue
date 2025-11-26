<template>
  <div
    class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all group cursor-pointer"
    @click="$emit('click', project)"
    @mouseenter="startAutoSlide"
    @mouseleave="stopAutoSlide"
  >
    <!-- Carrousel d'images -->
    <div class="relative h-48 bg-gray-200 overflow-hidden">
      <!-- Images -->
      <div
        v-if="projectImages.length > 0"
        class="relative w-full h-full"
      >
        <img
          v-for="(image, index) in projectImages"
          :key="index"
          :src="image"
          :alt="`${project.title} - Image ${index + 1}`"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          :class="{
            'opacity-100': index === currentImageIndex,
            'opacity-0': index !== currentImageIndex
          }"
        >
        
        <!-- Effet de zoom au hover -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
      </div>

      <!-- Pas d'image -->
      <div v-else class="flex items-center justify-center h-full">
        <Icon name="mdi:image" class="h-16 w-16 text-gray-400" />
      </div>
      
      <!-- Badge catégorie -->
      <div class="absolute top-4 right-4">
        <span class="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
          {{ project.category }}
        </span>
      </div>

      <!-- Indicateurs de pagination (si plusieurs images) -->
      <div
        v-if="projectImages.length > 1"
        class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5"
      >
        <div
          v-for="(_, index) in projectImages"
          :key="index"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="{
            'w-6 bg-white': index === currentImageIndex,
            'w-1.5 bg-white bg-opacity-50': index !== currentImageIndex
          }"
        ></div>
      </div>

      <!-- Compteur d'images -->
      <div
        v-if="projectImages.length > 1"
        class="absolute top-4 left-4"
      >
        <span class="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded">
          <Icon name="mdi:image-multiple" class="inline h-3 w-3 mr-1" />
          {{ projectImages.length }}
        </span>
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-black">
        {{ project.title }}
      </h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ project.description }}
      </p>

      <!-- Technologies -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tech in project.technologies?.slice(0, 3)"
          :key="tech"
          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies?.length > 3"
          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
        >
          +{{ project.technologies.length - 3 }}
        </span>
      </div>

      <!-- Statut -->
      <div class="flex items-center justify-between">
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded',
            project.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          ]"
        >
          {{ project.status }}
        </span>
        <span class="text-sm text-gray-500 group-hover:text-black transition-colors">
          Voir plus →
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

// Gérer les images (nouveau format ou ancien)
const projectImages = computed(() => {
  if (props.project.images && props.project.images.length > 0) {
    return props.project.images
  } else if (props.project.image_url) {
    return [props.project.image_url]
  }
  return []
})

// Carrousel automatique au hover
const currentImageIndex = ref(0)
let slideInterval = null

const startAutoSlide = () => {
  if (projectImages.value.length <= 1) return
  
  slideInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % projectImages.value.length
  }, 1500) // Change toutes les 1.5 secondes
}

const stopAutoSlide = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
  currentImageIndex.value = 0 // Retour à la première image
}

onBeforeUnmount(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>