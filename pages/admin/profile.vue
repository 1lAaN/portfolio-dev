<template>
  <div>
    <NuxtLink to="/admin" class="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors">
      <Icon name="mdi:arrow-left" class="w-4 h-4 mr-1" />
      Dashboard
    </NuxtLink>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mon profil public</h1>
      <p class="mt-2 text-gray-600">Gérez le texte affiché sur votre page d'accueil</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
    </div>

    <div v-else class="max-w-2xl">
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">

        <!-- Open to work -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium text-gray-900">Disponible pour une alternance</p>
            <p class="text-sm text-gray-500">Affiche un badge vert "Open to work" sur votre profil</p>
          </div>
          <button
            @click="form.open_to_work = !form.open_to_work"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              form.open_to_work ? 'bg-green-500' : 'bg-gray-300'
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                form.open_to_work ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>

        <!-- Sous-titre -->
        <div>
          <label for="subtitle" class="block text-sm font-medium text-gray-700 mb-1">
            Sous-titre (sous votre nom)
          </label>
          <input
            id="subtitle"
            v-model="form.subtitle"
            type="text"
            placeholder="Ex: Développeur junior en 2ème année de BTS SIO SLAM"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          >
        </div>

        <!-- Texte de statut -->
        <div>
          <label for="status_text" class="block text-sm font-medium text-gray-700 mb-1">
            Message de disponibilité
          </label>
          <textarea
            id="status_text"
            v-model="form.status_text"
            rows="3"
            placeholder="Ex: Disponible pour une alternance en développement web dès septembre 2025"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          />
          <p class="mt-1 text-xs text-gray-500">Affiché sous les boutons d'action sur la page d'accueil</p>
        </div>

        <!-- Aperçu -->
        <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Aperçu</p>
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Bonjour, je suis Ihlane</h1>
            <p class="text-sm text-gray-600 mb-2">{{ form.subtitle || '...' }}</p>
            <span
              v-if="form.open_to_work"
              class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-2"
            >
              🟢 Open to work
            </span>
            <p v-if="form.status_text" class="text-xs text-gray-500 italic">{{ form.status_text }}</p>
          </div>
        </div>

        <!-- Bouton save -->
        <div class="flex justify-end pt-2">
          <button
            @click="save"
            :disabled="saving"
            class="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 font-medium"
          >
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>

        <!-- Confirmation -->
        <div v-if="saved" class="flex items-center gap-2 text-green-600 text-sm">
          <Icon name="mdi:check-circle" class="w-5 h-5" />
          Modifications enregistrées !
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

const pb = usePb()
const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
let recordId = null

const form = ref({
  subtitle: '',
  status_text: '',
  open_to_work: true
})

const loadProfile = async () => {
  try {
    const res = await pb.collection('profile').getList(1, 1)
    if (res.items.length > 0) {
      const p = res.items[0]
      recordId = p.id
      form.value = {
        subtitle: p.subtitle || '',
        status_text: p.status_text || '',
        open_to_work: p.open_to_work ?? true
      }
    }
  } catch (e) {
    console.error('Erreur chargement profil:', e)
  } finally {
    loading.value = false
  }
}

const save = async () => {
  saving.value = true
  saved.value = false
  try {
    if (recordId) {
      await pb.collection('profile').update(recordId, form.value)
    } else {
      const res = await pb.collection('profile').create(form.value)
      recordId = res.id
    }
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e) {
    console.error('Erreur sauvegarde:', e)
    alert('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>
