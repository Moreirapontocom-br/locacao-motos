/**
 * CONTATO COMERCIAL PELO WHATSAPP
 * ------------------------------------------------------------------
 * Ponto único usado por TODOS os CTAs comerciais:
 *  1. recebe o contexto de origem (onde o visitante clicou);
 *  2. monta uma mensagem curta e personalizada;
 *  3. gera o link com os parâmetros codificados;
 *  4. abre o WhatsApp com segurança (nova aba, sem acesso à página de origem).
 *
 * Sem número válido em `siteConfig.contact.whatsapp`, NENHUMA conversa é
 * aberta: o site usa telefone/e-mail configurados ou mostra o aviso de
 * canal em configuração.
 */
import { commercialConfig, contactMessages, type PurposeValue } from '../config/commercial'
import { siteConfig } from '../config/site'
import type { Motorcycle } from '../types'
import { trackEvent, type ContactChannel } from './analytics'
import { resolveContactAction, type ContactAction } from './contact'
import { motorcycleDisplayName } from './motorcycles'

export type ContactOrigin =
  | 'header'
  | 'footer'
  | 'menu'
  | 'floating'
  | 'home-contact'
  | 'home-featured'
  | 'catalog'
  | 'catalog-help'
  | 'related'
  | 'detail'
  | 'detail-sticky'
  | 'modality'
  | 'faq'
  | 'finder'
  | 'form'

export interface ContactContext {
  origin: ContactOrigin
  /** Moto em questão (cards, página individual, formulário). */
  moto?: Motorcycle
  /** Modalidade escolhida (seção de modalidades ou formulário). */
  modality?: string
  /** Objetivo de utilização (formulário). */
  purpose?: PurposeValue
  /** Objetivo escolhido no seletor "Encontre sua próxima moto" (rótulo). */
  goal?: string
}

const purposeLabel = (value?: PurposeValue) => commercialConfig.purposes.find((p) => p.value === value)?.label

/**
 * Modalidades oferecidas no formulário: as da moto (se cadastradas) ou as
 * confirmadas em `commercialConfig`. Aquisição só entra se estiver confirmada.
 * Lista vazia = o formulário não pergunta modalidade (a equipe apresenta as opções).
 */
export function modalityOptions(moto?: Motorcycle, config = commercialConfig): string[] {
  const base = moto && moto.modalities.length > 0 ? moto.modalities : config.modalities
  const list = [...new Set(base)]
  if (config.acquisition.confirmed && !list.includes(config.acquisition.label)) list.push(config.acquisition.label)
  return list
}

/** Texto do botão conforme a ação real ("pelo WhatsApp" → "por telefone"/"por e-mail"). */
export function contactLabel(kind: ContactAction['kind'], label: string) {
  if (kind === 'phone') return label.replace(/(pelo|no) WhatsApp/i, 'por telefone')
  if (kind === 'email') return label.replace(/(pelo|no) WhatsApp/i, 'por e-mail')
  return label
}

/** Monta a mensagem do contexto. Curta, sem dados pessoais. */
export function buildContactMessage(context: ContactContext): string {
  const moto = context.moto ? motorcycleDisplayName(context.moto) : undefined

  switch (context.origin) {
    case 'catalog':
    case 'home-featured':
    case 'related':
      return moto ? contactMessages.catalog(moto) : contactMessages.general
    case 'detail':
    case 'detail-sticky':
      return moto ? contactMessages.detail(moto) : contactMessages.general
    case 'home-contact':
      // Sem modalidade escolhida na página, não inventa preferência.
      return context.modality ? contactMessages.modality(context.modality) : contactMessages.general
    case 'modality':
      return contactMessages.modality(context.modality)
    case 'faq':
      return contactMessages.faq
    case 'finder':
      return contactMessages.finder(context.goal, context.modality)
    case 'catalog-help':
      return contactMessages.availability
    case 'form': {
      const purpose = purposeLabel(context.purpose)
      const lines = [
        contactMessages.formIntro,
        `• Moto: ${moto ?? 'ainda não escolhi'}`,
        `• Modalidade: ${context.modality || 'ainda não decidi'}`,
        ...(purpose ? [`• Uso: ${purpose}`] : []),
      ]
      return lines.join('\n')
    }
    default:
      return contactMessages.general
  }
}

/** Assunto exibido no aviso demonstrativo (ex.: "a moto Urbana 160"). */
export function contactSubject(context: ContactContext): string | undefined {
  if (context.moto) return `a moto ${motorcycleDisplayName(context.moto)}`
  if (context.modality) return `a modalidade de ${context.modality.toLowerCase()}`
  if (context.origin === 'modality') return 'as modalidades de locação'
  return undefined
}

/** Ação de contato para o contexto (WhatsApp → telefone → e-mail → aviso). */
export function contactActionFor(context: ContactContext, contact = siteConfig.contact): ContactAction {
  return resolveContactAction(buildContactMessage(context), contact)
}

export function channelOf(action: ContactAction): ContactChannel {
  return action.kind === 'section' ? 'unconfigured' : action.kind
}

/** Registra o clique (não o envio) no contato. */
export function trackContactClick(context: ContactContext, action: ContactAction) {
  trackEvent('contact_click', { origin: context.origin, slug: context.moto?.slug, channel: channelOf(action) })
}

/**
 * Abre o canal externo de forma segura. Retorna `false` quando não há canal
 * configurado (quem chamou deve mostrar o aviso demonstrativo).
 */
export function openContactAction(action: ContactAction): boolean {
  if (action.kind === 'section') return false
  if (action.kind === 'whatsapp') {
    // noopener/noreferrer: a página do WhatsApp não tem acesso a esta janela.
    const win = window.open(action.href, '_blank', 'noopener,noreferrer')
    if (!win) window.location.href = action.href // bloqueador de pop-up: abre na mesma aba
    return true
  }
  window.location.href = action.href
  return true
}
