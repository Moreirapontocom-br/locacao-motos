import { Check, Info } from 'lucide-react'
import { useModalityChoice } from '../components/contact/modalityContext'
import { ContactButton } from '../components/ui/ContactButton'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { rentalModesSection } from '../config/content'
import { rentalModes, type RentalMode } from '../config/modalities'

/**
 * Os dois cards seguem a mesma estrutura; a modalidade em destaque ganha o
 * fundo grafite. Não mostra preços nem prazos: só o que está em `rentalModes`.
 */
function ModeCard({ mode }: { mode: RentalMode }) {
  const { modality, setModality } = useModalityChoice()
  const dark = mode.highlighted
  const selected = modality === mode.name
  const headingId = `modalidade-${mode.id}`

  return (
    <article
      aria-labelledby={headingId}
      className={`relative flex h-full flex-col rounded-panel p-7 sm:p-10 ${
        dark ? 'bg-graphite text-white shadow-card-hover' : 'bg-white shadow-card ring-1 ring-graphite/[0.08]'
      }`}
    >
      <div className="flex min-h-7 items-center justify-between gap-3">
        <p className={`eyebrow ${dark ? 'text-accent' : 'text-accent-ink'}`}>
          <span aria-hidden className="h-0.5 w-7 rounded-full bg-current" />
          {mode.name}
        </p>
        {mode.badge && (
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-graphite">{mode.badge}</span>
        )}
      </div>

      <h3 id={headingId} className={`mt-6 text-h3 uppercase sm:text-[1.75rem] ${dark ? 'text-white' : ''}`}>
        {mode.headline}
      </h3>
      <p className={`mt-4 text-base leading-relaxed ${dark ? 'text-muted-dark' : 'text-muted'}`}>{mode.description}</p>

      <ul className={`mt-8 space-y-3.5 border-t pt-8 ${dark ? 'border-white/10' : 'border-graphite/10'}`}>
        {mode.benefits.map((benefit) => (
          <li key={benefit} className={`flex gap-3 text-[0.95rem] leading-snug ${dark ? 'text-white/85' : 'text-graphite/85'}`}>
            <span
              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                dark ? 'bg-accent/15 text-accent' : 'bg-graphite/[0.06] text-accent-ink'
              }`}
            >
              <Check aria-hidden className="size-3" strokeWidth={3} />
            </span>
            {benefit}
          </li>
        ))}
      </ul>

      {mode.confirmed && mode.confirmed.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {mode.confirmed.map((item) => (
            <div key={item.label}>
              <dt className={dark ? 'text-muted-dark' : 'text-muted'}>{item.label}</dt>
              <dd className="mt-0.5 font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-auto pt-9">
        {mode.caution && (
          <p className={`mb-5 flex gap-2.5 text-sm leading-snug ${dark ? 'text-white/70' : 'text-muted'}`}>
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            {mode.caution}
          </p>
        )}
        <ContactButton
          size="lg"
          variant={dark ? 'primary' : 'dark'}
          className="w-full sm:w-auto"
          context={{ origin: 'modality', modality: mode.name }}
          label={mode.cta}
          srSuffix={mode.name}
          onContact={() => setModality(mode.name)}
        />
        {selected && (
          <p className={`mt-3 text-sm ${dark ? 'text-muted-dark' : 'text-muted'}`} role="status">
            Modalidade registrada para o seu contato.
          </p>
        )}
      </div>
    </article>
  )
}

export function RentalModes() {
  return (
    <section id="modalidades" aria-labelledby="modalidades-titulo" className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="modalidades-titulo"
            eyebrow={rentalModesSection.eyebrow}
            title={rentalModesSection.title}
            description={rentalModesSection.description}
            uppercase
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {rentalModes.map((mode, i) => (
            <Reveal key={mode.id} delay={i * 0.08} className="h-full">
              <ModeCard mode={mode} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 flex max-w-3xl gap-3 text-sm leading-relaxed text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
          {rentalModesSection.note}
        </p>
      </div>
    </section>
  )
}
