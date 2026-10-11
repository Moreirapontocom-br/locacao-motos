import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'
import { commercialHint, motorcycleDisplayName, styleLabels } from '../../lib/motorcycles'
import type { ContactOrigin } from '../../lib/whatsapp'
import type { Motorcycle } from '../../types'
import { ContactIconButton } from '../ui/ContactButton'
import { DemoBadge } from '../ui/DemoNotice'
import { SmartImage } from '../ui/SmartImage'

export function MotorcycleCard({ moto, origin }: { moto: Motorcycle; origin: ContactOrigin }) {
  const href = `/motos/${moto.slug}`
  const name = motorcycleDisplayName(moto)
  const facts = [
    { label: 'Estilo', value: styleLabels[moto.style] },
    { label: 'Cilindrada', value: moto.displacement ? `${moto.displacement} cc` : '—' },
    moto.year ? { label: 'Ano', value: String(moto.year) } : (moto.specs[0] ?? { label: 'Ano', value: '—' }),
  ]

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-graphite/[0.07] transition-[box-shadow,transform] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[0_32px_64px_-32px_rgb(21_25_29/0.45)] motion-reduce:hover:translate-y-0">
      <div className="relative p-2 pb-0">
        <div className="relative overflow-hidden rounded-[1.35rem]">
          {/* No hover a foto avança levemente para a direita, sugerindo movimento. */}
          <SmartImage
            image={moto.images[0]}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="aspect-[4/3]"
            imgClassName="transition-transform duration-[900ms] ease-out-soft group-hover:translate-x-1.5 group-hover:scale-[1.05] motion-reduce:group-hover:transform-none"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-5 top-5 flex items-start justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-graphite backdrop-blur">
            {styleLabels[moto.style]}
          </span>
          {moto.demo && <DemoBadge label="Moto de exemplo" always />}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-6 pb-6">
        <p className="truncate text-xs font-semibold tracking-[0.14em] text-accent-ink uppercase">{moto.model}</p>
        <h3 className="mt-1.5 truncate text-2xl font-semibold tracking-tight">
          {/* O link cobre todo o card (área de clique maior), mantendo um único destino acessível. */}
          <Link
            to={href}
            onClick={() => trackEvent('moto_interest_click', { origin, slug: moto.slug })}
            className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
          >
            {moto.name}
          </Link>
        </h3>

        <dl className="mt-5 grid grid-cols-3 border-y border-graphite/[0.08]">
          {facts.map((fact, i) => (
            <div key={fact.label} className={`min-w-0 py-3 ${i > 0 ? 'border-l border-graphite/[0.08] pl-3' : ''}`}>
              <dt className="truncate text-[0.7rem] font-medium tracking-wide text-muted uppercase">{fact.label}</dt>
              <dd className="mt-0.5 truncate text-sm font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 truncate text-sm text-muted">{commercialHint(moto)}</p>

        <div className="mt-auto flex items-center gap-2 pt-5">
          {/* Visual de botão; o clique é capturado pelo link que cobre o card. */}
          <span
            aria-hidden
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-graphite text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-accent group-hover:text-graphite"
          >
            Ver detalhes
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <ContactIconButton
            context={{ origin, moto }}
            label={`Consultar ${name} pelo WhatsApp`}
            className="size-12 border border-graphite/15 text-lg text-graphite hover:border-graphite hover:bg-ice"
          />
        </div>
      </div>
      {/* Anel de foco visível para navegação por teclado no card inteiro. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card ring-accent group-has-[a:focus-visible]:ring-2"
      />
    </article>
  )
}
