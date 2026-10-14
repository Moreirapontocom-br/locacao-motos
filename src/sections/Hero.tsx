import { ArrowDown, ArrowRight, Check } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '../components/ui/Button'
import { DemoBadge } from '../components/ui/DemoNotice'
import { SmartImage } from '../components/ui/SmartImage'
import { hero } from '../config/content'

const ease = [0.22, 1, 0.36, 1] as const

/** Entrada curta e discreta, igual para todos os blocos do banner. */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})

/**
 * Banner principal com linguagem cinematográfica: fundo grafite, foto ampla
 * que se funde ao fundo (sem distorcer a moto) e título expressivo.
 * No celular a foto aparece inteira, abaixo do texto, no seu formato original (4:3).
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden bg-graphite pt-[calc(var(--header-h)+2.5rem)] lg:flex lg:min-h-[min(100svh,56rem)] lg:items-center lg:pt-(--header-h) lg:pb-0"
    >
      <div className="container-page relative">
        <div className="max-w-xl lg:max-w-[min(38rem,46%)] lg:py-24">
          <motion.p {...fadeUp()} className="eyebrow mb-6 text-white/85">
            <span aria-hidden className="h-0.5 w-7 rounded-full bg-accent" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1 id="hero-titulo" {...fadeUp(0.05)} className="text-display text-white uppercase">
            {hero.title}
          </motion.h1>

          <motion.p {...fadeUp(0.1)} className="mt-6 max-w-md text-lead text-muted-dark">
            {hero.subtitle}
          </motion.p>

          <motion.div {...fadeUp(0.15)} className="mt-9 grid gap-3 sm:flex">
            <Button to={hero.primaryCta.to} size="lg" className="sm:min-w-56">
              {hero.primaryCta.label}
              <ArrowDown aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
            </Button>
            <Button to={hero.secondaryCta.to} size="lg" variant="outline-light" className="sm:min-w-44">
              {hero.secondaryCta.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Button>
          </motion.div>

          <motion.ul
            {...fadeUp(0.2)}
            className="mt-10 grid gap-3 border-t border-white/10 pt-6 text-sm text-white/80 sm:flex sm:flex-wrap sm:gap-x-6"
          >
            {hero.points.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <Check aria-hidden className="size-4 text-accent" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Foto principal: no desktop ocupa a direita e se funde ao fundo pela esquerda. */}
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease }}
        className="group/main relative mt-12 sm:mt-14 lg:absolute lg:top-1/2 lg:right-0 lg:mt-0 lg:w-[62%] lg:-translate-y-1/2 xl:w-[60%]"
      >
        <div className="relative lg:mask-hero">
          <SmartImage
            image={hero.images.main}
            priority
            tone="dark"
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="aspect-[4/3]"
            imgClassName="transition-transform duration-[1400ms] ease-out-soft group-hover/main:scale-[1.025]"
          />
          {/* Sobreposição discreta na base da foto. */}
          <div aria-hidden className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-80" />
        </div>
        <DemoBadge label="Fotos ilustrativas" className="absolute top-4 right-[var(--gutter)]" />
      </motion.div>
    </section>
  )
}
