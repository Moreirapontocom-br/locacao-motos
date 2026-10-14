import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: ReactNode
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  id?: string
  className?: string
}

/** Hierarquia padrão das seções: rótulo curto → título forte → descrição. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = 'light',
  align = 'left',
  as: Heading = 'h2',
  id,
  className = '',
}: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <p className={`eyebrow mb-5 ${dark ? 'text-accent' : 'text-accent-ink'}`}>
          <span aria-hidden className="h-0.5 w-7 rounded-full bg-current" />
          {eyebrow}
        </p>
      )}
      <Heading id={id} className={`${Heading === 'h1' ? 'text-h1' : 'text-h2'} ${dark ? 'text-white' : 'text-graphite'}`}>
        {title}
      </Heading>
      {description && (
        <p className={`mt-5 max-w-text text-lead ${dark ? 'text-muted-dark' : 'text-muted'} ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  )
}
