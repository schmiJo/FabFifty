// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Compatibility fallback for Nuxt features
  compatibilityDate: '2025-05-15',

  // Enable Nuxt Devtools for development
  devtools: { enabled: true },

  // Set app metadata
  app: {
    head: {
      title: 'Fab Fifty Uploader',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Upload files directly to DigitalOcean Spaces' }
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
    // Example: '@nuxtjs/tailwindcss', '@nuxt/image', etc.
  ]
})
