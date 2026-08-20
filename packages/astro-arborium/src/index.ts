import { isUnifiedProcessor, unified } from "@astrojs/markdown-remark"
import type { AstroIntegration } from "astro"
import rehypeArborium, { ALL_LANGUAGES, DEFAULT_LANGUAGES } from "./rehype.js"
import { createThemeCss, THEMES, validateTheme } from "./theme.js"
import type { ThemeOption } from "./theme.js"

export { ALL_LANGUAGES, DEFAULT_LANGUAGES, THEMES }
export {
  rehypeHighlight,
  rehypeCodeFrame,
  createCodeFrame,
} from "./rehype.js"
export { arboriumConfig, createArboriumConfig, highlightCode } from "./highlight.js"
export { getLanguageLabel, LANGUAGE_LABELS } from "./labels.js"
export type { ThemeName, ThemeOption } from "./theme.js"

export interface ArboriumOptions {
  /**
   * Languages to enable. Defaults to the original 7 languages (`DEFAULT_LANGUAGES`).
   * Use `ALL_LANGUAGES` to enable every supported Arborium grammar.
   */
  languages?: string[]
  /**
   * Theme to use. Pass a string for a single theme, an object for light/dark mode
   * switching, or `false` to disable bundled styles. Defaults to `"one-dark"`.
   */
  theme?: ThemeOption | false
}

function themeModuleId(theme: ThemeOption): string {
  const key =
    typeof theme === "string"
      ? theme
      : `${theme.light ?? "github-light"}-${theme.dark ?? "one-dark"}`

  return `virtual:astro-arborium/theme-${key}.css`
}

/**
 * Astro integration for Arborium syntax highlighting.
 */
export default function arborium(options: ArboriumOptions = {}): AstroIntegration {
  const theme = options.theme ?? "one-dark"

  if (theme !== false) {
    // Validate theme names early so the user gets a clear error at config time.
    validateTheme(theme)
  }

  return {
    name: "astro-arborium",
    hooks: {
      "astro:config:setup": async ({ config, updateConfig, injectScript }) => {
        const existing = config.markdown?.processor
        const processor =
          existing && isUnifiedProcessor(existing) ? existing : unified()

        processor.options.rehypePlugins = [
          ...(processor.options.rehypePlugins ?? []),
          [rehypeArborium, options],
        ]

        updateConfig({
          markdown: {
            syntaxHighlight: false,
            processor,
          },
        })

        if (theme !== false) {
          // Expose the generated theme as a virtual CSS module so Vite can
          // bundle it into Astro's normal stylesheet pipeline. The cascade
          // layer lets consumers override Arborium with unlayered CSS.
          const css = `@layer arborium {\n${await createThemeCss(theme)}\n}`
          const moduleId = themeModuleId(theme)
          const resolvedModuleId = `\0${moduleId}`

          updateConfig({
            vite: {
              plugins: [
                {
                  name: "astro-arborium:theme",
                  resolveId(id) {
                    if (id === moduleId) return resolvedModuleId
                  },
                  load(id) {
                    if (id === resolvedModuleId) return css
                  },
                },
              ],
            },
          })

          injectScript("page-ssr", `import ${JSON.stringify(moduleId)};`)
        }

        injectScript("page", 'import "@infiniteunion/astro-arborium/client";')
      },
    },
  }
}
