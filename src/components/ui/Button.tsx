import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'dark' | 'light' | 'outline' | 'outline-light' | 'ghost' | 'ghost-light'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 rounded-control text-center leading-tight font-semibold tracking-[-0.005em] sm:whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out-soft active:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:translate-y-0'

/**
 * Hierarquia: `primary` (laranja) é a ação principal da tela; `dark`/`light`
 * são ações fortes neutras; `outline*` e `ghost` são secundárias.
 */
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-graphite hover:-translate-y-px hover:bg-accent-soft hover:shadow-accent active:translate-y-0 active:bg-accent-strong motion-reduce:hover:translate-y-0',
  dark: 'bg-graphite text-white hover:bg-graphite-700',
  light: 'bg-white text-graphite hover:bg-steel',
  outline: 'border border-graphite/20 bg-transparent text-graphite hover:border-graphite hover:bg-graphite hover:text-white',
  'outline-light': 'border border-white/25 bg-white/[0.02] text-white hover:border-white hover:bg-white hover:text-graphite',
  ghost: 'text-graphite hover:bg-graphite/[0.06]',
  /** Ação secundária discreta sobre fundo escuro (ex.: hero): texto com sublinhado que cresce no hover. */
  'ghost-light':
    'text-white/85 underline decoration-white/30 decoration-1 underline-offset-[6px] hover:text-white hover:decoration-accent',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-12 px-6 py-2.5 text-[0.95rem]',
  lg: 'min-h-14 px-7 py-3 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps &
  (
    | ({ to: string; href?: never } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to' | 'className' | 'children'>)
    | ({ href: string; to?: never; external?: boolean } & Omit<
        ComponentPropsWithoutRef<'a'>,
        'href' | 'className' | 'children'
      >)
    | ({ to?: never; href?: never } & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>)
  )

function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

/**
 * Botão único para links internos (`to`), externos (`href`) e ações (`onClick`).
 * No celular, rótulos longos quebram em duas linhas em vez de ultrapassar a largura da tela.
 */
export function Button(props: ButtonProps) {
  const { variant, size, className, children, ...rest } = props
  const classes = buttonClasses(variant, size, className)

  if ('to' in rest && rest.to !== undefined) {
    return (
      <Link {...rest} className={classes}>
        {children}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    const { external, ...anchor } = rest as ComponentPropsWithoutRef<'a'> & { external?: boolean }
    return (
      <a
        {...anchor}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" {...(rest as ComponentPropsWithoutRef<'button'>)} className={classes}>
      {children}
    </button>
  )
}
