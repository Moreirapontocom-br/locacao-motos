import { Bike, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigation } from '../../config/content'
import { ContactButton } from '../ui/ContactButton'
import { Logo } from './Logo'

function useIsActive() {
  const { pathname, hash } = useLocation()
  return (to: string) => {
    const [path, anchor] = to.split('#')
    if (anchor) return pathname === (path || '/') && hash === `#${anchor}`
    return pathname === to || pathname.startsWith(`${to}/`)
  }
}

/** Ao clicar em um link de âncora já ativo, a URL não muda — rola manualmente. */
function scrollIfSameTarget(to: string, pathname: string, hash: string) {
  const [path, anchor] = to.split('#')
  if (anchor && pathname === (path || '/') && hash === `#${anchor}`) {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isActive = useIsActive()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha o menu ao navegar (inclusive voltar/avançar do navegador).
  const [lastKey, setLastKey] = useState(location.key)
  if (location.key !== lastKey) {
    setLastKey(location.key)
    setOpen(false)
  }

  // Trava a rolagem e permite fechar com Esc quando o menu móvel está aberto.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid ? 'border-b border-white/10 bg-graphite/90 backdrop-blur-lg' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-graphite"
      >
        Pular para o conteúdo
      </a>
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => scrollIfSameTarget(item.to, location.pathname, location.hash)}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.to) ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ContactButton size="sm" context={{ origin: 'header' }} label="Contato" />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 bg-graphite lg:hidden"
          >
            <nav aria-label="Menu móvel" className="container-page flex h-full flex-col py-8">
              <ul className="flex flex-col">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => {
                        scrollIfSameTarget(item.to, location.pathname, location.hash)
                        setOpen(false)
                      }}
                      className="flex items-center justify-between border-b border-white/10 py-5 font-display text-2xl font-medium text-white"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link
                to="/motos"
                className="mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-white/5 text-sm font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
              >
                <Bike aria-hidden className="size-4.5 text-accent" />
                Conhecer as motos
              </Link>
              <div className="mt-auto pt-8">
                <ContactButton size="lg" className="w-full" context={{ origin: 'menu' }} label="Falar pelo WhatsApp" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
