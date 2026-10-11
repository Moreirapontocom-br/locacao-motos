import { Check } from 'lucide-react'
import { technicalSheet } from '../../lib/motorcycles'
import type { Motorcycle } from '../../types'
import { DemoNotice } from '../ui/DemoNotice'

/** Ficha técnica, características principais e descrição — somente dados cadastrados. */
export function MotorcycleSpecs({ moto }: { moto: Motorcycle }) {
  const features = moto.features ?? []

  return (
    <div className="space-y-12">
      <section aria-labelledby="ficha-titulo">
        <h2 id="ficha-titulo" className="text-2xl font-semibold sm:text-3xl">
          Ficha técnica
        </h2>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {technicalSheet(moto).map((spec) => (
            <div key={spec.label} className="rounded-2xl bg-white p-5 ring-1 ring-graphite/[0.06]">
              <dt className="text-xs font-medium tracking-wide text-muted uppercase">{spec.label}</dt>
              <dd className="mt-1.5 font-display text-lg font-semibold">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {features.length > 0 && (
        <section aria-labelledby="caracteristicas-titulo">
          <h2 id="caracteristicas-titulo" className="text-2xl font-semibold sm:text-3xl">
            Características principais
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-graphite/[0.06]">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-ink">
                  <Check aria-hidden className="size-4" strokeWidth={2.5} />
                </span>
                <span className="pt-0.5 text-[0.95rem] font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(moto.description || moto.demo) && (
        <section aria-labelledby="sobre-moto-titulo">
          <h2 id="sobre-moto-titulo" className="text-2xl font-semibold sm:text-3xl">
            Sobre esta moto
          </h2>
          {moto.description && <p className="mt-4 max-w-2xl leading-relaxed text-muted">{moto.description}</p>}
          {moto.demo && (
            <DemoNotice className="mt-5 max-w-2xl">
              Moto de exemplo, com fotos e informações ilustrativas. Será substituída pelos dados reais da frota.
            </DemoNotice>
          )}
        </section>
      )}
    </div>
  )
}
