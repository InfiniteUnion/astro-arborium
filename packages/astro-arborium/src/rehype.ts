import { highlight, normalizeLanguage } from "@arborium/arborium"
import { fromHtml } from "hast-util-from-html"
import type { Element, ElementContent, Root, RootContent } from "hast"
import { arboriumConfig } from "./highlight.js"
import { getLanguageLabel } from "./labels.js"

/**
 * Default languages highlighted when no `languages` option is provided.
 * These match the original out-of-the-box behavior.
 */
export const DEFAULT_LANGUAGES = [
  "bash",
  "cpp",
  "java",
  "markdown",
  "rust",
  "typescript",
  "yaml",
]

/**
 * Every Arborium grammar package available on npm.
 * Users can opt-in to any of these by installing the matching `@arborium/<lang>`
 * package and passing it to the integration.
 */
export const ALL_LANGUAGES = [
  "ada",
  "agda",
  "asciidoc",
  "asciidoc_inline",
  "asm",
  "awk",
  "bash",
  "batch",
  "c",
  "c-sharp",
  "caddy",
  "capnp",
  "cedar",
  "cedarschema",
  "clojure",
  "cmake",
  "cobol",
  "commonlisp",
  "cpp",
  "css",
  "d",
  "dart",
  "devicetree",
  "diff",
  "dockerfile",
  "dot",
  "elisp",
  "elixir",
  "elm",
  "erlang",
  "fish",
  "fsharp",
  "gitattributes",
  "gleam",
  "glsl",
  "go",
  "graphql",
  "groovy",
  "haskell",
  "hcl",
  "hlsl",
  "html",
  "idris",
  "ini",
  "java",
  "javascript",
  "jinja2",
  "jq",
  "jsdoc",
  "json",
  "julia",
  "just",
  "kconfig",
  "kdl",
  "kotlin",
  "lean",
  "lua",
  "make",
  "markdown",
  "matlab",
  "meson",
  "nginx",
  "ninja",
  "nix",
  "objc",
  "ocaml",
  "odin",
  "perl",
  "php",
  "postscript",
  "powershell",
  "prolog",
  "proto",
  "python",
  "query",
  "r",
  "regex",
  "rego",
  "rescript",
  "ron",
  "ruby",
  "rust",
  "scala",
  "scheme",
  "scss",
  "solidity",
  "sparql",
  "sql",
  "ssh-config",
  "starlark",
  "styx",
  "svelte",
  "swift",
  "textproto",
  "thrift",
  "tlaplus",
  "toml",
  "tsx",
  "typescript",
  "typst",
  "uiua",
  "vb",
  "verilog",
  "vhdl",
  "vim",
  "vue",
  "wit",
  "x86asm",
  "xml",
  "yaml",
  "yuri",
  "zig",
  "zsh",
]

export interface RehypeArboriumOptions {
  /** Languages to highlight. Defaults to the original 7 languages. */
  languages?: string[]
}

/**
 * Rehype plugin that highlights `pre > code` blocks with Arborium.
 *
 * Replaces the code's children with highlighted spans and stamps the language
 * onto `data-arborium-language` attributes on both the `<pre>` and `<code>`.
 * Does **not** add a code frame or copy button — pair it with `rehypeCodeFrame`
 * (or use the default `rehypeArborium`, which runs both) for the chrome.
 */
export function rehypeHighlight(options: RehypeArboriumOptions = {}) {
  const languages = new Set(options.languages ?? DEFAULT_LANGUAGES)

  return async function transform(tree: Root): Promise<void> {
    await visitCodeBlocks(tree, async (_parent, _index, pre, code) => {
      const language = getLanguage(code)
      if (!language || !languages.has(language)) return

      const source = toText(code)
      if (!source) return

      const highlighted = await highlight(language, source, arboriumConfig)
      const fragment = fromHtml(highlighted, { fragment: true })

      // Highlight output is a fragment of spans/text — never a doctype, so the
      // RootContent[] is safe to treat as ElementContent[].
      code.children = fragment.children as ElementContent[]
      code.properties = {
        ...code.properties,
        "data-arborium-language": language,
      }
      pre.properties = {
        ...pre.properties,
        "data-arborium": "",
        "data-arborium-language": language,
      }
    })
  }
}

/**
 * Rehype plugin that wraps highlighted `pre` blocks (those stamped with
 * `data-arborium` by `rehypeHighlight`) in a code frame with a language label
 * and copy button. No highlighting is performed.
 */
