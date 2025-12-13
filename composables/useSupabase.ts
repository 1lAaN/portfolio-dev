export const useSupabase = () => {
  // Mock côté serveur pour éviter les erreurs de build
  if (process.server) {
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          remove: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    }
  }

  // Import dynamique côté client uniquement
  const config = useRuntimeConfig()
  
  // Utiliser l'import dynamique au lieu de require
  return (async () => {
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey
    )
  })()
}