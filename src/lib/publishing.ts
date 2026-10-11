/**
 * PREPARAÇÃO PARA PUBLICAÇÃO
 * ------------------------------------------------------------------
 * Funções puras usadas no build (vite.config.ts) e nos testes:
 *  - lista de dados oficiais ainda pendentes;
 *  - robots.txt e sitemap.xml conforme o ambiente;
 *  - dados estruturados (JSON-LD) SOMENTE com informações confirmadas.
 *
 * Nada aqui inventa dados: campo vazio = campo omitido.
 */
import type { SiteConfig } from '../config/site'
import type { Motorcycle } from '../types'
import { formatAddress, normalizePhone, normalizeWhatsapp } from './contact'

/** Nome provisório de `siteConfig.name`. Enquanto estiver assim, o nome não é publicado em dados estruturados. */
export const PLACEHOLDER_NAME = 'Nome da Empresa'

export const isPlaceholderName = (name: string) => !name.trim() || name.trim() === PLACEHOLDER_NAME

const absoluteUrl = (base: string, path: string) => (/^https?:\/\//.test(path) ? path : base + path)

/** Dados oficiais que ainda faltam. Lista vazia = nada pendente. */
export function pendingData(site: SiteConfig, motos: Motorcycle[]): string[] {
  const { contact, legal } = site
  const pending: string[] = []
  if (isPlaceholderName(site.name)) pending.push('Nome comercial (siteConfig.name)')
  if (!site.logo.src) pending.push('Logotipo (siteConfig.logo.src)')
  if (!site.url) pending.push('Domínio oficial (siteConfig.url)')
  if (!normalizeWhatsapp(contact.whatsapp)) pending.push('WhatsApp comercial (siteConfig.contact.whatsapp)')
  if (!normalizePhone(contact.phone)) pending.push('Telefone (siteConfig.contact.phone)')
  if (!contact.email) pending.push('E-mail (siteConfig.contact.email)')
  if (!formatAddress(contact.address)) pending.push('Endereço (siteConfig.contact.address)')
  if (contact.openingHours.length === 0) pending.push('Horário de atendimento (siteConfig.contact.openingHours)')
  if (!site.social.some((s) => s.url)) pending.push('Redes sociais (siteConfig.social)')
  if (!legal.companyName || !legal.cnpj) pending.push('Razão social e CNPJ (siteConfig.legal)')

  const real = motos.filter((m) => !m.demo)
  if (real.length === 0) pending.push('Frota oficial: todas as motos são exemplos (demo: true)')
  else if (real.length < motos.length) pending.push('Frota: ainda há motos de exemplo misturadas às reais')
  if (motos.some((m) => m.images.some((img) => img.illustrative)))
    pending.push('Fotografias oficiais: há motos com fotos ilustrativas')
  return pending
}

/**
 * robots.txt conforme o ambiente: só libera a indexação quando há domínio
 * oficial configurado. Sem domínio (demonstração/homologação), bloqueia tudo.
 */
export function buildRobots(site: Pick<SiteConfig, 'url'>): string {
  if (!site.url) {
    return ['# Sem dominio oficial (siteConfig.url vazio): indexacao bloqueada.', 'User-agent: *', 'Disallow: /', ''].join('\n')
  }
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${site.url}/sitemap.xml`, ''].join('\n')
}

/** Rotas públicas indexáveis. Motos de exemplo ficam de fora. */
export function sitemapPaths(motos: Motorcycle[]): string[] {
  return ['/', '/motos', ...motos.filter((m) => !m.demo).map((m) => `/motos/${m.slug}`)]
}

/** sitemap.xml, ou `null` quando não há domínio oficial. */
export function buildSitemap(site: Pick<SiteConfig, 'url'>, motos: Motorcycle[]): string | null {
  if (!site.url) return null
  const urls = sitemapPaths(motos).map((path) => `  <url><loc>${site.url}${path}</loc></url>`)
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n')
}

/**
 * Dados estruturados (schema.org) da empresa. Retorna `null` enquanto nome
 * ou domínio não forem oficiais. Telefone, endereço, horário e redes só
 * entram quando preenchidos — nunca com valores fictícios.
 */
export function buildOrganizationJsonLd(site: SiteConfig): Record<string, unknown> | null {
  if (isPlaceholderName(site.name) || !site.url) return null
  const { contact } = site
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: site.description,
    url: site.url,
  }
  if (site.logo.src) data.logo = absoluteUrl(site.url, site.logo.src)
  const phone = normalizePhone(contact.phone)
  if (phone) data.telephone = phone
  if (contact.email) data.email = contact.email
  const { street, district, city, state, zip } = contact.address
  if (street && city) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: [street, district].filter(Boolean).join(', '),
      addressLocality: city,
      ...(state && { addressRegion: state }),
      ...(zip && { postalCode: zip }),
      addressCountry: 'BR',
    }
  }
  if (contact.mapsUrl) data.hasMap = contact.mapsUrl
  const sameAs = site.social.map((s) => s.url).filter(Boolean)
  if (sameAs.length > 0) data.sameAs = sameAs
  return data
}

/** Imagem de compartilhamento: só fotos oficiais (não ilustrativas), com URL absoluta. */
export function shareImageUrl(site: Pick<SiteConfig, 'url'>, image?: { src: string; illustrative?: boolean }) {
  if (!image?.src || image.illustrative) return undefined
  if (/^https?:\/\//.test(image.src)) return image.src
  return site.url ? site.url + image.src : undefined
}
