import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export const useSupabase = () => {
  // Créer le client une seule fois
  if (!supabaseClient) {
    const config = useRuntimeConfig()
    
    const supabaseUrl = config.public.supabaseUrl
    const supabaseKey = config.public.supabaseKey
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase config missing:', { supabaseUrl, supabaseKey })
      throw new Error('Supabase URL and Key are required')
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseKey)
  }
  
  return supabaseClient
}