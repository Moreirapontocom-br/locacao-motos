import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { usePageMeta } from '../lib/seo'

interface NotFoundPageProps {
  title?: string
  message?: string
  /** Conteúdo extra abaixo do aviso (ex.: sugestões de motos). */
  children?: ReactNode
}

export function NotFoundPage({
  title = 'Página não encontrada',
  message = 'A página que você procura não existe ou foi movida.',
  children,
}: NotFoundPageProps) {
  usePageMeta(title, message, { noindex: true })
  return (
    <>
      <PageHeader className={children ? 'pb-20!' : 'min-h-[70vh] pb-24!'}>
        <SectionHeading as="h1" tone="dark" eyebrow="Erro 404" title={title} description={message} />
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button to="/motos" size="lg">
            Conhecer as motos
          </Button>
          <Button to="/" size="lg" variant="outline-light">
            <ArrowLeft aria-hidden className="size-4" />
            Voltar ao início
          </Button>
        </div>
      </PageHeader>
      {children}
    </>
  )
}
