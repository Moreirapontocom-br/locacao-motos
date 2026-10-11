import { ArrowRight, Check } from 'lucide-react'
import { SpeedLines } from '../components/ui/SpeedLines'
import { Button } from '../components/ui/Button'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoBadge } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SmartImage } from '../components/ui/SmartImage'
import { acquisition } from '../config/content'

/**
 * Seção comercial de destaque. Composição própria: foto vertical com o
 * "trajeto" desenhado sobre ela e o argumento ao lado, em fundo grafite.
 */
export function Acquisition() {
  const lastStop = acquisition.path.length - 1

  return (
    <section id="aquisicao" aria-labelledby="aquisicao-titulo" className="section-y relative overflow-hidden bg-graphite">
      {/* Linhas de movimento em grande escala, discretas, como assinatura visual da seção. */}
      <SpeedLines className="absolute right-[-4rem] bottom-10 hidden w-[30rem] opacity-40 lg:block" />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <Reveal className="relative">
          <div className="group relative overflow-hidden rounded-card">
            <SmartImage
              image={acquisition.image}
              tone="dark"
              sizes="(min-width: 1024px) 520px, 100vw"
              className="aspect-[4/3] sm:aspect-[4/5]"
              imgClassName="transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.03]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/10 to-transparent" />
            <DemoBadge label="Imagem ilustrativa" className="absolute top-4 left-4" />

            {/* Trajeto desenhado sobre a foto. */}
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
              <span aria-hidden className="absolute top-[7px] right-[16%] left-[16%] h-px bg-[repeating-linear-gradient(90deg,var(--color-accent)_0,var(--color-accent)_6px,transparent_6px,transparent_12px)]" />
              <ol aria-label="Trajeto da locação à possibilidade de aquisição" className="relative grid grid-cols-3 gap-2">
                {acquisition.path.map((stop, i) => (
                  <li key={stop.label} className="flex flex-col items-center text-center">
                    <span
                      aria-hidden
                      className={`size-[15px] rounded-full border-2 border-accent ${i === lastStop ? 'bg-accent' : 'bg-graphite'}`}
                    />
                    <span className="mt-3 text-xs leading-tight font-semibold text-white sm:text-sm">{stop.label}</span>
                    <span className="mt-1 hidden text-xs leading-snug text-white/65 sm:block">{stop.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-accent uppercase">
            <span aria-hidden className="h-px w-6 bg-current" />
            {acquisition.eyebrow}
          </p>
          <h2 id="aquisicao-titulo" className="text-3xl leading-[1.08] font-semibold text-white sm:text-4xl lg:text-[3.1rem]">
            {acquisition.title}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-dark sm:text-lg">{acquisition.description}</p>

          <div className="mt-8 rounded-2xl border border-white/10 p-5 sm:p-6">
            <p className="text-xs font-bold tracking-[0.16em] text-white/60 uppercase">Importante saber</p>
            <ul className="mt-4 space-y-3">
              {acquisition.notes.map((note) => (
                <li key={note} className="flex gap-3 text-[0.95rem] leading-snug text-white/85">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                    <Check aria-hidden className="size-3" strokeWidth={3} />
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-9 grid gap-3 sm:flex">
            <ContactButton
              size="lg"
              context={{ origin: 'modality' }}
              label="Perguntar sobre modalidades"
            />
            <Button to="/motos" variant="outline-light" size="lg">
              Conhecer as motos
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
