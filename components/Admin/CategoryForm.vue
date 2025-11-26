<template>
  <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-6">
      {{ isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Nom -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Nom de la catégorie *
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Web App, Mobile..."
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          @input="generateSlug"
        >
      </div>

      <!-- Slug (généré automatiquement) -->
      <div>
        <label for="slug" class="block text-sm font-medium text-gray-700">
          Slug (URL) *
        </label>
        <input
          id="slug"
          v-model="form.slug"
          type="text"
          required
          placeholder="web-app, mobile..."
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
        <p class="mt-1 text-xs text-gray-500">
          Généré automatiquement, mais vous pouvez le modifier
        </p>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="2"
          placeholder="Courte description de cette catégorie..."
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        />
      </div>

      <!-- Options d'affichage -->
      <div class="border-t border-gray-200 pt-6">
        <h4 class="text-sm font-medium text-gray-900 mb-4">Options d'affichage</h4>

        <!-- Visible dans les filtres principaux -->
        <div class="flex items-start mb-4">
          <div class="flex items-center h-5">
            <input
              id="visible_in_filters"
              v-model="form.visible_in_filters"
              type="checkbox"
              class="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            >
          </div>
          <div class="ml-3 text-sm">
            <label for="visible_in_filters" class="font-medium text-gray-700">
              Afficher dans les filtres principaux
            </label>
            <p class="text-gray-500">
              Si décoché, la catégorie sera dans le menu "Afficher toutes les catégories"
            </p>
          </div>
        </div>

        <!-- Ordre d'affichage des filtres -->
        <div>
          <label for="display_order" class="block text-sm font-medium text-gray-700">
            Ordre d'affichage dans les filtres
          </label>
          <input
            id="display_order"
            v-model.number="form.display_order"
            type="number"
            min="0"
            placeholder="0"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          >
          <p class="mt-1 text-xs text-gray-500">
            Les filtres seront affichés par ordre croissant (0 en premier)
          </p>
        </div>
      </div>

      <!-- Ordre général -->
      <div>
        <label for="order" class="block text-sm font-medium text-gray-700">
          Ordre général
        </label>
        <input
          id="order"
          v-model.number="form.order"
          type="number"
          min="0"
          placeholder="0"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
        <p class="mt-1 text-xs text-gray-500">
          Ordre général dans l'admin et les listes
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
  category: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['success', 'cancel'])
const supabase = useSupabase()

const isEditing = computed(() => !!props.category)
const loading = ref(false)

// Formulaire
const form = ref({
  name: '',
  slug: '',
  description: '',
  order: 0,
  visible_in_filters: true,
  display_order: 0
})

// Initialiser le formulaire si on édite
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.value = { ...newCategory }
  } else {
    form.value = {
      name: '',
      slug: '',
      description: '',
      order: 0,
      visible_in_filters: true,
      display_order: 0
    }
  }
}, { immediate: true })

// Générer le slug automatiquement
const generateSlug = () => {
  if (!isEditing.value) {
    form.value.slug = form.value.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par -
      .replace(/^-+|-+$/g, '') // Enlever les - au début et à la fin
  }
}

const handleSubmit = async () => {
  loading.value = true

  try {
    if (isEditing.value) {
      // Mise à jour
      const { error } = await supabase
        .from('categories')
        .update(form.value)
        .eq('id', props.category.id)

      if (error) throw error
    } else {
      // Création
      const { error } = await supabase
        .from('categories')
        .insert([form.value])

      if (error) throw error
    }

    emit('success')
  } catch (error) {
    console.error('Erreur:', error)
    if (error.code === '23505') {
      alert('Cette catégorie existe déjà !')
    } else {
      alert('Une erreur est survenue')
    }
  } finally {
    loading.value = false
  }
}
</script>