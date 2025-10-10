import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/server";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.maisonsattvaia.fr",
  output: "server", // tout en SSR → plus de getStaticPaths obligatoire + headers OK
  adapter: vercel(),
  integrations: [tailwind(), react(), sitemap()],
});
