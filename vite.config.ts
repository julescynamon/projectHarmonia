// vite.config.ts
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  // Optimisations de build
  build: {
    // Optimisation du chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparation des vendors
          vendor: ['react', 'react-dom'],
          // Séparation des utilitaires
          utils: ['@supabase/supabase-js', 'zod'],
          // Séparation des animations
          animations: ['gsap', 'aos'],
          // Séparation des composants UI
          ui: ['sonner'],
        },
      },
    },
    // Optimisation de la taille des chunks
    chunkSizeWarningLimit: 1000,
    // Minification avancée
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    // Optimisation des assets
    assetsInlineLimit: 4096, // 4KB
    // Génération de source maps pour le développement uniquement
    sourcemap: false,
  },
  
  // Optimisations des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'zod',
      'gsap',
      'aos',
      'sonner',
    ],
    exclude: ['@astrojs/node'],
  },
  
  // Optimisations CSS
  css: {
    devSourcemap: false,
    postcss: {
      plugins: [
        // Optimisation automatique des CSS
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            colormin: true,
            minifyFontValues: true,
            minifySelectors: true,
          }],
        }),
      ],
    },
  },
  
  // Plugins de compression
  plugins: [
    // Compression Gzip
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Compresser les fichiers > 10KB
      deleteOriginFile: false,
      filter: /\.(js|css|html|svg|ttf|eot|woff|woff2)$/i,
    }),
    
    // Compression Brotli
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240, // Compresser les fichiers > 10KB
      deleteOriginFile: false,
      filter: /\.(js|css|html|svg|ttf|eot|woff|woff2)$/i,
    }),
    
    // PWA pour le cache et les performances
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 jours
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Harmonia - Naturopathie & Soins Chamaniques',
        short_name: 'Harmonia',
        description: 'Site de naturopathie et soins chamaniques',
        theme_color: '#4F46E5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.ico',
            sizes: 'any',
            type: 'image/x-icon',
          },
        ],
      },
    }),
  ],
  
  // Optimisations du serveur de développement
  server: {
    // Optimisation du HMR
    hmr: {
      overlay: false,
    },
  },
  
  // Optimisations de preview
  preview: {
    port: 4321,
    host: true,
  },
}); 