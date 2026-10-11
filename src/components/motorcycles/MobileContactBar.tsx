import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type RefObject } from 'react'
import { commercialHint, motorcycleDisplayName } from '../../lib/motorcycles'
import type { Motorcycle } from '../../types'
import { ContactButton } from '../ui/ContactButton'

/**
 * Mostra a barra somente quando o botão principal não está na tela e o
 * rodapé ainda não apareceu — assim ela nunca duplica o CTA nem cobre o rodapé.
 */
function useStickyBar(ctaRef: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const cta = ctaRef.current
    const footer = document.querySelector('footer')
    if (!cta || typeof IntersectionObserver === 'undefined') return

    const seen = new Map<Element, boolean>()
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target, e.isIntersecting)
      setVisible(!(seen.get(cta) ?? true) && !(footer && seen.get(footer)))
    })
    observer.observe(cta)
    if (footer) observer.observe(footer)
    return () => observer.disconnect()
  }, [ctaRef])

  return visible
}

/** Barra fixa de contato no celular/tablet: o atendimento fica a um toque. */
export function MobileContactBar({ moto, ctaRef }: { moto: Motorcycle; ctaRef: RefObject<HTMLElement | null> }) {
  const visible = useStickyBar(ctaRef)
  const name = motorcycleDisplayName(moto)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Contato rápido"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-graphite/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
          <div className="container-page flex items-center gap-3 py-3">
            {/* Em telas muito estreitas, só o botão (largura total); o nome volta quando há espaço. */}
            <div className="hidden min-w-0 flex-1 min-[360px]:block">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted">{commercialHint(moto)}</p>
            </div>
            <ContactButton
              context={{ origin: 'detail-sticky', moto }}
              label="Consultar pelo WhatsApp"
              size="sm"
              className="h-11 w-full shrink-0 min-[360px]:w-auto"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
