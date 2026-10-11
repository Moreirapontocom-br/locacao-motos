import { ArrowRight, CircleCheck } from 'lucide-react'
import type { ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'
import { motorcycleDisplayName, styleLabels } from '../../lib/motorcycles'
import type { Motorcycle } from '../../types'
import { InterestFormDisclosure } from '../contact/InterestForm'
import { ContactButton } from '../ui/ContactButton'
import { DemoBadge } from '../ui/DemoNotice'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3.5 text-sm">
      <dt className="shrink-0 text-muted-dark">{label}</dt>
      <dd className="text-right font-semibold">{children}</dd>
    </div>
  )
}

const pending = <span className="font-medium text-muted-dark italic">Sob consulta</span>

/** Destaques rápidos (cilindrada, ano, transmissão): só os que foram informados. */
function highlights(moto: Motorcycle) {
  return [
    moto.displacement && { label: 'Cilindrada', value: `${moto.displacement} cc` },
    moto.year && { label: 'Ano', value: String(moto.year) },
    moto.transmission && { label: 'Transmissão', value: moto.transmission },
  ].filter((h): h is { label: string; value: string } => Boolean(h))
}

interface PanelProps {
  moto: Motorcycle
  /** Marca o botão principal; usado para exibir a barra fixa no celular quando ele sai da tela. */
  ctaRef?: Ref<HTMLDivElement>
}

/**
 * Bloco comercial ao lado da galeria: identificação da moto, condições
 * confirmadas (ou "sob consulta") e o contato pelo WhatsApp.
 */
export function MotorcycleCommercialPanel({ moto, ctaRef }: PanelProps) {
  const facts = highlights(moto)
  const eyebrow = [moto.brand, moto.model].filter(Boolean).join(' · ')

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={`/motos?estilo=${moto.style}`}
          className="inline-flex h-8 items-center rounded-full bg-white px-3 text-xs font-semibold ring-1 ring-graphite/10 transition-colors hover:ring-graphite/30"
        >
          {styleLabels[moto.style]}
        </Link>
        {moto.demo && <DemoBadge label="Moto de exemplo" always />}
      </div>

      <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">{eyebrow}</p>
      <h1 className="mt-2 text-4xl leading-[1.05] font-semibold sm:text-5xl">{motorcycleDisplayName(moto)}</h1>
      <p className="mt-4 leading-relaxed text-muted">{moto.summary}</p>

      {facts.length > 0 && (
        <dl className="mt-6 flex border-y border-graphite/[0.08]">
          {facts.map((f, i) => (
            <div key={f.label} className={`min-w-0 flex-1 py-3.5 ${i > 0 ? 'border-l border-graphite/[0.08] pl-4' : ''}`}>
              <dt className="text-[0.7rem] font-medium tracking-wide text-muted uppercase">{f.label}</dt>
              <dd className="mt-0.5 truncate font-display text-lg font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section
        aria-labelledby="condicoes-titulo"
        className="relative mt-7 overflow-hidden rounded-card bg-graphite p-6 text-white sm:p-7"
      >
        {/* Faixa laranja discreta: mesma linguagem visual das seções escuras da home. */}
        <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-accent" />
        <h2 id="condicoes-titulo" className="text-lg font-semibold">
          Locação desta moto
        </h2>
        <dl className="mt-2 divide-y divide-white/10">
          <Row label="Modalidades">{moto.modalities.length > 0 ? moto.modalities.join(', ') : pending}</Row>
          {moto.prices.length > 0 ? (
            moto.prices.map((p) => (
              <Row key={p.label} label={p.label}>
                {p.value}
              </Row>
            ))
          ) : (
            <Row label="Valores">{pending}</Row>
          )}
          {moto.availability && (
            <Row label="Disponibilidade">
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck aria-hidden className="size-4 text-accent" />
                {moto.availability}
              </span>
            </Row>
          )}
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-muted-dark">
          Condições e disponibilidade são confirmadas pela equipe no atendimento, antes de qualquer contratação.
        </p>

        <div ref={ctaRef} className="mt-6">
          <ContactButton context={{ origin: 'detail', moto }} size="lg" label="Consultar pelo WhatsApp" className="w-full" />
        </div>
        {/* Qualificação opcional: quem não quiser preencher já tem o botão direto acima. */}
        <InterestFormDisclosure origin="detail" moto={moto} tone="dark" className="mt-3" />
        <Link
          to="/motos"
          className="group/link mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
        >
          Ver outras motos
          <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
        </Link>
      </section>
    </div>
  )
}
