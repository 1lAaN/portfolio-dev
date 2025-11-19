<template>
  <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-6">
      {{ isEditing ? 'Modifier le skill' : 'Nouveau skill' }}
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Nom -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Nom *
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Vue.js, TypeScript..."
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
          placeholder="Décrivez ce skill..."
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        />
      </div>

      <!-- Icône -->
      <div>
        <label for="icon" class="block text-sm font-medium text-gray-700">
          Icône (Iconify) *
        </label>
        <input
          id="icon"
          v-model="form.icon"
          type="text"
          required
          placeholder="mdi:vuejs, mdi:language-typescript..."
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
        <p class="mt-1 text-xs text-gray-500">
          Cherchez des icônes sur <a href="https://icon-sets.iconify.design/" target="_blank" class="text-blue-600 hover:underline">Iconify</a>
        </p>
        <div v-if="form.icon" class="mt-2 flex items-center">
          <Icon :name="form.icon" class="h-8 w-8 mr-2" />
          <span class="text-sm text-gray-600">Aperçu de l'icône</span>
        </div>
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700">
          Tags (séparés par des virgules)
        </label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          placeholder="langage, framework, tool"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
        <p class="mt-1 text-xs text-gray-500">
          Exemples: langage, framework, tool, database
        </p>
      </div>

      <!-- Ordre d'affichage -->
      <div>
        <label for="order" class="block text-sm font-medium text-gray-700">
          Ordre d'affichage
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
          Les skills seront triés par ordre croissant
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
  skill: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['success', 'cancel'])
const supabase = useSupabase()

const isEditing = computed(() => !!props.skill)
const loading = ref(false)

// Formulaire
const form = ref({
  name: '',
  description: '',
  icon: '',
  tags: [],
  order: 0
})

// Input pour les tags (string)
const tagsInput = ref('')

// Initialiser le formulaire si on édite
watch(() => props.skill, (newSkill) => {
  if (newSkill) {
    form.value = { ...newSkill }
    tagsInput.value = newSkill.tags?.join(', ') || ''
  }
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true

  try {
    // Convertir les tags en array
    form.value.tags = tagsInput.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)

    if (isEditing.value) {
      // Mise à jour
      const { error } = await supabase
        .from('skills')
        .update(form.value)
        .eq('id', props.skill.id)

      if (error) throw error
    } else {
      // Création
      const { error } = await supabase
        .from('skills')
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
