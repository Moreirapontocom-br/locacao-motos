import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { siteConfig } from '../../config/site'

/**
 * Selo pequeno que identifica conteúdo demonstrativo. Some quando `showDemoNotices` = false,
 * exceto com `always` (ex.: moto de exemplo, que nunca pode parecer frota real).
 */
export function DemoBadge({
  label = 'Demonstrativo',
  className = '',
  always = false,
}: {
  label?: string
  className?: string
  always?: boolean
}) {
  if (!siteConfig.showDemoNotices && !always) return null
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-graphite/85 px-2.5 py-1 text-[0.6875rem] leading-none font-semibold tracking-[0.06em] text-white uppercase ring-1 ring-white/10 backdrop-blur-md ${className}`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {label}
    </span>
  )
}

/** Aviso em linha para conteúdos provisórios. */
export function DemoNotice({
  children,
  tone = 'light',
  className = '',
}: {
  children: ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  if (!siteConfig.showDemoNotices) return null
  const dark = tone === 'dark'
  return (
    <p
      className={`flex items-start gap-2.5 rounded-control border-l-2 border-accent px-4 py-3 text-sm leading-snug ${
        dark ? 'bg-white/[0.04] text-muted-dark' : 'bg-white text-muted ring-1 ring-graphite/[0.06]'
      } ${className}`}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

/**
 * Exibe o valor ou um marcador "A informar" quando o dado oficial ainda não existe.
 * O marcador herda a cor do texto ao redor (em itálico). No fundo claro fica levemente
 * esmaecido; no escuro mantém a cor cheia para preservar o contraste AA (4,5:1).
 */
export function Pending({
  value,
  fallback = 'A informar',
  tone = 'dark',
}: {
  value?: string
  fallback?: string
  tone?: 'light' | 'dark'
}) {
  if (value) return <>{value}</>
  return <span className={`italic ${tone === 'light' ? 'opacity-95' : ''}`}>{fallback}</span>
}
