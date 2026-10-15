import { ArrowDown } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '../components/ui/Button'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoBadge } from '../components/ui/DemoNotice'
import { SmartImage } from '../components/ui/SmartImage'
import { hero } from '../config/content'
import { MotoFinder } from './MotoFinder'

const ease = [0.22, 1, 0.36, 1] as const

/** Entrada curta e discreta, igual para todos os blocos da capa. */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
})

/**
 * Capa (Fase 15): minimalista. A moto ocupa a direita (no celular, o topo);
 * à esquerda ficam só título, uma linha de apoio e o cartão de perguntas
 * ("Encontre sua próxima moto"), que é o centro da experiência.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="relative isolate overflow-hidden bg-graphite-900">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease }}
        // Celular: foto no topo, fundindo-se ao fundo. Desktop: foto nos 3/5 da direita.
        className="mask-hero-mobile absolute inset-x-0 top-0 -z-10 h-[62svh] lg:mask-hero lg:inset-y-0 lg:right-0 lg:left-[36%] lg:h-auto"
      >
        <SmartImage
          image={hero.images.main}
          priority
          tone="dark"
          // Sem foto (ou falha ao carregar), o fundo fica liso: nenhum texto sob o título.
          placeholderLabel=""
          sizes="(min-width: 1024px) 64vw, 100vw"
          className="h-full [&>*]:invisible"
          imgClassName="object-[64%_42%] lg:object-[55%_center]"
        />
      </motion.div>
      {/* Leitura do texto no desktop: sombra só no lado esquerdo. */}
      <div aria-hidden className="scrim-hero-desktop absolute inset-0 -z-10 hidden lg:block" />

      <div className="container-page relative grid min-h-[min(100svh,58rem)] items-center pt-[calc(var(--header-h)+24svh)] pb-14 sm:pt-[calc(var(--header-h)+30svh)] lg:grid-cols-12 lg:pt-[calc(var(--header-h)+2.5rem)] lg:pb-16">
        <div className="lg:col-span-7 xl:col-span-6">
          <motion.p {...fadeUp(0.12)} className="eyebrow mb-5 text-white/75">
            <span aria-hidden className="h-0.5 w-8 rounded-full bg-accent" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            id="hero-titulo"
            {...fadeUp(0.18)}
            className="text-[clamp(2.5rem,1.5rem+3.2vw,3.875rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.3)]"
          >
            {hero.title} <span className="text-accent">{hero.titleAccent}</span>
          </motion.h1>

          <motion.p {...fadeUp(0.24)} className="mt-4 max-w-[30rem] text-lead text-white/70">
            {hero.subtitle}
          </motion.p>

          <motion.div {...fadeUp(0.32)} className="mt-7 max-w-[34rem]">
            <MotoFinder />
          </motion.div>

          {/* Ações secundárias discretas: o cartão de perguntas é a ação principal da capa. */}
          <motion.div {...fadeUp(0.4)} className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Button to={hero.primaryCta.to} variant="ghost-light" size="sm" className="px-0">
              {hero.primaryCta.label}
              <ArrowDown aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
            </Button>
            <ContactButton
              size="sm"
              variant="ghost-light"
              className="px-0"
              context={{ origin: 'home-contact' }}
              label={hero.secondaryCta.label}
            />
          </motion.div>
        </div>
      </div>

      <DemoBadge label="Foto ilustrativa" className="absolute top-[calc(var(--header-h)+1rem)] right-[var(--gutter)]" />
    </section>
  )
}
