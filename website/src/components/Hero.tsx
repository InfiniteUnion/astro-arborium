import { MotionConfig, motion } from "motion/react"
import type { Variants } from "motion/react"
import type { ReactNode } from "react"

interface HeroProps {
  install?: ReactNode
}

/* Staggered entrance for the hero column. Labels propagate from the
   container, each direct child delays by `staggerChildren`. */
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

/* Badges cascade in individually after the row lands. */
const badgeRow: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

const badge: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Hero({ install }: HeroProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        data-motion-root
        variants={container}
        initial="hidden"
        animate="show"
        className="relative pt-6 pb-12 mb-4 grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-y-10 gap-x-12 items-center max-[800px]:grid-cols-1 max-[800px]:gap-8 max-[800px]:text-center max-[800px]:pt-4 max-[800px]:pb-10"
      >
        <div className="min-w-0">
          <motion.div
            variants={badgeRow}
            className="flex flex-wrap justify-start gap-3 mt-7 mb-7 max-[800px]:justify-center max-[800px]:mt-6"
          >
            <motion.span
              variants={badge}
              className="inline-flex items-center gap-[0.4rem] px-[0.95rem] py-[0.4rem] bg-surface border-2 border-lavender-dark rounded-full font-display font-semibold text-[0.95rem] text-lavender-dark shadow-[3px_3px_0_var(--shadow-soft)]"
            >
              🌳 tree-sitter powered
            </motion.span>
            <motion.span
              variants={badge}
              className="inline-flex items-center gap-[0.4rem] px-[0.95rem] py-[0.4rem] bg-surface border-2 border-blossom-dark rounded-full font-display font-semibold text-[0.95rem] text-blossom-dark shadow-[3px_3px_0_var(--shadow-soft)]"
            >
              ⚡ zero runtime JS
            </motion.span>
            <motion.span
              variants={badge}
              className="inline-flex items-center gap-[0.4rem] px-[0.95rem] py-[0.4rem] bg-surface border-2 border-mint-dark rounded-full font-display font-semibold text-[0.95rem] text-mint-dark shadow-[3px_3px_0_var(--shadow-soft)]"
            >
              🚀 Astro native
            </motion.span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display font-bold text-[clamp(2.75rem,6.5vw,4.25rem)] leading-[0.95] tracking-[-0.03em] mb-4"
          >
            Syntax highlighting
            <br />
            with a little{" "}
            <span className="relative inline-block bg-[linear-gradient(135deg,var(--color-lavender),var(--color-blossom)_35%,var(--color-sky)_70%,var(--color-mint)_100%)] bg-clip-text [-webkit-background-clip:text] text-transparent after:absolute after:inset-x-0 after:bottom-[0.05em] after:h-[0.12em] after:rounded-full after:bg-[linear-gradient(90deg,var(--color-lavender),var(--color-blossom),var(--color-sky),var(--color-mint))] after:opacity-35 after:content-['']">
              Arborium
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-[520px] mb-7 text-ink-muted text-[clamp(1.05rem,2vw,1.25rem)] font-medium max-[800px]:mx-auto"
          >
            A lightweight Astro integration that hands your fenced code blocks to{" "}
            <code>tree-sitter</code> for fast, precise, language-aware
            highlighting.
          </motion.p>

          <motion.div
            variants={item}
            className="max-w-[520px] mb-7 max-[800px]:max-w-[560px] max-[800px]:mx-auto max-[800px]:mb-6 [&_.code-frame]:shadow-[8px_8px_0_var(--shadow-medium)] [&_.code-frame_pre]:text-[clamp(0.9rem,1.8vw,1.05rem)]"
          >
            {install}
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap justify-start gap-4 max-[800px]:justify-center"
          >
            <motion.a
              variants={item}
              whileHover={{ y: -3, rotate: -1 }}
              whileTap={{ y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="inline-flex items-center gap-2 px-[1.6rem] py-[0.85rem] border-2 border-outline rounded-2xl font-display font-bold text-[1.05rem] no-underline cursor-pointer shadow-sticker transition-[box-shadow,background-color] duration-150 ease-in-out hover:shadow-[8px_8px_0_var(--shadow-strong)] active:shadow-sticker bg-ink text-cream"
              href="https://github.com/InfiniteUnion/astro-arborium"
            >
              Github ↗
            </motion.a>
            <motion.a
              variants={item}
              whileHover={{ y: -3, rotate: -1 }}
              whileTap={{ y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="inline-flex items-center gap-2 px-[1.6rem] py-[0.85rem] border-2 border-outline rounded-2xl font-display font-bold text-[1.05rem] no-underline cursor-pointer shadow-sticker transition-[box-shadow,background-color] duration-150 ease-in-out hover:shadow-[8px_8px_0_var(--shadow-strong)] active:shadow-sticker bg-surface text-ink"
              href="https://arborium.bearcove.eu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Arborium ↗
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center items-center min-w-0 max-[800px]:hidden"
        >
          <motion.img
            className="w-[min(600px,100%)] h-auto drop-shadow-[0_14px_30px_var(--logo-shadow)]"
            src="/logo.webp"
            alt="Astro Arborium logo"
            width={600}
            height={338}
            animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
          />
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}
