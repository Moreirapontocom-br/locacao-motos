import { motion } from 'motion/react'
import { useId } from 'react'
import type { StyleFilterValue } from '../../types'

interface StyleFilterProps {
  value: StyleFilterValue
  onChange: (value: StyleFilterValue) => void
  /** Opções derivadas dos dados (ver `styleFilterOptions`). Vazio = filtro oculto. */
  options: { value: StyleFilterValue; label: string; count: number }[]
  showCounts?: boolean
  className?: string
}

/** Filtro por estilo de moto. Rola horizontalmente em telas pequenas. */
export function StyleFilter({ value, onChange, options, showCounts = false, className = '' }: StyleFilterProps) {
  const pillId = useId()
  if (options.length === 0) return null

  return (
    <div className={`-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 ${className}`}>
      <div
        role="group"
        aria-label="Filtrar motos por estilo"
        className="inline-flex rounded-full bg-white p-1 ring-1 ring-graphite/10"
      >
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`relative h-11 shrink-0 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                active ? 'text-white' : 'text-graphite/70 hover:text-graphite'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={pillId}
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-graphite"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">
                {option.label}
                {showCounts && (
                  <span className={`ml-1.5 text-xs ${active ? 'text-white/60' : 'text-graphite/40'}`}>{option.count}</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
