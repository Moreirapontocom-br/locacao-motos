import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'
import { commercialHint, formatDisplacement, motorcycleDisplayName, styleLabels } from '../../lib/motorcycles'
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
    { label: 'Cilindrada', value: moto.displacement ? formatDisplacement(moto.displacement) : '—' },
    moto.year ? { label: 'Ano', value: String(moto.year) } : (moto.specs[0] ?? { label: 'Ano', value: '—' }),
  ]

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-graphite/[0.06] transition-[box-shadow,transform] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0">
      {/* Área de imagem em destaque, com a moto como protagonista. */}
      <div className="relative overflow-hidden bg-steel/60">
        <SmartImage
          // Moto ainda sem fotos: espaço reservado "Fotos em breve" (como na galeria).
          image={moto.images[0] ?? { src: '', alt: `${name}: fotos em breve` }}
          placeholderLabel={moto.images.length === 0 ? 'Fotos em breve' : undefined}
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 90vw"
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.04] motion-reduce:group-hover:transform-none"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-graphite/25 to-transparent"
        />
        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-graphite shadow-sm backdrop-blur">
            {styleLabels[moto.style]}
          </span>
          {moto.demo && <DemoBadge label="Moto de exemplo" always />}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="truncate text-xs font-semibold tracking-[0.08em] text-accent-ink uppercase">{moto.model}</p>
        <h3 className="mt-2 line-clamp-2 text-h3">
          {/* O link cobre todo o card (área de clique maior), mantendo um único destino acessível. */}
          <Link
            to={href}
            onClick={() => trackEvent('moto_interest_click', { origin, slug: moto.slug })}
            className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
          >
            {moto.name}
          </Link>
        </h3>

        <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-control bg-graphite/[0.07]">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0 bg-ice px-3 py-2.5">
              <dt className="truncate text-[0.6875rem] font-medium text-muted">{fact.label}</dt>
              <dd className="mt-0.5 truncate text-sm font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 truncate text-sm text-muted">{commercialHint(moto)}</p>

        <div className="mt-auto flex items-center gap-2 pt-5">
          {/* Visual de botão; o clique é capturado pelo link que cobre o card. */}
          <span
            aria-hidden
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-control bg-graphite text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-accent group-hover:text-graphite"
          >
            Ver detalhes
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <ContactIconButton
            context={{ origin, moto }}
            label={`Consultar ${name} pelo WhatsApp`}
            className="size-12 rounded-control! border border-graphite/15 text-lg text-graphite hover:border-graphite hover:bg-graphite hover:text-white"
          />
        </div>
      </div>
      {/* Anel de foco visível para navegação por teclado no card inteiro. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card ring-accent ring-offset-2 group-has-[a:focus-visible]:ring-2"
      />
    </article>
  )
}
