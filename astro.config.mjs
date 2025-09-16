import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import blogNotifications from "./src/integrations/blog-notifications";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  site: "https://project-harmonia.vercel.app",
  output: "static",
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
    // Désactivé temporairement
    // blogNotifications(),
  ],
  // Optimisations de build
  build: {
    inlineStylesheets: "auto",
    // Optimisation des assets
    assets: "_astro",
    // Génération de source maps pour le développement uniquement
    sourcemap: true,
  },
  // Optimisations Vite
  vite: {
    ssr: {
      noExternal: ["@supabase/supabase-js"],
    },
    // Optimisations de build
    build: {
      // Optimisation du chunking
      rollupOptions: {
        output: {
          manualChunks: {
            // Séparation des vendors
            vendor: ["react", "react-dom"],
            // Séparation des utilitaires
            utils: ["@supabase/supabase-js", "zod"],
            // Séparation des animations
            animations: ["gsap", "aos"],
          },
        },
      },
      // Optimisation de la taille des chunks
      chunkSizeWarningLimit: 1000,
      // Minification avancée
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    // Optimisations des assets
    assetsInclude: ["**/*.woff2", "**/*.woff", "**/*.ttf", "**/*.eot"],
    // Plugins Vite
    plugins: [
      // PWA pour le cache et les performances
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "gstatic-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
                },
              },
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-resources-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 jours
                },
              },
            },
          ],
        },
        manifest: {
          name: "La Maison Sattvaïa - Naturopathie & Soins Chamaniques",
          short_name: "La Maison Sattvaïa",
          description: "Site de naturopathie et soins chamaniques",
          theme_color: "#4F46E5",
          background_color: "#ffffff",
          display: "standalone",
          icons: [
            {
              src: "/favicon.ico",
              sizes: "any",
              type: "image/x-icon",
            },
          ],
        },
      }),
    ],
    // Optimisations CSS
    css: {
      devSourcemap: false,
    },
    // Optimisations des dépendances
    optimizeDeps: {
      include: ["react", "react-dom", "@supabase/supabase-js"],
    },
  },
  // Compression HTML gérée par Vercel
  // Optimisations des images
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    // Formats d'image optimisés
    formats: ["webp", "avif"],
    // Qualité d'image optimisée
    quality: 80,
    // Redimensionnement automatique
    densities: [1, 2],
    // Optimisations Sharp
    sharp: {
      // Compression progressive
      progressive: true,
      // Optimisation des métadonnées
      stripMetadata: true,
      // Compression JPEG
      mozjpeg: true,
      // Compression PNG
      pngquant: {
        quality: [0.6, 0.8],
      },
      // Compression WebP
      webp: {
        quality: 80,
        effort: 6,
      },
      // Compression AVIF
      avif: {
        quality: 80,
        effort: 4,
      },
    },
  },
});