export function rehypeCodeFrame() {
  return async function transform(tree: Root): Promise<void> {
    await visitCodeBlocks(tree, async (parent, index, pre) => {
      if (!hasArboriumMarker(pre)) return
      const language = stringProperty(pre.properties?.["data-arborium-language"])
      if (!language) return
      if (!parent || typeof index !== "number") return
      parent.children[index] = createCodeFrame(language, pre)
    })
  }
}

/**
 * Default rehype plugin for Arborium: runs `rehypeHighlight` followed by
 * `rehypeCodeFrame`. Equivalent to using both in sequence.
 */
export default function rehypeArborium(options: RehypeArboriumOptions = {}) {
  const highlightPlugin = rehypeHighlight(options)
  const framePlugin = rehypeCodeFrame()

  return async function transform(tree: Root): Promise<void> {
    await highlightPlugin(tree)
    await framePlugin(tree)
  }
}

function hasArboriumMarker(pre: Element): boolean {
  return "data-arborium" in (pre.properties ?? {})
}

type CodeBlockVisitor = (
  parent: Root | Element | null,
  index: number | null,
  pre: Element,
  code: Element
) => Promise<void>

async function visitCodeBlocks(
  node: Root | RootContent,
  visitor: CodeBlockVisitor,
  parent: Root | Element | null = null,
  index: number | null = null
): Promise<void> {
  if (node.type === "element" && node.tagName === "pre") {
    const code = node.children.find(
      (child): child is Element =>
        child.type === "element" && child.tagName === "code"
    )
    if (code) {
      await visitor(parent, index, node, code)
    }
    return
  }

  if (!("children" in node)) return

  for (const [childIndex, child] of node.children.entries()) {
    await visitCodeBlocks(child, visitor, node, childIndex)
  }
}

export function createCodeFrame(language: string, pre: Element): Element {
  const label = getLanguageLabel(language)

  return {
    type: "element",
    tagName: "figure",
    properties: {
      className: ["code-frame"],
      "data-code-language": language,
    },
    children: [
      {
        type: "element",
        tagName: "figcaption",
        properties: { className: ["code-frame__header"] },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["code-frame__label"] },
            children: [{ type: "text", value: label }],
          },
          {
            type: "element",
            tagName: "button",
            properties: {
              className: ["code-frame__copy"],
              type: "button",
              "data-code-copy": "",
              "aria-label": `Copy ${label} code`,
              title: "Copy code",
            },
            children: [createCopyIcon(), createCheckIcon()],
          },
        ],
      },
      pre,
    ],
  }
}

function createCopyIcon(): Element {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      className: ["code-frame__copy-icon", "code-frame__copy-icon--copy"],
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "square",
      strokeLinejoin: "miter",
      "aria-hidden": "true",
    },
    children: [
      {
        type: "element",
        tagName: "rect",
        properties: { x: "8", y: "8", width: "10", height: "10" },
        children: [],
      },
      {
        type: "element",
        tagName: "path",
        properties: { d: "M6 16H4V4h12v2" },
        children: [],
      },
    ],
  }
}

function createCheckIcon(): Element {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      className: ["code-frame__copy-icon", "code-frame__copy-icon--check"],
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.4",
      strokeLinecap: "square",
      strokeLinejoin: "miter",
      "aria-hidden": "true",
    },
    children: [
      {
        type: "element",
        tagName: "path",
        properties: { d: "M5 12.5 10 17 19 7" },
        children: [],
      },
    ],
  }
}

function getLanguage(code: Element): string | null {
  // HAST types className as a token array, while external trees may still
  // provide a space-separated string at runtime.
  const classNames: unknown = code.properties?.className
  const classes: Array<string | number> = Array.isArray(classNames)
    ? classNames
    : typeof classNames === "string"
      ? classNames.split(/\s+/)
      : []

  const raw =
    getLanguageFromClasses(classes) ??
    stringProperty(code.properties?.dataLanguage) ??
    stringProperty(code.properties?.["data-language"])

  return raw ? normalizeLanguage(raw) : null
}

function getLanguageFromClasses(classes: Array<string | number>): string | null {
  for (const className of classes) {
    if (typeof className !== "string") continue
    if (className.startsWith("language-"))
      return className.slice("language-".length)
    if (className.startsWith("lang-")) return className.slice("lang-".length)
  }
  return null
}

function stringProperty(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function toText(node: ElementContent): string {
  if (node.type === "text") return node.value
  if (node.type !== "element") return ""
  return node.children.map(toText).join("")
}
