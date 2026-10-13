import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { MotorcycleCarousel } from '../components/motorcycles/MotorcycleCarousel'
import { StyleFilter } from '../components/motorcycles/StyleFilter'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoNotice } from '../components/ui/DemoNotice'
import { SectionHeading } from '../components/ui/SectionHeading'
import { motorcycles } from '../config/motorcycles'
import { filterMotorcycles, parseStyleFilter, styleFilterOptions, styleLabels } from '../lib/motorcycles'
import { usePageMeta } from '../lib/seo'
import type { StyleFilterValue } from '../types'

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const options = styleFilterOptions(motorcycles)
  // Ignora estilos que não existem na lista atual (ex.: link antigo).
  const parsed = parseStyleFilter(params.get('estilo'))
  const filter = options.some((o) => o.value === parsed) ? parsed : 'todas'
  const list = filterMotorcycles(motorcycles, filter)
  const title = filter === 'todas' ? 'Motos Honda para locação' : `Motos ${styleLabels[filter]}`

  usePageMeta(
    filter === 'todas' ? 'Motos para locação' : title,
    'Honda CG 160 Start, CG 160 Fan e outras opções Honda para locação. Consulte disponibilidade e condições com a equipe.',
  )

  const onChange = (value: StyleFilterValue) => {
    setParams(value === 'todas' ? {} : { estilo: value }, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Motos"
          title={title}
          description="Nosso foco é a Honda CG 160, nas versões Start e Fan. Escolha uma moto para ver fotos e informações e consultar disponibilidade e condições com a equipe."
        />
      </PageHeader>

      <section aria-label="Lista de motos" className="py-12 sm:py-16">
        <div className="container-page">
          <h2 className="sr-only">Lista de motos</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <StyleFilter value={filter} onChange={onChange} options={options} showCounts />
            <p className="shrink-0 text-sm text-muted" aria-live="polite">
              {list.length} {list.length === 1 ? 'moto' : 'motos'}
            </p>
          </div>

          {motorcycles.some((m) => m.demo || m.images.some((img) => img.illustrative)) && (
            <DemoNotice className="mt-6">
              Fotos ilustrativas, que não são das motos da empresa. As opções de 300 cc são provisórias. Ano, versão e
              condições de cada moto são confirmados pela equipe.
            </DemoNotice>
          )}

          <div className="mt-8">
            <MotorcycleCarousel motorcycles={list} origin="catalog" label="Lista de motos" />
          </div>

          <div className="mt-12 flex flex-col items-start gap-6 rounded-card bg-white p-6 ring-1 ring-graphite/[0.06] sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold">Não encontrou a moto que procura?</h2>
              <p className="mt-2 text-muted">A frota pode mudar. Fale com a equipe e consulte a disponibilidade.</p>
            </div>
            <ContactButton
              variant="dark"
              context={{ origin: 'catalog-help' }}
              label="Consultar disponibilidade pelo WhatsApp"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </section>
    </>
  )
}
