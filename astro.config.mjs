import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import editableRegions from "@cloudcannon/editable-regions/astro-integration";

export default defineConfig({
  site: "https://skagway.tours",
  integrations: [mdx(), sitemap(), editableRegions()],
  markdown: {
    shikiConfig: { theme: "github-dark-dimmed" },
  },
});
