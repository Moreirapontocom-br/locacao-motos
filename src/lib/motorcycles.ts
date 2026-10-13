import { contactMessages } from '../config/commercial'
import type { LabeledValue, MotoStyle, Motorcycle, StyleFilterValue } from '../types'

export const styleLabels: Record<MotoStyle, string> = {
  street: 'Street',
  naked: 'Naked',
  scooter: 'Scooter',
  trail: 'Trail',
  classica: 'Clássica',
  custom: 'Custom',
  esportiva: 'Esportiva',
  touring: 'Touring',
  eletrica: 'Elétrica',
}

/**
 * Opções de filtro derivadas dos dados: só aparecem estilos que existem na
 * lista. Com menos de dois estilos, o filtro não faz sentido (retorna []).
 */
export function styleFilterOptions(list: Motorcycle[]): { value: StyleFilterValue; label: string; count: number }[] {
  const styles = [...new Set(list.map((m) => m.style))]
  if (styles.length < 2) return []
  return [
    { value: 'todas', label: 'Todas', count: list.length },
    ...styles.map((style) => ({
      value: style,
      label: styleLabels[style],
      count: list.filter((m) => m.style === style).length,
    })),
  ]
}

/** Cilindrada no formato brasileiro (ex.: 162,7 cc). */
export function formatDisplacement(cc: number): string {
  return `${cc.toLocaleString('pt-BR')} cc`
}

/** Converte um valor arbitrário (ex.: da URL) em um filtro válido. */
export function parseStyleFilter(value: string | null | undefined): StyleFilterValue {
  return value && value in styleLabels ? (value as MotoStyle) : 'todas'
}

export function filterMotorcycles(list: Motorcycle[], filter: StyleFilterValue): Motorcycle[] {
  if (filter === 'todas') return list
  return list.filter((m) => m.style === filter)
}

export function findMotorcycle(list: Motorcycle[], slug: string | undefined): Motorcycle | undefined {
  return list.find((m) => m.slug === slug)
}

/** Nome completo para exibição e mensagens: fabricante (se informado) + nome. */
export function motorcycleDisplayName(moto: Motorcycle): string {
  if (!moto.brand || moto.name.toLowerCase().startsWith(moto.brand.toLowerCase())) return moto.name
  return `${moto.brand} ${moto.name}`
}

/** Chave que identifica o mesmo modelo cadastrado mais de uma vez (ex.: unidades repetidas). */
const modelKey = (m: Motorcycle) => `${m.brand ?? ''} ${m.name} ${m.model} ${m.year ?? ''}`.trim().toLowerCase()

/**
 * "Você também pode gostar": primeiro do mesmo estilo, depois as demais.
 * Nunca repete a moto atual, modelos duplicados ou motos marcadas como indisponíveis.
 */
export function relatedMotorcycles(list: Motorcycle[], moto: Motorcycle, limit = 3): Motorcycle[] {
  const seen = new Set([modelKey(moto)])
  const others = list.filter((m) => {
    if (m.slug === moto.slug || m.unavailable) return false
    const key = modelKey(m)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return [...others.filter((m) => m.style === moto.style), ...others.filter((m) => m.style !== moto.style)].slice(0, limit)
}

/** Ficha técnica: somente campos informados (nada é preenchido por suposição). */
export function technicalSheet(moto: Motorcycle): LabeledValue[] {
  return [
    ...(moto.brand ? [{ label: 'Fabricante', value: moto.brand }] : []),
    { label: 'Estilo', value: styleLabels[moto.style] },
    ...(moto.displacement ? [{ label: 'Cilindrada', value: formatDisplacement(moto.displacement) }] : []),
    ...(moto.year ? [{ label: 'Ano', value: String(moto.year) }] : []),
    ...(moto.transmission ? [{ label: 'Transmissão', value: moto.transmission }] : []),
    ...moto.specs,
  ]
}

/** Mensagem da página individual (texto em src/config/commercial.ts). */
export function motorcycleInterestMessage(moto: Motorcycle): string {
  return contactMessages.detail(motorcycleDisplayName(moto))
}

/** Texto curto sobre condições para cards (nunca inventa valores). */
export function commercialHint(moto: Motorcycle): string {
  if (moto.prices[0]) return `${moto.prices[0].label}: ${moto.prices[0].value}`
  if (moto.modalities.length > 0) return moto.modalities.join(' · ')
  return 'Condições sob consulta'
}
