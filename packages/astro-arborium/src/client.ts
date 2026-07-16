async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return true
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.top = "-1000px"
  textarea.style.left = "-1000px"
  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand("copy")
  } finally {
    textarea.remove()
  }
}

function init(): void {
  const copyButtons = document.querySelectorAll("[data-code-copy]")

  for (const button of copyButtons) {
    if (!(button instanceof HTMLButtonElement)) continue
    if (button.dataset.codeCopyBound === "true") continue

    button.dataset.codeCopyBound = "true"
    button.addEventListener("click", async () => {
      const frame = button.closest(".code-frame")
      const code = frame?.querySelector("pre code")
      const source = code?.textContent
      if (!source) return

      const resetButton = (): void => {
        button.dataset.copied = "false"
        button.dataset.copyError = "false"
        button.setAttribute("aria-label", "Copy code")
        button.setAttribute("title", "Copy code")
      }

      try {
        const copied = await copyToClipboard(source)
        if (!copied) throw new Error("Clipboard copy was rejected")

        button.dataset.copied = "true"
        button.dataset.copyError = "false"
        button.setAttribute("aria-label", "Copied code to clipboard")
        button.setAttribute("title", "Copied code to clipboard")

        window.setTimeout(resetButton, 1400)
      } catch {
        button.dataset.copyError = "true"
        button.setAttribute("aria-label", "Failed to copy code")
        button.setAttribute("title", "Failed to copy code")
        window.setTimeout(resetButton, 1400)
      }
    })
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true })
  } else {
    init()
  }

  document.addEventListener("astro:page-load", init)
}

export {}
