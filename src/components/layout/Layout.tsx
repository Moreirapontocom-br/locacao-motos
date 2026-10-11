import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ContactDialogProvider } from '../contact/ContactDialog'
import { FloatingContact } from '../contact/FloatingContact'
import { Footer } from './Footer'
import { Header } from './Header'

/** Rola até a âncora (#secao) ou para o topo ao trocar de página. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <ContactDialogProvider>
        <ScrollManager />
        <Header />
        <main id="conteudo" className="min-h-[60vh]">
          <Outlet />
        </main>
        <Footer />
        <FloatingContact />
      </ContactDialogProvider>
    </MotionConfig>
  )
}
