import { readFile } from "node:fs/promises"

/**
 * All bundled Arborium theme names. These match the CSS files in
 * `@arborium/arborium/themes/`.
 */
export const THEMES = [
  "alabaster",
  "ayu-dark",
  "ayu-light",
  "catppuccin-frappe",
  "catppuccin-latte",
  "catppuccin-macchiato",
  "catppuccin-mocha",
  "cobalt2",
  "dayfox",
  "desert256",
  "dracula",
  "ef-melissa-dark",
  "evergarden-fall",
  "github-dark",
  "github-light",
  "gruvbox-dark",
  "gruvbox-light",
  "kanagawa-dragon",
  "light-owl",
  "lucius-light",
  "melange-dark",
  "melange-light",
  "monokai",
  "nord",
  "one-dark",
  "rose-pine-moon",
  "rustdoc-ayu",
  "rustdoc-dark",
  "rustdoc-light",
  "solarized-dark",
  "solarized-light",
  "tokyo-night",
  "zenburn",
] as const

/** A valid Arborium theme name. */
export type ThemeName = (typeof THEMES)[number]

/**
 * A theme option: a single theme name, or an object selecting separate themes
 * for light and dark mode.
 */
export type ThemeOption = ThemeName | { light?: ThemeName; dark?: ThemeName }

const CODE_FRAME_STYLES = `
.code-frame {
  margin: 1.5rem 0;
  border: 1px solid var(--border, #d4d4ce);
  background: var(--code-bg);
  color: var(--code-fg);
  overflow: hidden;
}

.code-frame__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.25rem;
  padding: 0.375rem 0.75rem;
  border-bottom: 1px solid color-mix(in srgb, var(--code-fg) 14%, transparent);
  background: color-mix(in srgb, var(--code-bg) 84%, black);
  color: var(--code-fg);
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
}

.code-frame__label {
  transform: translateY(0.03em);
}

.code-frame__copy {
  display: inline-grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  margin-left: auto;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--code-fg) 24%, transparent);
  background: color-mix(in srgb, var(--code-fg) 6%, transparent);
  color: var(--code-fg);
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.code-frame__copy:hover,
.code-frame__copy:focus-visible {
  border-color: var(--primary, #e61919);
  background: color-mix(in srgb, var(--primary, #e61919) 16%, transparent);
  color: #ffffff;
}

.code-frame__copy[data-copied="true"] {
  border-color: var(--primary, #e61919);
  background: color-mix(in srgb, var(--primary, #e61919) 16%, transparent);
  color: var(--primary, #e61919);
}

.code-frame__copy[data-copy-error="true"] {
  border-color: var(--primary, #e61919);
  color: var(--primary, #e61919);
}

.code-frame__copy-icon {
  grid-area: 1 / 1;
  width: 0.875rem;
  height: 0.875rem;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.code-frame__copy-icon--check {
  opacity: 0;
  transform: scale(0.75);
}

.code-frame__copy[data-copied="true"] .code-frame__copy-icon--copy {
  opacity: 0;
  transform: scale(0.75);
}

.code-frame__copy[data-copied="true"] .code-frame__copy-icon--check {
  opacity: 1;
  transform: scale(1);
}

.code-frame pre {
  padding: 1rem;
  border: 0;
  margin: 0;
  background: var(--code-bg);
  color: var(--code-fg);
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
  font-size: 1rem;
  line-height: 1.55;
  overflow-x: auto;
  tab-size: 2;
  -webkit-overflow-scrolling: touch;
}

.code-frame pre code {
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  word-break: normal;
  overflow-wrap: normal;
  white-space: pre;
}
`.trim()

/**
 * Generate the CSS for the selected Arborium theme.
 */
export async function createThemeCss(theme: ThemeOption): Promise<string> {
  if (typeof theme === "string") {
    validateTheme(theme)
    const base = await readThemeFile("base-rustdoc.css")
    const themeCss = await readThemeFile(`${theme}.css`)
    return [
      base,
      themeCss,
      ".code-frame {",
      "  --code-bg: var(--arb-bg-dark, var(--arb-bg-light));",
      "  --code-fg: var(--arb-fg-dark, var(--arb-fg-light));",
      "}",
      CODE_FRAME_STYLES,
    ].join("\n")
  }

  const light = theme.light ?? "github-light"
  const dark = theme.dark ?? "one-dark"
  validateTheme(light)
  validateTheme(dark)

  const base = await readThemeFile("base.css")
  const lightCss = await readThemeFile(`${light}.css`)
  const darkCss = await readThemeFile(`${dark}.css`)

  return [
    base,
    lightCss,
    darkCss,
    ".code-frame {",
    "  --code-bg: var(--arb-bg-light);",
    "  --code-fg: var(--arb-fg-light);",
    "}",
    "@media (prefers-color-scheme: dark) {",
    "  .code-frame {",
    "    --code-bg: var(--arb-bg-dark);",
    "    --code-fg: var(--arb-fg-dark);",
    "  }",
    "}",
    CODE_FRAME_STYLES,
  ].join("\n")
}

/**
 * Validate a theme option without reading files.
 */
export function validateTheme(theme: ThemeOption): void {
  if (typeof theme === "string") {
    validateThemeName(theme)
    return
  }
  validateThemeName(theme.light ?? "github-light")
  validateThemeName(theme.dark ?? "one-dark")
}

function validateThemeName(name: string): void {
  if (!(THEMES as readonly string[]).includes(name)) {
    throw new Error(
      `Unknown Arborium theme: "${name}". Valid themes: ${THEMES.join(", ")}`
    )
  }
}

async function readThemeFile(filename: string): Promise<string> {
  const url = import.meta.resolve(`@arborium/arborium/themes/${filename}`)
  return readFile(new URL(url), "utf-8")
}
