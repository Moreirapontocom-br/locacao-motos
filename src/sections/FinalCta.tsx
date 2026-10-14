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
        <Reveal className="relative isolate overflow-hidden rounded-panel bg-graphite px-6 py-14 shadow-card-hover sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 lg:block">
            <SmartImage
              image={finalCta.image}
              tone="dark"
              sizes="50vw"
              className="h-full"
              imgClassName="opacity-75"
            />
            <div aria-hidden className="scrim-left absolute inset-0" />
          </div>

          <div className="max-w-xl">
            <p className="eyebrow mb-5 text-accent">
              <span aria-hidden className="h-0.5 w-7 rounded-full bg-current" />
              {finalCta.eyebrow}
            </p>
            <h2 id="contato-titulo" className="text-h2 text-white uppercase">
              {finalCta.title}
            </h2>
            <p className="mt-5 text-lead text-muted-dark">{finalCta.description}</p>

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

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ContactButton size="lg" context={context} label="Solicitar informações pelo WhatsApp" />
              <Button to="/motos" variant="outline-light" size="lg">
                Ver todas as motos
                <ArrowRight aria-hidden className="size-4" />
              </Button>
            </div>

            {/* Qualificação opcional, recolhida: o contato direto continua a um clique. */}
            <InterestFormDisclosure origin="home-contact" tone="dark" className="mt-4 max-w-md sm:[&>button]:justify-start" />

            {!whatsapp && (
              <DemoNotice tone="dark" className="mt-6">
                Demonstração: o WhatsApp oficial ainda não foi configurado. O botão mostra a mensagem que será enviada assim que o número for informado.
              </DemoNotice>
            )}
          </div>

          <div className="mt-12 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:max-w-2xl">
            {channels.map((c) => (
              <div key={c.label} className="flex gap-3 text-sm">
                <c.icon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-accent" />
                <dl>
                  <dt className="font-semibold text-white">{c.label}</dt>
                  <dd className="mt-0.5 text-muted-dark">{c.value}</dd>
                </dl>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
