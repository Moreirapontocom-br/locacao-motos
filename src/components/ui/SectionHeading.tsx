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
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && (
        <p
          className={`mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase ${
            dark ? 'text-accent' : 'text-accent-ink'
          }`}
        >
          <span aria-hidden className="h-px w-6 bg-current" />
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={`text-3xl leading-[1.1] font-semibold sm:text-4xl lg:text-[2.75rem] ${
          dark ? 'text-white' : 'text-graphite'
        }`}
      >
        {title}
      </Heading>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? 'text-muted-dark' : 'text-muted'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
