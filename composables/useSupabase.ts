export const useSupabase = () => {
  // Import dynamique côté client uniquement
  if (process.server) {
    // Retourne un mock côté serveur pour éviter les erreurs de build
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signIn: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
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

  // Import réel côté client
  const config = useRuntimeConfig()
  const { createClient } = require('@supabase/supabase-js')
  
  return createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )
}