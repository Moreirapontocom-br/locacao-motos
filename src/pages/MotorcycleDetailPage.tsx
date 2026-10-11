import { ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { MobileContactBar } from '../components/motorcycles/MobileContactBar'
import { MotorcycleCommercialPanel } from '../components/motorcycles/MotorcycleCommercialPanel'
import { MotorcycleGallery } from '../components/motorcycles/MotorcycleGallery'
import { MotorcycleSpecs } from '../components/motorcycles/MotorcycleSpecs'
import { RelatedMotorcycles } from '../components/motorcycles/RelatedMotorcycles'
import { Reveal } from '../components/ui/Reveal'
import { motorcycles } from '../config/motorcycles'
import { findMotorcycle, motorcycleDisplayName, relatedMotorcycles } from '../lib/motorcycles'
import { siteConfig } from '../config/site'
import { shareImageUrl } from '../lib/publishing'
import { usePageMeta } from '../lib/seo'
import type { Motorcycle } from '../types'
import { NotFoundPage } from './NotFoundPage'

function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-dark">
        <li>
          <Link to="/" className="hover:text-white">
            Início
          </Link>
          <ChevronRight aria-hidden className="ml-1.5 inline size-3.5" />
        </li>
        <li>
          <Link to="/motos" className="hover:text-white">
            Motos
          </Link>
          <ChevronRight aria-hidden className="ml-1.5 inline size-3.5" />
        </li>
        <li aria-current="page" className="text-white">
          {current}
        </li>
      </ol>
    </nav>
  )
}

/** Moto inexistente: aviso 404 + sugestões reais do catálogo. */
function MotorcycleNotFound() {
  const suggestions = motorcycles.filter((m) => !m.unavailable).slice(0, 3)
  return (
    <NotFoundPage
      title="Moto não encontrada"
      message="Esta moto não está mais no catálogo ou o endereço está incorreto. Veja outras opções disponíveis."
    >
      <RelatedMotorcycles motorcycles={suggestions} title="Conheça outras motos" />
    </NotFoundPage>
  )
}

function MotorcycleDetail({ moto }: { moto: Motorcycle }) {
  const name = motorcycleDisplayName(moto)
  const ctaRef = useRef<HTMLDivElement>(null)
  const cover = moto.images[0]

  usePageMeta(`${name} — ${moto.model}`, moto.summary, { image: shareImageUrl(siteConfig, cover) })

  return (
    <>
      <PageHeader className="pb-8! sm:pb-10!">
        <Breadcrumb current={name} />
      </PageHeader>

      <div className="container-page grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.4fr_1fr] lg:gap-x-14 lg:gap-y-16">
        {/* Conteúdo da primeira dobra aparece imediatamente (sem animação de entrada) para não atrasar a foto principal. */}
        <MotorcycleGallery images={moto.images} title={name} />

        <div className="lg:sticky lg:top-28 lg:row-span-2 lg:self-start">
          <MotorcycleCommercialPanel moto={moto} ctaRef={ctaRef} />
        </div>

        <Reveal className="lg:col-start-1">
          <MotorcycleSpecs moto={moto} />
        </Reveal>
      </div>

      <RelatedMotorcycles motorcycles={relatedMotorcycles(motorcycles, moto)} />

      {/* Reserva espaço no celular para a barra fixa não cobrir o fim do conteúdo. */}
      <div aria-hidden className="h-[calc(5rem+env(safe-area-inset-bottom))] lg:hidden" />
      <MobileContactBar moto={moto} ctaRef={ctaRef} />
    </>
  )
}

export function MotorcycleDetailPage() {
  const { slug } = useParams()
  const moto = findMotorcycle(motorcycles, slug)
  // `key` garante estado novo (galeria, barra de contato) a cada moto.
  return moto ? <MotorcycleDetail key={moto.slug} moto={moto} /> : <MotorcycleNotFound />
}
