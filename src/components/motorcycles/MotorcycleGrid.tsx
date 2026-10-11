import { AnimatePresence, motion } from 'motion/react'
import type { ContactOrigin } from '../../lib/whatsapp'
import type { Motorcycle } from '../../types'
import { MotorcycleCard } from './MotorcycleCard'

export function MotorcycleGrid({
  motorcycles,
  origin,
  emptyMessage,
}: {
  motorcycles: Motorcycle[]
  /** Onde a grade aparece: define a mensagem de contato e a origem dos eventos. */
  origin: ContactOrigin
  emptyMessage?: string
}) {
  if (motorcycles.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-graphite/20 px-6 py-16 text-center text-muted">
        {emptyMessage ?? 'Nenhuma moto encontrada neste estilo no momento.'}
      </p>
    )
  }

  return (
    <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        {motorcycles.map((moto) => (
          <motion.li
            key={moto.slug}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <MotorcycleCard moto={moto} origin={origin} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
