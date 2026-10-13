# Relatório da Fase 10: consolidação técnica e preparação para publicação

Data: 13/10/2026 · Branch: `fase-10` (criada a partir de `fase-9`)

## Resumo

O código está consolidado e pronto para a personalização final. Esta fase:

- corrigiu os contrastes pendentes;
- corrigiu um erro que derrubava o catálogo quando uma moto era cadastrada sem fotos;
- preparou exemplos de hospedagem para Vercel e Netlify, testados com os cabeçalhos de segurança;
- atualizou o `PUBLICACAO.md`.

Nada foi publicado e nada foi mesclado na `main`.

**Correção da Fase 9:** o relatório anterior dizia que os textos "a informar" tinham contraste de 4,35:1. Isso valia só para o fundo escuro. Na seção "Sobre nós", de fundo claro, o contraste era **2,95:1**. A auditoria não detectou porque a animação de entrada escondia esses textos durante a varredura. Nesta fase repeti a auditoria com animações reduzidas, que mostra todo o conteúdo, e o problema foi corrigido.

---

## 1. Alterações realizadas, por arquivo

| Arquivo | Alteração | Motivo |
| --- | --- | --- |
| `src/components/ui/DemoNotice.tsx` | `Pending` ganhou a opção `tone`. No fundo escuro (padrão), a opacidade passou de 70% para 75%. No fundo claro (`tone="light"`), de 70% para 95% | Contraste AA: escuro 4,35 → **4,81:1**, claro 2,95 → **4,88:1** |
| `src/sections/About.tsx` | Os 4 marcadores "a informar" usam `tone="light"` | Única seção de fundo claro com esses marcadores |
| `src/components/ui/SmartImage.tsx` | Texto do espaço reservado (foto ausente ou com falha) no tom claro: `text-muted` → `text-graphite/65` | Contraste 4,38 → **4,83:1**, com tom praticamente igual |
| `src/components/motorcycles/MotorcycleCard.tsx` | Moto sem fotos (`images: []`) mostra "Fotos em breve" no card | **Erro corrigido:** o card lia `images[0].src` e a página inteira (home, catálogo, recomendações) quebrava com "Cannot read properties of undefined". O `PUBLICACAO.md` já prometia esse comportamento |
| `src/components/motorcycles/fotos.test.tsx` (novo) | 2 testes: card e galeria sem fotos | O teste do card falhava antes da correção e passa depois |
| `docs/hospedagem/vercel.json` (novo) | Exemplo para a Vercel: fallback de SPA, cabeçalhos de segurança, CSP e cache | Não vincula o projeto: só tem efeito se for copiado para a raiz |
| `docs/hospedagem/netlify.toml` (novo) | O mesmo para a Netlify, com comentários | Idem |
| `package.json` / `package-lock.json` | Campo `engines` com Node `^20.19.0 \|\| >=22.12.0`, a mesma exigência do Vite 8 | As hospedagens usam esse campo para escolher a versão do Node no build. No lockfile mudou só esse campo |
| `PUBLICACAO.md` | Roteiro rápido de personalização, nova seção 8 (hospedagem, fallback, HTTPS, cabeçalhos, CSP, privacidade) e checklist de hospedagem atualizado | Item 5 do pedido |
| `README.md` | Seção "Publicação" aponta para `docs/hospedagem/` | Coerência com o guia |
| `docs/RELATORIO-FASE10.md` | Este relatório | |

O numeral decorativo do hero não foi alterado, como pedido.

### Comparação visual

Comparei as capturas de página inteira da `fase-9` e da `fase-10` em 390, 768 e 1366 px, em 4 páginas, pixel a pixel. Só mudam os textos dos marcadores "a informar" e dos espaços reservados de foto, que ficaram levemente mais legíveis. Não mudaram o tamanho das páginas, o layout, as cores de fundo, os botões, os títulos nem as animações. No rodapé escuro, a maior diferença é de 7 em 255 por canal de cor, imperceptível. No fundo claro, onde a correção era necessária, chega a 56.

