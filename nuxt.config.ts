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
  }
})