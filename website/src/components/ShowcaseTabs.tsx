import { useId, useRef, useState } from "react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react"

export interface ShowcaseItem {
  id: string
  title: string
  icon: string
  tag: string
  color?: string
}

export interface Props {
  items: ShowcaseItem[]
  /* Panels arrive as named slots from the .astro page (`slot="rust"` → prop `rust`). */
  [slot: string]: unknown
}

const spring = { type: "spring", stiffness: 400, damping: 26 } as const

export default function ShowcaseTabs({ items, ...slots }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")
  const active = items.find((item) => item.id === activeId) ?? items[0]
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const baseId = useId()

  const selectTab = (id: string) => setActiveId(id)

  /* The Arborium copy-button client binds on `DOMContentLoaded`/`astro:page-load`,
     so buttons inside panels mounted later by AnimatePresence would be unbound.
     This fires once per panel mount — at that point the panel is in the DOM and
     `init()` picks up its buttons. `data-code-copy-bound` guards against double-binding. */
  const bindPanelCopyButtons = (el: HTMLElement | null) => {
    if (!el) return
    document.dispatchEvent(new Event("astro:page-load"))
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1
    if (event.key === "ArrowRight") next = (index + 1) % items.length
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = items.length - 1
    if (next === -1) return
    event.preventDefault()
    const target = items[next]
    selectTab(target.id)
    tabRefs.current[target.id]?.focus()
  }

  if (!active) return null

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        data-motion-root
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="showcase-tabs relative min-w-0"
      >
        <div
          role="tablist"
          aria-label="Language showcase"
          className="showcase-tab-bar flex flex-wrap justify-start gap-3 mb-7 max-[640px]:gap-2"
        >
          {items.map((item, index) => {
            const isActive = item.id === active.id
            return (
              <motion.button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[item.id] = el
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.id}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                animate={{ y: isActive ? -2 : 0 }}
                whileHover={{ y: -4 }}
                whileTap={{ y: 0 }}
                transition={spring}
                className={`relative inline-flex items-center gap-2 px-4 py-[0.55rem] bg-surface border-2 rounded-full shadow-[3px_3px_0_var(--shadow-soft)] font-display font-bold text-[0.95rem] text-ink cursor-pointer transition-[box-shadow,border-color] duration-150 ease-in-out hover:shadow-[5px_5px_0_var(--shadow-medium)] focus-visible:outline-3 focus-visible:outline-ink focus-visible:outline-offset-3 max-[640px]:px-[0.85rem] max-[640px]:py-[0.45rem] max-[640px]:text-[0.9rem] ${
                  isActive
                    ? "border-[var(--tab-color)] shadow-[4px_5px_0_color-mix(in_srgb,var(--tab-color)_25%,var(--shadow-soft))]"
                    : "border-outline"
                }`}
                style={{ "--tab-color": item.color ?? "var(--color-lavender)" } as CSSProperties}
              >
                {isActive && (
                  <motion.span
                    layoutId={`${baseId}-active-pill`}
                    className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--tab-color)_14%,var(--color-surface))]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-2">
                  <span className="text-[1.1rem] leading-none" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="translate-y-[0.03em]">{item.title}</span>
                  <span className="px-[0.55rem] py-[0.15rem] border-[1.5px] border-outline rounded-full bg-surface text-[0.65rem] font-bold uppercase tracking-[0.06em] max-[640px]:hidden">
                    {item.tag}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={active.id}
            ref={bindPanelCopyButtons}
            role="tabpanel"
            id={`${baseId}-panel-${active.id}`}
            aria-labelledby={`${baseId}-tab-${active.id}`}
            initial={{ opacity: 0, y: 14, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.995 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {slots[active.id] as ReactNode | undefined}
          </motion.section>
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  )
}
