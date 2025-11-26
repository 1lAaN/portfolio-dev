<template>
  <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-6">
      {{ isEditing ? 'Modifier le projet' : 'Nouveau projet' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Titre -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">
          Titre *
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        />
      </div>

      <!-- Description complète -->
      <div>
        <label for="full_description" class="block text-sm font-medium text-gray-700">
          Description complète
        </label>
        <textarea
          id="full_description"
          v-model="form.full_description"
          rows="5"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        />
      </div>

      <!-- Upload image -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image du projet
        </label>

        <!-- Aperçu de l'image actuelle -->
        <div v-if="form.image_url" class="mb-3">
          <div class="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="form.image_url"
              alt="Aperçu"
              class="w-full h-full object-cover"
            >
            <button
              type="button"
              @click="removeImage"
              class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              <Icon name="mdi:delete" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Zone d'upload -->
        <div
          v-else
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          >
          
          <Icon name="mdi:cloud-upload" class="h-12 w-12 mx-auto text-gray-400 mb-3" />
          
          <button
            type="button"
            @click="$refs.fileInput.click()"
            :disabled="uploading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {{ uploading ? 'Upload en cours...' : 'Choisir une image' }}
          </button>
          
          <p class="mt-2 text-xs text-gray-500">
            PNG, JPG, WEBP jusqu'à 10MB
          </p>
        </div>

        <!-- Barre de progression -->
        <div v-if="uploading" class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-black h-2 rounded-full transition-all duration-300" style="width: 75%"></div>
          </div>
          <p class="text-sm text-gray-500 mt-1">Upload en cours...</p>
        </div>
      </div>

      <!-- Technologies -->
      <div>
        <label for="technologies" class="block text-sm font-medium text-gray-700">
          Technologies (séparées par des virgules)
        </label>
        <input
          id="technologies"
          v-model="technologiesInput"
          type="text"
          placeholder="Vue.js, Nuxt.js, Tailwind CSS"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
      </div>

      <!-- Catégorie -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">
          Catégorie *
        </label>
        <select
          v-if="categories.length > 0"
          id="category"
          v-model="form.category"
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
          <option value="">-- Sélectionner une catégorie --</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
        <div v-else class="mt-1 text-sm text-gray-500">
          Chargement des catégories...
        </div>
        <p class="mt-1 text-xs text-gray-500">
          <NuxtLink to="/admin/categories" class="text-blue-600 hover:underline">
            Gérer les catégories
          </NuxtLink>
        </p>
      </div>

      <!-- Statut -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          id="status"
          v-model="form.status"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="En pause">En pause</option>
          <option value="Archivé">Archivé</option>
        </select>
      </div>

      <!-- URLs -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label for="demo_url" class="block text-sm font-medium text-gray-700">
            URL Démo
          </label>
          <input
            id="demo_url"
            v-model="form.demo_url"
            type="url"
            placeholder="https://demo.example.com"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          >
        </div>

        <div>
          <label for="github_url" class="block text-sm font-medium text-gray-700">
            URL GitHub
          </label>
          <input
            id="github_url"
            v-model="form.github_url"
            type="url"
            placeholder="https://github.com/..."
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          >
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="loading || uploading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50"
        >
          {{ loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['success', 'cancel'])
const supabase = useSupabase()
const { uploadImage } = useCloudinary()

const isEditing = computed(() => !!props.project)
const loading = ref(false)
const uploading = ref(false)
const categories = ref([])

// Formulaire
const form = ref({
  title: '',
  description: '',
  full_description: '',
  technologies: [],
  category: '',
  status: 'En cours',
  demo_url: '',
  github_url: '',
  image_url: ''
})

// Input pour les technologies (string)
const technologiesInput = ref('')

// Charger les catégories depuis la BDD
const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true })

    if (error) throw error
    categories.value = data || []
    
    if (!isEditing.value && categories.value.length > 0 && !form.value.category) {
      form.value.category = categories.value[0].name
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

// Initialiser le formulaire si on édite
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = { ...newProject }
    technologiesInput.value = newProject.technologies?.join(', ') || ''
  } else {
    form.value = {
      title: '',
      description: '',
      full_description: '',
      technologies: [],
      category: categories.value.length > 0 ? categories.value[0].name : '',
      status: 'En cours',
      demo_url: '',
      github_url: '',
      image_url: ''
    }
    technologiesInput.value = ''
  }
}, { immediate: true })

// Gérer la sélection d'un fichier
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier le type
  if (!file.type.startsWith('image/')) {
    alert('Veuillez sélectionner une image')
    return
  }

  // Vérifier la taille (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    alert('L\'image est trop grande (max 10MB)')
    return
  }

  try {
    uploading.value = true
    const result = await uploadImage(file)
    form.value.image_url = result.url
  } catch (error) {
    console.error('Erreur upload:', error)
    alert('Erreur lors de l\'upload de l\'image')
  } finally {
    uploading.value = false
  }
}

// Supprimer l'image
const removeImage = () => {
  form.value.image_url = ''
}

const handleSubmit = async () => {
  loading.value = true

  try {
    // Convertir les technologies en array
    form.value.technologies = technologiesInput.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    if (isEditing.value) {
      // Mise à jour
      const { error } = await supabase
        .from('projects')
        .update(form.value)
        .eq('id', props.project.id)

      if (error) throw error
    } else {
      // Création
      const { error } = await supabase
        .from('projects')
        .insert([form.value])

      if (error) throw error
    }

    emit('success')
  } catch (error) {
    console.error('Erreur:', error)
    alert('Une erreur est survenue')
  } finally {
    loading.value = false
  }
}

// Charger les catégories au montage
onMounted(() => {
  loadCategories()
})
</script>