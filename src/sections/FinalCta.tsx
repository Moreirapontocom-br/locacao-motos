import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ContactButton } from '../components/ui/ContactButton'
import { DemoNotice, Pending } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SmartImage } from '../components/ui/SmartImage'
import { finalCta } from '../config/content'
import { siteConfig } from '../config/site'
import { InterestFormDisclosure } from '../components/contact/InterestForm'
import { formatAddress, phoneHref } from '../lib/contact'
import { contactActionFor, trackContactClick, type ContactContext } from '../lib/whatsapp'

const context: ContactContext = { origin: 'home-contact' }

export function FinalCta() {
  const { contact } = siteConfig
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
  ]

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="section-y">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-graphite px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 lg:block">
            <SmartImage
              image={finalCta.image}
              tone="dark"
              sizes="50vw"
              className="h-full"
              imgClassName="opacity-60"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/70 to-transparent" />
          </div>

          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-accent uppercase">
              <span aria-hidden className="h-px w-6 bg-current" />
              {finalCta.eyebrow}
            </p>
            <h2 id="contato-titulo" className="text-3xl leading-[1.1] font-semibold text-white sm:text-4xl lg:text-5xl">
              {finalCta.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-dark">{finalCta.description}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ContactButton size="lg" context={context} label="Quero alugar uma moto" />
              <Button to="/motos" variant="outline-light" size="lg">
                Conhecer as motos
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

          <dl className="mt-12 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:max-w-2xl">
            {channels.map((c) => (
              <div key={c.label} className="flex gap-3 text-sm">
                <c.icon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-accent" />
                <div>
                  <dt className="font-semibold text-white">{c.label}</dt>
                  <dd className="mt-0.5 text-muted-dark">{c.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
