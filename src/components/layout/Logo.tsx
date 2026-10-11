import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'

/**
 * Logotipo. Enquanto `siteConfig.logo.src` estiver vazio, exibe um
 * marcador provisório com o nome da empresa.
 */
export function Logo({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) {
  const onDark = tone === 'dark'
  return (
    <Link
      to="/"
      aria-label={`${siteConfig.name} — página inicial`}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      {siteConfig.logo.src ? (
        <img src={siteConfig.logo.src} alt={siteConfig.logo.alt} className="h-9 w-auto" />
      ) : (
        <>
          <span
            aria-hidden
            className={`grid size-9 place-items-center rounded-lg border border-dashed text-[0.6rem] font-bold tracking-wider ${
              onDark ? 'border-white/35 text-white/70' : 'border-graphite/35 text-graphite/60'
            }`}
          >
            LOGO
          </span>
          <span
            className={`font-display text-[1.05rem] leading-none font-semibold tracking-tight ${
              onDark ? 'text-white' : 'text-graphite'
            }`}
          >
            {siteConfig.name}
          </span>
        </>
      )}
    </Link>
  )
}
