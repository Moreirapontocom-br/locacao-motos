import type { LucideIcon } from 'lucide-react'

/** Estilos de moto. Adicione novos valores aqui e o rótulo em `lib/motorcycles.ts`. */
export type MotoStyle =
  | 'street'
  | 'naked'
  | 'scooter'
  | 'trail'
  | 'classica'
  | 'custom'
  | 'esportiva'
  | 'touring'
  | 'eletrica'

/** Valor do filtro usado na interface e na URL (?estilo=naked). */
export type StyleFilterValue = 'todas' | MotoStyle

export interface ImageAsset {
  src: string
  alt: string
  srcSet?: string
  /** Imagem meramente ilustrativa (não é foto da empresa/frota). */
  illustrative?: boolean
}

export interface LabeledValue {
  label: string
  value: string
}

export interface Motorcycle {
  /** Identificador único usado na URL (/motos/<slug>). */
  slug: string
  /** Nome comercial exibido em destaque. */
  name: string
  /** Modelo/versão (ex.: fabricante + versão). */
  model: string
  /** Fabricante (ex.: 'Honda'). Opcional: só aparece quando informado. */
  brand?: string
  /** Ano do modelo. Opcional: só aparece quando informado. */
  year?: number
  /** Cilindrada em cc. Opcional. */
  displacement?: number
  /** Tipo de transmissão (ex.: 'Manual, 5 marchas', 'Automática (CVT)'). Opcional. */
  transmission?: string
  style: MotoStyle
  /** Marca a moto como exemplo de demonstração (exibe selo; não é frota real). */
  demo?: boolean
  /** Aparece em "Encontre sua próxima moto" na página inicial. */
  featured?: boolean
  /** Resumo curto (cards e SEO). */
  summary: string
  /** Descrição completa (página de detalhes). Opcional. */
  description?: string
  images: ImageAsset[]
  /** Especificações adicionais (ex.: partida, freios, combustível). */
  specs: LabeledValue[]
  /** Características principais em frases curtas (ex.: 'Freios ABS'). Opcional. */
  features?: string[]
  /** Modalidades disponíveis (ex.: 'Locação semanal'). Vazio = "sob consulta". */
  modalities: string[]
  /** Preços oficiais, SOMENTE se fornecidos pela empresa. Vazio = "sob consulta". */
  prices: LabeledValue[]
  /** Disponibilidade confirmada pela empresa (ex.: 'Disponível para retirada'). Vazio = não exibida. */
  availability?: string
  /** Moto temporariamente indisponível: continua acessível, mas não é recomendada em outras páginas. */
  unavailable?: boolean
}

export type SocialNetwork = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'linkedin'

export interface SocialLink {
  network: SocialNetwork
  label: string
  url: string
}

export interface NavItem {
  label: string
  to: string
}

export interface Step {
  icon: LucideIcon
  title: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
}
