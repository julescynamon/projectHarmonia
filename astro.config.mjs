import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://harmonia-lime.vercel.app",
  output: "server", // tout en SSR → plus de getStaticPaths obligatoire + headers OK
  adapter: vercel(),
});
