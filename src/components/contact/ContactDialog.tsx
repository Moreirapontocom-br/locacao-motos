import { Check, Copy, MessageCircle, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ContactDialogContext, type ContactRequest } from './contactContext'

/**
 * Estado demonstrativo de contato: enquanto nenhum canal (WhatsApp, telefone
 * ou e-mail) estiver configurado, os botões de contato abrem este diálogo,
 * mostrando a mensagem que será enviada quando o canal oficial existir.
 */
export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ContactRequest | null>(null)
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const open = useCallback((next: ContactRequest) => {
    setCopied(false)
    setRequest(next)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (request && dialog && !dialog.open) dialog.showModal()
  }, [request])

  const close = () => dialogRef.current?.close()

  const copy = async () => {
    if (!request) return
    try {
      await navigator.clipboard.writeText(request.message)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <ContactDialogContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="contato-dialogo-titulo"
        onClose={() => setRequest(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-card bg-white p-0 text-graphite shadow-float backdrop:bg-graphite/75 backdrop:backdrop-blur-sm"
      >
        {request && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-12 place-items-center rounded-control bg-accent/[0.12] text-accent-ink">
                <MessageCircle aria-hidden className="size-5.5" />
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Fechar"
                className="grid size-11 place-items-center rounded-control text-graphite/60 transition-colors hover:bg-ice hover:text-graphite"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="eyebrow mt-6 text-accent-ink">Versão demonstrativa</p>
            <h2 id="contato-dialogo-titulo" className="mt-3 text-h3">
              Canal de atendimento em configuração
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              O WhatsApp oficial da empresa ainda não foi informado. Assim que for configurado, este botão abrirá a
              conversa já com a mensagem abaixo{request.subject ? ` sobre ${request.subject}` : ''}.
            </p>

            <figure className="mt-6 rounded-control border-l-2 border-accent bg-ice p-4">
              <figcaption className="text-xs font-semibold text-muted">Mensagem preparada</figcaption>
              <blockquote className="mt-2 text-[0.95rem] leading-relaxed whitespace-pre-line">“{request.message}”</blockquote>
            </figure>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/#contato"
                onClick={() => {
                  close()
                  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex min-h-12 items-center justify-center rounded-control px-5 text-sm font-semibold text-graphite transition-colors hover:bg-ice"
              >
                Ver canais de contato
              </Link>
              <button
                type="button"
                onClick={copy}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-6 text-sm font-semibold transition-colors ${
                  copied ? 'bg-success text-white' : 'bg-graphite text-white hover:bg-graphite-700'
                }`}
              >
                {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
                {copied ? 'Mensagem copiada' : 'Copiar mensagem'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ContactDialogContext.Provider>
  )
}
