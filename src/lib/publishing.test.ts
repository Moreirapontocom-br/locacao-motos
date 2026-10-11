import { describe, expect, it } from 'vitest'
import { motorcycles } from '../config/motorcycles'
import { siteConfig, type SiteConfig } from '../config/site'
import type { Motorcycle } from '../types'
import { normalizePhone, phoneHref } from './contact'
import { fleetPhoto } from './images'
import {
  buildOrganizationJsonLd,
  buildRobots,
  buildSitemap,
  pendingData,
  shareImageUrl,
  sitemapPaths,
} from './publishing'

const official: SiteConfig = {
  ...siteConfig,
  name: 'Empresa Teste',
  url: 'https://www.exemplo.com.br',
  logo: { src: '/logo.svg', alt: 'Empresa Teste' },
  contact: {
    ...siteConfig.contact,
    whatsapp: '5511900000000',
    phone: '1130000000',
    email: 'contato@exemplo.com.br',
    address: { street: 'Rua A, 1', district: 'Centro', city: 'São Paulo', state: 'SP', zip: '01000-000' },
    openingHours: ['Segunda a sexta, 8h às 18h'],
  },
  social: [{ network: 'instagram', label: 'Instagram', url: 'https://instagram.com/exemplo' }],
  legal: { ...siteConfig.legal, companyName: 'Empresa Teste Ltda', cnpj: '00.000.000/0001-00' },
}

const realMoto: Motorcycle = {
  ...motorcycles[0],
  demo: false,
  slug: 'moto-real',
  images: [fleetPhoto('moto-real.jpg', 'Moto real')],
}

describe('dados pendentes', () => {
  it('lista tudo o que falta enquanto a configuração é provisória', () => {
    const pending = pendingData(siteConfig, motorcycles)
    expect(pending).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Nome comercial'),
        expect.stringContaining('WhatsApp'),
        expect.stringContaining('Frota oficial'),
        expect.stringContaining('Fotografias oficiais'),
      ]),
    )
  })

  it('fica vazia com todos os dados oficiais e frota real', () => {
    expect(pendingData(official, [realMoto])).toEqual([])
  })
})

describe('robots.txt e sitemap', () => {
  it('sem domínio oficial, bloqueia indexação e não gera sitemap', () => {
    expect(buildRobots(siteConfig)).toContain('Disallow: /')
    expect(buildSitemap(siteConfig, motorcycles)).toBeNull()
  })

  it('com domínio, libera indexação e aponta o sitemap', () => {
    const robots = buildRobots(official)
    expect(robots).toContain('Allow: /')
    expect(robots).toContain('Sitemap: https://www.exemplo.com.br/sitemap.xml')
  })

  it('sitemap não inclui motos de exemplo', () => {
    expect(sitemapPaths([...motorcycles, realMoto])).toEqual(['/', '/motos', '/motos/moto-real'])
    expect(buildSitemap(official, [realMoto])).toContain('<loc>https://www.exemplo.com.br/motos/moto-real</loc>')
  })
})

describe('dados estruturados', () => {
  it('não publica nada com nome ou domínio provisórios', () => {
    expect(buildOrganizationJsonLd(siteConfig)).toBeNull()
    expect(buildOrganizationJsonLd({ ...official, url: '' })).toBeNull()
  })

  it('omite telefone e endereço não informados', () => {
    const data = buildOrganizationJsonLd({
      ...official,
      contact: { ...official.contact, phone: '', address: { ...siteConfig.contact.address } },
    })!
    expect(data.name).toBe('Empresa Teste')
    expect(data).not.toHaveProperty('telephone')
    expect(data).not.toHaveProperty('address')
  })

  it('inclui os dados confirmados', () => {
    const data = buildOrganizationJsonLd(official)!
    expect(data.telephone).toBe('+551130000000')
    expect(data.address).toMatchObject({ addressLocality: 'São Paulo', addressRegion: 'SP' })
    expect(data.sameAs).toEqual(['https://instagram.com/exemplo'])
    expect(data.logo).toBe('https://www.exemplo.com.br/logo.svg')
  })
})

describe('compartilhamento e telefone', () => {
  it('imagem de compartilhamento só com foto oficial e URL absoluta', () => {
    expect(shareImageUrl(official, motorcycles[0].images[0])).toBeUndefined()
    expect(shareImageUrl(official, realMoto.images[0])).toBe('https://www.exemplo.com.br/images/frota/moto-real.jpg')
    expect(shareImageUrl(siteConfig, realMoto.images[0])).toBeUndefined()
  })

  it('telefone: aceita com ou sem DDI e rejeita incompletos', () => {
    expect(normalizePhone('(11) 3000-0000')).toBe('+551130000000')
    expect(normalizePhone('55 11 99999-0000')).toBe('+5511999990000')
    expect(normalizePhone('3000-0000')).toBeNull()
    expect(phoneHref('')).toBeNull()
  })
})
