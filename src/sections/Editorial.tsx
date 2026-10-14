import { ArrowRight } from 'lucide-react'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoBadge } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SmartImage } from '../components/ui/SmartImage'
import { Button } from '../components/ui/Button'
import { editorial } from '../config/content'

/**
 * Peça de campanha: foto ampla à direita, título grande à esquerda, composição
 * assimétrica sobre fundo grafite. Sem promessas de custo, renda ou aprovação.
 */
export function Editorial() {
  return (
    <section aria-labelledby="editorial-titulo" className="section-y relative isolate overflow-hidden bg-graphite">
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12 lg:gap-0">
        <Reveal className="relative z-10 lg:col-span-6 lg:pr-6">
          <span aria-hidden className="block h-16 w-0.5 bg-accent sm:h-24" />
          <h2 id="editorial-titulo" className="text-h1 mt-8 text-white uppercase">
            Mais <span className="text-accent">liberdade</span> para seguir seu caminho.
          </h2>
          <p className="mt-7 max-w-md text-lead text-muted-dark">{editorial.text}</p>
          <div className="mt-9 grid gap-3 sm:flex">
            <ContactButton size="lg" context={{ origin: 'home-contact' }} label="Falar com a equipe" />
            <Button to="/#modalidades" variant="outline-light" size="lg">
              Ver modalidades
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative lg:col-span-6 lg:col-start-7 lg:-mr-[calc(var(--gutter)+max(0px,(100vw-var(--container-page))/2))]">
          <div className="relative overflow-hidden rounded-card lg:rounded-r-none lg:rounded-l-panel">
            <SmartImage
              image={editorial.image}
              tone="dark"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="aspect-[4/3] lg:aspect-[5/4]"
            />
            <div aria-hidden className="scrim-bottom absolute inset-0 opacity-40" />
            <DemoBadge label="Imagem ilustrativa" className="absolute top-4 left-4" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
