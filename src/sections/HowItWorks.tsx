import { ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { howItWorks } from '../config/content'
import { rentalModes } from '../config/modalities'

/**
 * Passo a passo por modalidade, em abas acessíveis (setas, Home e End).
 * Fase 15: visual simplificado (ícone numerado + título + uma linha), sem números gigantes.
 * As etapas são uma explicação comercial geral, não o procedimento contratual.
 */
export function HowItWorks() {
  const baseId = useId()
  const [activeId, setActiveId] = useState(rentalModes[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = rentalModes.findIndex((m) => m.id === activeId)
  const mode = rentalModes[activeIndex]

  const select = (index: number) => {
    const next = (index + rentalModes.length) % rentalModes.length
    setActiveId(rentalModes[next].id)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: rentalModes.length - 1,
    }
    if (e.key in keys) {
      e.preventDefault()
      select(keys[e.key])
    }
  }

  return (
    <section id="como-funciona" aria-labelledby="como-funciona-titulo" className="section-y">
      <div className="container-page">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="como-funciona-titulo" eyebrow={howItWorks.eyebrow} title={howItWorks.title} description={howItWorks.description} />

          <div
            role="tablist"
            aria-label="Modalidade de locação"
            onKeyDown={onKeyDown}
            className="grid w-full grid-cols-2 gap-1 rounded-pill bg-white p-1 ring-1 ring-graphite/[0.08] lg:w-auto lg:min-w-[26rem]"
          >
            {rentalModes.map((m, i) => {
              const selected = m.id === activeId
              return (
                <button
                  key={m.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  id={`${baseId}-tab-${m.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(m.id)}
                  className={`min-h-11 rounded-pill px-3 py-2 text-sm leading-tight font-semibold transition-colors sm:px-5 ${
                    selected ? 'bg-graphite text-white shadow-card' : 'text-graphite/75 hover:bg-ice hover:text-graphite'
                  }`}
                >
                  {m.name}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${mode.id}`} tabIndex={0} className="mt-head rounded-card outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={mode.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-label={`Etapas da ${mode.name.toLowerCase()}`}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10"
            >
              {mode.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4 lg:flex-col lg:gap-5">
                  <span aria-hidden className="relative grid size-14 shrink-0 place-items-center rounded-full bg-accent/10 text-accent-ink">
                    <step.icon className="size-6" strokeWidth={1.8} />
                    <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-graphite font-display text-[0.6875rem] font-bold text-white ring-2 ring-ice">
                      {i + 1}
                    </span>
                  </span>
                  <div>
                    <h3 className="text-lg leading-snug font-bold">
                      <span className="sr-only">Etapa {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-xs text-[0.9375rem] leading-relaxed text-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>

        <Reveal className="mt-12 flex max-w-3xl items-start gap-2.5 border-t border-graphite/[0.08] pt-6 text-sm text-muted lg:mt-14">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
          <p>{howItWorks.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
