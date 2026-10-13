# Site — Locação de motos (Teste 1)

Site institucional/comercial de uma empresa especializada em locação de motocicletas.
React + Vite + TypeScript, Tailwind CSS v4, Motion e Lucide.

## Comandos

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # checagem de tipos + build de produção em dist/
npm test           # testes (Vitest + Testing Library)
npm run lint       # oxlint
```

## Onde trocar os dados provisórios

| O quê | Arquivo |
| --- | --- |
| Nome, descrição, logotipo, WhatsApp, telefone, e-mail, endereço, horário, redes sociais, CNPJ/razão social | `src/config/site.ts` |
| Textos do hero, "Como funciona", "Modalidades e condições", "Sobre nós", fotos institucionais, FAQ, chamada final, menu | `src/config/content.ts` |
| Motos (nome, modelo, ano, cilindrada, estilo, fotos, modalidades, preços, disponibilidade, descrição) | `src/config/motorcycles.ts` |
| Rótulos dos estilos de moto (Street, Naked, Scooter…) | `src/lib/motorcycles.ts` |
| Cores e fontes | tokens `@theme` em `src/index.css` (+ `theme-color` e fontes em `index.html`) |
| Título/descrição padrão, `robots.txt`, `sitemap.xml` e dados estruturados | gerados de `src/config/site.ts` no build (plugin em `vite.config.ts`, funções em `src/lib/publishing.ts`) |

**Guia completo de atualização e checklist de publicação: [`PUBLICACAO.md`](PUBLICACAO.md).**
`npm run build` lista no terminal os dados oficiais que ainda faltam.

Regras importantes:

- **As motos atuais são exemplos (`demo: true`)**, com fotos ilustrativas do Unsplash (licença livre). Não representam o estoque real.
- `modalities`, `prices` e `availability` vazios exibem "sob consulta". **Preencha somente com dados fornecidos pela empresa.**
- `year` e `displacement` são opcionais: só aparecem quando informados.
- O filtro por estilo é gerado a partir dos dados e só aparece quando há pelo menos dois estilos.
- **Campos vazios nunca geram links falsos.** Sem WhatsApp configurado, os botões de contato abrem um aviso "canal em configuração" com a mensagem preparada.
- WhatsApp: apenas dígitos com DDI e DDD (ex.: `55` + DDD + número).
- `showDemoNotices: true` exibe os selos "Moto de exemplo"/"A informar". Desligue quando todos os dados oficiais estiverem preenchidos.
- Fotos oficiais: coloque em `public/images/frota/` e use `fleetPhoto('arquivo.jpg', 'descrição')`.

## Atendimento pelo WhatsApp e conversões

- **Número comercial:** um único campo, `siteConfig.contact.whatsapp` em `src/config/site.ts` (hoje vazio = pendente).
  Sem número válido, nenhuma conversa é aberta: o site usa telefone/e-mail configurados ou mostra o aviso
  "canal em configuração" com a mensagem preparada.
- **Mensagens por contexto** (home, catálogo, página da moto, modalidades, FAQ, formulário): `src/config/commercial.ts`.
- **Modalidades confirmadas** e **aquisição** (`acquisition.confirmed`, hoje `false`): `src/config/commercial.ts`.
  A aquisição só aparece no formulário quando confirmada.
- **Função central:** `src/lib/whatsapp.ts` — recebe o contexto, monta a mensagem, codifica a URL e abre o
  WhatsApp com `noopener`. Todos os botões comerciais (`ContactButton`, `ContactIconButton`, formulário) a usam.
- **Formulário de interesse** (`src/components/contact/InterestForm.tsx`): opcional e recolhido, sem dados
  pessoais; moto pré-preenchida na página da moto. Nada é enviado ou salvo pelo site.
- **Eventos internos** (`src/lib/analytics.ts`): `moto_interest_click`, `interest_form_open` e `contact_click`
  (com origem, moto, canal e dispositivo). `contact_click` mede o **clique**, não o envio da mensagem.
  Nenhuma ferramenta externa está instalada; para integrar uma no futuro, ouça `window` `conversion` ou use
  `onConversionEvent`.

## Estrutura

```
src/
  config/        dados da empresa, conteúdos e motos (editar aqui)
  components/
    layout/      Header, Footer, Logo, Layout, PageHeader
    ui/          Button, ContactButton, Accordion, SmartImage, Reveal, DemoNotice, SpeedLines, ...
    motorcycles/ MotorcycleCard, StyleFilter, MotorcycleGrid, MotorcycleGallery
    contact/     diálogo de contato demonstrativo e botão flutuante
  sections/      seções da homepage
  pages/         Home, Catálogo (/motos), Detalhes (/motos/:slug), 404
  lib/           contato/WhatsApp, filtros e ficha técnica das motos, imagens, SEO
```

Links antigos (`/veiculos` e `/veiculos/:slug`) redirecionam para `/motos`.

## Publicação

É uma SPA com rotas no navegador: configure o servidor para redirecionar todas as rotas para `index.html`.
Hospedagem escolhida: **Cloudflare** (plano gratuito), já configurada em `wrangler.jsonc` e `public/_headers`
(fallback, cache e cabeçalhos de segurança). Alternativas para Vercel e Netlify em `docs/hospedagem/`.
Passo a passo em [`PUBLICACAO.md`](PUBLICACAO.md), seção 8.
