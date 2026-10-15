import { ArrowDown } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { DemoBadge } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SmartImage } from '../components/ui/SmartImage'
import { editorial } from '../config/content'

/**
 * Seção editorial sobre mobilidade: foto ampla que vaza até a borda direita,
 * título grande e uma única ação (leva ao seletor "Encontre sua próxima moto").
 * Sem promessas de custo, renda ou aprovação.
 */
export function Editorial() {
  return (
    <section aria-labelledby="editorial-titulo" className="section-y relative isolate overflow-hidden bg-graphite">
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12 lg:gap-0">
        <Reveal className="relative z-10 lg:col-span-5 lg:pr-10">
          <p className="eyebrow text-accent">
            <span aria-hidden className="h-0.5 w-7 rounded-full bg-current" />
            {editorial.eyebrow}
          </p>
          <h2 id="editorial-titulo" className="text-h2 mt-5 text-white">
            Mais <span className="text-accent">liberdade</span> para seguir seu caminho.
          </h2>
          <p className="mt-5 max-w-md text-lead text-muted-dark">{editorial.text}</p>
          <Button to="/#encontre" variant="outline-light" size="lg" className="mt-10">
            Encontrar minha moto
            <ArrowDown aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="relative lg:col-span-7 lg:col-start-6 lg:-mr-[calc(var(--gutter)+max(0px,(100vw-var(--container-page))/2))]">
          <div className="relative overflow-hidden rounded-card lg:rounded-l-panel lg:rounded-r-none">
            <SmartImage
              image={editorial.image}
              tone="dark"
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="aspect-[4/3] lg:aspect-[16/11]"
            />
            <div aria-hidden className="scrim-bottom absolute inset-0 opacity-40" />
            <DemoBadge label="Imagem ilustrativa" className="absolute top-4 left-4" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
