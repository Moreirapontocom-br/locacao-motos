import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'
import { formatDisplacement, motorcycleDisplayName, styleLabels } from '../../lib/motorcycles'
import type { ContactOrigin } from '../../lib/whatsapp'
import type { Motorcycle } from '../../types'
import { ContactIconButton } from '../ui/ContactButton'
import { DemoBadge } from '../ui/DemoNotice'
import { SmartImage } from '../ui/SmartImage'

/**
 * Card da frota (Fase 14): a foto é a protagonista e o texto fica abaixo dela,
 * sem caixa ao redor. Na visualização inicial, só o essencial: papel do modelo,
 * nome, estilo e cilindrada. Preço ou modalidades aparecem apenas se forem
 * dados oficiais cadastrados na moto.
 */
export function MotorcycleCard({ moto, origin }: { moto: Motorcycle; origin: ContactOrigin }) {
  const href = `/motos/${moto.slug}`
  const name = motorcycleDisplayName(moto)
  const facts = [styleLabels[moto.style], moto.displacement ? formatDisplacement(moto.displacement) : undefined, moto.year]
    .filter(Boolean)
    .join(' · ')
  const official = moto.prices[0]
    ? `${moto.prices[0].label}: ${moto.prices[0].value}`
    : moto.modalities.length > 0
      ? moto.modalities.join(' · ')
      : undefined

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-card bg-steel/60 shadow-card transition-shadow duration-500 ease-out-soft group-hover:shadow-card-hover">
        <SmartImage
          // Moto ainda sem fotos: espaço reservado "Fotos em breve" (como na galeria).
          image={moto.images[0] ?? { src: '', alt: `${name}: fotos em breve` }}
          placeholderLabel={moto.images.length === 0 ? 'Fotos em breve' : undefined}
          sizes="(min-width: 1024px) 600px, (min-width: 640px) 50vw, 92vw"
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-[1100ms] ease-out-soft group-hover:scale-[1.05] motion-reduce:group-hover:transform-none"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-graphite/30 to-transparent" />
        {moto.demo && (
          <div className="pointer-events-none absolute top-4 left-4">
            <DemoBadge label="Moto de exemplo" always />
          </div>
        )}
        {/* Seta que acompanha o hover: indica que o card leva aos detalhes. */}
        <span
          aria-hidden
          className="absolute right-4 bottom-4 grid size-12 place-items-center rounded-full bg-white text-graphite shadow-float transition-[background-color,color,transform] duration-300 ease-out-soft group-hover:bg-accent sm:translate-y-1 sm:opacity-90 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      <div className="flex flex-1 items-start justify-between gap-4 pt-5">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold tracking-[0.1em] text-accent-ink uppercase">{moto.model}</p>
          <h3 className="mt-2 text-h3 uppercase">
            {/* O link cobre todo o card (área de clique maior), mantendo um único destino acessível. */}
            <Link
              to={href}
              onClick={() => trackEvent('moto_interest_click', { origin, slug: moto.slug })}
              className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
            >
              {moto.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-muted">{facts}</p>
          {official && <p className="mt-1 text-sm font-semibold text-graphite">{official}</p>}
        </div>
        <ContactIconButton
          context={{ origin, moto }}
          label={`Consultar ${name} pelo WhatsApp`}
          className="mt-1 size-11 shrink-0 border border-graphite/15 text-lg text-graphite hover:border-graphite hover:bg-graphite hover:text-white"
        />
      </div>
      {/* Anel de foco visível para navegação por teclado no card inteiro. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-[calc(var(--radius-card)+0.5rem)] ring-accent group-has-[a:focus-visible]:ring-2"
      />
    </article>
  )
}
