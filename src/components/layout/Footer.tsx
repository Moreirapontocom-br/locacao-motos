import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { navigation } from '../../config/content'
import { siteConfig } from '../../config/site'
import { formatAddress, phoneHref } from '../../lib/contact'
import { contactActionFor, trackContactClick, type ContactContext } from '../../lib/whatsapp'
import { Pending } from '../ui/DemoNotice'
import { SocialIcon } from '../ui/SocialIcon'
import { Logo } from './Logo'

const year = new Date().getFullYear()

const footerLink =
  'inline-flex min-h-9 items-center rounded-control transition-colors duration-200 hover:text-white'


export function Footer() {
  const { contact, social, legal } = siteConfig
  const address = formatAddress(contact.address)
  const phone = phoneHref(contact.phone)
  const footerContext: ContactContext = { origin: 'footer' }
  const action = contactActionFor(footerContext)
  const whatsapp = action.kind === 'whatsapp' ? action.href : null
  const socialToShow = social.filter((s) => s.url || siteConfig.showDemoNotices)

  return (
    <footer className="relative bg-graphite text-muted-dark">
      {/* Linha de destaque: mesma assinatura das faixas de abertura das páginas. */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/70 via-white/10 to-transparent" />
      <div className="container-page grid gap-12 py-16 sm:py-20 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr] lg:gap-16 lg:py-24">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-6 text-[0.9375rem] leading-relaxed">{siteConfig.description}</p>
          {socialToShow.length > 0 && (
            <ul className="mt-6 flex gap-2" aria-label="Redes sociais">
              {socialToShow.map((s) => (
                <li key={s.network}>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (abre em nova aba)`}
                      className="grid size-11 place-items-center rounded-control bg-white/[0.04] text-white ring-1 ring-white/10 transition-colors hover:bg-accent hover:text-graphite hover:ring-accent"
                    >
                      <SocialIcon network={s.network} />
                    </a>
                  ) : (
                    <span
                      role="img"
                      title={`${s.label}: perfil a informar`}
                      aria-label={`${s.label}: perfil a informar`}
                      className="grid size-11 place-items-center rounded-control border border-dashed border-white/15 text-white/35"
                    >
                      <SocialIcon network={s.network} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Rodapé">
          <h2 className="eyebrow text-white">Navegação</h2>
          <ul className="mt-6 space-y-1 text-[0.9375rem]">
            <li>
              <Link to="/" className={footerLink}>
                Início
              </Link>
            </li>
            {navigation.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-white">Contato</h2>
          <ul className="mt-6 space-y-5 text-[0.9375rem]">
            <li className="flex gap-3">
              <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                {phone ? (
                  <a href={phone} className="hover:text-white">
                    {contact.phoneDisplay || contact.phone}
                  </a>
                ) : (
                  <Pending fallback="Telefone a informar" />
                )}
                {whatsapp && (
                  <>
                    {' · '}
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackContactClick(footerContext, action)}
                      className="hover:text-white"
                    >
                      WhatsApp
                    </a>
                  </>
                )}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                  {contact.email}
                </a>
              ) : (
                <Pending fallback="E-mail a informar" />
              )}
            </li>
            <li className="flex gap-3">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              <address className="not-italic">
                <Pending value={address} fallback="Endereço a informar" />
              </address>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs leading-relaxed sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} <Pending value={legal.companyName} fallback={siteConfig.name} />. Todos os direitos reservados.
            {' · '}CNPJ: <Pending value={legal.cnpj} />
          </p>
          {legal.links.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {legal.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
