/**
 * "ENCONTRE SUA PRÓXIMA MOTO" — CORRESPONDÊNCIA HONESTA
 * ------------------------------------------------------------------
 * O seletor só filtra motos por um dado OFICIAL: as modalidades cadastradas
 * em cada moto (`modalities` em src/config/motorcycles.ts). O objetivo de uso
 * NÃO filtra nada, porque não existe dado oficial que relacione objetivos a
 * modelos. Sem correspondência confirmada, o resultado mostra as motos do
 * catálogo e avisa que não são uma recomendação para o perfil.
 */
import type { Motorcycle } from '../types'

export interface FinderResult {
  /** true = as motos têm a modalidade escolhida cadastrada oficialmente. */
  matched: boolean
  motorcycles: Motorcycle[]
}

export function finderResults(list: Motorcycle[], modality?: string): FinderResult {
  const available = list.filter((m) => !m.unavailable)
  const withModality = modality ? available.filter((m) => m.modalities.includes(modality)) : []
  if (withModality.length > 0) return { matched: true, motorcycles: withModality }
  return { matched: false, motorcycles: available }
}
