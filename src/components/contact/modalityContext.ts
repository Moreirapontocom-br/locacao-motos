import { createContext, useContext } from 'react'

export interface ModalityChoice {
  /** Nome da modalidade escolhida na página (ex.: 'Locação tradicional'), se houver. */
  modality: string | undefined
  setModality: (modality: string | undefined) => void
}

/** Guarda a modalidade escolhida na home até o formulário e o botão de contato final. */
export const ModalityChoiceContext = createContext<ModalityChoice>({ modality: undefined, setModality: () => {} })

export function useModalityChoice() {
  return useContext(ModalityChoiceContext)
}
