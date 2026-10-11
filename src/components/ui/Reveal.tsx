import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}

/** Entrada discreta (fade + leve deslocamento) quando o elemento aparece na tela. */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
