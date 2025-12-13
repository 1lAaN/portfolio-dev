<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Ma Synthèse de Stage</h1>
        <p class="text-gray-600 mt-2">Découvrez mon parcours et mes réalisations</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Chargement du document...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-800 font-semibold">{{ error }}</p>
        <button 
          @click="fetchDocument"
          class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>

      <!-- Document Display -->
      <div v-else-if="document" class="space-y-8">
        <!-- Document Info Card -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ document.title }}</h2>
          <p v-if="document.description" class="text-gray-600 mb-4">{{ document.description }}</p>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Publié le {{ formatDate(document.created_at) }}</span>
          </div>
        </div>

        <!-- PDF Viewer -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              Aperçu du document
            </h3>
            <div class="flex gap-2">
              <a
                :href="document.pdf_url"
                target="_blank"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ouvrir dans un nouvel onglet
              </a>
              <a
                :href="document.pdf_url"
                download
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger
              </a>
            </div>
          </div>

          <!-- PDF Iframe -->
          <div class="relative bg-gray-50" style="height: 800px;">
            <iframe
              :src="document.pdf_url"
              class="w-full h-full border-0"
              title="Aperçu PDF"
            ></iframe>
          </div>

          <!-- Fallback message -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 text-center">
              Si le document ne s'affiche pas correctement, 
              <a :href="document.pdf_url" target="_blank" class="text-blue-600 hover:underline font-medium">
                cliquez ici pour l'ouvrir dans un nouvel onglet
              </a>
              ou téléchargez-le.
            </p>
          </div>
        </div>
      </div>

      <!-- No Document State -->
      <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-yellow-800 font-semibold">Aucun document disponible pour le moment</p>
        <p class="text-yellow-700 text-sm mt-2">La synthèse de stage sera bientôt disponible.</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-20">
      <div class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        <p>&copy; 2024 - Synthèse de Stage</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const supabase = useSupabase()

// État
const document = ref(null)
const loading = ref(true)
const error = ref(null)

// Récupérer le document le plus récent
const fetchDocument = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        // Aucun document trouvé
        document.value = null
      } else {
        throw fetchError
      }
    } else {
      document.value = data
    }
  } catch (err) {
    console.error('Erreur lors du chargement du document:', err)
    error.value = 'Impossible de charger le document. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

// Formater la date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Charger le document au montage
onMounted(() => {
  fetchDocument()
})
</script>