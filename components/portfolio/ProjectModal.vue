<template>
  <div
    v-if="project"
    @click.self="$emit('close')"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Carrousel d'images -->
      <div class="relative h-96 bg-gray-200">
        <div
          v-if="projectImages.length > 0"
          class="relative w-full h-full"
        >
          <!-- Images -->
          <img
            v-for="(image, index) in projectImages"
            :key="index"
            :src="image"
            :alt="`${project.title} - Image ${index + 1}`"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            :class="{
              'opacity-100': index === currentIndex,
              'opacity-0': index !== currentIndex
            }"
          >

          <!-- Navigation précédent/suivant -->
          <template v-if="projectImages.length > 1">
            <button
              @click="prevImage"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
            >
              <Icon name="mdi:chevron-left" class="h-6 w-6" />
            </button>
            <button
              @click="nextImage"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
            >
              <Icon name="mdi:chevron-right" class="h-6 w-6" />
            </button>

            <!-- Compteur d'images -->
            <div class="absolute bottom-4 left-4">
              <span class="px-3 py-1.5 bg-black bg-opacity-70 text-white text-sm font-medium rounded">
                {{ currentIndex + 1 }} / {{ projectImages.length }}
              </span>
            </div>

            <!-- Miniatures -->
            <div class="absolute bottom-4 right-4 flex gap-2 max-w-md overflow-x-auto">
              <button
                v-for="(image, index) in projectImages"
                :key="index"
                @click="currentIndex = index"
                class="flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all"
                :class="{
                  'border-white': index === currentIndex,
                  'border-transparent opacity-60 hover:opacity-100': index !== currentIndex
                }"
              >
                <img
                  :src="image"
                  :alt="`Miniature ${index + 1}`"
                  class="w-full h-full object-cover"
                >
              </button>
            </div>
          </template>
        </div>

        <!-- Pas d'image -->
        <div v-else class="flex items-center justify-center h-full">
          <Icon name="mdi:image" class="h-20 w-20 text-gray-400" />
        </div>
        
        <!-- Bouton fermer -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 shadow-lg"
        >
          <Icon name="mdi:close" class="h-6 w-6" />
        </button>
      </div>

      <!-- Contenu -->
      <div class="p-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-3xl font-bold text-gray-900">{{ project.title }}</h2>
          <span class="px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
            {{ project.category }}
          </span>
        </div>

        <p class="text-gray-600 mb-6 text-lg">
          {{ project.full_description || project.description }}
        </p>

        <!-- Technologies -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Technologies utilisées</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Liens -->
        <div class="flex gap-4">
          <a
            v-if="project.demo_url"
            :href="project.demo_url"
            target="_blank"
            class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            <Icon name="mdi:open-in-new" class="h-5 w-5 mr-2" />
            Voir la démo
          </a>
          <a
            v-if="project.github_url"
            :href="project.github_url"
            target="_blank"
            class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Icon name="mdi:github" class="h-5 w-5 mr-2" />
            Code source
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

// Gérer les images
const projectImages = computed(() => {
  if (props.project?.images && props.project.images.length > 0) {
    return props.project.images
  } else if (props.project?.image_url) {
    return [props.project.image_url]
  }
  return []
})

// Navigation du carrousel
const currentIndex = ref(0)

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % projectImages.value.length
}

const prevImage = () => {
  currentIndex.value = currentIndex.value === 0 
    ? projectImages.value.length - 1 
    : currentIndex.value - 1
}

// Support clavier
const handleKeydown = (e) => {
  if (!props.project) return
  
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Réinitialiser l'index quand on change de projet
watch(() => props.project, () => {
  currentIndex.value = 0
})
</script>