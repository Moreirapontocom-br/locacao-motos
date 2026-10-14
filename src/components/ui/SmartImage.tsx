import { Camera, ImageOff } from 'lucide-react'
import { useState } from 'react'
import type { ImageAsset } from '../../types'

interface SmartImageProps {
  image: ImageAsset
  sizes?: string
  className?: string
  imgClassName?: string
  priority?: boolean
  /** Texto mostrado quando ainda não há foto (src vazio). */
  placeholderLabel?: string
  tone?: 'light' | 'dark'
}

/**
 * Imagem com carregamento otimizado, transição suave e espaço reservado
 * quando a foto ainda não existe ou falha ao carregar.
 */
export function SmartImage({
  image,
  sizes = '100vw',
  className = '',
  imgClassName = '',
  priority = false,
  placeholderLabel,
  tone = 'light',
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const dark = tone === 'dark'

  if (!image.src || failed) {
    const Icon = image.src ? ImageOff : Camera
    return (
      <div
        // alt vazio = imagem decorativa (ex.: miniatura com rótulo no botão): fica fora da leitura de tela.
        {...(image.alt ? { role: 'img', 'aria-label': image.alt } : { 'aria-hidden': true })}
        className={`flex flex-col items-center justify-center gap-2 overflow-hidden p-4 text-center ${
          dark ? 'bg-graphite-800 text-muted-dark' : 'bg-gradient-to-br from-steel/70 to-ice text-muted'
        } ${className}`}
      >
        <Icon aria-hidden className="size-6 opacity-80" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-[0.01em]">{placeholderLabel ?? image.alt}</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${dark ? 'bg-graphite-800' : 'bg-steel/60'} ${className}`}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        // Imagens já em cache podem concluir antes do onLoad ser registrado.
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0) setLoaded(true)
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        // Imagens prioritárias (primeira dobra) aparecem sem esperar o fade, para não atrasar o carregamento percebido.
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          loaded || priority ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  )
}
