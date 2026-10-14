import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'

/**
 * Logotipo. Enquanto `siteConfig.logo.src` estiver vazio, exibe um
 * tratamento tipográfico provisório com o nome configurado (não é um logotipo).
 */
export function Logo({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) {
  const onDark = tone === 'dark'
  return (
    <Link
      to="/"
      aria-label={`${siteConfig.name} — página inicial`}
      className={`group/logo inline-flex items-center gap-3 rounded-control ${className}`}
    >
      {siteConfig.logo.src ? (
        <img src={siteConfig.logo.src} alt={siteConfig.logo.alt} className="h-9 w-auto" />
      ) : (
        <>
          {/* Barra de destaque: apenas um marcador tipográfico provisório. */}
          <span aria-hidden className="h-6 w-1 -skew-x-12 rounded-[1px] bg-accent transition-transform duration-300 group-hover/logo:scale-y-110" />
          <span className="flex flex-col">
            <span
              className={`font-display text-[1.0625rem] leading-none font-bold tracking-[-0.02em] ${
                onDark ? 'text-white' : 'text-graphite'
              }`}
            >
              {siteConfig.name}
            </span>
            <span
              className={`mt-1 text-[0.6875rem] leading-none font-medium ${onDark ? 'text-muted-dark' : 'text-muted'}`}
            >
              {siteConfig.tagline}
            </span>
          </span>
        </>
      )}
    </Link>
  )
}
