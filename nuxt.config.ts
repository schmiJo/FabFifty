// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Compatibility fallback for Nuxt features
  compatibilityDate: '2025-05-15',

  // Enable Nuxt Devtools for development
  devtools: { enabled: true },

  // Set app metadata
  app: {
    head: {
      title: '✨ Fab Fifty - 50 Jahre voller Erinnerungen',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no' },
        { name: 'description', content: 'Feiere mit uns - Lade deine schönsten Fotos hoch und teile die besten Momente des 50. Geburtstags' },
        { name: 'theme-color', content: '#FFD700' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
      ],
      link: [
        // Google Fonts für elegante Typografie
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600;700&display=swap' },
        // Font Awesome für Icons
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ]
    }
  },

  // Runtime config (private and public keys)
  runtimeConfig: {
    // Private (server-only) - these will be automatically populated from NUXT_DO_SPACES_KEY and NUXT_DO_SPACES_SECRET
    doSpacesKey: process.env.NUXT_DO_SPACES_KEY || '',
    doSpacesSecret: process.env.NUXT_DO_SPACES_SECRET || '',

    // Public (client and server)
    public: {
      spaceName: 'fifty',
      region: 'fra1'
    }
  },

  // Nitro server options
  nitro: {
    preset: 'node-server',
    experimental: {
      wasm: true
    }
  },

  // Vite config for better CSS processing and Android compatibility
  vite: {
    define: {
      'process.env.DEBUG': false
    },
    optimizeDeps: {
      include: ['vue', 'vue-router']
    }
  },

  // Modules can go here
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Global CSS
  css: [
    '~/assets/css/fabfifty.css'
  ]
})
