<p align="center">
  <img src="./logo.png" alt="astro-arborium logo" width="480">
</p>

# astro-arborium

Astro integration for [Arborium](https://github.com/bearcove/arborium) syntax highlighting.

## Install

```sh
bun add astro-arborium
```

The default languages are bundled with `astro-arborium`. If you enable any other language, install its grammar package separately:

```sh
bun add @arborium/python @arborium/go @arborium/json
```

## Usage

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

The integration automatically:

- highlights fenced code blocks with Arborium,
- wraps them in a code frame with a language label and copy button,
- injects the required CSS,
- wires up the copy-button client behavior.

## Configuration

Pass a `languages` array to control which code blocks are highlighted. Defaults to the original 7 languages.

```js
import arborium, { ALL_LANGUAGES, DEFAULT_LANGUAGES } from "astro-arborium"

export default defineConfig({
  markdown: { syntaxHighlight: false },
  integrations: [
    // highlight every language Arborium supports
    arborium({ languages: ALL_LANGUAGES }),

    // or just a few
    arborium({ languages: ["rust", "typescript"] }),
  ],
})
```

Language identifiers match the Arborium package names (e.g. `c-sharp`, `cpp`, `typescript`).

## Themes

Pass a `theme` option to pick one of Arborium's bundled themes. Defaults to `"one-dark"`.

```js
import arborium, { THEMES } from "astro-arborium"

export default defineConfig({
  markdown: { syntaxHighlight: false },
  integrations: [
    // single theme, always applied
    arborium({ theme: "tokyo-night" }),

    // different themes for light / dark mode
    arborium({ theme: { light: "github-light", dark: "one-dark" } }),

    // disable auto-injected styles and bring your own CSS
    arborium({ theme: false }),
  ],
})
```

`THEMES` exports all 33 bundled theme names.

When `theme: false`, no styles are injected automatically. You can still import `astro-arborium/style.css` for the original One Dark look, or bring your own Arborium theme CSS.

## Supported languages

All 113 Arborium grammars are supported. Install the matching `@arborium/<lang>` package for any language you enable.

The default languages are:

- Bash
- C++
- Java
- Markdown
- Rust
- TypeScript
- YAML

See [`ALL_LANGUAGES`](./src/rehype.ts) for the complete list.

## Example

See the `website/` directory in this repository for a demo landing page.

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT License ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.
