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
      // PocketBase
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL,

      // Cloudinary
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    }
  },

  nitro: {
    preset: 'cloudflare-pages-static',
    prerender: {
      crawlLinks: false,
      routes: ['/404.html']
    }
  },

  // Désactiver SSR pour toutes les pages qui utilisent Supabase
  ssr: false
})