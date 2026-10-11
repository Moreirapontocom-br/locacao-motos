import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import type { FaqItem } from '../../types'

/** Acordeão acessível (botões com aria-expanded/aria-controls). Um item aberto por vez. */
export function Accordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className="divide-y divide-graphite/10 border-y border-graphite/10">
      {items.map((item, i) => {
        const isOpen = open === i
        const buttonId = `${baseId}-btn-${i}`
        const panelId = `${baseId}-panel-${i}`
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-medium transition-colors hover:text-accent-ink sm:text-xl"
              >
                {item.question}
                <span
                  aria-hidden
                  className={`grid size-9 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-300 ${
                    isOpen ? 'rotate-45 bg-graphite text-white' : 'bg-ice text-graphite'
                  }`}
                >
                  <Plus className="size-4.5" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pr-12 pb-6 leading-relaxed text-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
