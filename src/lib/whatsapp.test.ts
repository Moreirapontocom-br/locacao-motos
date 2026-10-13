import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { commercialConfig, contactMessages } from '../config/commercial'
import { motorcycles } from '../config/motorcycles'
import { siteConfig } from '../config/site'
import { clearTrackedEvents, getTrackedEvents, onConversionEvent, trackEvent } from './analytics'
import {
  buildContactMessage,
  contactActionFor,
  contactLabel,
  modalityOptions,
  openContactAction,
  trackContactClick,
} from './whatsapp'

const moto = motorcycles[0]
const withNumber = { ...siteConfig.contact, whatsapp: '5511900000000' }

describe('mensagens por contexto', () => {
  it('cada origem gera a mensagem certa', () => {
    expect(buildContactMessage({ origin: 'header' })).toBe(contactMessages.general)
    expect(buildContactMessage({ origin: 'catalog', moto })).toContain(`moto ${moto.name} no catálogo`)
    expect(buildContactMessage({ origin: 'detail', moto })).toContain(`interesse na locação da moto ${moto.name}.`)
    expect(buildContactMessage({ origin: 'modality', modality: 'Locação mensal' })).toContain('"Locação mensal"')
    expect(buildContactMessage({ origin: 'modality' })).toBe(contactMessages.modality())
    expect(buildContactMessage({ origin: 'faq' })).toBe(contactMessages.faq)
  })

  it('sem moto, os contextos de moto caem na mensagem geral (nunca "undefined")', () => {
    expect(buildContactMessage({ origin: 'catalog' })).toBe(contactMessages.general)
    expect(buildContactMessage({ origin: 'detail' })).toBe(contactMessages.general)
  })

  it('mensagens são curtas', () => {
    for (const origin of ['header', 'catalog', 'detail', 'modality', 'faq', 'catalog-help'] as const) {
      expect(buildContactMessage({ origin, moto }).length).toBeLessThan(160)
    }
  })

  it('formulário gera mensagem organizada com as escolhas', () => {
    const message = buildContactMessage({ origin: 'form', moto, modality: 'Locação mensal', purpose: 'trabalho' })
    expect(message.split('\n')).toEqual([
      contactMessages.formIntro,
      `• Moto: ${moto.name}`,
      '• Modalidade: Locação mensal',
      '• Uso: Trabalho',
    ])
  })

  it('formulário sem escolhas não inventa nada', () => {
    const message = buildContactMessage({ origin: 'form' })
    expect(message).toContain('• Moto: ainda não escolhi')
    expect(message).toContain('• Modalidade: quero conhecer as opções')
    expect(message).not.toContain('Uso:')
  })
})

describe('link e abertura do WhatsApp', () => {
  it('sem número configurado, nunca gera link de WhatsApp', () => {
    expect(siteConfig.contact.whatsapp).toBe('')
    expect(contactActionFor({ origin: 'detail', moto }).kind).toBe('section')
  })

  it('com número, codifica a mensagem (inclusive quebras de linha) na URL', () => {
    const context = { origin: 'form' as const, moto, purpose: 'pessoal' as const }
    const action = contactActionFor(context, withNumber)
    expect(action.kind).toBe('whatsapp')
    expect(action.href).toBe(`https://wa.me/5511900000000?text=${encodeURIComponent(buildContactMessage(context))}`)
    expect(action.href).toContain('%0A')
    expect(action.href).not.toMatch(/\s/)
  })

  it('abre o WhatsApp em nova aba sem acesso à janela de origem', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue({} as Window)
    const action = contactActionFor({ origin: 'header' }, withNumber)
    expect(openContactAction(action)).toBe(true)
    expect(open).toHaveBeenCalledWith(action.href, '_blank', 'noopener,noreferrer')
    open.mockRestore()
  })

  it('sem canal configurado, não abre nada (o site mostra o aviso)', () => {
    const open = vi.spyOn(window, 'open')
    expect(openContactAction(contactActionFor({ origin: 'header' }))).toBe(false)
    expect(open).not.toHaveBeenCalled()
    open.mockRestore()
  })

  it('o texto do botão reflete o canal real', () => {
    expect(contactLabel('whatsapp', 'Consultar pelo WhatsApp')).toBe('Consultar pelo WhatsApp')
    expect(contactLabel('phone', 'Consultar pelo WhatsApp')).toBe('Consultar por telefone')
    expect(contactLabel('email', 'Consultar pelo WhatsApp')).toBe('Consultar por e-mail')
  })
})

describe('modalidades', () => {
  it('aquisição só aparece quando confirmada', () => {
    expect(commercialConfig.acquisition.confirmed).toBe(false)
    expect(modalityOptions()).not.toContain(commercialConfig.acquisition.label)
    const confirmed = { ...commercialConfig, acquisition: { ...commercialConfig.acquisition, confirmed: true } }
    expect(modalityOptions(undefined, confirmed)).toContain(commercialConfig.acquisition.label)
  })

  it('usa as modalidades da moto quando cadastradas; senão, as confirmadas', () => {
    const config = { ...commercialConfig, modalities: ['Locação mensal'] }
    expect(modalityOptions(undefined, config)).toEqual(['Locação mensal'])
    expect(modalityOptions({ ...moto, modalities: ['Locação semanal'] }, config)).toEqual(['Locação semanal'])
  })
})

describe('eventos de conversão', () => {
  beforeEach(() => clearTrackedEvents())
  afterEach(() => clearTrackedEvents())

  it('registra origem, moto e canal, e avisa os assinantes', () => {
    const listener = vi.fn()
    const domListener = vi.fn()
    const off = onConversionEvent(listener)
    window.addEventListener('conversion', domListener)

    trackEvent('moto_interest_click', { origin: 'catalog', slug: moto.slug })
    trackContactClick({ origin: 'detail', moto }, contactActionFor({ origin: 'detail', moto }))

    const events = getTrackedEvents()
    expect(events.map((e) => e.name)).toEqual(['moto_interest_click', 'contact_click'])
    expect(events[1]).toMatchObject({ origin: 'detail', slug: moto.slug, channel: 'unconfigured' })
    expect(listener).toHaveBeenCalledTimes(2)
    expect(domListener).toHaveBeenCalledTimes(2)

    off()
    window.removeEventListener('conversion', domListener)
  })
})
