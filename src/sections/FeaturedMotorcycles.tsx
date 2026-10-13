import { ArrowRight } from 'lucide-react'
import { MotorcycleCarousel } from '../components/motorcycles/MotorcycleCarousel'
import { Button } from '../components/ui/Button'
import { DemoNotice } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { featured } from '../config/content'
import { motorcycles } from '../config/motorcycles'

export function FeaturedMotorcycles() {
  const highlighted = motorcycles.filter((m) => m.featured)

  return (
    <section id="motos" aria-labelledby="destaques-titulo" className="section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="destaques-titulo"
            eyebrow={featured.eyebrow}
            title={featured.title}
            description={featured.description}
          />
        </Reveal>

        {highlighted.some((m) => m.demo || m.images.some((img) => img.illustrative)) && (
          <DemoNotice className="mt-8">
            Fotos ilustrativas, que não são das motos da empresa. As opções de 300 cc são provisórias. Ano, versão e
            condições de cada moto são confirmados pela equipe.
          </DemoNotice>
        )}

        <div className="mt-10">
          <MotorcycleCarousel motorcycles={highlighted} origin="home-featured" label="Motos em destaque" />
        </div>

        <div className="mt-10 flex justify-center">
          <Button to="/motos" variant="outline" size="lg">
            Ver todas as motos
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
