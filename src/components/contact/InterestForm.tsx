import { ChevronDown, MessageCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type FormEvent } from 'react'
import { commercialConfig, type PurposeValue } from '../../config/commercial'
import { motorcycles } from '../../config/motorcycles'
import { trackEvent } from '../../lib/analytics'
import { motorcycleDisplayName } from '../../lib/motorcycles'
import {
  buildContactMessage,
  channelOf,
  contactActionFor,
  contactLabel,
  contactSubject,
  modalityOptions,
  openContactAction,
  type ContactContext,
  type ContactOrigin,
} from '../../lib/whatsapp'
import type { Motorcycle } from '../../types'
import { useContactDialog } from './contactContext'

type Tone = 'light' | 'dark'

const styles = {
  dark: {
    label: 'text-white',
    hint: 'text-muted-dark',
    field: 'bg-white/[0.06] text-white ring-white/15 hover:ring-white/30 [&_option]:text-graphite',
    chip: 'text-white/80 ring-white/15 hover:ring-white/35 has-[:checked]:bg-white has-[:checked]:text-graphite has-[:checked]:ring-white',
  },
  light: {
    label: 'text-graphite',
    hint: 'text-muted',
    field: 'bg-white text-graphite ring-graphite/15 hover:ring-graphite/35',
    chip: 'text-graphite/80 ring-graphite/15 hover:ring-graphite/35 has-[:checked]:bg-graphite has-[:checked]:text-white has-[:checked]:ring-graphite',
  },
} satisfies Record<Tone, Record<string, string>>

interface InterestFormProps {
  origin: ContactOrigin
  /** Moto já escolhida (página de detalhes): o campo vem preenchido. */
  moto?: Motorcycle
  tone?: Tone
}

/**
 * Formulário opcional de interesse: três escolhas rápidas que viram uma
 * mensagem organizada no WhatsApp. Sem cadastro e sem dados pessoais —
 * nada é enviado ou salvo pelo site; só a ação voluntária de abrir o WhatsApp.
 */
export function InterestForm({ origin, moto, tone = 'dark' }: InterestFormProps) {
  const id = useId()
  const s = styles[tone]
  const openDialog = useContactDialog()
  const [motoSlug, setMotoSlug] = useState(moto?.slug ?? '')
  const [modality, setModality] = useState('')
  const [purpose, setPurpose] = useState<PurposeValue | ''>('')

  // Indisponíveis ficam fora da lista, exceto a moto da página atual.
  const choices = motorcycles.filter((m) => !m.unavailable || m.slug === moto?.slug)
  const selected = choices.find((m) => m.slug === motoSlug)
  const modalities = modalityOptions(selected)
  const context: ContactContext = {
    origin: 'form',
    moto: selected,
    modality: modalities.includes(modality) ? modality : undefined,
    purpose: purpose || undefined,
  }
  const action = contactActionFor(context)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Origem "form/<local>": diferencia o envio pelo formulário do botão direto da mesma página.
    trackEvent('contact_click', { origin: `form/${origin}`, slug: selected?.slug, channel: channelOf(action) })
    if (!openContactAction(action)) {
      openDialog({ message: buildContactMessage(context), subject: contactSubject(context) })
    }
  }

  const fieldClass = `h-12 w-full appearance-none rounded-xl pr-10 pl-4 text-sm font-medium ring-1 transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-accent ${s.field}`

  return (
    <form onSubmit={onSubmit} aria-describedby={`${id}-nota`} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor={`${id}-moto`} className={`text-sm font-semibold ${s.label}`}>
          Moto desejada
        </label>
        <div className="relative">
          <select id={`${id}-moto`} value={motoSlug} onChange={(e) => setMotoSlug(e.target.value)} className={fieldClass}>
            <option value="">Ainda não escolhi</option>
            {choices.map((m) => (
              <option key={m.slug} value={m.slug}>
                {motorcycleDisplayName(m)}
                {m.demo ? ' (exemplo)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className={`pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 ${s.hint}`} />
        </div>
      </div>

      <div className="grid gap-2">
        {modalities.length > 0 ? (
          <>
            <label htmlFor={`${id}-modalidade`} className={`text-sm font-semibold ${s.label}`}>
              Modalidade de interesse
            </label>
            <div className="relative">
              <select
                id={`${id}-modalidade`}
                value={context.modality ?? ''}
                onChange={(e) => setModality(e.target.value)}
                className={fieldClass}
              >
                <option value="">Quero conhecer as opções</option>
                {modalities.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden className={`pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 ${s.hint}`} />
            </div>
          </>
        ) : (
          <>
            <p className={`text-sm font-semibold ${s.label}`}>Modalidade de interesse</p>
            <p className={`text-sm leading-relaxed ${s.hint}`}>
              As modalidades disponíveis são apresentadas pela equipe no atendimento.
            </p>
          </>
        )}
      </div>

      <fieldset className="grid gap-2">
        <legend className={`mb-2 text-sm font-semibold ${s.label}`}>Objetivo de utilização</legend>
        <div className="flex flex-wrap gap-2">
          {commercialConfig.purposes.map((p) => (
            <label
              key={p.value}
              className={`inline-flex h-11 cursor-pointer items-center rounded-full px-4 text-sm font-medium ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${s.chip}`}
            >
              <input
                type="radio"
                name={`${id}-objetivo`}
                value={p.value}
                checked={purpose === p.value}
                onChange={() => setPurpose(p.value as PurposeValue)}
                className="sr-only"
              />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        aria-haspopup={action.kind === 'section' ? 'dialog' : undefined}
        className="group/btn inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent px-7 text-base font-semibold text-graphite transition-[background-color,transform] duration-200 hover:bg-accent-soft active:scale-[0.98]"
      >
        <MessageCircle aria-hidden className="size-5" />
        {contactLabel(action.kind, 'Continuar pelo WhatsApp')}
      </button>

      <p id={`${id}-nota`} className={`text-xs leading-relaxed ${s.hint}`}>
        Todos os campos são opcionais. Suas escolhas entram apenas na mensagem do WhatsApp — o site não envia nem
        guarda nenhum dado.
      </p>
    </form>
  )
}

/**
 * Formulário recolhido por padrão, abaixo do botão de contato direto:
 * quem não quiser preencher nada continua com um clique.
 */
export function InterestFormDisclosure({ origin, moto, tone = 'dark', className = '' }: InterestFormProps & { className?: string }) {
  const [open, setOpen] = useState(false)
  const [tracked, setTracked] = useState(false)
  const panelId = useId()
  const s = styles[tone]

  const toggle = () => {
    if (!open && !tracked) {
      trackEvent('interest_form_open', { origin, slug: moto?.slug })
      setTracked(true)
    }
    setOpen((v) => !v)
  }

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={`group/toggle flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
          tone === 'dark' ? 'text-white/80 hover:text-white' : 'text-graphite/80 hover:text-graphite'
        }`}
      >
        Detalhar minha consulta
        <span className={`font-normal ${s.hint}`}>(opcional)</span>
        <ChevronDown aria-hidden className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className={`mt-3 border-t pt-5 ${tone === 'dark' ? 'border-white/10' : 'border-graphite/10'}`}>
              <InterestForm origin={origin} moto={moto} tone={tone} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
