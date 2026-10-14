import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ContactIconButton } from '../ui/ContactButton'

/**
 * Atalho de contato fixo no canto da tela. Aparece após a primeira dobra e
 * fica oculto na página de detalhes (que já tem barra de contato própria).
 */
export function FloatingContact() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const hidden = pathname.startsWith('/motos/')

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && !hidden && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
        >
          <ContactIconButton
            context={{ origin: 'floating' }}
            label="Falar pelo WhatsApp"
            className="size-14 bg-accent text-xl text-graphite shadow-float hover:bg-accent-soft hover:shadow-accent active:bg-accent-strong"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
