// composables/useSupabaseStorage.js
export const useSupabaseStorage = () => {
  const supabase = useSupabase()
  const BUCKET_NAME = 'documents'

  const uploadPDF = async (file) => {
    try {
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(7)
      const fileName = `${timestamp}-${randomString}.pdf`
      const filePath = `pdfs/${fileName}`

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf'
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)

      return {
        url: publicUrl,
        path: filePath,
        size: file.size
      }
    } catch (error) {
      console.error('Erreur upload Supabase Storage:', error)
      throw error
    }
  }

  const deletePDF = async (filePath) => {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath])

      if (error) throw error
      console.log('✅ Fichier supprimé:', filePath)
    } catch (error) {
      console.error('Erreur suppression:', error)
      throw error
    }
  }

  return {
    uploadPDF,
    deletePDF
  }
}