import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'
import { formatDisplacement, motorcycleDisplayName, styleLabels } from '../../lib/motorcycles'
import type { ContactOrigin } from '../../lib/whatsapp'
import type { Motorcycle } from '../../types'
import { ContactIconButton } from '../ui/ContactButton'
import { DemoBadge } from '../ui/DemoNotice'
import { SmartImage } from '../ui/SmartImage'

/**
 * Card da frota (Fase 15): a foto é a protagonista, sobre um fundo claro e
 * neutro. Abaixo, só o nome e uma etiqueta (estilo · cilindrada), com a seta
 * de detalhes. O atalho de WhatsApp fica discreto no canto da foto. Preço ou
 * modalidades aparecem apenas se forem dados oficiais cadastrados na moto.
 */
export function MotorcycleCard({ moto, origin }: { moto: Motorcycle; origin: ContactOrigin }) {
  const href = `/motos/${moto.slug}`
  const name = motorcycleDisplayName(moto)
  const facts = [styleLabels[moto.style], moto.displacement ? formatDisplacement(moto.displacement) : undefined]
    .filter(Boolean)
    .join(' · ')
  const official = moto.prices[0]
    ? `${moto.prices[0].label}: ${moto.prices[0].value}`
    : moto.modalities.length > 0
      ? moto.modalities.join(' · ')
      : undefined

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-graphite/[0.06] transition-[transform,box-shadow] duration-300 ease-out-soft lg:hover:-translate-y-1 lg:hover:shadow-lift motion-reduce:lg:hover:translate-y-0">
      <div className="relative overflow-hidden bg-gradient-to-b from-ice to-steel/50">
        <SmartImage
          // Moto ainda sem fotos: espaço reservado "Fotos em breve" (como na galeria).
          image={moto.images[0] ?? { src: '', alt: `${name}: fotos em breve` }}
          placeholderLabel={moto.images.length === 0 ? 'Fotos em breve' : undefined}
          sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 92vw"
          className="aspect-[4/3] bg-transparent"
          imgClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.04] motion-reduce:group-hover:transform-none"
        />
        {moto.demo && (
          <div className="pointer-events-none absolute top-3.5 left-3.5">
            <DemoBadge label="Moto de exemplo" always />
          </div>
        )}
        <ContactIconButton
          context={{ origin, moto }}
          label={`Consultar ${name} pelo WhatsApp`}
          className="absolute! top-3 right-3 size-10 bg-white/90 text-base text-graphite shadow-card ring-1 ring-graphite/[0.06] backdrop-blur-md hover:bg-graphite hover:text-white"
        />
      </div>

      <div className="flex flex-1 items-end justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <h3 className="text-[1.125rem] leading-tight font-bold tracking-[-0.015em]">
            {/* O link cobre todo o card (área de clique maior), mantendo um único destino acessível. */}
            <Link
              to={href}
              onClick={() => trackEvent('moto_interest_click', { origin, slug: moto.slug })}
              className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
            >
              {moto.name}
            </Link>
          </h3>
          {facts && (
            <p className="mt-2.5 inline-flex rounded-pill bg-ice px-2.5 py-1 text-xs font-medium text-muted ring-1 ring-graphite/[0.05]">{facts}</p>
          )}
          {official && <p className="mt-2 text-sm font-semibold text-graphite">{official}</p>}
        </div>
        {/* Visual de link; o clique é capturado pelo link que cobre o card. */}
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-graphite/12 transition-[background-color,color,transform,box-shadow] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:bg-accent group-hover:ring-accent motion-reduce:group-hover:translate-x-0"
        >
          <ArrowRight className="size-4" />
        </span>
      </div>
      {/* Anel de foco visível para navegação por teclado no card inteiro. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card ring-accent ring-inset group-has-[a:focus-visible]:ring-2"
      />
    </article>
  )
}
