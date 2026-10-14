import type { ReactNode } from 'react'

/**
 * Faixa escura de abertura das páginas internas: mantém o cabeçalho legível
 * e repete a linguagem dos banners (fundo grafite, linha de destaque discreta).
 */
export function PageHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden bg-graphite pt-32 pb-14 sm:pt-36 sm:pb-18 ${className}`}>
      {/* Luz suave no canto, só para dar profundidade ao fundo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-12rem] -z-10 size-[36rem] rounded-full bg-accent/[0.07] blur-3xl"
      />
      <div className="container-page">{children}</div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-accent/60 via-white/10 to-transparent" />
    </div>
  )
}
