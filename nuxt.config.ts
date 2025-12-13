export default defineNuxtConfig({
  compatibilityDate: '2025-09-14',
  
  modules: [
    '@unocss/nuxt',
    '@nuxt/icon'
  ],
  
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  },
  
  runtimeConfig: {
    public: {
      // Supabase
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,

      // Cloudinary
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    }
  },

  // ✅ AJOUT : Fix pour Supabase et Cloudflare Pages
  nitro: {
    moduleSideEffects: ['@supabase/supabase-js'],
    preset: 'cloudflare-pages-static'
  },

  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  }
})