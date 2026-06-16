import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import tailwindcss from "@tailwindcss/vite"
import arborium from "astro-arborium"

export default defineConfig({
  markdown: {
    syntaxHighlight: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    arborium({
      theme: "catppuccin-latte",
    }),
  ],
})
