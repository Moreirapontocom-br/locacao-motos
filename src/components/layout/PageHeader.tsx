import type { ReactNode } from 'react'

/** Faixa escura de abertura das páginas internas (mantém o cabeçalho legível). */
export function PageHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-graphite pt-28 pb-12 sm:pt-32 sm:pb-16 ${className}`}>
      <div className="container-page">{children}</div>
    </div>
  )
}
