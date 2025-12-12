<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white py-20 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Tableau de Synthèse
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Mon parcours, mes compétences et mes réalisations en un document
          </p>
        </div>
      </div>
    </section>

    <!-- Contenu principal -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="loading" class="text-center py-12">
        <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Chargement du document...</p>
      </div>

      <div v-else-if="!document" class="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Icon name="mdi:file-document-outline" class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-500 mb-4">Aucun tableau de synthèse disponible</p>
        <NuxtLink
          to="/#contact"
          class="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Me contacter pour en savoir plus
        </NuxtLink>
      </div>

      <div v-else>
        <!-- Info document -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center">
              <div class="bg-blue-100 rounded-lg p-3 mr-4">
                <Icon name="mdi:file-pdf-box" class="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ document.name }}</h2>
                <p class="text-sm text-gray-600">{{ document.description }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  Mis à jour le {{ formatDate(document.updated_at) }}
                  <span v-if="document.file_size">
                    • {{ formatFileSize(document.file_size) }}
                  </span>
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <a
                :href="document.file_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Icon name="mdi:open-in-new" class="h-5 w-5 mr-2" />
                Ouvrir
              </a>
              <a
                :href="document.file_url"
                :download="document.name + '.pdf'"
                class="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Icon name="mdi:download" class="h-5 w-5 mr-2" />
                Télécharger
              </a>
            </div>
          </div>
        </div>

        <!-- Aperçu du PDF avec Google Docs Viewer -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Aperçu du document</h3>
          </div>
          
          <!-- Viewer PDF via Google Docs -->
          <div class="relative w-full" style="height: 800px;">
            <iframe
              :src="`https://docs.google.com/viewer?url=${encodeURIComponent(document.file_url)}&embedded=true`"
              class="w-full h-full border-0"
              title="Aperçu du tableau de synthèse"
              frameborder="0"
            />
          </div>

          <!-- Alternative : bouton pour ouvrir dans un nouvel onglet -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-3">
              Le document ne s'affiche pas ? 
            </p>
            <div class="flex gap-3">
              <a
                :href="document.file_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <Icon name="mdi:open-in-new" class="h-4 w-4 mr-2" />
                Ouvrir dans un nouvel onglet
              </a>
              <a
                :href="document.file_url"
                :download="document.name + '.pdf'"
                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                <Icon name="mdi:download" class="h-4 w-4 mr-2" />
                Télécharger le PDF
              </a>
            </div>
          </div>
        </div>

        <!-- Informations complémentaires -->
        <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex">
            <Icon name="mdi:information" class="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <h3 class="text-lg font-semibold text-blue-900 mb-2">
                À propos de ce document
              </h3>
              <p class="text-blue-800 mb-3">
                Ce tableau de synthèse regroupe l'ensemble de mon parcours professionnel, 
                mes compétences techniques et mes principales réalisations.
              </p>
              <div class="flex gap-4">
                <NuxtLink
                  to="/projects"
                  class="inline-flex items-center text-sm font-medium text-blue-900 hover:underline"
                >
                  <Icon name="mdi:folder-multiple" class="h-4 w-4 mr-1" />
                  Voir mes projets
                </NuxtLink>
                <NuxtLink
                  to="/#contact"
                  class="inline-flex items-center text-sm font-medium text-blue-900 hover:underline"
                >
                  <Icon name="mdi:email" class="h-4 w-4 mr-1" />
                  Me contacter
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Tableau de Synthèse - Portfolio',
  description: 'Consultez et téléchargez mon tableau de synthèse professionnel avec mon parcours et mes compétences',
})

const supabase = useSupabase()
const loading = ref(true)
const document = ref(null)

// Charger le document
const loadDocument = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('type', 'synthese')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    document.value = data || null
    
    console.log('Document chargé:', data)
  } catch (error) {
    console.error('Erreur chargement document:', error)
  } finally {
    loading.value = false
  }
}

// Formater la date
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Formater la taille du fichier
const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['octets', 'Ko', 'Mo', 'Go']
  if (bytes === 0) return '0 octet'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

onMounted(() => {
  loadDocument()
})
</script>