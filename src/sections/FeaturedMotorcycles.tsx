import { ArrowRight } from 'lucide-react'
import { MotorcycleCard } from '../components/motorcycles/MotorcycleCard'
import { Button } from '../components/ui/Button'
import { DemoNotice } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { featured } from '../config/content'
import { motorcycles } from '../config/motorcycles'

/** Vitrine da home: mesmas motos e mesmos cards do catálogo (fonte única em config/motorcycles.ts). */
export function FeaturedMotorcycles() {
  const highlighted = motorcycles.filter((m) => m.featured && !m.unavailable)

  return (
    <section id="motos" aria-labelledby="destaques-titulo" className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="destaques-titulo"
            eyebrow={featured.eyebrow}
            title={featured.title}
            description={featured.description}
            uppercase
          />
        </Reveal>

        {highlighted.some((m) => m.demo || m.images.some((img) => img.illustrative)) && (
          <DemoNotice className="mt-8">
            Fotos ilustrativas, que não são das motos da empresa. Os modelos marcados como exemplo são provisórios.
            Ano, versão, disponibilidade e condições de cada moto são confirmados pela equipe.
          </DemoNotice>
        )}

        <ul aria-label="Motos em destaque" className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {highlighted.map((moto, i) => (
            <Reveal as="li" key={moto.slug} delay={(i % 2) * 0.08}>
              <MotorcycleCard moto={moto} origin="home-featured" />
            </Reveal>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Button to="/motos" variant="outline" size="lg">
            Ver todas as motos
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
