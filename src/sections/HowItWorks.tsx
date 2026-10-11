import { ShieldCheck } from 'lucide-react'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { howItWorks } from '../config/content'

/**
 * Linha do tempo editorial: números grandes vazados, conector contínuo e
 * marcadores. Horizontal no desktop e vertical no celular.
 */
export function HowItWorks() {
  const lastIndex = howItWorks.steps.length - 1

  return (
    <section id="como-funciona" aria-labelledby="como-funciona-titulo" className="section-y bg-white">
      <div className="container-page">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="como-funciona-titulo" eyebrow={howItWorks.eyebrow} title={howItWorks.title} />
          <p className="max-w-sm text-base leading-relaxed text-muted lg:pb-2 lg:text-right">{howItWorks.description}</p>
        </Reveal>

        <ol className="relative mt-14 grid gap-12 sm:mt-16 lg:mt-20 lg:grid-cols-4 lg:gap-10">
          {/* Conector: horizontal (desktop) e vertical (celular/tablet). */}
          <span aria-hidden className="absolute top-[7px] right-0 left-0 hidden h-px bg-graphite/15 lg:block" />
          <span aria-hidden className="absolute top-3 bottom-3 left-[7px] w-px bg-graphite/15 lg:hidden" />

          {howItWorks.steps.map((step, i) => {
            const last = i === lastIndex
            return (
              <Reveal as="li" key={step.title} delay={i * 0.08} className="group relative pl-12 lg:pl-0">
                <span
                  aria-hidden
                  className={`absolute top-3 left-0 size-[15px] rounded-full border-2 border-accent ring-[6px] ring-white transition-colors duration-300 lg:static lg:block ${
                    last ? 'bg-accent' : 'bg-white group-hover:bg-accent'
                  }`}
                />
                <p
                  aria-hidden
                  className={`font-display text-[3.5rem] leading-none font-semibold tracking-tight text-transparent transition-[-webkit-text-stroke-color] duration-300 [-webkit-text-stroke-width:1.5px] sm:text-[4.5rem] lg:mt-8 lg:text-[5.5rem] ${
                    last
                      ? '[-webkit-text-stroke-color:var(--color-accent)]'
                      : '[-webkit-text-stroke-color:rgb(21_25_29/0.25)] group-hover:[-webkit-text-stroke-color:var(--color-accent)]'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <step.icon aria-hidden className="size-5 shrink-0 text-accent-ink" strokeWidth={1.8} />
                  <h3 className="text-lg leading-snug font-semibold sm:text-xl">
                    <span className="sr-only">Etapa {i + 1}: </span>
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted">{step.description}</p>
              </Reveal>
            )
          })}
        </ol>

        <Reveal className="mt-14 flex items-start gap-3 border-t border-graphite/10 pt-6 text-sm text-muted sm:items-center lg:mt-20">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink sm:mt-0" />
          <p>{howItWorks.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
