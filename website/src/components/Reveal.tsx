import { MotionConfig, motion } from "motion/react"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  delay?: number
}

/* Scroll-triggered fade-up for static page sections. Used as a
   `client:visible` island so it hydrates only when scrolled near. */
export default function Reveal({ children, delay = 0 }: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        data-motion-root
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}
