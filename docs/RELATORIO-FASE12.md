# Relatório da Fase 12: redesign visual premium

Branch `fase-12`, com PR para a `main`. Nada foi mesclado nem publicado.

**Verificação inicial:** a Fase 12 ainda não tinha sido feita. O repositório só tinha as branches das Fases 8 a 11 (PRs #1 a #4, já mesclados) e nenhum commit depois da Fase 11. A paleta em uso era a antiga (`#15191d` e laranja `#db6538`), e o corpo do texto usava Manrope.

## A. Resumo das alterações

- **Sistema de design centralizado** em `src/index.css`, com tokens de cor, estados, tipografia fluida, larguras, raios, sombras, movimento, foco e breakpoints. Os componentes deixaram de ter cores hexadecimais soltas. As únicas exceções são as sombras e sobreposições `rgb(...)`, que derivam da própria paleta.
- **Paleta da Fase 12** aplicada a todo o site: grafite `#111418`, superfície `#1C2229`, laranja provisório `#F97316`, fundo claro `#F5F6F8`, cinza `#88919B` e branco.
- **Tipografia:** Sora (600/700) nos títulos e Inter (400–700) no corpo, com escala fluida em `clamp()` e fonte de reserva com métricas ajustadas para reduzir o salto de layout (CLS).
- **Cabeçalho:** fica transparente sobre o banner e passa a sólido e compacto (80 → 64 px) na rolagem. A navegação tem indicador laranja no item ativo, e o botão de contato fica em destaque. O menu mobile foi redesenhado e mantém todos os links, o Esc, o fechamento ao navegar e o bloqueio de rolagem.
- **Marca:** o quadro tracejado "LOGO" foi trocado por um tratamento tipográfico provisório (barra laranja + nome + "Locação de motos" vindos de `site.ts`). Não é um logotipo novo.
- **Banner principal (cinematográfico):** no desktop a foto é ampla e se funde ao fundo pela esquerda, com máscara suave e **sem recorte extra** (mantém 4:3). No celular a foto aparece inteira, abaixo do texto. O título usa a escala `display`. A paralaxe de mouse foi removida.
- **Cards de motos:** imagem em destaque de ponta a ponta, sombra e zoom leves no hover, ficha rápida em bloco, botão principal "Ver detalhes" e botão secundário de WhatsApp. Os nomes longos quebram em duas linhas em vez de serem cortados.
- **Componentes globais padronizados:** botões (raio de controle, `primary` com brilho no hover), filtros, carrossel (setas e indicadores), galeria, acordeão, campos e chips do formulário, diálogo de contato (estado de sucesso em verde ao copiar), avisos demonstrativos, selos, espaços reservados de imagem, estados vazios, faixas de abertura das páginas e rodapé.
- **Rodapé:** linha de destaque no topo, colunas com títulos curtos, links com área de toque maior e ícones sociais quadrados.
- **Ritmo:** espaçamento entre seções fluido (`--section-space`), margens laterais fluidas (`--gutter`) e a alternância claro/escuro que já existia mantida.
- Foram removidos elementos decorativos sem função: as "linhas de velocidade" animadas e a textura listrada do banner.

## B. Arquivos modificados

| Arquivo | Finalidade |
|---|---|
| `src/index.css` | Tokens, escala tipográfica, utilitários (`container-page`, `section-y`, `bleed-x`, `eyebrow`, `scrim-*`, `mask-hero`), foco, validação e movimento reduzido |
| `index.html` | Fontes Sora + Inter (só os pesos usados) e `theme-color` |
| `public/favicon.svg` | Cores da nova paleta |
| `src/components/ui/Button.tsx` | Variantes e tamanhos com nova hierarquia |
| `src/components/ui/SectionHeading.tsx` | Rótulo, título e descrição na nova escala |
| `src/components/ui/Accordion.tsx`, `DemoNotice.tsx`, `SmartImage.tsx` | Visual padronizado, contraste do "A informar" no fundo escuro |
| `src/components/ui/SpeedLines.tsx` | Removido (decorativo) |
| `src/components/layout/Header.tsx`, `Logo.tsx`, `PageHeader.tsx`, `Footer.tsx` | Cabeçalho compacto, marca tipográfica, faixa de abertura e rodapé |
| `src/sections/Hero.tsx` | Banner cinematográfico |
| `src/sections/Acquisition.tsx`, `About.tsx`, `HowItWorks.tsx`, `FinalCta.tsx` | Tipografia, sobreposições e superfícies (mesma estrutura) |
| `src/components/motorcycles/*` | Card, carrossel, grade, filtro, galeria, painel comercial, ficha técnica, relacionadas, barra fixa mobile |
| `src/components/contact/*` | Formulário, diálogo e botão flutuante |

Nenhum arquivo de dados (`src/config/*`), tipo, rota ou lógica (`src/lib/*`) foi alterado.

## C. Sistema de design

**Cores** (`@theme` em `src/index.css`):

| Token | Valor | Uso |
|---|---|---|
| `graphite` | `#111418` | Fundo escuro principal |
| `graphite-800` | `#1C2229` | Superfícies escuras secundárias |
| `graphite-700` / `-600` | `#262E37` / `#36404B` | Hover e bordas no escuro |
| `ice` | `#F5F6F8` | Fundo claro |
| `steel` | `#DDE1E6` | Bordas e espaços reservados no claro |
| `gray` / `muted-dark` | `#88919B` | Texto secundário no escuro (5,7:1) |
| `muted` | `#59626C` | Texto secundário no claro (5,6:1) |
| `accent` | `#F97316` | Laranja provisório: botões e destaques (texto grafite por cima, 6,4:1) |
| `accent-soft` / `accent-strong` | `#FB8A3C` / `#EA580C` | Hover / pressionado |
| `accent-ink` | `#C2410C` | Laranja para texto em fundo claro (5,2:1) |
| `success`, `danger` (+ `-dark`) | | Feedback de sucesso e erro |

**Tipografia:** `font-display` = Sora, `font-sans` = Inter. A escala fluida é `text-display` (40→76 px), `text-h1` (36→60), `text-h2` (30→48), `text-h3` (20→26), `text-lead` (17→20) e `eyebrow` (12 px, maiúsculas só em rótulos curtos).

**Demais tokens:**
- Larguras: `container-page` 80rem e `container-text` 40rem.
- Raios: `control` 10 px, `media` 16, `card` 20 e `panel` 28.
- Sombras: `card`, `card-hover`, `float` e `accent`.
- Movimento: `ease-out-soft`, transição padrão de 200 ms e `--duration-*`.
- Foco: `--focus-ring` (laranja, 2 px, afastamento de 3 px).
- Breakpoints: 640, 768, 1024, 1280 e 1536 px.
- Ritmo: `--header-h` 80 px, `--header-h-compact` 64 px, `--section-space` 72→128 px e `--gutter` 20→40 px.

**Padrões:** botões `primary` (ação principal), `dark`/`light` (fortes neutros), `outline`/`outline-light`/`ghost` (secundários). Ícones de ação são circulares, e os botões de texto usam raio de controle.

## D. Preservação funcional

Verificado no navegador (Chromium, build de produção):
- Rotas `/`, `/motos`, `/motos/:slug` (as 4 motos), `/veiculos` (redireciona), slug inexistente e 404.
- Fluxo catálogo → clique no card → página da moto (`/motos/honda-cg-160-fan`, título correto).
- Menu mobile: abre, `aria-expanded`, fecha com Esc e fecha ao escolher um destino (âncora `#como-funciona`).
- Botão de contato sem WhatsApp configurado abre o diálogo demonstrativo com a mensagem da moto.
- "Detalhar minha consulta" abre o formulário com a moto pré-selecionada.
- Cabeçalho compacto na rolagem (80 → 64 px).
- Com `prefers-reduced-motion`, a rolagem suave é desligada.
- Motos de exemplo continuam com o selo "Moto de exemplo" e fotos ilustrativas com o selo. "Fotos em breve" continua coberto por teste.

Dados, mensagens do WhatsApp, validações e regras comerciais não foram tocados (os testes de `whatsapp`, `lib`, `conversion` e `publishing` passam sem alteração).

## E. Validação

| Comando | Resultado |
|---|---|
| `npm run lint` (oxlint) | Sem avisos |
| `npm run typecheck` (tsc -b) | Sem erros |
| `npm test` (vitest) | **73 de 73 testes passando** (6 arquivos) |
| `npm run build` | OK. CSS 66,7 → 75,3 kB (gzip 11,3 → 12,8 kB), JS 489,5 → 485,9 kB (gzip 153,2 → 151,9 kB) |
| Varredura em 360, 390, 768, 1024 e 1440 px, 9 páginas cada (Playwright) | 0 páginas com rolagem horizontal e 0 erros novos no console |

Capturas em `/mnt/project-files/fase12/capturas/`.

## F. Limitações

- **Fotos não puderam ser vistas.** O ambiente bloqueia `images.unsplash.com`, então as capturas mostram os espaços reservados no lugar das fotos. O enquadramento do banner com foto real deve ser conferido no ar.
- **LCP, CLS e INP não foram medidos** (sem Lighthouse ou dados reais neste ambiente). Não há números estimados neste relatório.
- Acessibilidade foi verificada de forma básica (teclado, foco, rótulos e contrastes calculados para os tokens). Não houve teste com leitor de tela.
- As fontes continuam vindo do Google Fonts (já liberado na CSP). Hospedá-las no próprio site exigiria uma nova dependência ou arquivos.
- O laranja é provisório e muda em um único lugar (`--color-accent*`).
- O logotipo real, as fotos oficiais e os dados de contato continuam pendentes.

## G. Próxima fase (Fase 13)

- Reformulação estrutural da página inicial (ordem e composição das seções), que esta fase não mexeu.
- Páginas individuais das motos e ferramentas de conversão, conforme o plano.
- Ao receber: logotipo, fotos oficiais (principalmente a CG 160 sendo pilotada para o banner) e cor oficial da marca, para substituir os tokens provisórios.