---

## 2. Situação das branches e integração pendente

```
main     a97c4e5  Fase 7
fase-8   6e40404  Fase 8         (PR #1 → main, aberto)
fase-9   2ec5120  Fase 9         (PR #2 → fase-8, aberto)
fase-10  <novo>   Fase 10        (PR #3 → fase-9, aberto)
```

- O histórico é **linear**: cada fase parte exatamente da anterior. Não há divergência, conflito nem commit perdido. Todas as melhorias das fases 7, 8 e 9 estão na `fase-10`, e os 70 testes cobrem os comportamentos aprovados (WhatsApp por contexto, aquisição desligada, nenhuma menção a carros, etc.).
- A `main` ainda está na Fase 7. **Nada das fases 8, 9 e 10 está integrado.**
- Integração recomendada, que **depende da sua aprovação**:
  1. Mesclar o PR #1 (fase-8 → main).
  2. Mesclar o PR #2. O GitHub muda a base dele para `main` automaticamente quando a branch `fase-8` é apagada no merge. Se a branch for mantida, troque a base do PR para `main` antes.
  3. Mesclar o PR #3 da mesma forma.

  Alternativa equivalente: como o histórico é linear, mesclar só o PR #3 depois de mudar a base dele para `main` leva as três fases de uma vez. Nesse caso, feche os PRs #1 e #2.
- Nenhuma configuração remota foi alterada: sem proteção de branch, sem integração com provedor e sem merge.
- O repositório não tem CI (GitHub Actions). As validações abaixo foram feitas localmente.

---

## 3. Problemas corrigidos e problemas restantes

### Corrigidos nesta fase
1. Contraste dos marcadores "a informar" no fundo escuro (4,35 → 4,81:1) e no fundo claro (2,95 → 4,88:1).
2. Contraste do texto do espaço reservado de foto (4,38 → 4,83:1).
3. **Erro:** moto sem fotos derrubava a home e o catálogo.

### Restantes (nenhum impede a publicação)

| Problema | Situação |
| --- | --- |
| Numeral decorativo do hero (4,4:1) | Mantido por decisão sua (decorativo e `aria-hidden`) |
| O nome acessível do logotipo provisório não inclui a palavra "LOGO" | Some ao configurar o logotipo oficial |
| Rota inexistente responde HTTP 200 (página "não encontrada" com `noindex`) | Limitação de SPA. Um 404 real exigiria pré-renderizar o site, uma mudança grande e fora do escopo |
| Fontes carregadas do Google Fonts (privacidade) | Documentado. Hospedar as fontes no próprio site é opcional e pede aprovação |
| Teste em iPhone e Android reais e Lighthouse na URL final | Dependem da publicação. Estão no checklist |
| Imagem com `src` apontando para arquivo inexistente no **logotipo** mostra o ícone de imagem quebrada do navegador | Só acontece com erro de configuração. O guia orienta conferir o arquivo |

### Desempenho: análise do JavaScript (486,7 KB, 152,3 KB gzip)

Composição medida pelo *sourcemap* do build:

| Parte | Tamanho (sem compressão) |
| --- | --- |
| react-dom | 204 KB |
| Motion (animações) | 127 KB |
| Código do site | 84 KB |
| React Router | 38 KB |
| React, Lucide e outros | 22 KB |

**Decisão: não dividir o carregamento por rota.** Os componentes exclusivos da página da moto (galeria, painel comercial, ficha, barra fixa, recomendações) somam cerca de 16 KB, uns 5 KB com gzip, ou 3% do total. React, Motion e o Router são usados em todas as páginas e não podem ser adiados. Dividir traria uma espera e um estado de carregamento na primeira abertura de uma moto, com risco de piscar a tela e de interferir na rolagem e nas animações, em troca de um ganho mínimo. As animações foram todas preservadas.

