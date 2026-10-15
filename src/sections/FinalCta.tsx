import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoNotice, Pending } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SmartImage } from '../components/ui/SmartImage'
import { finalCta } from '../config/content'
import { siteConfig } from '../config/site'
import { useModalityChoice } from '../components/contact/modalityContext'
import { InterestFormDisclosure } from '../components/contact/InterestForm'
import { formatAddress, phoneHref } from '../lib/contact'
import { contactActionFor, trackContactClick, type ContactContext } from '../lib/whatsapp'

export function FinalCta() {
  const { contact } = siteConfig
  const { modality, setModality } = useModalityChoice()
  // Com modalidade escolhida na página, a mensagem a leva junto; senão, não inventa preferência.
  const context: ContactContext = { origin: 'home-contact', modality }
  const action = contactActionFor(context)
  const whatsapp = action.kind === 'whatsapp' ? action.href : null
  const address = formatAddress(contact.address)
  const phone = phoneHref(contact.phone)

  const channels = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContactClick(context, action)}
          className="hover:text-white"
        >
          Iniciar conversa
        </a>
      ) : (
        <Pending fallback="Número a configurar" />
      ),
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: phone ? (
        <a href={phone} className="hover:text-white">
          {contact.phoneDisplay || contact.phone}
        </a>
      ) : (
        <Pending />
      ),
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: contact.email ? (
        <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
          {contact.email}
        </a>
      ) : (
        <Pending />
      ),
    },
    { icon: MapPin, label: 'Endereço', value: <Pending value={address} /> },
    {
      icon: Clock,
      label: 'Atendimento',
      value:
        contact.openingHours.length > 0 ? (
          contact.openingHours.map((h) => (
            <span key={h} className="block">
              {h}
            </span>
          ))
        ) : (
          <Pending fallback="Horário a informar" />
        ),
    },
  ]

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="section-y">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-panel bg-graphite shadow-[var(--shadow-inset-line),var(--shadow-card-hover)]">
          {/* Foto ilustrativa: faixa no topo (celular) ou metade direita (desktop), fundida ao grafite. */}
          <div className="relative h-52 sm:h-64 lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:h-auto lg:w-[58%]">
            <SmartImage image={finalCta.image} tone="dark" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full" imgClassName="opacity-80" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-graphite to-transparent lg:hidden" />
            <div aria-hidden className="scrim-left absolute inset-0 hidden lg:block" />
          </div>

          <div className="px-6 pb-10 sm:px-12 sm:pb-14 lg:px-16 lg:py-20">
            <div className="max-w-xl">
              <p className="eyebrow mb-5 text-accent">
                <span aria-hidden className="h-0.5 w-7 rounded-full bg-current" />
                {finalCta.eyebrow}
              </p>
              <h2 id="contato-titulo" className="text-h2 text-white">
                {finalCta.title} <span className="text-accent">{finalCta.titleAccent}</span>
              </h2>
              <p className="mt-5 max-w-md text-lead text-muted-dark">{finalCta.description}</p>

              {modality && (
                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85" role="status">
                  <span>
                    Modalidade de interesse: <strong className="font-semibold text-white">{modality}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setModality(undefined)}
                    className="rounded-control px-1 font-semibold text-accent underline underline-offset-4 hover:text-accent-soft"
                  >
                    Remover
                  </button>
                </p>
              )}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ContactButton size="lg" className="shadow-accent" context={context} label="Solicitar informações pelo WhatsApp" />
                <Button to="/motos" variant="ghost-light" size="lg" className="sm:px-4">
                  Ver todas as motos
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </Button>
              </div>

              {/* Qualificação opcional, recolhida: o contato direto continua a um clique. */}
              <InterestFormDisclosure origin="home-contact" tone="dark" className="mt-3 max-w-md sm:[&>button]:justify-start" />

              {!whatsapp && (
                <DemoNotice tone="dark" className="mt-6">
                  Demonstração: o WhatsApp oficial ainda não foi configurado. O botão mostra a mensagem que será enviada assim que o número for informado.
                </DemoNotice>
              )}
            </div>

            {/* Canais em uma linha discreta: o botão acima é a ação principal. */}
            <div className="mt-12 grid gap-x-8 gap-y-5 border-t border-white/10 pt-8 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-3">
              {channels.map((c) => (
                <div key={c.label} className="flex gap-3 text-sm">
                  <c.icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  <dl>
                    <dt className="font-semibold text-white">{c.label}</dt>
                    <dd className="mt-0.5 text-muted-dark">{c.value}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
