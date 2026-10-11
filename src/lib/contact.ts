import { contactMessages } from '../config/commercial'
import { siteConfig } from '../config/site'

/**
 * Valida um número de WhatsApp no formato internacional (somente dígitos).
 * Aceita números brasileiros com DDI 55 (12 ou 13 dígitos) ou outros
 * DDIs com 10 a 15 dígitos.
 */
export function normalizeWhatsapp(raw: string | undefined): string | null {
  const digits = (raw ?? '').replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return null
  if (digits.startsWith('55') && digits.length !== 12 && digits.length !== 13) return null
  return digits
}

export function buildWhatsAppLink(number: string | undefined, message?: string): string | null {
  const digits = normalizeWhatsapp(number)
  if (!digits) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

/** Telefone no formato internacional (+55DDNNNNNNNN), ou `null` se incompleto. */
export function normalizePhone(raw: string | undefined): string | null {
  const digits = (raw ?? '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  return digits.length === 10 || digits.length === 11 ? `+55${digits}` : null
}

/** Link `tel:` do telefone configurado, ou `null` se incompleto. */
export function phoneHref(raw: string | undefined): string | null {
  const phone = normalizePhone(raw)
  return phone ? `tel:${phone}` : null
}

export type ContactKind = 'whatsapp' | 'phone' | 'email' | 'section'

export interface ContactAction {
  kind: ContactKind
  href: string
  external: boolean
}

/**
 * Define a melhor ação de contato disponível, nesta ordem:
 * WhatsApp → telefone → e-mail → seção de contato do site.
 * Nunca gera link para um número que não tenha sido configurado.
 */
export function resolveContactAction(
  message: string = contactMessages.general,
  contact: Pick<typeof siteConfig.contact, 'whatsapp' | 'phone' | 'email'> = siteConfig.contact,
): ContactAction {
  const whatsapp = buildWhatsAppLink(contact.whatsapp, message)
  if (whatsapp) return { kind: 'whatsapp', href: whatsapp, external: true }

  const phone = phoneHref(contact.phone)
  if (phone) return { kind: 'phone', href: phone, external: false }

  if (contact.email.includes('@')) {
    const params = `?subject=${encodeURIComponent('Contato pelo site')}&body=${encodeURIComponent(message)}`
    return { kind: 'email', href: `mailto:${contact.email}${params}`, external: false }
  }

  return { kind: 'section', href: '/#contato', external: false }
}

export function formatAddress(address: typeof siteConfig.contact.address): string {
  const cityState = [address.city, address.state].filter(Boolean).join(' - ')
  return [address.street, address.district, cityState, address.zip && `CEP ${address.zip}`]
    .filter(Boolean)
    .join(', ')
}
