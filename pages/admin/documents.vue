<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gestion des Documents</h1>
        <p class="text-gray-600 mt-2">Téléchargez et gérez vos documents PDF</p>
      </div>

      <!-- Upload Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Ajouter un document</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Titre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Titre du document *
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Synthèse de stage 2024"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description du document..."
            ></textarea>
          </div>

          <!-- Upload PDF -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fichier PDF *
            </label>
            <div class="flex items-center gap-4">
              <input
                ref="fileInput"
                type="file"
                accept="application/pdf"
                @change="handleFileSelect"
                class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
              <span v-if="selectedFile" class="text-sm text-green-600">
                ✓ {{ selectedFile.name }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Taille maximale: 10MB
            </p>
          </div>

          <!-- Bouton Submit -->
          <div class="flex items-center gap-4">
            <button
              type="submit"
              :disabled="isUploading || !formData.title || !selectedFile"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{ isUploading ? 'Upload en cours...' : 'Ajouter le document' }}
            </button>
            
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="flex-1">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ uploadProgress }}%</p>
            </div>
          </div>

          <!-- Message de succès/erreur -->
          <div v-if="message.text" :class="[
            'p-4 rounded-lg',
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          ]">
            {{ message.text }}
          </div>
        </form>
      </div>

      <!-- Liste des documents -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Documents existants</h2>

        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-500">Chargement...</p>
        </div>

        <div v-else-if="documents.length === 0" class="text-center py-8">
          <p class="text-gray-500">Aucun document pour le moment</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-lg text-gray-900">{{ doc.title }}</h3>
                <p v-if="doc.description" class="text-gray-600 mt-1">{{ doc.description }}</p>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{{ formatDate(doc.created_at) }}</span>
                  <a
                    :href="doc.pdf_url"
                    target="_blank"
                    class="text-blue-600 hover:underline"
                  >
                    Voir le PDF ↗
                  </a>
                </div>
              </div>

              <button
                @click="deleteDocument(doc)"
                class="ml-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabase()
const { uploadPDF, deletePDF } = useSupabaseStorage()

// État
const documents = ref([])
const loading = ref(true)
const isUploading = ref(false)
const uploadProgress = ref(0)
const selectedFile = ref(null)
const fileInput = ref(null)

const formData = ref({
  title: '',
  description: ''
})

const message = ref({
  text: '',
  type: '' // 'success' ou 'error'
})

// Charger les documents
const fetchDocuments = async () => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    documents.value = data || []
  } catch (error) {
    console.error('Erreur chargement documents:', error)
    showMessage('Erreur lors du chargement des documents', 'error')
  } finally {
    loading.value = false
  }
}

// Sélection de fichier
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      showMessage('Veuillez sélectionner un fichier PDF', 'error')
      event.target.value = ''
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showMessage('Le fichier est trop volumineux (max 10MB)', 'error')
      event.target.value = ''
      return
    }
    selectedFile.value = file
  }
}

// Soumission du formulaire
const handleSubmit = async () => {
  if (!selectedFile.value) {
    showMessage('Veuillez sélectionner un fichier PDF', 'error')
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  try {
    // Simuler progression
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    // Upload vers Supabase Storage
    const uploadResult = await uploadPDF(selectedFile.value)

    clearInterval(progressInterval)

    if (!uploadResult) {
      throw new Error('Erreur lors de l\'upload du fichier')
    }

    uploadProgress.value = 95

    // Sauvegarder dans la base de données
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        title: formData.value.title,
        description: formData.value.description || null,
        pdf_url: uploadResult.url,
        file_path: uploadResult.path // Important pour la suppression
      }])
      .select()

    if (error) throw error

    uploadProgress.value = 100

    // Ajouter le nouveau document à la liste
    if (data && data[0]) {
      documents.value.unshift(data[0])
    }

    // Réinitialiser le formulaire
    formData.value = { title: '', description: '' }
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    showMessage('Document ajouté avec succès !', 'success')

    // Réinitialiser la progression après 2 secondes
    setTimeout(() => {
      uploadProgress.value = 0
    }, 2000)

  } catch (error) {
    console.error('Erreur lors de l\'ajout du document:', error)
    showMessage('Erreur lors de l\'ajout du document', 'error')
  } finally {
    isUploading.value = false
  }
}

// Supprimer un document
const deleteDocument = async (doc) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer "${doc.title}" ?`)) {
    return
  }

  try {
    // Supprimer le fichier de Supabase Storage
    if (doc.file_path) {
      await deletePDF(doc.file_path)
    }

    // Supprimer l'entrée de la base de données
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', doc.id)

    if (error) throw error

    // Retirer de la liste locale
    documents.value = documents.value.filter(d => d.id !== doc.id)
    showMessage('Document supprimé avec succès', 'success')

  } catch (error) {
    console.error('Erreur suppression document:', error)
    showMessage('Erreur lors de la suppression', 'error')
  }
}

// Afficher un message
const showMessage = (text, type) => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = { text: '', type: '' }
  }, 5000)
}

// Formater la date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Charger les documents au montage
onMounted(() => {
  fetchDocuments()
})
</script>