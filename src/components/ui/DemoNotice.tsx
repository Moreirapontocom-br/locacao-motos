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
      className={`inline-flex items-center gap-1 rounded-full bg-graphite/80 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-white uppercase backdrop-blur ${className}`}
    >
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
      className={`flex items-start gap-2 rounded-xl border border-dashed px-4 py-3 text-sm leading-snug ${
        dark ? 'border-white/20 text-muted-dark' : 'border-graphite/20 text-muted'
      } ${className}`}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

/**
 * Exibe o valor ou um marcador "A informar" quando o dado oficial ainda não existe.
 * O marcador herda a cor do texto ao redor e fica levemente esmaecido; a opacidade
 * depende do fundo para manter o contraste AA (4,5:1): `light` = fundo claro.
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
  return <span className={`italic ${tone === 'light' ? 'opacity-95' : 'opacity-75'}`}>{fallback}</span>
}
