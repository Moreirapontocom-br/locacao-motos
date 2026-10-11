import { Camera, Clock, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { DemoBadge, DemoNotice, Pending } from '../components/ui/DemoNotice'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SmartImage } from '../components/ui/SmartImage'
import { about } from '../config/content'
import { siteConfig } from '../config/site'
import { formatAddress } from '../lib/contact'
import type { ImageAsset } from '../types'

function InfoRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-4">
      <Icon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-accent-ink" />
      <div className="grid min-w-0 flex-1 gap-0.5 text-sm sm:grid-cols-[10rem_1fr] sm:gap-4">
        <dt className="font-semibold text-graphite">{label}</dt>
        <dd className="break-words text-muted">{children}</dd>
      </div>
    </div>
  )
}

/**
 * Espaço de foto da empresa. Com imagem: exibe a foto (com selo se for
 * ilustrativa). Sem imagem: um quadro grafite discreto indicando a foto oficial esperada.
 */
function PhotoSlot({ photo, className, sizes }: { photo: ImageAsset; className: string; sizes: string }) {
  if (photo.src) {
    return (
      <div className={`group/photo relative overflow-hidden ${className}`}>
        <SmartImage
          image={photo}
          sizes={sizes}
          className="h-full"
          imgClassName="transition-transform duration-[1200ms] ease-out-soft group-hover/photo:scale-[1.03]"
        />
        {photo.illustrative && <DemoBadge label="Imagem ilustrativa" className="absolute top-4 left-4" />}
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`Espaço reservado para foto oficial: ${photo.alt}`}
      className={`relative flex flex-col justify-end overflow-hidden bg-graphite p-3 sm:p-5 ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(115deg,#fff_0,#fff_1px,transparent_1px,transparent_22px)]"
      />
      <span
        aria-hidden
        className="absolute top-3 right-3 grid size-8 place-items-center rounded-full border border-accent/50 text-accent sm:top-4 sm:right-4 sm:size-10"
      >
        <Camera className="size-4" strokeWidth={1.75} />
      </span>
      <p className="relative text-[0.6rem] font-semibold tracking-[0.16em] text-muted-dark uppercase sm:text-[0.68rem]">
        Foto oficial
      </p>
      <p className="relative mt-0.5 font-display text-xs leading-snug font-medium text-white sm:text-base">{photo.alt}</p>
    </div>
  )
}

export function About() {
  const { contact } = siteConfig
  const address = formatAddress(contact.address)
  const [main, ...others] = about.photos
  const [lead, ...rest] = about.paragraphs

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="section-y">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {/* Foto principal vertical com as fotos oficiais "por chegar" sobrepostas. */}
        <Reveal className="relative mx-auto w-full max-w-lg pr-[16%] pb-[10%] lg:max-w-none">
          <PhotoSlot photo={main} className="aspect-[4/5] rounded-card" sizes="(min-width: 1024px) 460px, 85vw" />
          {others[0] && (
            <div className="absolute top-[10%] right-0 w-[34%]">
              <PhotoSlot photo={others[0]} className="aspect-[4/5] rounded-2xl ring-[6px] ring-ice" sizes="180px" />
            </div>
          )}
          {others[1] && (
            <div className="absolute right-[4%] bottom-0 w-[40%]">
              <PhotoSlot photo={others[1]} className="aspect-square rounded-2xl ring-[6px] ring-ice" sizes="220px" />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <SectionHeading id="sobre-titulo" eyebrow={about.eyebrow} title={about.title} />
          <p className="mt-7 border-l-2 border-accent pl-5 font-display text-xl leading-snug font-medium text-graphite sm:text-2xl">
            {lead}
          </p>
          {rest.map((p) => (
            <p key={p} className="mt-6 text-base leading-relaxed text-muted sm:text-[1.05rem]">
              {p}
            </p>
          ))}

          <ul aria-label="O que orienta o nosso trabalho" className="mt-7 flex flex-wrap gap-2">
            {about.values.map((value) => (
              <li
                key={value}
                className="rounded-full border border-graphite/12 bg-white px-3.5 py-1.5 text-sm font-medium text-graphite/80"
              >
                {value}
              </li>
            ))}
          </ul>

          {about.facts.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {about.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="mt-1 font-display text-xl font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <dl className="mt-8 divide-y divide-graphite/10 border-y border-graphite/10">
            <InfoRow icon={MapPin} label="Localização">
              {address && contact.mapsUrl ? (
                <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                  {address}
                </a>
              ) : (
                <Pending value={address} fallback="Endereço a informar" />
              )}
            </InfoRow>
            <InfoRow icon={Clock} label="Atendimento">
              {contact.openingHours.length > 0 ? (
                contact.openingHours.map((h) => <span key={h} className="block">{h}</span>)
              ) : (
                <Pending fallback="Horário a informar" />
              )}
            </InfoRow>
            <InfoRow icon={Phone} label="Telefone">
              <Pending value={contact.phoneDisplay || contact.phone} />
            </InfoRow>
            <InfoRow icon={Mail} label="E-mail">
              <Pending value={contact.email} />
            </InfoRow>
          </dl>

          <DemoNotice className="mt-6">
            História, fotos e dados de contato da empresa ainda serão informados. A foto principal é ilustrativa.
          </DemoNotice>
        </Reveal>
      </div>
    </section>
  )
}
