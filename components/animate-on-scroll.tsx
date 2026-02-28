"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"

interface Props {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimateOnScroll({ children, className = "", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 1,
        delay: delay / 1000
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
