import { ArrowDown } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '../components/ui/Button'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoBadge } from '../components/ui/DemoNotice'
import { SmartImage } from '../components/ui/SmartImage'
import { hero } from '../config/content'

const ease = [0.22, 1, 0.36, 1] as const

/** Entrada curta e discreta, igual para todos os blocos do banner. */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
})

/**
 * Banner de campanha (Fase 14): a foto ocupa toda a área e é a protagonista.
 * Sobre ela, apenas rótulo, título, subtítulo e duas ações, ancorados na base
 * (celular) ou à esquerda (desktop), com um degradê só onde há texto.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate flex min-h-[max(36rem,92svh)] items-end overflow-hidden bg-graphite lg:min-h-[min(100svh,62rem)] lg:items-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease }}
        className="absolute inset-0 -z-10"
      >
        <SmartImage
          image={hero.images.main}
          priority
          tone="dark"
          // Sem foto (ou falha ao carregar), o fundo fica liso: nenhum texto sob o título.
          placeholderLabel=""
          sizes="100vw"
          className="h-full [&>svg]:invisible"
          imgClassName="object-[62%_center] lg:object-center"
        />
      </motion.div>
      {/* Degradês de leitura: base no celular, esquerda no desktop. */}
      <div aria-hidden className="scrim-bottom absolute inset-0 -z-10 lg:hidden" />
      <div aria-hidden className="scrim-left absolute inset-0 -z-10 hidden lg:block" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-graphite/70 to-transparent" />

      <div className="container-page relative pt-[calc(var(--header-h)+4rem)] pb-14 sm:pb-20 lg:py-32">
        <div className="max-w-2xl">
          <motion.p {...fadeUp(0.15)} className="eyebrow mb-6 text-white/85">
            <span aria-hidden className="h-0.5 w-7 rounded-full bg-accent" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1 id="hero-titulo" {...fadeUp(0.22)} className="max-w-[14ch] text-display text-white uppercase">
            {hero.title}
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className="mt-6 max-w-md text-lead text-white/80">
            {hero.subtitle}
          </motion.p>

          <motion.div {...fadeUp(0.38)} className="mt-10 grid gap-3 sm:flex">
            <Button to={hero.primaryCta.to} size="lg" className="sm:min-w-60">
              {hero.primaryCta.label}
              <ArrowDown aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
            </Button>
            <ContactButton
              size="lg"
              variant="outline-light"
              className="backdrop-blur-sm sm:min-w-48"
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
