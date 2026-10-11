import { useEffect } from 'react'
import { siteConfig } from '../config/site'

function setMeta(attr: 'name' | 'property', key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (content === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (href === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

interface PageMetaOptions {
  /** Imagem de compartilhamento (og:image), URL absoluta. Fotos ilustrativas não devem ser usadas. */
  image?: string
  /** Páginas que não devem ser indexadas (ex.: moto inexistente). */
  noindex?: boolean
}

/** Atualiza título, descrição, canonical e metatags de compartilhamento. */
export function usePageMeta(
  title?: string,
  description: string = siteConfig.description,
  { image, noindex = false }: PageMetaOptions = {},
) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`
    const url = siteConfig.url && !noindex ? siteConfig.url + window.location.pathname : null
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex' : null)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', image ?? null)
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('property', 'og:url', url)
    setCanonical(url)
  }, [title, description, image, noindex])
}
