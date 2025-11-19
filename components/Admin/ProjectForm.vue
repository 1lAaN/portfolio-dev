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
          Catégorie
        </label>
        <select
          id="category"
          v-model="form.category"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
          <option value="Web App">Web App</option>
          <option value="E-commerce">E-commerce</option>
          <option value="Mobile">Mobile</option>
          <option value="API">API</option>
          <option value="Open Source">Open Source</option>
        </select>
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

      <!-- URL Image -->
      <div>
        <label for="image_url" class="block text-sm font-medium text-gray-700">
          URL de l'image
        </label>
        <input
          id="image_url"
          v-model="form.image_url"
          type="url"
          placeholder="https://example.com/image.jpg"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
        <p class="mt-1 text-xs text-gray-500">
          Ajoutez une URL d'image (vous pouvez uploader sur Cloudinary plus tard)
        </p>
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

// Formulaire
const form = ref({
  title: '',
  description: '',
  full_description: '',
  technologies: [],
  category: 'Web App',
  status: 'En cours',
  demo_url: '',
  github_url: '',
  image_url: ''
})

// Input pour les technologies (string)
const technologiesInput = ref('')

// Initialiser le formulaire si on édite
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = { ...newProject }
    technologiesInput.value = newProject.technologies?.join(', ') || ''
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
</script>
