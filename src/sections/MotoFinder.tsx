import { ArrowLeft, ArrowRight, Check, Info, RotateCcw } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useModalityChoice } from '../components/contact/modalityContext'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoBadge } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SmartImage } from '../components/ui/SmartImage'
import { finder } from '../config/content'
import { rentalModes } from '../config/modalities'
import { motorcycles } from '../config/motorcycles'
import { trackEvent } from '../lib/analytics'
import { finderResults } from '../lib/finder'
import { formatDisplacement, styleLabels } from '../lib/motorcycles'

type Step = 0 | 1 | 2

/** Botão de opção: grande, com descrição curta e marca de seleção ao voltar à etapa. */
function OptionButton({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`group/opt relative flex min-h-24 w-full items-start justify-between gap-4 rounded-card border bg-white p-5 text-left transition-[border-color,box-shadow,transform] duration-200 ease-out-soft active:scale-[0.99] motion-reduce:active:scale-100 sm:p-6 ${
        selected
          ? 'border-accent shadow-[0_0_0_3px_rgb(249_115_22/0.14),var(--shadow-card)]'
          : 'border-graphite/10 hover:-translate-y-px hover:border-graphite/30 hover:shadow-card motion-reduce:hover:translate-y-0'
      }`}
    >
      <span>
        <span className="block font-display text-[1.0625rem] leading-snug font-semibold tracking-[-0.01em] sm:text-lg">{label}</span>
        {description && <span className="mt-2 block text-sm leading-relaxed text-muted">{description}</span>}
      </span>
      <span
        aria-hidden
        className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full transition-[background-color,border-color,color,transform] duration-200 ${
          selected
            ? 'scale-100 bg-accent text-graphite'
            : 'border border-graphite/15 text-graphite/35 group-hover/opt:translate-x-0.5 group-hover/opt:border-graphite/40 group-hover/opt:text-graphite motion-reduce:group-hover/opt:translate-x-0'
        }`}
      >
        {selected ? <Check className="size-3.5" strokeWidth={3} /> : <ArrowRight className="size-3" />}
      </span>
    </button>
  )
}

/**
 * "Encontre sua próxima moto" (Fase 14): duas perguntas, uma por vez, e um
 * resultado. Progresso visível, botão de voltar, foco levado ao título de cada
 * etapa (teclado e leitores de tela). Não inventa compatibilidade: ver lib/finder.ts.
 */
export function MotoFinder() {
  const baseId = useId()
  const reduce = useReducedMotion()
  const { setModality } = useModalityChoice()
  const [step, setStep] = useState<Step>(0)
  const [direction, setDirection] = useState(1)
  const [goal, setGoal] = useState<string>()
  const [modality, setLocalModality] = useState<string>()
  const [undecided, setUndecided] = useState(false)
  const interacted = useRef(false)

  // Leva o foco ao título da nova etapa quando ela entra (após a transição),
  // nunca na primeira renderização da página.
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && interacted.current) el.focus({ preventScroll: true })
  }, [])

  const go = (next: Step) => {
    interacted.current = true
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const goalLabel = finder.goals.find((g) => g.value === goal)?.label
  const result = finderResults(motorcycles, modality)

  const chooseModality = (name: string | undefined) => {
    setLocalModality(name)
    setUndecided(!name)
    // A escolha também segue para o contato final da home e o formulário.
    if (name) setModality(name)
    go(2)
  }

  const restart = () => {
    setGoal(undefined)
    setLocalModality(undefined)
    setUndecided(false)
    go(0)
  }

  const offset = reduce ? 0 : 28
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * offset }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -offset }),
  }

  const headingClass = 'text-h3 outline-none'

  return (
    <section id="encontre" aria-labelledby="encontre-titulo" className="section-y bg-white">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-5 text-accent-ink">
            <span aria-hidden className="h-0.5 w-7 rounded-full bg-current" />
            {finder.eyebrow}
          </p>
          <h2 id="encontre-titulo" className="text-h2">
            {finder.title}
          </h2>
          <p className="mt-5 max-w-sm text-lead text-muted">{finder.description}</p>

          {/* Progresso: etapas nomeadas + barra. */}
          <ol aria-label="Progresso" className="mt-10 hidden space-y-1 lg:block">
            {finder.steps.map((label, i) => {
              const state = i < step ? 'done' : i === step ? 'current' : 'todo'
              return (
                <li key={label} aria-current={state === 'current' ? 'step' : undefined} className="flex items-center gap-4 py-2">
                  <span
                    aria-hidden
                    className={`grid size-8 place-items-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                      state === 'current'
                        ? 'bg-accent text-graphite'
                        : state === 'done'
                          ? 'bg-graphite text-white'
                          : 'border border-graphite/15 text-muted'
                    }`}
                  >
                    {state === 'done' ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={`text-sm font-semibold ${state === 'todo' ? 'text-muted' : 'text-graphite'}`}>
                    {label}
                    <span className="sr-only">{state === 'done' ? ' (concluída)' : state === 'current' ? ' (etapa atual)' : ''}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </Reveal>

        <Reveal delay={0.08} className="min-w-0 lg:col-span-8">
          <div className="rounded-panel bg-ice p-5 ring-1 ring-graphite/[0.06] sm:p-10 lg:p-12">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-muted" aria-live="polite" id={`${baseId}-progress`}>
                Etapa {step + 1} de {finder.steps.length}
                <span className="text-graphite"> · {finder.steps[step]}</span>
              </p>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => go((step - 1) as Step)}
                  className="group/back inline-flex min-h-10 items-center gap-1.5 rounded-control border border-graphite/12 bg-white px-3.5 text-sm font-semibold text-graphite transition-[border-color,background-color] duration-200 hover:border-graphite/35"
                >
                  <ArrowLeft aria-hidden className="size-4 transition-transform duration-200 group-hover/back:-translate-x-0.5 motion-reduce:transform-none" />
                  Voltar
                </button>
              )}
            </div>
            <div
              role="progressbar"
              aria-labelledby={`${baseId}-progress`}
              aria-valuemin={1}
              aria-valuemax={finder.steps.length}
              aria-valuenow={step + 1}
              className="mt-4 grid grid-cols-3 gap-1.5"
            >
              {/* Um segmento por etapa; o preenchimento anima com transform (barato). */}
              {finder.steps.map((label, i) => (
                <span key={label} aria-hidden className="h-1 overflow-hidden rounded-pill bg-graphite/10">
                  <span
                    className={`block h-full origin-left rounded-pill bg-accent transition-transform duration-500 ease-out-soft ${
                      i <= step ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </span>
              ))}
            </div>

            <div className="relative mt-9 overflow-hidden sm:mt-11">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && (
                    <fieldset>
                      <legend className="w-full">
                        <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                          {finder.goalQuestion}
                        </h3>
                      </legend>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
                        {finder.goals.map((g) => (
                          <OptionButton
                            key={g.value}
                            label={g.label}
                            description={g.description}
                            selected={goal === g.value}
                            onSelect={() => {
                              setGoal(g.value)
                              go(1)
                            }}
                          />
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {step === 1 && (
                    <fieldset>
                      <legend className="w-full">
                        <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                          {finder.modalityQuestion}
                        </h3>
                      </legend>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
                        {rentalModes.map((mode) => (
                          <OptionButton
                            key={mode.id}
                            label={mode.name}
                            description={mode.description}
                            selected={modality === mode.name}
                            onSelect={() => chooseModality(mode.name)}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => chooseModality(undefined)}
                        aria-pressed={undecided}
                        className="mt-5 rounded-control px-1 text-sm font-semibold text-graphite underline decoration-graphite/30 underline-offset-4 transition-colors hover:decoration-accent"
                      >
                        Ainda não decidi
                      </button>
                    </fieldset>
                  )}

                  {step === 2 && (
                    <div>
                      <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                        {finder.resultTitle}
                      </h3>
                      {/* Respostas escolhidas, em selos discretos. */}
                      <ul aria-label="Suas respostas" className="mt-4 flex flex-wrap gap-2 text-sm">
                        <li className="rounded-pill bg-white px-3.5 py-1.5 ring-1 ring-graphite/[0.08]">
                          <span className="text-muted">Objetivo:</span> <strong className="font-semibold">{goalLabel ?? 'não informado'}</strong>
                        </li>
                        <li className="rounded-pill bg-white px-3.5 py-1.5 ring-1 ring-graphite/[0.08]">
                          <span className="text-muted">Modalidade:</span> <strong className="font-semibold">{modality ?? 'ainda não decidi'}</strong>
                        </li>
                      </ul>
                      <p className="mt-6 flex gap-3 rounded-control border-l-2 border-accent bg-white px-4 py-3.5 text-sm leading-relaxed text-muted">
                        <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
                        {result.matched ? finder.resultMatch : finder.resultNoMatch}
                      </p>

                      {result.motorcycles.length > 0 ? (
                        <ul aria-label="Motos do resultado" className="mt-6 grid gap-4 sm:grid-cols-2">
                          {result.motorcycles.map((moto) => (
                            <li key={moto.slug}>
                              <Link
                                to={`/motos/${moto.slug}`}
                                onClick={() => trackEvent('moto_interest_click', { origin: 'finder', slug: moto.slug })}
                                className="group/res flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-graphite/[0.07] transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0"
                              >
                                <span className="relative block">
                                  <SmartImage
                                    image={moto.images[0] ? { ...moto.images[0], alt: '' } : { src: '', alt: '' }}
                                    placeholderLabel={moto.images[0] ? undefined : 'Fotos em breve'}
                                    sizes="(min-width: 640px) 320px, 90vw"
                                    className="aspect-[16/10]"
                                    imgClassName="transition-transform duration-700 group-hover/res:scale-[1.03] motion-reduce:transform-none"
                                  />
                                  {moto.demo && <DemoBadge label="Exemplo" always className="absolute top-3 left-3" />}
                                </span>
                                <span className="flex flex-1 items-end justify-between gap-3 p-4 sm:p-5">
                                  <span className="min-w-0">
                                    <span className="block font-display leading-snug font-semibold">{moto.name}</span>
                                    <span className="mt-1 block truncate text-xs text-muted">
                                      {[styleLabels[moto.style], moto.displacement && formatDisplacement(moto.displacement)].filter(Boolean).join(' · ')}
                                    </span>
                                  </span>
                                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-graphite">
                                    Detalhes
                                    <ArrowRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover/res:translate-x-0.5" />
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-6 rounded-card bg-white p-5 text-sm text-muted ring-1 ring-graphite/[0.07]">
                          Nenhuma moto está cadastrada no catálogo no momento. Fale com a equipe para saber das opções.
                        </p>
                      )}

                      <div className="mt-8 flex flex-col gap-3 border-t border-graphite/10 pt-8 sm:flex-row sm:items-center">
                        <ContactButton
                          size="lg"
                          context={{ origin: 'finder', goal: goalLabel, modality }}
                          label="Falar com a equipe sobre minha escolha"
                        />
                        <button
                          type="button"
                          onClick={restart}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold text-graphite transition-colors hover:bg-graphite/[0.06]"
                        >
                          <RotateCcw aria-hidden className="size-4" />
                          Recomeçar
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
