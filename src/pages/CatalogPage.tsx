import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { MotorcycleGrid } from '../components/motorcycles/MotorcycleGrid'
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
  const title = filter === 'todas' ? 'Encontre sua próxima moto' : `Motos ${styleLabels[filter]}`

  usePageMeta(
    filter === 'todas' ? 'Motos para locação' : title,
    'Conheça as motos para locação, com fotos e informações de cada modelo. Consulte disponibilidade e condições com a equipe.',
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
          description="Escolha uma moto para ver fotos e informações e consultar disponibilidade e condições com a equipe."
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

          {motorcycles.some((m) => m.demo) && (
            <DemoNotice className="mt-6">
              Catálogo demonstrativo: motos de exemplo e fotos ilustrativas, que não representam o estoque da empresa.
              Sem preços ou condições reais.
            </DemoNotice>
          )}

          <div className="mt-8">
            <MotorcycleGrid motorcycles={list} origin="catalog" />
          </div>

          <div className="mt-16 flex flex-col items-start gap-6 rounded-card bg-white p-6 ring-1 ring-graphite/[0.06] sm:flex-row sm:items-center sm:justify-between sm:p-10">
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
