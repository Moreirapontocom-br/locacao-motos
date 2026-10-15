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
      className="relative isolate flex min-h-[max(38rem,94svh)] items-end overflow-hidden bg-graphite-900 lg:min-h-[min(100svh,64rem)] lg:items-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease }}
        // No desktop a foto ocupa os 3/4 da direita: a moto fica longe do texto e ganha protagonismo.
        className="absolute inset-0 -z-10 lg:left-[22%] lg:[mask-image:linear-gradient(to_right,transparent,black_30%)]"
      >
        <SmartImage
          image={hero.images.main}
          priority
          tone="dark"
          // Sem foto (ou falha ao carregar), o fundo fica liso: nenhum texto sob o título.
          placeholderLabel=""
          sizes="100vw"
          className="h-full [&>*]:invisible"
          imgClassName="object-[64%_42%] lg:object-[58%_center]"
        />
      </motion.div>
      {/* Degradês de leitura: sombra só atrás do texto (base no celular, esquerda no desktop). */}
      <div aria-hidden className="scrim-hero-mobile absolute inset-0 -z-10 lg:hidden" />
      <div aria-hidden className="scrim-hero-desktop absolute inset-0 -z-10 hidden lg:block" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-graphite-900/75 to-transparent" />

      <div className="container-page relative pt-[calc(var(--header-h)+4rem)] pb-12 sm:pb-20 lg:py-36">
        <div className="max-w-[40rem]">
          <motion.p {...fadeUp(0.15)} className="eyebrow mb-7 text-white/75">
            <span aria-hidden className="h-0.5 w-8 rounded-full bg-accent" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1 id="hero-titulo" {...fadeUp(0.22)} className="max-w-[13ch] text-display font-extrabold text-white uppercase [text-shadow:0_2px_24px_rgb(0_0_0/0.25)]">
            {hero.title}
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className="mt-7 max-w-[30rem] text-lead text-white/75">
            {hero.subtitle}
          </motion.p>

          {/* Hierarquia: ação principal forte; secundária como link discreto. */}
          <motion.div {...fadeUp(0.38)} className="mt-11 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-7">
            <Button to={hero.primaryCta.to} size="lg" className="shadow-accent sm:min-w-64 sm:px-8">
              {hero.primaryCta.label}
              <ArrowDown aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
            </Button>
            <ContactButton
              size="md"
              variant="ghost-light"
              className="self-center sm:self-auto"
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
