import { describe, expect, it } from 'vitest'
import { motorcycles } from '../config/motorcycles'
import type { Motorcycle } from '../types'
import { buildWhatsAppLink, normalizeWhatsapp, resolveContactAction } from './contact'
import { fleetPhoto } from './images'
import {
  commercialHint,
  filterMotorcycles,
  formatDisplacement,
  motorcycleInterestMessage,
  parseStyleFilter,
  relatedMotorcycles,
  styleFilterOptions,
  technicalSheet,
} from './motorcycles'

describe('catálogo de motos', () => {
  it('interpreta o estilo vindo da URL', () => {
    expect(parseStyleFilter('naked')).toBe('naked')
    expect(parseStyleFilter('carros')).toBe('todas')
    expect(parseStyleFilter(null)).toBe('todas')
  })

  it('filtra por estilo', () => {
    expect(filterMotorcycles(motorcycles, 'todas')).toHaveLength(motorcycles.length)
    expect(filterMotorcycles(motorcycles, 'street').every((m) => m.style === 'street')).toBe(true)
  })

  it('só oferece filtros para estilos existentes e esconde o filtro com um único estilo', () => {
    const options = styleFilterOptions(motorcycles)
    const styles = new Set(motorcycles.map((m) => m.style))
    expect(options.slice(1).map((o) => o.value).sort()).toEqual([...styles].sort())
    expect(styleFilterOptions(motorcycles.filter((m) => m.style === 'street'))).toEqual([])
  })

  it('sugere outras motos sem repetir a atual, priorizando o mesmo estilo', () => {
    const street = motorcycles.find((m) => m.style === 'street')!
    const related = relatedMotorcycles(motorcycles, street)
    expect(related.some((m) => m.slug === street.slug)).toBe(false)
    expect(related[0].style).toBe('street')
  })

  it('recomendações: no máximo três, sem indisponíveis nem modelos duplicados', () => {
    const [base, ...rest] = motorcycles
    const copy: Motorcycle = { ...rest[0], slug: 'copia' }
    const off: Motorcycle = { ...rest[1], slug: 'indisponivel', name: 'Outra', unavailable: true }
    const sameAsCurrent: Motorcycle = { ...base, slug: 'mesmo-modelo' }
    const related = relatedMotorcycles([base, sameAsCurrent, rest[0], copy, off, ...rest.slice(2)], base)
    expect(related.length).toBeLessThanOrEqual(3)
    expect(related.map((m) => m.slug)).not.toContain('copia')
    expect(related.map((m) => m.slug)).not.toContain('indisponivel')
    expect(related.map((m) => m.slug)).not.toContain('mesmo-modelo')
  })

  it('mensagem do WhatsApp usa o nome da moto (com fabricante, se houver)', () => {
    const demo = motorcycles[0]
    expect(motorcycleInterestMessage(demo)).toBe(
      `Olá! Tenho interesse na locação da moto ${demo.name}. Gostaria de receber mais informações.`,
    )
    expect(motorcycleInterestMessage({ ...demo, brand: 'Marca' })).toContain(`da moto Marca ${demo.name}.`)
  })

  it('ficha técnica só inclui fabricante e transmissão quando informados', () => {
    const demo: Motorcycle = { ...motorcycles[0], brand: undefined, transmission: undefined }
    const labels = technicalSheet(demo).map((s) => s.label)
    expect(labels).not.toContain('Fabricante')
    expect(labels).not.toContain('Transmissão')
    expect(technicalSheet({ ...demo, brand: 'Marca', transmission: 'Manual' })).toEqual(
      expect.arrayContaining([
        { label: 'Fabricante', value: 'Marca' },
        { label: 'Transmissão', value: 'Manual' },
      ]),
    )
  })

  it('frota da Fase 11: 4 motos Honda, com as CG 160 Start e Fan primeiro', () => {
    expect(motorcycles).toHaveLength(4)
    expect(motorcycles.every((m) => m.brand === 'Honda')).toBe(true)
    expect(motorcycles.slice(0, 2).map((m) => m.name)).toEqual(['Honda CG 160 Start', 'Honda CG 160 Fan'])
  })

  it('cilindrada no formato brasileiro', () => {
    expect(formatDisplacement(162.7)).toBe('162,7 cc')
    expect(formatDisplacement(300)).toBe('300 cc')
  })

  it('não possui slugs duplicados', () => {
    const slugs = motorcycles.map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('nunca inventa condições: sem dados mostra "sob consulta"', () => {
    const demo = motorcycles[0]
    expect(commercialHint(demo)).toBe('Condições sob consulta')
    const withPrice: Motorcycle = { ...demo, prices: [{ label: 'Semanal', value: 'R$ X' }] }
    expect(commercialHint(withPrice)).toBe('Semanal: R$ X')
  })

  it('ficha técnica só mostra ano quando informado', () => {
    const demo = motorcycles[0]
    expect(technicalSheet(demo).some((s) => s.label === 'Ano')).toBe(false)
    expect(technicalSheet({ ...demo, year: 2024 })).toContainEqual({ label: 'Ano', value: '2024' })
  })
})

describe('fotos oficiais', () => {
  it('fleetPhoto aponta para public/images/frota e não é marcada como ilustrativa', () => {
    const photo = fleetPhoto('cg-160-frente.jpg', 'Moto vista de frente')
    expect(photo).toEqual({ src: '/images/frota/cg-160-frente.jpg', alt: 'Moto vista de frente' })
  })
})

describe('contato', () => {
  it('não gera link de WhatsApp sem número válido', () => {
    expect(buildWhatsAppLink('')).toBeNull()
    expect(buildWhatsAppLink('123')).toBeNull()
    expect(normalizeWhatsapp('55 (11) 9999')).toBeNull()
  })

  it('gera link wa.me com mensagem codificada', () => {
    expect(buildWhatsAppLink('+55 (11) 90000-0000', 'Olá & tchau')).toBe(
      'https://wa.me/5511900000000?text=Ol%C3%A1%20%26%20tchau',
    )
  })

  it('usa canais alternativos quando o WhatsApp não está configurado', () => {
    expect(resolveContactAction('oi', { whatsapp: '', phone: '', email: '' })).toEqual({
      kind: 'section',
      href: '/#contato',
      external: false,
    })
    expect(resolveContactAction('oi', { whatsapp: '', phone: '', email: 'a@b.com' }).kind).toBe('email')
    expect(resolveContactAction('oi', { whatsapp: '', phone: '1130000000', email: '' }).href).toBe('tel:+551130000000')
  })

  it('com WhatsApp configurado, abre a conversa com a mensagem da moto', () => {
    const message = motorcycleInterestMessage(motorcycles[0])
    const action = resolveContactAction(message, { whatsapp: '5511900000000', phone: '', email: '' })
    expect(action.kind).toBe('whatsapp')
    expect(action.href).toBe(`https://wa.me/5511900000000?text=${encodeURIComponent(message)}`)
  })
})
