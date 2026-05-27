// Avec PocketBase, les fichiers sont des champs natifs dans la collection.
// Upload : passer un FormData à pb.collection('documents').create(formData)
// URL    : usePbFileUrl(record, record.file)
export const usePbFileUrl = (record, filename) => {
  if (!record || !filename) return ''
  const pb = usePb()
  return pb.files.getURL(record, filename)
}
