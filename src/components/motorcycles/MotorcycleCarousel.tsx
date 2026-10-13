import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ContactOrigin } from '../../lib/whatsapp'
import type { Motorcycle } from '../../types'
import { MotorcycleCard } from './MotorcycleCard'

/** Posição de rolagem atual: quantas paradas existem e em qual delas o carrossel está. */
interface TrackState {
  stops: number
  current: number
}

/**
 * Carrossel horizontal de motos.
 * A rolagem é nativa (arrastar no celular, trackpad no computador) com encaixe em cada card;
 * as setas e os indicadores levam ao card seguinte/anterior. Um pedaço do próximo card fica
 * à mostra para indicar que há mais motos ao lado.
 */
export function MotorcycleCarousel({
  motorcycles,
  origin,
  label,
  emptyMessage,
}: {
  motorcycles: Motorcycle[]
  /** Onde o carrossel aparece: define a mensagem de contato e a origem dos eventos. */
  origin: ContactOrigin
  /** Nome acessível do carrossel (ex.: "Motos em destaque"). */
  label: string
  emptyMessage?: string
}) {
  const trackId = useId()
  const trackRef = useRef<HTMLUListElement>(null)
  const reduce = useReducedMotion()
  // Antes da primeira medição (e em ambientes sem layout), uma parada por moto.
  const [state, setState] = useState<TrackState>({ stops: motorcycles.length, current: 0 })

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    const items = Array.from(track.children) as HTMLElement[]
    if (items.length === 0) return
    const start = items[0].offsetLeft
    const maxScroll = track.scrollWidth - track.clientWidth
    // Última parada: o primeiro card que, alinhado à esquerda, já leva a rolagem ao fim.
    const lastStop = items.findIndex((item) => item.offsetLeft - start >= maxScroll - 2)
    const stops = maxScroll <= 2 ? 1 : (lastStop === -1 ? items.length - 1 : lastStop) + 1
    let current = 0
    if (track.scrollLeft >= maxScroll - 2) current = stops - 1
    else {
      let best = Infinity
      items.slice(0, stops).forEach((item, i) => {
        const distance = Math.abs(item.offsetLeft - start - track.scrollLeft)
        if (distance < best) {
          best = distance
          current = i
        }
      })
    }
    setState((prev) => (prev.stops === stops && prev.current === current ? prev : { stops, current }))
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    // Lista nova (ex.: filtro trocado): volta ao início.
    track.scrollTo?.({ left: 0 })
    measure()
    track.addEventListener('scroll', measure, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
    observer?.observe(track)
    return () => {
      track.removeEventListener('scroll', measure)
      observer?.disconnect()
    }
  }, [measure, motorcycles])

  const goTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const items = Array.from(track.children) as HTMLElement[]
    const target = items[Math.max(0, Math.min(index, items.length - 1))]
    if (!target) return
    track.scrollTo?.({ left: target.offsetLeft - items[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
    setState((prev) => ({ ...prev, current: Math.max(0, Math.min(index, prev.stops - 1)) }))
  }

  if (motorcycles.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-graphite/20 px-6 py-16 text-center text-muted">
        {emptyMessage ?? 'Nenhuma moto encontrada neste estilo no momento.'}
      </p>
    )
  }

  const { stops, current } = state
  const atStart = current === 0
  const atEnd = current >= stops - 1

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={label}>
      {/* Faixa que vaza até a borda da tela; o recuo mantém o primeiro card alinhado ao conteúdo. */}
      <ul
        id={trackId}
        ref={trackRef}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pt-2 pb-10 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:gap-6 sm:px-8 lg:-mx-10 lg:scroll-px-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {motorcycles.map((moto, i) => (
          <motion.li
            key={moto.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="w-[84%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <MotorcycleCard moto={moto} origin={origin} />
          </motion.li>
        ))}
      </ul>

      {stops > 1 && (
        <div className="-mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center">
            {Array.from({ length: stops }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para a moto ${i + 1}`}
                aria-controls={trackId}
                aria-current={i === current ? 'true' : undefined}
                onClick={() => goTo(i)}
                className="group/dot grid h-11 place-items-center px-1.5"
              >
                <span
                  aria-hidden
                  className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out-soft ${
                    i === current ? 'w-8 bg-accent' : 'w-1.5 bg-graphite/20 group-hover/dot:bg-graphite/40'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <CarouselArrow direction="prev" disabled={atStart} controls={trackId} onClick={() => goTo(current - 1)} />
            <CarouselArrow direction="next" disabled={atEnd} controls={trackId} onClick={() => goTo(current + 1)} />
          </div>
        </div>
      )}
    </div>
  )
}

function CarouselArrow({
  direction,
  disabled,
  controls,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  controls: string
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Motos anteriores' : 'Próximas motos'}
      aria-controls={controls}
      disabled={disabled}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-full border border-graphite/15 text-graphite transition-colors duration-300 hover:border-graphite hover:bg-graphite hover:text-white disabled:pointer-events-none disabled:opacity-35"
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )
}
