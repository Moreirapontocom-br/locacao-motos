import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'dark' | 'light' | 'outline' | 'outline-light' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn inline-flex items-center justify-center gap-2 rounded-full text-center leading-tight font-semibold sm:whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 ease-out-soft active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-graphite hover:bg-accent-soft',
  dark: 'bg-graphite text-white hover:bg-graphite-700',
  light: 'bg-white text-graphite hover:bg-steel',
  outline: 'border border-graphite/15 text-graphite hover:border-graphite/40 hover:bg-white',
  'outline-light': 'border border-white/20 text-white hover:border-white/50 hover:bg-white/5',
  ghost: 'text-graphite hover:bg-graphite/5',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-7 text-base',
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
