<p align="center">
  <img src="./logo.png" alt="astro-arborium logo" width="480">
</p>

# astro-arborium

Astro integration for [Arborium](https://github.com/bearcove/arborium) syntax highlighting.

Highlights code in Markdown, MDX, and anywhere else you render code blocks in Astro — with a code frame, language label, and copy button.

Requires Astro 7.

## Install

```sh
pnpm add astro-arborium
```

The default languages are bundled with `astro-arborium`. If you enable any other language, install its grammar package separately:

```sh
pnpm add @arborium/python @arborium/go @arborium/json
```

## Features

The integration automatically:

- highlights fenced code blocks with Arborium (WASM-backed tree-sitter grammars),
- wraps them in a code frame with a language label and copy button,
- injects the required CSS,
- wires up the copy-button client behavior.

For code that does **not** flow through Markdown (raw `<pre><code>` in `.astro` components, custom HTML, CMS content), astro-arborium also exposes the building blocks individually — see [Standalone usage](#standalone-usage) and [Direct usage](#direct-usage).

## Usage as an Astro integration

For Markdown and MDX: add the integration and disable Astro's built-in syntax highlighting.

```js
// astro.config.mjs
import { defineConfig } from "astro/config"
import arborium from "astro-arborium"

export default defineConfig({
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [arborium()],
})
```

Fenced code blocks in `.md` and `.mdx` files are highlighted automatically. MDX is covered because it flows through Astro's Markdown processor — no extra setup is needed.

## Standalone usage

If you render code through your own unified/rehype pipeline (for example, a custom MDX configuration or a hand-built processor), use the rehype plugins directly from `astro-arborium/rehype`:

```js
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { rehypeHighlight, rehypeCodeFrame } from "astro-arborium/rehype"

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeHighlight, { languages: ["rust", "typescript"] })
  .use(rehypeCodeFrame)
```

`rehypeHighlight` and `rehypeCodeFrame` are also available individually, so you can highlight without the frame, or frame pre-highlighted markup. The default export `rehypeArborium` runs both in sequence.

> **Note:** Outside the Astro integration, the copy-button script and theme CSS are **not** injected for you. Add them in a layout (CSS as a normal import, the client script in a `<script>` tag so it runs in the browser):
>
> ```astro
> ---
> import "astro-arborium/style.css" // default One Dark theme
> ---
> <script>
>   import "astro-arborium/client" // copy-button behavior
> </script>
> ```

## Direct usage

For code blocks authored directly inside `.astro` components (which never enter the rehype pipeline), use the `<Code>` component:

```astro
---
import Code from "astro-arborium/components"
import "astro-arborium/style.css" // theme CSS (or use the integration / your own)
---

<Code language="typescript" src={`const answer: number = 42`} />
```

The component highlights the source and renders the same code frame, language label, and copy button as Markdown code blocks. It bundles the copy-button client script itself, so you only need to bring the CSS — via the integration, `astro-arborium/style.css` (default One Dark), or your own Arborium theme CSS.

For lower-level control — for example, emitting highlighted HTML into your own markup — call `highlightCode()` directly:

```astro
---
import { highlightCode } from "astro-arborium"

const html = await highlightCode("rust", "fn main() {}")
---
<pre><code set:html={html} /></pre>
```

`highlightCode()` returns an HTML string of highlighted spans only — no frame, copy button, or CSS. Use the `<Code>` component for the full chrome, or `createCodeFrame()` from `astro-arborium/rehype` to build the frame markup yourself. The copy-button behavior is selector-driven (`[data-code-copy]`), so add `import "astro-arborium/client"` via a `<script>` tag if you build the frame yourself.

> **Resolution note:** `<Code>` and `highlightCode()` run Arborium at render time, so `@arborium/arborium` must be resolvable from your project. pnpm's isolated `node_modules` doesn't hoist transitive dependencies, so install it as a direct dependency:
>
> ```sh
> pnpm add @arborium/arborium
> ```
>
> Without it, highlighting silently falls back to plain text (a `[arborium] Failed to load host` warning appears in the build log). The rehype plugins are unaffected because they resolve from the `astro-arborium` package itself.

## Configuration

Pass a `languages` array to control which code blocks are highlighted. Defaults to the original 7 languages.

```js
import arborium, { ALL_LANGUAGES } from "astro-arborium"

// Highlight every language Arborium supports.
const languages = ALL_LANGUAGES

// Or replace the line above with a custom subset:
// const languages = ["rust", "typescript"]

export default defineConfig({
  markdown: { syntaxHighlight: false },
  integrations: [arborium({ languages })],
})
```

Language identifiers match the Arborium package names (e.g. `c-sharp`, `cpp`, `typescript`).

## Themes

Pass a `theme` option to pick one of Arborium's bundled themes. Defaults to `"one-dark"`.

```js
import arborium from "astro-arborium"

// Use different themes for light and dark mode.
const theme = { light: "github-light", dark: "one-dark" }

// Or replace the line above with a single theme or no bundled theme styles:
// const theme = "tokyo-night"
// const theme = false

export default defineConfig({
  markdown: { syntaxHighlight: false },
  integrations: [arborium({ theme })],
})
```

`THEMES` exports all 33 bundled theme names.

When `theme: false`, no styles are bundled automatically. You can still import `astro-arborium/style.css` for the original One Dark look, or bring your own Arborium theme CSS.

## Supported languages

All 113 Arborium grammars are supported (see [`ALL_LANGUAGES`](./src/rehype.ts) for the complete, authoritative list). Install the matching `@arborium/<lang>` package for any language you enable.

The default languages are:

- Bash
- C++
- Java
- Markdown
- Rust
- TypeScript
- YAML

## Exports

| Subpath                        | Description                                                            |
| ------------------------------ | ---------------------------------------------------------------------- |
| `astro-arborium`               | Astro integration (default export) + helpers (`highlightCode`, config) |
| `astro-arborium/rehype`        | `rehypeHighlight`, `rehypeCodeFrame`, `rehypeArborium`, `createCodeFrame` |
| `astro-arborium/highlight`     | `highlightCode`, `arboriumConfig`, `createArboriumConfig`              |
| `astro-arborium/labels`        | `getLanguageLabel`, `LANGUAGE_LABELS`                                  |
| `astro-arborium/components`    | `<Code>` Astro component                                               |
| `astro-arborium/client`        | Copy-button client script (auto-imported by the integration)           |
| `astro-arborium/style.css`     | Default One Dark theme CSS                                             |

## Example

See the `website/` directory in this repository for a demo landing page.

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.
