/**
 * MEDIÇÃO DE CONVERSÕES (interna, sem ferramentas externas)
 * ------------------------------------------------------------------
 * Registra eventos em memória e os publica como `CustomEvent('conversion')`
 * na janela. Para integrar uma ferramenta de analytics no futuro (com
 * autorização), basta ouvir esse evento ou usar `onConversionEvent`.
 *
 * IMPORTANTE: `contact_click` registra o CLIQUE no botão de contato.
 * O site não tem como saber se a conversa foi de fato enviada no WhatsApp.
 */

export type ConversionEventName =
  /** Clique para ver uma moto (card do catálogo, destaques ou recomendações). */
  | 'moto_interest_click'
  /** Abertura do formulário opcional de interesse. */
  | 'interest_form_open'
  /** Clique em um botão de contato (não confirma envio de mensagem). */
  | 'contact_click'

/** Canal acionado pelo clique. `unconfigured` = nenhum canal configurado (abre o aviso demonstrativo). */
export type ContactChannel = 'whatsapp' | 'phone' | 'email' | 'unconfigured'

export interface ConversionEvent {
  name: ConversionEventName
  /** Ponto do site onde ocorreu a interação (ex.: 'catalog', 'detail', 'faq'). */
  origin: string
  /** Moto relacionada, quando houver. */
  slug?: string
  /** Somente em `contact_click`. */
  channel?: ContactChannel
  /** Dispositivo no momento do clique (pela largura da tela). */
  device: 'mobile' | 'desktop'
  timestamp: number
}

const MAX_EVENTS = 200
const events: ConversionEvent[] = []
const listeners = new Set<(event: ConversionEvent) => void>()

function currentDevice(): ConversionEvent['device'] {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'desktop'
  return window.matchMedia('(max-width: 1023px)').matches ? 'mobile' : 'desktop'
}

export function trackEvent(name: ConversionEventName, data: { origin: string; slug?: string; channel?: ContactChannel }) {
  const event: ConversionEvent = { name, ...data, device: currentDevice(), timestamp: Date.now() }
  events.push(event)
  if (events.length > MAX_EVENTS) events.shift()

  for (const listener of listeners) listener(event)
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('conversion', { detail: event }))
  if (import.meta.env.DEV && import.meta.env.MODE !== 'test') console.debug('[conversão]', event)
}

/** Assina os eventos; retorna a função para cancelar. */
export function onConversionEvent(listener: (event: ConversionEvent) => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Eventos registrados nesta visita (cópia). */
export function getTrackedEvents(): ConversionEvent[] {
  return [...events]
}

/** Uso em testes. */
export function clearTrackedEvents() {
  events.length = 0
}
