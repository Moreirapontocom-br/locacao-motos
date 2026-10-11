/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, runnerImport, type Plugin } from 'vite'
import type * as Publishing from './src/lib/publishing.ts'

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Carrega a configuração do site pelo próprio Vite (mesma resolução de módulos do app). */
async function loadSiteData() {
  const load = async <T,>(id: string) => (await runnerImport<T>(id, { configFile: false })).module
  const [publishing, { siteConfig }, { motorcycles }] = await Promise.all([
    load<typeof Publishing>('/src/lib/publishing.ts'),
    load<typeof import('./src/config/site.ts')>('/src/config/site.ts'),
    load<typeof import('./src/config/motorcycles.ts')>('/src/config/motorcycles.ts'),
  ])
  return { ...publishing, siteConfig, motorcycles }
}

/**
 * Dados da empresa no index.html, robots.txt e sitemap.xml gerados a partir
 * de `src/config` — nada disso precisa ser editado à mão.
 */
function siteFiles(): Plugin {
  return {
    name: 'site-files',
    async transformIndexHtml(html) {
      const { siteConfig, buildOrganizationJsonLd } = await loadSiteData()
      const jsonLd = buildOrganizationJsonLd(siteConfig)
      return html
        .replaceAll('%SITE_TITLE%', escapeHtml(`${siteConfig.name} — ${siteConfig.tagline}`))
        .replaceAll('%SITE_DESCRIPTION%', escapeHtml(siteConfig.description))
        .replace(
          '<!-- site:json-ld -->',
          jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : '',
        )
    },
    configureServer(server) {
      server.middlewares.use('/robots.txt', async (_req, res) => {
        const { siteConfig, buildRobots } = await loadSiteData()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(buildRobots(siteConfig))
      })
    },
    async generateBundle() {
      const { siteConfig, motorcycles, buildRobots, buildSitemap, pendingData } = await loadSiteData()
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(siteConfig) })
      const sitemap = buildSitemap(siteConfig, motorcycles)
      if (sitemap) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })

      const pending = pendingData(siteConfig, motorcycles)
      if (pending.length > 0) {
        this.warn(`Dados oficiais pendentes (ver PUBLICACAO.md):\n${pending.map((p) => `  - ${p}`).join('\n')}`)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteFiles()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
