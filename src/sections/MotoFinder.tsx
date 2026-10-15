import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarRange,
  Check,
  Compass,
  Info,
  KeyRound,
  MapPin,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useModalityChoice } from '../components/contact/modalityContext'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoBadge } from '../components/ui/DemoNotice'
import { SmartImage } from '../components/ui/SmartImage'
import { finder } from '../config/content'
import { rentalModes } from '../config/modalities'
import { motorcycles } from '../config/motorcycles'
import { trackEvent } from '../lib/analytics'
import { finderResults } from '../lib/finder'
import { formatDisplacement, styleLabels } from '../lib/motorcycles'

type Step = 0 | 1 | 2

/** Ícone discreto por resposta (apenas visual; as respostas e a lógica são as mesmas). */
const goalIcons: Record<string, LucideIcon> = {
  trabalhar: Briefcase,
  'dia-a-dia': MapPin,
  aquisicao: KeyRound,
  explorar: Compass,
}
const modalityIcons: Record<string, LucideIcon> = {
  'locacao-aquisicao': KeyRound,
  'locacao-tradicional': CalendarRange,
}

/** Opção do seletor: ícone, rótulo e descrição curta; marca de seleção ao voltar à etapa. */
function OptionButton({
  icon: Icon,
  label,
  description,
  selected,
  onSelect,
}: {
  icon?: LucideIcon
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
      className={`group/opt relative flex w-full items-center gap-3.5 rounded-card p-3.5 text-left ring-1 transition-[background-color,box-shadow,transform] duration-200 ease-out-soft active:scale-[0.985] motion-reduce:active:scale-100 sm:min-h-[4.75rem] sm:px-4 sm:py-3 ${
        selected
          ? 'bg-accent/[0.12] ring-2 ring-accent'
          : 'bg-white/[0.04] ring-white/10 hover:bg-white/[0.08] hover:ring-white/25'
      }`}
    >
      {Icon && (
        <span
          aria-hidden
          className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-200 ${
            selected ? 'bg-accent text-graphite' : 'bg-white/[0.06] text-white/80 group-hover/opt:text-accent'
          }`}
        >
          {selected ? <Check className="size-4.5" strokeWidth={2.75} /> : <Icon className="size-4.5" strokeWidth={1.8} />}
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[0.95rem] leading-snug font-semibold text-white">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-snug text-muted-dark">{description}</span>}
      </span>
    </button>
  )
}

/**
 * "Encontre sua próxima moto" (Fase 15): o seletor virou o cartão interativo
 * da capa. Mesmas perguntas, respostas e regras da Fase 14: uma pergunta por
 * vez, voltar mantém a resposta, foco levado ao título de cada etapa.
 * Não inventa compatibilidade: ver lib/finder.ts.
 */
export function MotoFinder({ className = '' }: { className?: string }) {
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

  const offset = reduce ? 0 : 24
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * offset }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -offset }),
  }

  const headingClass = 'font-display text-[1.25rem] leading-tight font-semibold tracking-[-0.015em] text-white outline-none sm:text-[1.375rem]'
  const total = finder.steps.length

  return (
    <section
      id="encontre"
      aria-labelledby={`${baseId}-titulo`}
      className={`rounded-panel bg-graphite-800/75 p-5 shadow-[var(--shadow-inset-line),var(--shadow-float)] ring-1 ring-white/10 backdrop-blur-xl sm:p-7 ${className}`}
    >
      <h2 id={`${baseId}-titulo`} className="sr-only">
        {finder.title}
      </h2>

      {/* Cabeçalho do cartão: contador, progresso em segmentos e voltar. */}
      <div className="flex items-center gap-4">
        <p className="shrink-0 font-display text-sm font-semibold text-white tabular-nums" aria-live="polite" id={`${baseId}-progress`}>
          <span className="sr-only">
            Etapa {step + 1} de {total} · {finder.steps[step]}
          </span>
          <span aria-hidden>
            {String(step + 1).padStart(2, '0')}
            <span className="text-white/40"> / {String(total).padStart(2, '0')}</span>
          </span>
        </p>
        <div
          role="progressbar"
          aria-labelledby={`${baseId}-progress`}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step + 1}
          className="grid flex-1 grid-cols-3 gap-1.5"
        >
          {finder.steps.map((label, i) => (
            <span key={label} aria-hidden className="h-1 overflow-hidden rounded-pill bg-white/10">
              <span
                className={`block h-full origin-left rounded-pill bg-accent transition-transform duration-500 ease-out-soft ${
                  i <= step ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </span>
          ))}
        </div>
        {step > 0 ? (
          <button
            type="button"
            aria-label="Voltar"
            onClick={() => go((step - 1) as Step)}
            className="group/back grid size-9 shrink-0 place-items-center rounded-full text-white ring-1 ring-white/15 transition-colors duration-200 hover:bg-white/10 hover:ring-white/30"
          >
            <ArrowLeft aria-hidden className="size-4 transition-transform duration-200 group-hover/back:-translate-x-0.5 motion-reduce:transform-none" />
          </button>
        ) : (
          // Reserva o espaço do botão para o progresso não "pular" entre etapas.
          <span aria-hidden className="size-9 shrink-0" />
        )}
      </div>

      <div className="relative mt-5 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <fieldset>
                <legend className="w-full">
                  <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                    {finder.goalQuestion}
                  </h3>
                </legend>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {finder.goals.map((g) => (
                    <OptionButton
                      key={g.value}
                      icon={goalIcons[g.value]}
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
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {rentalModes.map((mode) => (
                    <OptionButton
                      key={mode.id}
                      icon={modalityIcons[mode.id]}
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
                  className="mt-4 rounded-control px-1 text-sm font-semibold text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-accent"
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
                <ul aria-label="Suas respostas" className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  <li className="rounded-pill bg-white/[0.06] px-3 py-1.5 text-white ring-1 ring-white/10">
                    <span className="text-muted-dark">Objetivo:</span> <strong className="font-semibold">{goalLabel ?? 'não informado'}</strong>
                  </li>
                  <li className="rounded-pill bg-white/[0.06] px-3 py-1.5 text-white ring-1 ring-white/10">
                    <span className="text-muted-dark">Modalidade:</span> <strong className="font-semibold">{modality ?? 'ainda não decidi'}</strong>
                  </li>
                </ul>
                <p className="mt-4 flex gap-2.5 text-[0.8125rem] leading-relaxed text-muted-dark">
                  <Info aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
                  {result.matched ? finder.resultMatch : finder.resultNoMatch}
                </p>

                {result.motorcycles.length > 0 ? (
                  <ul aria-label="Motos do resultado" className="mt-4 grid gap-2">
                    {result.motorcycles.map((moto) => (
                      <li key={moto.slug}>
                        <Link
                          to={`/motos/${moto.slug}`}
                          onClick={() => trackEvent('moto_interest_click', { origin: 'finder', slug: moto.slug })}
                          className="group/res flex items-center gap-3 rounded-card bg-white/[0.04] p-2 pr-3 ring-1 ring-white/10 transition-[background-color,box-shadow] duration-200 hover:bg-white/[0.08] hover:ring-white/25"
                        >
                          <SmartImage
                            image={moto.images[0] ? { ...moto.images[0], alt: '' } : { src: '', alt: '' }}
                            placeholderLabel=""
                            tone="dark"
                            sizes="96px"
                            className="size-14 shrink-0 rounded-[0.75rem] [&_span]:size-8"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm leading-snug font-semibold text-white">{moto.name}</span>
                            <span className="mt-0.5 flex items-center gap-2 truncate text-xs text-muted-dark">
                              {[styleLabels[moto.style], moto.displacement && formatDisplacement(moto.displacement)].filter(Boolean).join(' · ')}
                              {moto.demo && <DemoBadge label="Exemplo" always className="px-2 py-0.5 text-[0.625rem]" />}
                            </span>
                          </span>
                          <ArrowRight aria-hidden className="size-4 shrink-0 text-white/50 transition-[color,transform] duration-200 group-hover/res:translate-x-0.5 group-hover/res:text-accent" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-card bg-white/[0.04] p-4 text-sm text-muted-dark ring-1 ring-white/10">
                    Nenhuma moto está cadastrada no catálogo no momento. Fale com a equipe para saber das opções.
                  </p>
                )}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <ContactButton
                    size="md"
                    className="sm:flex-1"
                    context={{ origin: 'finder', goal: goalLabel, modality }}
                    label="Falar com a equipe sobre minha escolha"
                  />
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
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
    </section>
  )
}
