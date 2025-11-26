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

      <!-- Gestionnaire d'images -->
      <AdminImageManager v-model="form.images" />

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
          :disabled="loading"
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

const isEditing = computed(() => !!props.project)
const loading = ref(false)
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
  images: [], // Nouveau : tableau d'images
  image_url: '' // Garde pour compatibilité (sera auto-rempli)
})

const technologiesInput = ref('')

// Charger les catégories
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
    console.error('Erreur chargement catégories:', error)
  }
}

// Initialiser le formulaire
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = {
      ...newProject,
      images: newProject.images || (newProject.image_url ? [newProject.image_url] : [])
    }
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
      images: [],
      image_url: ''
    }
    technologiesInput.value = ''
  }
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true

  try {
    // Convertir les technologies en array
    form.value.technologies = technologiesInput.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    // La première image devient image_url (pour compatibilité)
    form.value.image_url = form.value.images.length > 0 ? form.value.images[0] : ''

    if (isEditing.value) {
      const { error } = await supabase
        .from('projects')
        .update(form.value)
        .eq('id', props.project.id)

      if (error) throw error
    } else {
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

onMounted(() => {
  loadCategories()
})
</script>