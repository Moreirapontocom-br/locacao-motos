/**
 * MODALIDADES DE LOCAÇÃO
 * ------------------------------------------------------------------
 * Fonte única das duas modalidades apresentadas na home, no formulário
 * de interesse e nas mensagens de WhatsApp.
 *
 * CONFIRMADO pela empresa: as duas modalidades existem.
 * NÃO CONFIRMADO: preços, prazos, caução, taxas, documentos, critérios,
 * manutenção, seguro, devolução, multas e condições de aquisição.
 * Quando a empresa informar, preencha `confirmed` (rótulo + valor). Enquanto
 * estiver ausente, o site não exibe nenhum dado contratual. Não use 0 nem
 * texto de exemplo aqui. Preços de concorrentes NUNCA entram neste arquivo.
 *
 * As modalidades NÃO são associadas a modelos de moto: o catálogo
 * (src/config/motorcycles.ts) continua independente.
 */
import { Bike, FileText, RotateCcw, Route, Search, type LucideIcon } from 'lucide-react'
import type { LabeledValue } from '../types'

export type RentalModeId = 'locacao-aquisicao' | 'locacao-tradicional'

export interface RentalModeStep {
  icon: LucideIcon
  title: string
  description: string
}

export interface RentalMode {
  id: RentalModeId
  /** Nome curto: usado no formulário e nas mensagens de WhatsApp. */
  name: string
  /** Título comercial do card. */
  headline: string
  description: string
  /** Modalidade de maior destaque comercial. */
  highlighted: boolean
  /** Selo do card (opcional). */
  badge?: string
  /** Situação das condições comerciais desta modalidade. */
  conditions: 'a-confirmar' | 'confirmadas'
  benefits: string[]
  /** Aviso curto sobre limites da modalidade (nunca promessa). */
  caution?: string
  cta: string
  /** Explicação comercial genérica, não são procedimentos contratuais. */
  steps: RentalModeStep[]
  /** Dados contratuais CONFIRMADOS (ex.: { label: 'Prazo', value: '...' }). Ausente = nada a exibir. */
  confirmed?: LabeledValue[]
}

export const rentalModes: RentalMode[] = [
  {
    id: 'locacao-aquisicao',
    name: 'Locação com aquisição',
    headline: 'Alugue com possibilidade de aquisição',
    description:
      'Utilize sua moto durante o contrato e conheça as condições para adquirir a propriedade ao final do período estabelecido.',
    highlighted: true,
    badge: 'Maior destaque',
    conditions: 'a-confirmar',
    benefits: [
      'Uso da moto durante a vigência contratual.',
      'Modalidade que contempla possibilidade de aquisição.',
      'Atendimento para esclarecimento das condições.',
    ],
    caution: 'A aquisição depende do cumprimento das condições contratuais, que a equipe informa antes da contratação.',
    cta: 'Quero conhecer essa modalidade',
    steps: [
      { icon: Bike, title: 'Escolha sua moto', description: 'Veja os modelos do catálogo e escolha o que combina com a sua rotina.' },
      { icon: Search, title: 'Consulte as condições', description: 'Pergunte pelas condições e pelos requisitos da modalidade com aquisição.' },
      { icon: FileText, title: 'Formalize a contratação', description: 'A contratação segue as orientações da empresa.' },
      { icon: Route, title: 'Utilize a moto', description: 'Durante o contrato, conheça as condições contratuais necessárias para a aquisição.' },
    ],
  },
  {
    id: 'locacao-tradicional',
    name: 'Locação tradicional',
    headline: 'Alugue pelo período contratado',
    description:
      'Tenha uma moto à disposição durante o período contratado, sem compromisso de aquisição como parte dessa modalidade.',
    highlighted: false,
    conditions: 'a-confirmar',
    benefits: [
      'Acesso à motocicleta durante o contrato.',
      'Alternativa para quem não deseja adquirir o veículo.',
      'Consulta de condições pelo atendimento comercial.',
    ],
    cta: 'Quero conhecer essa modalidade',
    steps: [
      { icon: Bike, title: 'Escolha sua moto', description: 'Veja os modelos do catálogo e escolha o que combina com a sua rotina.' },
      { icon: Search, title: 'Consulte as condições', description: 'Pergunte pelos períodos, valores e requisitos disponíveis.' },
      { icon: FileText, title: 'Formalize a contratação', description: 'A contratação segue as orientações da empresa.' },
      { icon: RotateCcw, title: 'Utilize e devolva', description: 'Use a moto e devolva conforme as condições contratuais.' },
    ],
  },
]
