import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Motorcycle } from '../../types'
import { SectionHeading } from '../ui/SectionHeading'
import { MotorcycleGrid } from './MotorcycleGrid'

/** "Você também pode gostar": até três outras motos (some quando não há nenhuma). */
export function RelatedMotorcycles({
  motorcycles,
  title = 'Você também pode gostar',
}: {
  motorcycles: Motorcycle[]
  title?: string
}) {
  if (motorcycles.length === 0) return null

  return (
    <section aria-labelledby="relacionadas-titulo" className="border-t border-graphite/[0.07] bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex items-end justify-between gap-4">
          <SectionHeading id="relacionadas-titulo" eyebrow="Outras motos" title={title} />
          <Link
            to="/motos"
            className="group/link hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-ink hover:underline sm:inline-flex"
          >
            Ver todas
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </Link>
        </div>
        <MotorcycleGrid motorcycles={motorcycles} origin="related" />
      </div>
    </section>
  )
}
