import { Mail, MessageCircle, Phone } from 'lucide-react'
import type { ComponentProps } from 'react'
import type { ContactKind } from '../../lib/contact'
import {
  buildContactMessage,
  contactActionFor,
  contactLabel,
  contactSubject,
  trackContactClick,
  type ContactContext,
} from '../../lib/whatsapp'
import { useContactDialog } from '../contact/contactContext'
import { Button } from './Button'

const icons: Record<ContactKind, typeof MessageCircle> = {
  whatsapp: MessageCircle,
  phone: Phone,
  email: Mail,
  section: MessageCircle,
}

/** Ação comum: registra o clique e, sem canal configurado, abre o aviso demonstrativo. */
function useContact(context: ContactContext, onContact?: () => void) {
  const action = contactActionFor(context)
  const openDialog = useContactDialog()
  const onClick = () => {
    onContact?.()
    trackContactClick(context, action)
    if (action.kind === 'section') {
      openDialog({ message: buildContactMessage(context), subject: contactSubject(context) })
    }
  }
  return { action, onClick, Icon: icons[action.kind] }
}

interface ContactButtonProps {
  /** De onde vem o contato: define a mensagem enviada (ver src/lib/whatsapp.ts). */
  context: ContactContext
  label?: string
  /** Complemento só para leitores de tela, para distinguir botões de mesmo rótulo. */
  srSuffix?: string
  /** Chamado ao clicar, antes de abrir o canal (ex.: guardar a modalidade escolhida). */
  onContact?: () => void
  variant?: ComponentProps<typeof Button>['variant']
  size?: ComponentProps<typeof Button>['size']
  className?: string
}

/**
 * Botão de contato com ação real: abre o WhatsApp configurado com a mensagem
 * do contexto; sem número, usa telefone ou e-mail. Sem nenhum canal, abre o
 * aviso demonstrativo com a mensagem preparada.
 */
export function ContactButton({
  context,
  label = 'Falar pelo WhatsApp',
  srSuffix,
  onContact,
  variant = 'primary',
  size = 'md',
  className,
}: ContactButtonProps) {
  const { action, onClick, Icon } = useContact(context, onContact)
  const text = contactLabel(action.kind, label)
  const suffix = srSuffix && <span className="sr-only"> ({srSuffix})</span>

  if (action.kind === 'section') {
    return (
      <Button variant={variant} size={size} className={className} aria-haspopup="dialog" onClick={onClick}>
        <Icon aria-hidden className="size-[1.1em]" />
        {text}
        {suffix}
      </Button>
    )
  }

  return (
    <Button
      href={action.href}
      external={action.external}
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
    >
      <Icon aria-hidden className="size-[1.1em]" />
      {text}
      {suffix}
      {action.external && <span className="sr-only">(abre em nova aba)</span>}
    </Button>
  )
}

/** Versão compacta (somente ícone), usada nos cards e no botão flutuante. */
export function ContactIconButton({
  context,
  label,
  className = '',
}: {
  context: ContactContext
  label: string
  className?: string
}) {
  const { action, onClick, Icon } = useContact(context)
  const text = contactLabel(action.kind, label)
  const classes = `relative z-10 grid place-items-center rounded-full transition-colors ${className}`

  if (action.kind === 'section') {
    return (
      <button type="button" aria-label={text} title={text} aria-haspopup="dialog" onClick={onClick} className={classes}>
        <Icon aria-hidden className="size-[1.15em]" />
      </button>
    )
  }

  return (
    <a
      href={action.href}
      aria-label={action.external ? `${text} (abre em nova aba)` : text}
      title={text}
      onClick={onClick}
      className={classes}
      {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <Icon aria-hidden className="size-[1.15em]" />
    </a>
  )
}
