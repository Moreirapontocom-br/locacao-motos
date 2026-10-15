import { Info } from 'lucide-react'
import { useModalityChoice } from '../components/contact/modalityContext'
import { ContactButton } from '../components/ui/ContactButton'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { rentalModesSection } from '../config/content'
import { comparisonLabels, rentalModes, type RentalMode } from '../config/modalities'

/**
 * Comparação das modalidades (Fase 14), sobre fundo grafite. As duas colunas
 * têm as mesmas linhas (`comparisonLabels`), para a leitura lado a lado.
 * A modalidade em destaque ganha o filete laranja. Sem preços nem prazos.
 */
function ModeColumn({ mode }: { mode: RentalMode }) {
  const { modality, setModality } = useModalityChoice()
  const selected = modality === mode.name
  const headingId = `modalidade-${mode.id}`
  const accent = mode.highlighted

  return (
    <article
      aria-labelledby={headingId}
      className={`relative flex h-full flex-col rounded-panel p-7 transition-colors duration-300 sm:p-10 ${
        accent ? 'bg-graphite-800 ring-1 ring-accent/40' : 'bg-graphite-800/60 ring-1 ring-white/[0.08]'
      }`}
    >
      {accent && <span aria-hidden className="absolute inset-x-10 top-0 h-0.5 rounded-full bg-accent" />}
      <div className="flex min-h-7 items-center justify-between gap-3">
        <p className="eyebrow text-accent">{mode.name}</p>
        {mode.badge && <span className="text-xs font-semibold tracking-[0.08em] text-white/60 uppercase">{mode.badge}</span>}
      </div>

      <h3 id={headingId} className="mt-6 text-h3 text-white uppercase sm:text-[1.875rem]">
        {mode.headline}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-muted-dark">{mode.description}</p>

      <dl className="mt-9 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {comparisonLabels.map((label, i) => (
          <div key={label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="text-sm text-muted-dark">{label}</dt>
            <dd className="text-[0.95rem] font-semibold text-white">{mode.comparison[i] ?? 'A confirmar'}</dd>
          </div>
        ))}
        {mode.confirmed?.map((item) => (
          <div key={item.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="text-sm text-muted-dark">{item.label}</dt>
            <dd className="text-[0.95rem] font-semibold text-white">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-9">
        {mode.caution && (
          <p className="mb-6 flex gap-2.5 text-sm leading-snug text-white/70">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            {mode.caution}
          </p>
        )}
        <ContactButton
          size="lg"
          variant={accent ? 'primary' : 'outline-light'}
          className="w-full sm:w-auto"
          context={{ origin: 'modality', modality: mode.name }}
          label={mode.cta}
          srSuffix={mode.name}
          onContact={() => setModality(mode.name)}
        />
        {selected && (
          <p className="mt-3 text-sm text-muted-dark" role="status">
            Modalidade registrada para o seu contato.
          </p>
        )}
      </div>
    </article>
  )
}

export function RentalModes() {
  return (
    <section id="modalidades" aria-labelledby="modalidades-titulo" className="section-y bg-graphite">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="modalidades-titulo"
            tone="dark"
            eyebrow={rentalModesSection.eyebrow}
            title={rentalModesSection.title}
            description={rentalModesSection.description}
            uppercase
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {rentalModes.map((mode, i) => (
            <Reveal key={mode.id} delay={i * 0.08} className="h-full">
              <ModeColumn mode={mode} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 flex max-w-3xl gap-3 text-sm leading-relaxed text-muted-dark">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
          {rentalModesSection.note}
        </p>
      </div>
    </section>
  )
}
