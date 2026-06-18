import { defineConfig } from "astro/config"
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
    arborium({
      theme: "catppuccin-latte",
    }),
  ],
})
