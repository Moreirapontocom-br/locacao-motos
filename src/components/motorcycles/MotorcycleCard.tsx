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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card ring-1 ring-graphite/[0.06] transition-[transform,box-shadow] duration-300 ease-out-soft lg:hover:-translate-y-1 lg:hover:shadow-lift motion-reduce:lg:hover:translate-y-0">
      <div className="relative overflow-hidden">
        <SmartImage
          // Moto ainda sem fotos: espaço reservado "Fotos em breve" (como na galeria).
          image={moto.images[0] ?? { src: '', alt: `${name}: fotos em breve` }}
          placeholderLabel={moto.images.length === 0 ? 'Fotos em breve' : undefined}
          sizes="(min-width: 1024px) 600px, (min-width: 640px) 50vw, 92vw"
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.03] motion-reduce:group-hover:transform-none"
        />
        {moto.demo && (
          <div className="pointer-events-none absolute top-4 left-4">
            <DemoBadge label="Moto de exemplo" always />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="truncate text-[0.6875rem] font-semibold tracking-[0.12em] text-accent-ink uppercase">{moto.model}</p>
        <h3 className="mt-2.5 text-title font-bold">
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

        <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-4 border-t border-graphite/[0.07] pt-5">
          {/* Visual de link; o clique é capturado pelo link que cobre o card. */}
          <span aria-hidden className="inline-flex items-center gap-2 text-sm font-semibold text-graphite">
            Ver detalhes
            <span className="grid size-7 place-items-center rounded-full bg-graphite/[0.06] transition-[background-color,color,transform] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:bg-accent group-hover:text-graphite">
              <ArrowRight className="size-3.5" />
            </span>
          </span>
          <ContactIconButton
            context={{ origin, moto }}
            label={`Consultar ${name} pelo WhatsApp`}
            className="size-10 shrink-0 border border-graphite/12 text-base text-graphite/80 hover:border-graphite hover:bg-graphite hover:text-white"
          />
        </div>
        </div>
      </div>
      {/* Anel de foco visível para navegação por teclado no card inteiro. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card ring-accent ring-inset group-has-[a:focus-visible]:ring-2"
      />
    </article>
  )
}
