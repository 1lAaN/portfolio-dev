<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Expériences</h1>
        <p class="mt-2 text-gray-600">Gérez votre parcours (stages, formations, diplômes…)</p>
      </div>
      <button
        @click="openForm()"
        class="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Icon name="mdi:plus" class="h-5 w-5 mr-2" />
        Ajouter
      </button>
    </div>

    <!-- Liste -->
    <div v-if="loading" class="text-center py-12">
      <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
    </div>

    <div v-else-if="experiences.length === 0" class="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <Icon name="mdi:timeline" class="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p class="text-gray-500 mb-4">Aucune expérience pour le moment</p>
      <button
        @click="openForm()"
        class="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
      >
        <Icon name="mdi:plus" class="h-4 w-4 mr-2" />
        Ajouter votre première expérience
      </button>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="exp in experiences"
        :key="exp.id"
        class="bg-white rounded-lg border border-gray-200 p-5 flex items-start justify-between hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" :class="typeBg(exp.type)">
            <Icon :name="typeIcon(exp.type)" class="w-5 h-5" :class="typeIconColor(exp.type)" />
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-gray-900">{{ exp.title }}</h3>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="typeColor(exp.type)">
                {{ exp.type }}
              </span>
              <span v-if="exp.is_current" class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                En cours
              </span>
            </div>
            <p class="text-sm text-gray-600 font-medium">{{ exp.organization }}</p>
            <p v-if="exp.location" class="text-xs text-gray-400">{{ exp.location }}</p>
            <p class="text-xs text-gray-400 mt-1">
              {{ formatDate(exp.start_date) }} — {{ exp.is_current ? 'Aujourd\'hui' : formatDate(exp.end_date) }}
            </p>
            <p v-if="exp.description" class="text-sm text-gray-500 mt-2 line-clamp-2">{{ exp.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 ml-4 flex-shrink-0">
          <button
            @click="openForm(exp)"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="mdi:pencil" class="h-4 w-4" />
          </button>
          <button
            @click="deleteExperience(exp)"
            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Icon name="mdi:trash-can" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal formulaire -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeForm"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ editingExp ? 'Modifier l\'expérience' : 'Nouvelle expérience' }}
            </h2>
            <button @click="closeForm" class="text-gray-400 hover:text-gray-600">
              <Icon name="mdi:close" class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveExperience" class="space-y-4">
            <!-- Titre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="ex: Développeur web stagiaire"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              >
            </div>

            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                v-model="form.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              >
                <option value="">Choisir un type</option>
                <option value="Stage">Stage</option>
                <option value="Diplôme">Diplôme</option>
                <option value="Formation">Formation</option>
                <option value="Emploi">Emploi</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <!-- Organisation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Organisation / École *</label>
              <input
                v-model="form.organization"
                type="text"
                required
                placeholder="ex: Lycée Jean Moulin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              >
            </div>

            <!-- Lieu -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
              <input
                v-model="form.location"
                type="text"
                placeholder="ex: Paris, France"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              >
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mois de début *</label>
                <input
                  v-model="form.start_date"
                  type="month"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mois de fin</label>
                <input
                  v-model="form.end_date"
                  type="month"
                  :disabled="form.is_current"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm disabled:bg-gray-50 disabled:text-gray-400"
                >
              </div>
            </div>

            <!-- En cours -->
            <div class="flex items-center gap-2">
              <input
                id="is_current"
                v-model="form.is_current"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                @change="form.is_current && (form.end_date = '')"
              >
              <label for="is_current" class="text-sm font-medium text-gray-700">En cours</label>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Décrivez vos missions, acquis..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
              />
            </div>

            <!-- Message d'erreur -->
            <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {{ formError }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="closeForm"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Icon v-if="saving" name="mdi:loading" class="animate-spin h-4 w-4 mr-2 inline" />
                {{ editingExp ? 'Enregistrer' : 'Ajouter' }}
              </button>
            </div>
          </form>
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

const loading = ref(true)
const experiences = ref([])
const showForm = ref(false)
const editingExp = ref(null)
const saving = ref(false)
const formError = ref('')

const defaultForm = () => ({
  title: '',
  type: '',
  organization: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
})

const form = ref(defaultForm())

const loadExperiences = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) throw error
    experiences.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const openForm = (exp = null) => {
  editingExp.value = exp
  formError.value = ''
  if (exp) {
    form.value = {
      title: exp.title,
      type: exp.type,
      organization: exp.organization,
      location: exp.location || '',
      start_date: exp.start_date ? exp.start_date.slice(0, 7) : '',
      end_date: exp.end_date ? exp.end_date.slice(0, 7) : '',
      is_current: exp.is_current || false,
      description: exp.description || '',
    }
  } else {
    form.value = defaultForm()
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingExp.value = null
  formError.value = ''
}

const saveExperience = async () => {
  saving.value = true
  formError.value = ''
  try {
    const toDate = (ym) => ym ? `${ym}-01` : null
    const payload = {
      title: form.value.title,
      type: form.value.type,
      organization: form.value.organization,
      location: form.value.location || null,
      start_date: toDate(form.value.start_date),
      end_date: form.value.is_current ? null : toDate(form.value.end_date),
      is_current: form.value.is_current,
      description: form.value.description || null,
    }

    if (editingExp.value) {
      const { error } = await supabase
        .from('experiences')
        .update(payload)
        .eq('id', editingExp.value.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('experiences')
        .insert(payload)
      if (error) throw error
    }

    closeForm()
    await loadExperiences()
  } catch (error) {
    formError.value = error.message || 'Une erreur est survenue'
  } finally {
    saving.value = false
  }
}

const deleteExperience = async (exp) => {
  if (!confirm(`Supprimer "${exp.title}" ?`)) return
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', exp.id)
    if (error) throw error
    await loadExperiences()
  } catch (error) {
    alert('Erreur lors de la suppression')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

const typeColor = (type) => {
  const map = {
    'Stage': 'bg-blue-100 text-blue-700',
    'Diplôme': 'bg-green-100 text-green-700',
    'Formation': 'bg-purple-100 text-purple-700',
    'Emploi': 'bg-orange-100 text-orange-700',
  }
  return map[type] || 'bg-gray-100 text-gray-600'
}

const typeBg = (type) => {
  const map = {
    'Stage': 'bg-blue-50',
    'Diplôme': 'bg-green-50',
    'Formation': 'bg-purple-50',
    'Emploi': 'bg-orange-50',
  }
  return map[type] || 'bg-gray-50'
}

const typeIcon = (type) => {
  const map = {
    'Stage': 'mdi:briefcase',
    'Diplôme': 'mdi:school',
    'Formation': 'mdi:book-open-variant',
    'Emploi': 'mdi:domain',
  }
  return map[type] || 'mdi:star'
}

const typeIconColor = (type) => {
  const map = {
    'Stage': 'text-blue-600',
    'Diplôme': 'text-green-600',
    'Formation': 'text-purple-600',
    'Emploi': 'text-orange-600',
  }
  return map[type] || 'text-gray-500'
}

onMounted(loadExperiences)
</script>
