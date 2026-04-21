import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import editableRegions from "@cloudcannon/editable-regions/astro-integration";

export default defineConfig({
  site: "https://skagway.tours",
  integrations: [mdx(), sitemap(), icon(), editableRegions()],
  markdown: {
    shikiConfig: { theme: "github-dark-dimmed" },
  },
});
