import { createContext, useContext } from 'react'

export interface ContactRequest {
  /** Mensagem que seria enviada pelo WhatsApp/e-mail. */
  message: string
  /** Assunto exibido no diálogo (ex.: nome da moto). */
  subject?: string
}

export const ContactDialogContext = createContext<(request: ContactRequest) => void>(() => {})

/** Abre o diálogo de "contato em configuração" (usado quando nenhum canal foi configurado). */
export function useContactDialog() {
  return useContext(ContactDialogContext)
}
