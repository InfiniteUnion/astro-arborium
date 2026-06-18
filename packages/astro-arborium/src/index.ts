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
   * switching, or `false` to disable auto-injected styles. Defaults to `"one-dark"`.
   */
  theme?: ThemeOption | false
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
          // Wrap the injected styles in a cascade layer so consumers can
          // override Arborium's defaults (theme tokens, code-frame chrome,
          // the copy button) with their own unlayered CSS, regardless of the
          // fact that this <style> is appended to the end of <head> at runtime.
          const css = `@layer arborium {\n${await createThemeCss(theme)}\n}`
          injectScript(
            "page",
            `document.head.insertAdjacentHTML("beforeend", "<style>" + ${JSON.stringify(css)} + "</style>");`,
          )
        }

        injectScript("page", 'import "astro-arborium/client";')
      },
    },
  }
}
