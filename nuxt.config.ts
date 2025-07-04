// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Compatibility fallback for Nuxt features
  compatibilityDate: '2025-05-15',

  // Enable Nuxt Devtools for development
  devtools: { enabled: true },

  // Set app metadata
  app: {
    head: {
      title: 'Fab Fifty Photo Uploader',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Upload multiple photos directly to DigitalOcean Spaces' },
        { name: 'theme-color', content: '#2563eb' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        // Optional: add Tailwind CDN or favicon
        // { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css' }
      ]
    }
  },

  // Runtime config (private and public keys)
  runtimeConfig: {
    // Private (server-only)
    doSpacesKey: '',
    doSpacesSecret: '',

    // Public (client and server)
    public: {
      spaceName: 'fifty',
      region: 'fra1'
    }
  },

  // Nitro server options
  nitro: {
    preset: 'vercel-edge', // optional: for Vercel Edge Functions
  },

  // Vite config (optional: extend if needed)
  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },

  // Modules can go here
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
