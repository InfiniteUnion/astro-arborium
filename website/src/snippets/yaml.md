```yaml
name: astro-arborium
version: 0.0.1
description: An Astro integration for syntax highlighting
keywords:
  - astro
  - syntax-highlighting
  - tree-sitter

astro:
  markdown:
    syntaxHighlight: false
  integrations:
    - @infiniteunion/astro-arborium

scripts:
  dev: astro dev
  build: astro build
  preview: astro preview

dependencies:
  astro: ^6.4.2
  tailwindcss: ^4.3.0
```
