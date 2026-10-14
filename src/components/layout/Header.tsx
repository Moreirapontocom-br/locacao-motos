import { ArrowUpRight, Bike, Menu, X } from 'lucide-react'
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
  // Cabeçalho compacto durante a rolagem (altura definida pelos tokens --header-h*).
  const compact = scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out-soft ${
        solid
          ? 'border-b border-white/[0.08] bg-graphite/[0.92] shadow-[0_8px_24px_-16px_rgb(0_0_0/0.6)] backdrop-blur-xl'
          : 'border-b border-transparent bg-gradient-to-b from-graphite/70 to-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-graphite"
      >
        Pular para o conteúdo
      </a>
      <div
        className={`container-page flex items-center justify-between gap-6 transition-[height] duration-300 ease-out-soft ${
          compact ? 'h-(--header-h-compact)' : 'h-(--header-h)'
        }`}
      >
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const active = isActive(item.to)
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => scrollIfSameTarget(item.to, location.pathname, location.hash)}
                    aria-current={active ? 'page' : undefined}
                    className={`group/nav relative inline-flex h-10 items-center rounded-control px-4 text-sm font-medium transition-colors ${
                      active ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {/* Indicador: aparece no item ativo e, discretamente, no hover. */}
                    <span
                      aria-hidden
                      className={`absolute inset-x-4 bottom-1 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ease-out-soft ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ContactButton size="sm" context={{ origin: 'header' }} label="Contato" className="px-5" />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className={`grid size-11 place-items-center rounded-control text-white ring-1 transition-colors lg:hidden ${
              open ? 'bg-white/10 ring-white/20' : 'ring-white/15 hover:bg-white/10'
            }`}
          >
            {open ? <X aria-hidden className="size-5.5" /> : <Menu aria-hidden className="size-5.5" />}
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
            className={`overflow-y-auto border-t border-white/[0.08] bg-graphite lg:hidden ${
              compact ? 'h-[calc(100dvh-var(--header-h-compact))]' : 'h-[calc(100dvh-var(--header-h))]'
            }`}
          >
            <nav aria-label="Menu móvel" className="container-page flex h-full flex-col py-6">
              <ul className="flex flex-col">
                {navigation.map((item, i) => {
                  const active = isActive(item.to)
                  return (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i + 0.05 }}
                    >
                      <Link
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => {
                          scrollIfSameTarget(item.to, location.pathname, location.hash)
                          setOpen(false)
                        }}
                        className="group/item flex items-center justify-between gap-4 border-b border-white/[0.08] py-5 font-display text-2xl font-semibold tracking-[-0.02em] text-white transition-colors hover:text-accent"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className={`h-5 w-0.5 rounded-full transition-colors ${active ? 'bg-accent' : 'bg-white/15'}`}
                          />
                          {item.label}
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-5 text-white/35 transition-[color,transform] duration-300 group-hover/item:translate-x-0.5 group-hover/item:text-accent"
                        />
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
              <Link
                to="/motos"
                className="mt-8 flex min-h-14 items-center justify-center gap-2 rounded-control bg-white/[0.04] text-sm font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
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
