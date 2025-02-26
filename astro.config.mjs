import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import node from "@astrojs/node";
import blogNotifications from "./src/integrations/blog-notifications";

export default defineConfig({
  site: "https://harmonia.jules.com",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    react(),
    tailwind(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
    compress({
      css: true,
      html: true,
      js: true,
      img: true,
      svg: true,
    }),
    blogNotifications(),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    ssr: {
      noExternal: ["@supabase/supabase-js"],
    },
  },
});
