import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { MotorcycleGrid } from '../components/motorcycles/MotorcycleGrid'
import { StyleFilter } from '../components/motorcycles/StyleFilter'
import { Button } from '../components/ui/Button'
import { DemoNotice } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { featured } from '../config/content'
import { motorcycles } from '../config/motorcycles'
import { filterMotorcycles, styleFilterOptions } from '../lib/motorcycles'
import type { StyleFilterValue } from '../types'

const MAX_FEATURED = 6

export function FeaturedMotorcycles() {
  const [filter, setFilter] = useState<StyleFilterValue>('todas')
  const highlighted = motorcycles.filter((m) => m.featured)
  const list = filterMotorcycles(highlighted, filter).slice(0, MAX_FEATURED)
  const catalogLink = filter === 'todas' ? '/motos' : `/motos?estilo=${filter}`

  return (
    <section id="motos" aria-labelledby="destaques-titulo" className="section-y">
      <div className="container-page">
        {/* Filtro abaixo do título: com vários estilos, não cabe ao lado sem cortar. */}
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            id="destaques-titulo"
            eyebrow={featured.eyebrow}
            title={featured.title}
            description={featured.description}
          />
          <StyleFilter value={filter} onChange={setFilter} options={styleFilterOptions(highlighted)} />
        </Reveal>

        {highlighted.some((m) => m.demo) && (
          <DemoNotice className="mt-8">
            Motos de exemplo, usadas apenas para demonstrar o catálogo — não representam o estoque da empresa. Fotos
            ilustrativas, sem preços ou condições reais.
          </DemoNotice>
        )}

        <p className="sr-only" aria-live="polite">
          {list.length} {list.length === 1 ? 'moto' : 'motos'}
        </p>
        <div className="mt-10">
          <MotorcycleGrid motorcycles={list} origin="home-featured" />
        </div>

        <div className="mt-12 flex justify-center">
          <Button to={catalogLink} variant="outline" size="lg">
            Ver todas as motos
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
