<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Images du projet ({{ images.length }}/5)
    </label>

    <!-- Grille d'images -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      <!-- Images existantes -->
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative group"
        draggable="true"
        @dragstart="dragStart(index)"
        @dragover.prevent
        @drop="drop(index)"
      >
        <div class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 hover:border-black transition-colors cursor-move">
          <img
            :src="image"
            alt="Image du projet"
            class="w-full h-full object-cover"
          >
          
          <!-- Badge "Couverture" sur la première image -->
          <div v-if="index === 0" class="absolute top-2 left-2">
            <span class="px-2 py-1 bg-black text-white text-xs font-medium rounded">
              Couverture
            </span>
          </div>

          <!-- Numéro de l'image -->
          <div class="absolute top-2 right-2">
            <span class="px-2 py-1 bg-white bg-opacity-90 text-gray-900 text-xs font-medium rounded">
              {{ index + 1 }}
            </span>
          </div>

          <!-- Actions au hover -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                v-if="index !== 0"
                type="button"
                @click="moveToFirst(index)"
                class="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Définir comme couverture"
              >
                <Icon name="mdi:star" class="h-4 w-4 text-yellow-500" />
              </button>
              <button
                type="button"
                @click="removeImage(index)"
                class="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Supprimer"
              >
                <Icon name="mdi:delete" class="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        <!-- Indicateur de drag -->
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="mdi:drag" class="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <!-- Zone d'upload -->
      <div
        v-if="images.length < 5"
        class="relative aspect-video"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          @change="handleFileSelect"
          class="hidden"
        >
        
        <button
          type="button"
          @click="$refs.fileInput.click()"
          :disabled="uploading"
          class="w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <Icon name="mdi:plus" class="h-8 w-8 mb-2" />
          <span class="text-sm">{{ uploading ? 'Upload...' : 'Ajouter' }}</span>
        </button>
      </div>
    </div>

    <!-- Barre de progression -->
    <div v-if="uploading" class="mb-3">
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-black h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      <p class="text-sm text-gray-500 mt-1">Upload en cours... {{ uploadProgress }}%</p>
    </div>

    <!-- Instructions -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
      <p class="font-medium mb-1">💡 Astuces :</p>
      <ul class="list-disc list-inside space-y-1 text-xs">
        <li>La première image est utilisée comme couverture</li>
        <li>Glissez-déposez pour réorganiser les images</li>
        <li>Maximum 5 images par projet</li>
        <li>Formats acceptés : JPG, PNG, WEBP (max 10MB chacune)</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const { uploadImage } = useCloudinary()
const uploading = ref(false)
const uploadProgress = ref(0)
const draggedIndex = ref(null)

// Images locales synchronisées avec le parent
const images = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
})

// Gérer la sélection de fichiers
const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  const remainingSlots = 5 - images.value.length

  if (files.length > remainingSlots) {
    alert(`Vous pouvez ajouter maximum ${remainingSlots} image(s) supplémentaire(s)`)
    return
  }

  // Vérifier chaque fichier
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      alert(`${file.name} n'est pas une image`)
      continue
    }
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name} est trop volumineux (max 10MB)`)
      continue
    }
  }

  try {
    uploading.value = true
    const totalFiles = files.length
    const newImages = []

    for (let i = 0; i < files.length; i++) {
      uploadProgress.value = Math.round(((i + 1) / totalFiles) * 100)
      
      const result = await uploadImage(files[i])
      newImages.push(result.url)
    }

    images.value = [...images.value, ...newImages]
  } catch (error) {
    console.error('Erreur upload:', error)
    alert('Erreur lors de l\'upload des images')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
    event.target.value = '' // Reset input
  }
}

// Supprimer une image
const removeImage = (index) => {
  if (confirm('Supprimer cette image ?')) {
    const newImages = [...images.value]
    newImages.splice(index, 1)
    images.value = newImages
  }
}

// Définir comme couverture (déplacer en première position)
const moveToFirst = (index) => {
  const newImages = [...images.value]
  const [image] = newImages.splice(index, 1)
  newImages.unshift(image)
  images.value = newImages
}

// Drag & Drop
const dragStart = (index) => {
  draggedIndex.value = index
}

const drop = (dropIndex) => {
  if (draggedIndex.value === null) return
  
  const newImages = [...images.value]
  const [draggedImage] = newImages.splice(draggedIndex.value, 1)
  newImages.splice(dropIndex, 0, draggedImage)
  
  images.value = newImages
  draggedIndex.value = null
}
</script>