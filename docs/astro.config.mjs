import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Vite Caddy",
      social: {
        github: "https://github.com/withastro/starlight"
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", link: "/guides/example/" }
          ]
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" }
        }
      ]
    })
  ]
});
