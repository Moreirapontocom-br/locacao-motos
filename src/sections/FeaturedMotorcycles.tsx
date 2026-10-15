import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { MotorcycleCard } from '../components/motorcycles/MotorcycleCard'
import { StyleFilter } from '../components/motorcycles/StyleFilter'
import { Button } from '../components/ui/Button'
import { DemoNotice } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { featured } from '../config/content'
import { motorcycles } from '../config/motorcycles'
import { filterMotorcycles, styleFilterOptions } from '../lib/motorcycles'
import type { StyleFilterValue } from '../types'

/**
 * Frota em destaque (Fase 14): cards grandes em duas colunas, com filtro por
 * estilo derivado dos próprios dados (some quando há menos de dois estilos).
 * Fonte única: src/config/motorcycles.ts.
 */
export function FeaturedMotorcycles() {
  const highlighted = motorcycles.filter((m) => m.featured && !m.unavailable)
  const options = styleFilterOptions(highlighted)
  const [filter, setFilter] = useState<StyleFilterValue>('todas')
  const list = filterMotorcycles(highlighted, filter)

  return (
    <section id="motos" aria-labelledby="destaques-titulo" className="section-y">
      <div className="container-page">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="destaques-titulo"
            eyebrow={featured.eyebrow}
            title={featured.title}
            description={featured.description}
            uppercase
          />
          <StyleFilter value={filter} onChange={setFilter} options={options} className="lg:shrink-0" />
        </Reveal>

        {highlighted.some((m) => m.demo || m.images.some((img) => img.illustrative)) && (
          <DemoNotice className="mt-8 max-w-3xl">
            Fotos ilustrativas, que não são das motos da empresa. Os modelos marcados como exemplo são provisórios.
          </DemoNotice>
        )}

        <ul aria-label="Motos em destaque" className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-14 lg:gap-x-10 lg:gap-y-16">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((moto) => (
              <motion.li
                key={moto.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <MotorcycleCard moto={moto} origin="home-featured" />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {list.length === 0 && <p className="mt-6 text-muted">Nenhuma moto neste estilo no momento.</p>}

        <div className="mt-16 flex justify-center">
          <Button to="/motos" variant="outline" size="lg">
            Ver todas as motos
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
