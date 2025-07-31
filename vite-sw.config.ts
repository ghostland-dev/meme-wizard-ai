export default {
  // Basic service worker for offline caching
  registerSW: {
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'openai-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
          },
        },
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'supabase-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60, // 1 hour
            },
          },
        },
      ],
    },
  },
};