O que de fato reduz o tempo de carregamento na publicação, e já está documentado: cache longo dos arquivos com hash (nos exemplos), compressão gzip/brotli (automática na Vercel e na Netlify), fotos reais otimizadas em 4:3 com até ~300 KB e a remoção do `preconnect` do Unsplash.

### Imagens ausentes ou com falha

| Situação | Comportamento verificado |
| --- | --- |
| Moto sem fotos (`images: []`) | "Fotos em breve" no card e na galeria (**corrigido no card**) |
| Foto que falha ao carregar | Espaço reservado com ícone e descrição, sem quebrar o layout (testado com o Unsplash bloqueado) |
| Miniatura que falha | Espaço reservado oculto para leitores de tela (o botão já tem rótulo) |
| Foto institucional vazia (`src: ''`) | Quadro reservado "foto oficial" |

---

## 4. Resultados dos testes

| Verificação | Resultado |
| --- | --- |
| `npm test` | ✅ **70/70** em 6 arquivos (68 anteriores + 2 novos) |
| `npm run lint` | ✅ Sem avisos |
| `npm run build` | ✅ JS 486,7 KB (152,3 KB gzip), CSS 65,1 KB (11,1 KB gzip). Lista os 12 dados oficiais pendentes, como esperado |
| `npm audit --omit=dev` | ✅ 0 vulnerabilidades |
| `npm ci` | ✅ Instala limpo com o lockfile |
| Acessibilidade (axe-core, com animações reduzidas para revelar todo o conteúdo) | ✅ Nenhum problema de contraste nos textos informativos. Restam só o numeral decorativo e o logotipo provisório (seção 3) |
| Rolagem lateral (320, 390, 768, 1024, 1366, 1920 px × 5 páginas) | ✅ Nenhuma |
| CSP e cabeçalhos dos exemplos (servidor local com os mesmos cabeçalhos) | ✅ Nenhuma violação em home, catálogo, filtro, moto, galeria ampliada, formulário, aviso de contato e 404 |
| Fallback de SPA (acesso direto a `/motos/sport-400` e a uma rota inexistente) | ✅ Página certa. `robots.txt` continua servido como arquivo |
| WhatsApp (número de teste, não gravado no código) | ✅ Todos os botões geram `wa.me` com a moto correta. O formulário monta "Moto / Modalidade / Uso" |
| Sem WhatsApp configurado | ✅ Aviso "canal em configuração" com a mensagem preparada. Esc fecha e devolve o foco |
| Navegação | ✅ Menu do celular (Esc), âncoras vindas de outra página, "Pular para o conteúdo", filtro com URL, galeria (miniaturas, ampliação, Esc) |

Limitações do ambiente: as fotos do Unsplash e o Google Fonts não carregam aqui (rede bloqueada), e não há aparelhos reais.

---

## 5. Instruções para publicação

Resumo; o passo a passo está no `PUBLICACAO.md`, seções 1 a 8 e checklist:

1. **Integrar as branches** (seção 2 deste relatório), com sua aprovação.
2. **Personalizar** pelos arquivos de configuração (roteiro rápido no início do `PUBLICACAO.md`):
   - `src/config/site.ts`
   - `src/config/motorcycles.ts`
   - `src/config/commercial.ts`
   - `src/config/content.ts`
   - `public/` e `public/images/frota/`
3. Rodar `npm run build` e confirmar que **nenhum dado pendente** aparece. Depois, `showDemoNotices: false`.
4. **Escolher a hospedagem** (decisão e eventual contratação são do cliente) e copiar o exemplo de `docs/hospedagem/` para a raiz.
5. **Domínio e HTTPS**, com redirecionamento de `http` para `https`. Ativar o HSTS só depois de confirmar o HTTPS.
6. Retirar o Unsplash da CSP e do `index.html` quando não houver mais fotos de lá.
7. Conferir o site publicado:
   - acesso direto a uma moto;
   - WhatsApp no celular e no computador;
   - securityheaders.com;
   - console sem erros de CSP;
   - Lighthouse;
   - iPhone e Android reais.
