import { ArrowDown, ArrowUpRight, Bike, Check, Route } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
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

/** Rótulo clicável sobre as fotos (catálogo ou "como funciona"). */
function PhotoLabel({
  to,
  icon: Icon,
  index,
  label,
  className = '',
}: {
  to: string
  icon: typeof Bike
  index: string
  label: string
  className?: string
}) {
  return (
    <Link
      to={to}
      className={`group/label absolute inline-flex h-11 items-center gap-2 rounded-control bg-graphite/80 pr-1.5 pl-4 text-sm font-semibold text-white ring-1 ring-white/10 backdrop-blur-md transition-colors duration-300 hover:bg-graphite ${className}`}
    >
      <span aria-hidden className="font-display text-xs text-white/50 tabular-nums">
        {index}
      </span>
      <Icon aria-hidden className="size-4 text-accent" />
      {label}
      <span
        aria-hidden
        className="ml-1 grid size-8 place-items-center rounded-[0.5rem] bg-white/10 transition-[background-color,color] duration-300 group-hover/label:bg-accent group-hover/label:text-graphite"
      >
        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/label:rotate-45" />
      </span>
    </Link>
  )
}

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

          <motion.h1 id="hero-titulo" {...fadeUp(0.05)} className="text-display text-white">
            {hero.title}
          </motion.h1>

          <motion.p {...fadeUp(0.1)} className="mt-6 max-w-md text-lead text-muted-dark">
            {hero.subtitle}
          </motion.p>

          <motion.div {...fadeUp(0.15)} className="mt-9 grid gap-3 sm:flex">
            <Button to={hero.primaryCta.to} size="lg" className="sm:min-w-52">
              <Bike aria-hidden className="size-5" />
              {hero.primaryCta.label}
            </Button>
            <Button to={hero.secondaryCta.to} size="lg" variant="outline-light" className="sm:min-w-44">
              {hero.secondaryCta.label}
              <ArrowDown aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
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
          {/* Sobreposição discreta só na base, para a leitura dos rótulos. */}
          <div aria-hidden className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-80" />
        </div>
        <DemoBadge label="Fotos ilustrativas" className="absolute top-4 right-[var(--gutter)]" />
        <PhotoLabel to="/motos" icon={Bike} index="01" label="Ver as motos" className="right-[var(--gutter)] bottom-5" />
      </motion.div>

      {/* Foto secundária (moto parada): detalhe emoldurado nas telas largas, sobre a área esmaecida. */}
      <motion.div
        {...fadeUp(0.3)}
        className="group/secondary absolute bottom-10 left-[46%] z-10 hidden w-44 rounded-card bg-graphite p-1.5 shadow-float ring-1 ring-white/10 xl:block 2xl:w-52"
      >
        <div className="relative overflow-hidden rounded-[0.9rem]">
          <SmartImage
            image={hero.images.secondary}
            tone="dark"
            sizes="208px"
            className="aspect-[4/5]"
            imgClassName="transition-transform duration-[1200ms] ease-out-soft group-hover/secondary:scale-[1.04]"
          />
        </div>
        <PhotoLabel to="/#como-funciona" icon={Route} index="02" label="Como funciona" className="-bottom-5 left-3 whitespace-nowrap" />
      </motion.div>
    </section>
  )
}
