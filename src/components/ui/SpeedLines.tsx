import { motion } from 'motion/react'

/**
 * Linhas de movimento: detalhe gráfico discreto inspirado no rastro de uma
 * moto em velocidade. Puramente decorativo (aria-hidden).
 */
const lines = [
  { y: 8, x: 40, w: 200, accent: false },
  { y: 26, x: 0, w: 240, accent: true },
  { y: 44, x: 70, w: 170, accent: false },
  { y: 62, x: 120, w: 120, accent: false },
]

export function SpeedLines({ className = '', tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const neutral = tone === 'dark' ? 'rgb(255 255 255 / 0.18)' : 'rgb(21 25 29 / 0.14)'
  return (
    <svg aria-hidden viewBox="0 0 240 70" fill="none" className={`pointer-events-none ${className}`}>
      {lines.map((line, i) => (
        <motion.line
          key={line.y}
          x1={line.x}
          x2={line.x + line.w}
          y1={line.y}
          y2={line.y}
          stroke={line.accent ? 'var(--color-accent)' : neutral}
          strokeWidth={line.accent ? 3 : 2}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  )
}
