import { highlight, normalizeLanguage } from "@arborium/arborium"
import type { ArboriumConfig } from "@arborium/arborium"
import { readFile } from "node:fs/promises"

/**
 * Factory for an `ArboriumConfig` wired to resolve `@arborium/<lang>` grammar
 * packages (and the host runtime) from the host's `node_modules`. This is the
 * same resolver setup the Astro integration uses internally.
 *
 * Use it when you call Arborium's `highlight()` directly and want the same
 * behavior, or when you build your own rehype pipeline.
 */
export function createArboriumConfig(): ArboriumConfig {
  return {
    logger: {
      debug() {},
      warn: console.warn,
      error: console.error,
    },
    resolveHostJs: () => import("@arborium/arborium/arborium_host.js"),
    resolveHostWasm: () =>
      readFile(
        new URL(import.meta.resolve("@arborium/arborium/arborium_host_bg.wasm"))
      ),
    resolveJs: ({ language }) => import(`@arborium/${language}/grammar.js`),
    resolveWasm: ({ language }) =>
      readFile(
        new URL(import.meta.resolve(`@arborium/${language}/grammar_bg.wasm`))
      ),
  }
}

/**
 * Shared default config used by the integration, the rehype plugins, and the
 * `highlightCode` helper. Mutating it is not recommended — call
 * `createArboriumConfig()` for a fresh, customizable copy.
 */
export const arboriumConfig: ArboriumConfig = createArboriumConfig()

/**
 * Highlight `source` as `language` and return an HTML string of spans.
 *
 * This is the lowest-level entry point: it does not add a code frame, copy
 * button, or any CSS. Use the `<Code>` component (from `@infiniteunion/astro-arborium/components`)
 * for the full chrome, or the rehype plugins for Markdown/MDX pipelines.
 *
 * @param language Arborium language identifier (e.g. `"typescript"`, `"c-sharp"`).
 * @param source   Raw source code to highlight.
 */
export async function highlightCode(
  language: string,
  source: string
): Promise<string> {
  const normalized = normalizeLanguage(language)
  return highlight(normalized, source, arboriumConfig)
}
