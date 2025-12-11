<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestion des documents</h1>
      <p class="mt-2 text-gray-600">Gérez votre tableau de synthèse et autres documents PDF</p>
    </div>

    <!-- Upload de document -->
    <div class="mb-8 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">
        {{ editingDoc ? 'Modifier le document' : 'Ajouter un document' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nom -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nom du document *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Tableau de synthèse 2024"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
            >
          </div>

          <!-- Type -->
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">
              Type *
            </label>
            <select
              id="type"
              v-model="form.type"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
            >
              <option value="synthese">Tableau de synthèse</option>
              <option value="cv">CV</option>
              <option value="autre">Autre</option>
            </select>
          </div>
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
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        <!-- Upload PDF -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Fichier PDF *
          </label>
          
          <!-- Zone d'upload -->
          <div v-if="!form.file_url" class="relative">
            <input
              ref="fileInput"
              type="file"
              accept=".pdf,application/pdf"
              @change="handleFileSelect"
              class="hidden"
            >
            
            <button
              type="button"
              @click="$refs.fileInput.click()"
              :disabled="uploading"
              class="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors flex flex-col items-center justify-center"
            >
              <Icon name="mdi:file-pdf-box" class="h-12 w-12 text-gray-400 mb-3" />
              <span class="text-sm text-gray-600">
                {{ uploading ? 'Upload en cours...' : 'Cliquez pour sélectionner un PDF' }}
              </span>
              <span class="text-xs text-gray-500 mt-1">Maximum 10MB</span>
            </button>
          </div>

          <!-- PDF sélectionné -->
          <div v-else class="border-2 border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="mdi:file-pdf-box" class="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p class="text-sm font-medium text-green-900">PDF chargé avec succès</p>
                <a :href="form.file_url" target="_blank" class="text-xs text-green-700 hover:underline">
                  Voir le fichier →
                </a>
              </div>
            </div>
            <button
              type="button"
              @click="form.file_url = ''"
              class="text-red-600 hover:text-red-800"
            >
              <Icon name="mdi:close" class="h-5 w-5" />
            </button>
          </div>

          <!-- Barre de progression -->
          <div v-if="uploading" class="mt-3">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-black h-2 rounded-full transition-all duration-300"
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
            <p class="text-sm text-gray-500 mt-1">Upload... {{ uploadProgress }}%</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            v-if="editingDoc"
            type="button"
            @click="handleCancel"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading || !form.file_url"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50"
          >
            {{ loading ? 'Enregistrement...' : (editingDoc ? 'Mettre à jour' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des documents -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Documents existants</h3>
      </div>

      <div v-if="loadingList" class="p-8 text-center">
        <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-gray-400" />
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <div v-else-if="documents.length === 0" class="p-8 text-center">
        <Icon name="mdi:file-document-outline" class="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p class="text-gray-500">Aucun document trouvé</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3 mr-4">
                <Icon name="mdi:file-pdf-box" class="h-8 w-8 text-blue-600" />
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-900">{{ doc.name }}</h4>
                <p class="text-sm text-gray-600">{{ doc.description }}</p>
                <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded">{{ doc.type }}</span>
                  <span>{{ formatDate(doc.updated_at) }}</span>
                  <span v-if="doc.file_size">{{ formatFileSize(doc.file_size) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <a
                :href="doc.file_url"
                target="_blank"
                class="p-2 text-blue-600 hover:text-blue-900"
                title="Voir"
              >
                <Icon name="mdi:eye" class="h-5 w-5" />
              </a>
              <a
                :href="doc.file_url"
                download
                class="p-2 text-green-600 hover:text-green-900"
                title="Télécharger"
              >
                <Icon name="mdi:download" class="h-5 w-5" />
              </a>
              <button
                @click="editDocument(doc)"
                class="p-2 text-blue-600 hover:text-blue-900"
                title="Modifier"
              >
                <Icon name="mdi:pencil" class="h-5 w-5" />
              </button>
              <button
                @click="deleteDocument(doc)"
                class="p-2 text-red-600 hover:text-red-900"
                title="Supprimer"
              >
                <Icon name="mdi:delete" class="h-5 w-5" />
              </button>
            </div>
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
const { uploadImage } = useCloudinary()
const documents = ref([])
const loadingList = ref(true)
const loading = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const editingDoc = ref(null)

const form = ref({
  name: '',
  type: 'synthese',
  description: '',
  file_url: '',
  file_size: null
})

// Charger les documents
const loadDocuments = async () => {
  loadingList.value = true
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    documents.value = data || []
  } catch (error) {
    console.error('Erreur chargement documents:', error)
    alert('Erreur lors du chargement des documents')
  } finally {
    loadingList.value = false
  }
}

// Upload fichier
const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Vérifier que c'est un PDF
  if (!file.type.includes('pdf')) {
    alert('Seuls les fichiers PDF sont acceptés')
    event.target.value = ''
    return
  }

  // Vérifier la taille
  if (file.size > 10 * 1024 * 1024) {
    alert('Le fichier est trop volumineux (max 10MB)')
    event.target.value = ''
    return
  }

  try {
    uploading.value = true
    uploadProgress.value = 0

    // Simuler progression
    const interval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    // Upload vers Cloudinary (accepte aussi les PDFs)
    const result = await uploadImage(file)
    
    clearInterval(interval)
    uploadProgress.value = 100

    // Mettre à jour le formulaire
    form.value.file_url = result.url
    form.value.file_size = file.size

    console.log('✅ PDF uploadé avec succès:', result.url)
  } catch (error) {
    console.error('❌ Erreur upload:', error)
    alert('Erreur lors de l\'upload du fichier. Veuillez réessayer.')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
    event.target.value = ''
  }
}

// Submit formulaire
const handleSubmit = async () => {
  // Validation
  if (!form.value.name || !form.value.file_url) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  loading.value = true

  try {
    // Préparer les données
    const documentData = {
      name: form.value.name,
      type: form.value.type,
      description: form.value.description || '',
      file_url: form.value.file_url,
      file_size: form.value.file_size
    }

    if (editingDoc.value) {
      // Mise à jour
      console.log('Mise à jour du document:', editingDoc.value.id, documentData)
      
      const { error } = await supabase
        .from('documents')
        .update(documentData)
        .eq('id', editingDoc.value.id)

      if (error) throw error
      
      console.log('✅ Document mis à jour')
      alert('Document mis à jour avec succès !')
    } else {
      // Création
      console.log('Création d\'un nouveau document:', documentData)
      
      const { error } = await supabase
        .from('documents')
        .insert([documentData])

      if (error) throw error
      
      console.log('✅ Document créé')
      alert('Document créé avec succès !')
    }

    // Réinitialiser et recharger
    handleCancel()
    await loadDocuments()
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error)
    alert(`Erreur lors de la sauvegarde: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// Éditer un document
const editDocument = (doc) => {
  editingDoc.value = doc
  form.value = {
    name: doc.name,
    type: doc.type,
    description: doc.description || '',
    file_url: doc.file_url,
    file_size: doc.file_size
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Supprimer un document
const deleteDocument = async (doc) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer "${doc.name}" ?`)) {
    return
  }

  try {
    console.log('Suppression du document:', doc.id)
    
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', doc.id)

    if (error) throw error
    
    console.log('✅ Document supprimé')
    alert('Document supprimé avec succès !')
    
    await loadDocuments()
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    alert(`Erreur lors de la suppression: ${error.message}`)
  }
}

// Annuler l'édition
const handleCancel = () => {
  editingDoc.value = null
  form.value = {
    name: '',
    type: 'synthese',
    description: '',
    file_url: '',
    file_size: null
  }
}

// Formater la date
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR')
}

// Formater la taille
const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['o', 'Ko', 'Mo', 'Go']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// Charger au montage
onMounted(() => {
  loadDocuments()
})
</script>