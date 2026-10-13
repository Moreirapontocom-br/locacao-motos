import { ArrowDown, ArrowUpRight, Bike, Check, Route } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { DemoBadge } from '../components/ui/DemoNotice'
import { SmartImage } from '../components/ui/SmartImage'
import { SpeedLines } from '../components/ui/SpeedLines'
import { hero } from '../config/content'

const ease = [0.22, 1, 0.36, 1] as const

/** Entrada curta e discreta, igual para todos os blocos do hero. */
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
      
      className={`group/label absolute inline-flex h-11 items-center gap-2 rounded-full bg-graphite/75 pr-1.5 pl-4 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-graphite ${className}`}
    >
      <span aria-hidden className="font-display text-xs text-white/45 tabular-nums">
        {index}
      </span>
      <Icon aria-hidden className="size-4 text-accent" />
      {label}
      <span
        aria-hidden
        className="ml-1 grid size-8 place-items-center rounded-full bg-white/10 transition-[background-color,color,transform] duration-300 group-hover/label:rotate-45 group-hover/label:bg-accent group-hover/label:text-graphite"
      >
        <ArrowUpRight className="size-3.5" />
      </span>
    </Link>
  )
}

/**
 * Paralaxe muito sutil das fotos seguindo o mouse (poucos pixels).
 * Desligada para toque e para quem prefere movimento reduzido.
 */
function usePointerParallax() {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.6 })

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const resetPointer = () => {
    px.set(0)
    py.set(0)
  }

  return {
    onPointerMove,
    resetPointer,
    mainX: useTransform(sx, (v) => v * -10),
    mainY: useTransform(sy, (v) => v * -8),
    secondaryX: useTransform(sx, (v) => v * 14),
    secondaryY: useTransform(sy, (v) => v * 12),
    frameX: useTransform(sx, (v) => v * -18),
    frameY: useTransform(sy, (v) => v * -14),
  }
}

export function Hero() {
  const { onPointerMove, resetPointer, mainX, mainY, secondaryX, secondaryY, frameX, frameY } = usePointerParallax()

  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative overflow-hidden bg-graphite pt-26 pb-16 sm:pt-32 sm:pb-20 lg:flex lg:min-h-[min(100svh,58rem)] lg:items-center lg:pt-28 lg:pb-20"
    >
      {/* Textura discreta de linhas, remetendo a faixas de pista. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(115deg,#fff_0,#fff_1px,transparent_1px,transparent_72px)]"
      />
      {/* Luz suave atrás das fotos para separar as imagens do fundo grafite. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-10%] hidden size-[46rem] -translate-y-1/2 rounded-full bg-white/[0.035] blur-3xl lg:block"
      />

      <div className="container-page relative grid items-center gap-12 sm:gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 xl:gap-20">
        <div className="max-w-xl">
          <motion.p
            {...fadeUp()}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-white/80 uppercase"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            id="hero-titulo"
            {...fadeUp(0.05)}
            className="text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.03em] text-white sm:text-[3.5rem] lg:text-[3.75rem] xl:text-[4.25rem]"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            {...fadeUp(0.1)}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted-dark sm:text-xl"
          >
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
            className="mt-10 grid gap-3 border-t border-white/10 pt-6 text-sm text-white/75 sm:flex sm:flex-wrap sm:gap-x-6"
          >
            {hero.points.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <Check aria-hidden className="size-4 text-accent" />
                {point}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Composição: pessoa pilotando em destaque e foto da moto parada sobreposta. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          onPointerMove={onPointerMove}
          onPointerLeave={resetPointer}
          className="relative mx-auto w-full max-w-2xl pb-[16%] pl-[14%] lg:max-w-none"
        >
          {/* Moldura laranja deslocada, detalhe da identidade. */}
          <motion.div
            aria-hidden
            style={{ x: frameX, y: frameY }}
            className="absolute top-[-1.25rem] right-[-1.25rem] hidden h-[62%] w-[52%] rounded-[2rem] border border-accent/40 sm:block"
          />

          {/* Linhas de movimento saindo de trás da foto principal, como um rastro. */}
          <SpeedLines className="absolute top-[12%] left-0 w-[30%] sm:w-[26%]" />

          <motion.div style={{ x: mainX, y: mainY }} className="group/main relative">
            <div className="overflow-hidden rounded-card ring-1 ring-white/10">
              <SmartImage
                image={hero.images.main}
                priority
                tone="dark"
                sizes="(min-width: 1024px) 640px, 90vw"
                className="aspect-[4/3]"
                imgClassName="transition-transform duration-[1200ms] ease-out-soft group-hover/main:scale-[1.03]"
              />
            </div>
            <PhotoLabel to="/motos" icon={Bike} index="01" label="Ver as motos" className="right-4 bottom-4" />
            <DemoBadge label="Fotos ilustrativas" className="absolute top-4 right-4" />
          </motion.div>

          <motion.div
            style={{ x: secondaryX, y: secondaryY }}
            className="group/secondary absolute bottom-0 left-0 w-[42%] rounded-[1.6rem] bg-graphite p-1.5 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)] sm:p-2"
          >
            <div className="relative overflow-hidden rounded-[1.25rem]">
              <SmartImage
                image={hero.images.secondary}
                priority
                tone="dark"
                sizes="(min-width: 1024px) 280px, 40vw"
                className="aspect-[4/5]"
                imgClassName="transition-transform duration-[1200ms] ease-out-soft group-hover/secondary:scale-[1.04]"
              />
              {/* No celular a foto é pequena: o rótulo aparece a partir do tablet. */}
              <div className="hidden sm:block">
                <PhotoLabel to="/#como-funciona" icon={Route} index="02" label="Como funciona" className="bottom-3 left-3" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