8. Enviar o `sitemap.xml` ao Google Search Console.

---

## 6. Dados ainda pendentes do cliente

Nenhum dado foi inventado. Os itens abaixo continuam vazios ou marcados como demonstrativos:

- [ ] Nome comercial e descrição institucional (hoje "Nome da Empresa")
- [ ] Logotipo e favicon
- [ ] Domínio oficial
- [ ] Número de WhatsApp comercial
- [ ] Telefone e e-mail
- [ ] Endereço, link do mapa e horário de atendimento
- [ ] Redes sociais
- [ ] Razão social e CNPJ
- [ ] Frota real (as 7 motos atuais são exemplos com `demo: true`) e ficha técnica de cada moto
- [ ] Fotos reais das motos e fotos institucionais (fachada, equipe)
- [ ] História da empresa (o 2º parágrafo de "Sobre nós" é provisório)
- [ ] Modalidades de locação confirmadas. A aquisição continua **desligada** (`acquisition.confirmed: false`)
- [ ] Preços e disponibilidade, se a empresa quiser exibi-los (hoje "sob consulta")
- [ ] Política de privacidade e links legais, se houver
- [ ] Identidade visual definitiva, se for diferente da atual
- [ ] Escolha da hospedagem e do domínio

O escopo continua exclusivamente de locação de motos (há um teste automatizado que garante que nenhum texto fala em carros).

---

## 7. Nota técnica atualizada: **9 / 10**

- **Subiu de 8,5 para 9:**
  - os contrastes dos textos informativos estão dentro do AA;
  - um erro real de quebra de página foi eliminado e ganhou teste;
  - a hospedagem está preparada e testada (fallback, cabeçalhos, CSP sem bloqueios);
  - o guia de personalização está completo.
- **Falta para 10:** teste em aparelhos reais e Lighthouse na URL publicada, e a integração das branches na `main`. Os dois dependem de etapas fora do código.

## Pronto para a Fase 11?

**Sim.** O projeto está pronto para iniciar a Fase 11 (personalização final e entrega ao cliente). Antes de começar, falta uma única ação, que depende da sua aprovação: **integrar os PRs #1, #2 e #3 na `main`**, para que a personalização parta da versão final consolidada. Depois disso, a Fase 11 é preencher os arquivos de configuração com os dados reais da seção 6, sem mudanças de código.

---

## Adendo: hospedagem escolhida (13/10/2026)

A hospedagem recomendada é a **Cloudflare** (Workers com arquivos estáticos, plano gratuito). Ela já está configurada no repositório:

- `wrangler.jsonc`: publica `dist/` com o fallback de SPA;
- `public/_headers`: cabeçalhos de segurança, CSP e cache.

| | Cloudflare | Netlify (grátis) | Vercel (Hobby) |
| --- | --- | --- | --- |
| Site comercial no plano gratuito | Sim | Sim | Não (exige o Pro, US$ 20/mês) |
| Tráfego | Estáticos ilimitados | ~15 GB/mês | 100 GB/mês |
| Ao passar do limite | Continua no ar | Site pausado | Recursos bloqueados |

Validação local com o simulador oficial (`wrangler dev` 4.150):

- `/`, `/motos`, `/motos/sport-400` e uma rota inexistente respondem 200 com o `index.html`;
- `robots.txt` e `/assets/*` são servidos como arquivo, com cache de 1 ano nos assets;
- `/_headers` não é exposto;
- os 6 cabeçalhos aparecem em todas as respostas;
- no Chromium, nenhuma violação de CSP em home, catálogo, filtro, página da moto, galeria, formulário, aviso de contato e 404.

O `wrangler deploy --dry-run` lê a configuração sem erros.

Nenhuma conta foi criada, nada foi publicado e nenhum domínio foi configurado. O passo a passo para quando a publicação for aprovada está no `PUBLICACAO.md`, seção 8.
