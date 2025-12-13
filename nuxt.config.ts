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

  nitro: {
    preset: 'cloudflare-pages-static',
    prerender: {
      // Ne pas prerender les pages qui utilisent Supabase
      ignore: ['/admin', '/admin/*']
    }
  },

  // ✅ IMPORTANT : Externaliser Supabase pour éviter les erreurs de module
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
      }
    },
    optimizeDeps: {
      exclude: ['@supabase/supabase-js']
    }
  },

  // ✅ Désactiver SSR pour les routes qui utilisent Supabase
  routeRules: {
    '/admin/**': { ssr: false },
    '/synthese': { ssr: false }
  }
})