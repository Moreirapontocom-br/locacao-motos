import type { ImageAsset } from '../types'

interface UnsplashOptions {
  /** Proporção largura/altura do recorte. */
  ratio?: number
  /** Ponto focal (0–1) e zoom, para gerar recortes de detalhe da mesma foto. */
  focus?: { x: number; y: number; zoom?: number }
  widths?: number[]
}

/**
 * Foto OFICIAL da frota: arquivo em `public/images/frota/<arquivo>`.
 * Não é marcada como ilustrativa (sem o selo "Imagem demonstrativa").
 * Use fotos na proporção 4:3 (ex.: 1600×1200); a galeria recorta o excedente.
 * Ex.: fleetPhoto('cg-160-frente.jpg', 'Honda CG 160 vista de frente')
 */
export function fleetPhoto(file: string, alt: string): ImageAsset {
  return { src: `/images/frota/${file}`, alt }
}

/**
 * Monta URLs responsivas de fotos do Unsplash (licença livre).
 * Usado apenas nas imagens demonstrativas — fotos oficiais podem ser
 * arquivos locais em /public/images com { src, alt }.
 */
export function unsplash(id: string, alt: string, options: UnsplashOptions = {}): ImageAsset {
  const { ratio = 3 / 2, focus, widths = [480, 800, 1200, 1600] } = options

  const url = (w: number) => {
    const params = new URLSearchParams({
      auto: 'format',
      fit: 'crop',
      q: '75',
      w: String(w),
      h: String(Math.round(w / ratio)),
    })
    if (focus) {
      params.set('crop', 'focalpoint')
      params.set('fp-x', String(focus.x))
      params.set('fp-y', String(focus.y))
      if (focus.zoom) params.set('fp-z', String(focus.zoom))
    }
    return `https://images.unsplash.com/${id}?${params.toString()}`
  }

  return {
    src: url(widths[Math.min(1, widths.length - 1)]),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    alt,
    illustrative: true,
  }
}
