<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestion des skills</h1>
        <p class="mt-2 text-gray-600">Gérez toutes vos compétences depuis cet espace</p>
      </div>
      <button
        v-if="!showForm"
        @click="showForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
      >
        <Icon name="mdi:plus" class="h-5 w-5 mr-2" />
        Nouveau skill
      </button>
    </div>

    <!-- Formulaire -->
    <div v-if="showForm" class="mb-8">
      <AdminSkillForm
        :skill="editingSkill"
        @success="handleFormSuccess"
        @cancel="handleFormCancel"
      />
    </div>

    <!-- Recherche et filtres -->
    <div v-if="!showForm" class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un skill..."
          class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
        >
      </div>
      <select
        v-model="filterTag"
        class="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
      >
        <option value="">Tous les tags</option>
        <option value="langage">Langage</option>
        <option value="framework">Framework</option>
        <option value="tool">Tool</option>
        <option value="database">Database</option>
      </select>
    </div>

    <!-- Grille des skills -->
    <div v-if="!showForm">
      <div v-if="loading" class="text-center py-12">
        <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <div v-else-if="filteredSkills.length === 0" class="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Icon name="mdi:tools" class="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p class="text-gray-500">Aucun skill trouvé</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <!-- Header avec icône -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                <Icon :name="skill.icon" class="h-8 w-8 text-gray-900" />
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ skill.name }}</h3>
                <span class="text-xs text-gray-500">Ordre: {{ skill.order || 0 }}</span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editSkill(skill)"
                class="text-blue-600 hover:text-blue-900"
              >
                <Icon name="mdi:pencil" class="h-5 w-5" />
              </button>
              <button
                @click="deleteSkill(skill)"
                class="text-red-600 hover:text-red-900"
              >
                <Icon name="mdi:delete" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4">{{ skill.description }}</p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in skill.tags"
              :key="tag"
              class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const supabase = useSupabase()
const skills = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingSkill = ref(null)
const searchQuery = ref('')
const filterTag = ref('')

// Charger les skills
const loadSkills = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true })

    if (error) throw error
    skills.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// Skills filtrés
const filteredSkills = computed(() => {
  let filtered = skills.value

  if (searchQuery.value) {
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterTag.value) {
    filtered = filtered.filter(s => s.tags?.includes(filterTag.value))
  }

  return filtered
})

// Éditer un skill
const editSkill = (skill) => {
  editingSkill.value = skill
  showForm.value = true
}

// Supprimer un skill
const deleteSkill = async (skill) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer "${skill.name}" ?`)) {
    return
  }

  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', skill.id)

    if (error) throw error
    await loadSkills()
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la suppression')
  }
}

// Gestion du formulaire
const handleFormSuccess = async () => {
  showForm.value = false
  editingSkill.value = null
  await loadSkills()
}

const handleFormCancel = () => {
  showForm.value = false
  editingSkill.value = null
}

onMounted(() => {
  loadSkills()
})
</script>
