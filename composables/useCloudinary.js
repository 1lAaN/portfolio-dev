// composables/useCloudinary.js
export const useCloudinary = () => {
  const config = useRuntimeConfig()

  // Upload une image vers Cloudinary
  const uploadImage = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', config.public.cloudinaryUploadPreset)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return {
        url: data.secure_url,
        publicId: data.public_id
      }
    } catch (error) {
      console.error('Erreur upload Cloudinary:', error)
      throw error
    }
  }

  // Supprimer une image de Cloudinary (optionnel)
  const deleteImage = async (publicId) => {
    try {
      // Note: La suppression nécessite l'API côté serveur pour la sécurité
      // Pour l'instant, on garde les images (mode gratuit a beaucoup d'espace)
      console.log('Image à supprimer:', publicId)
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  return {
    uploadImage,
    deleteImage
  }
}