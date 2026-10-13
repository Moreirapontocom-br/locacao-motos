# Relatório da Fase 9: auditoria final e preparação para entrega

Data: 13/10/2026 · Base: branch `fase-8` (PR #1, ainda não mesclado em `main`) · Branch desta fase: `fase-9`

## Resumo

O site está tecnicamente pronto. Testes, lint e build passam, nenhuma página rola para os lados entre 320 e 1920 px e todos os botões de WhatsApp montam a mensagem certa para a moto escolhida. A auditoria encontrou cinco problemas de acessibilidade na marcação e corrigiu todos, sem mudar o visual: as capturas de tela de antes e depois são idênticas.

O que impede a publicação são dados que só a empresa pode fornecer: nome, logotipo, domínio, WhatsApp, frota e fotos reais.

**Escopo:** o pedido da fase fala em "carros e motos", mas o site é só de motos (decisão das fases anteriores, com um teste automatizado que garante que nenhum texto fala em carros). Nenhum carro foi incluído nesta fase. Se a empresa também alugar carros, isso é uma mudança de escopo e precisa de aprovação.

---

## 1. Funcionalidades verificadas e aprovadas

Verifiquei no Chromium (build de produção via `vite preview`) com larguras de 320, 360, 390, 414, 768, 1024, 1366 e 1920 px, e também com os testes automatizados.

| Área | Verificação | Resultado |
| --- | --- | --- |
| Páginas | Home, `/motos`, `/motos/:slug`, moto inexistente, rota inexistente (404) | ✅ Cada página tem título, descrição e um único `h1` |
| Links antigos | `/veiculos` e `/veiculos/:slug` redirecionam para `/motos` | ✅ |
| Layout responsivo | Rolagem lateral em 8 larguras × 6 páginas | ✅ Nenhuma ocorrência |
| Navegação | Menu do celular abre e fecha (inclusive com Esc) e as âncoras `#como-funciona`, `#sobre` e `#contato` rolam até a seção, vindo de outra página ou da mesma | ✅ |
| Teclado | O primeiro Tab mostra "Pular para o conteúdo". Na galeria ampliada, o foco vai para "Fechar", Esc fecha e o foco volta ao botão que abriu | ✅ |
| Filtro por estilo | Clique atualiza a URL (`?estilo=`), e o filtro também é aplicado quando a URL já vem com ele | ✅ |
| Galeria | Miniaturas (`aria-current`), setas, foto ampliada e espaço reservado quando a foto falha | ✅ |
| Formulário opcional | Abre recolhido, vem com a moto preenchida na página da moto e não pede dados pessoais | ✅ |
| Aviso sem WhatsApp | Sem número configurado, abre o aviso "canal em configuração" com a mensagem que seria enviada | ✅ |
| Erros de JavaScript | Console nas 6 páginas × 8 larguras | ✅ Nenhum erro do site (só as fotos do Unsplash, bloqueadas no ambiente de teste) |
| Segurança básica | Nenhum `innerHTML` ou `eval`. Todo link externo usa `rel="noopener noreferrer"`. O JSON-LD é escapado. O `npm audit` das dependências de produção encontrou 0 vulnerabilidades | ✅ |
| SEO | Títulos e descrições por página, `noindex` nas páginas de erro e `robots.txt` que bloqueia a indexação enquanto não há domínio. Sitemap e JSON-LD só são gerados com dados oficiais | ✅ |
| Troca de identidade e dados | Cores e fontes ficam em `src/index.css`, empresa e contatos em `src/config/site.ts`, frota em `src/config/motorcycles.ts`, mensagens e modalidades em `src/config/commercial.ts`, textos em `src/config/content.ts`. Fotos oficiais vão para `public/images/frota/` com `fleetPhoto()` | ✅ Tudo documentado em `PUBLICACAO.md` |

### WhatsApp (testado com um número fictício de teste, só no ambiente local)

Todos os links usam `https://wa.me/<número>`, abrem em nova aba com `noopener noreferrer` e levam o texto codificado:

| Onde | Mensagem enviada |
| --- | --- |
| Cabeçalho, botão flutuante, contato da home e rodapé | "Olá! Vim pelo site e tenho interesse em alugar uma moto." |
| Card do catálogo, destaques da home e "Você também pode gostar" | "Olá! Vi a moto **Sport 600** no catálogo do site e tenho interesse na locação. Gostaria de receber mais informações." |
| Página da moto (botão principal e barra fixa) | "Olá! Tenho interesse na locação da moto **Sport 400**. Gostaria de receber mais informações." |
| Modalidades | "Olá! Gostaria de conhecer as modalidades de locação de motos." |
| Perguntas frequentes | "Olá! Tenho uma dúvida sobre a locação de motos." |
| "Não encontrou a moto?" | "Olá! Vim pelo site e gostaria de saber quais motos estão disponíveis para locação." |
| Formulário (página da moto) | "Olá! Vim pelo site e gostaria de consultar a locação de uma moto. / • Moto: Sport 400 / • Modalidade: quero conhecer as opções / • Uso: Trabalho" |

O nome de cada moto vem de `motorcycles.ts`, e o fabricante entra quando `brand` é preenchido. O número de teste não foi gravado no código: `whatsapp` continua vazio.

---

## 2. Problemas identificados e corrigidos

Todos são de acessibilidade, foram encontrados pelo axe-core 4 e mudam só a marcação. Comparei as capturas de tela de página inteira, antes e depois, em 390, 768 e 1366 px, e elas são idênticas. A única diferença apontada aparece também ao comparar a versão original com ela mesma, porque vem do tempo de carregamento das imagens.

| # | Problema | Onde | Correção |
| --- | --- | --- | --- |
| 1 | `aria-label` em `<span>` sem papel: o leitor de tela ignorava "Instagram: perfil a informar" | `Footer.tsx` | Adicionado `role="img"` |
| 2 | `<dl>` com `div > div > dt/dd`, estrutura inválida que confunde leitores de tela (16 ocorrências) | `About.tsx` (Localização, Atendimento, Telefone, E-mail) | Cada linha virou um `<dl>` próprio, e o contêiner externo ficou `<div>` (mesmas classes) |
| 3 | Mesmo problema nos canais de contato | `FinalCta.tsx` | Mesma correção |
| 4 | Quando a miniatura da galeria não carrega, o espaço reservado era anunciado como "imagem sem nome" | `SmartImage.tsx` | Com `alt` vazio (imagem decorativa), o espaço reservado fica `aria-hidden`. Com `alt`, nada muda |
| 5 | Ordem de títulos no catálogo: `h1` pulava direto para os `h3` dos cards | `CatalogPage.tsx` | Título `h2` "Lista de motos" visível só para leitores de tela (`sr-only`) |

---

## 3. Problemas que ainda exigem intervenção

Nenhum deles impede o uso do site hoje. Não corrigi porque exigem uma mudança visual (proibida sem aprovação) ou uma decisão de hospedagem.

| Problema | Impacto | Recomendação |
| --- | --- | --- |
| Contraste levemente abaixo do AA (4,35:1, o mínimo é 4,5:1) nos textos "a informar" em itálico (`DemoNotice.tsx`, `opacity-70`) | Baixo. Esses textos **somem** quando os dados oficiais forem preenchidos | Nenhuma ação, se os dados chegarem antes da publicação |
| Contraste de 4,4:1 no numeral decorativo do hero (`Hero.tsx`, `text-white/45`, já `aria-hidden`) | Muito baixo (decorativo) | Opcional: subir para `text-white/50` (**mudança visual, precisa de aprovação**) |
| Contraste de 4,38:1 no texto do espaço reservado quando a foto falha (`SmartImage.tsx`) | Baixo (só aparece em falha de imagem) | Opcional: ajustar a cor (**precisa de aprovação**) |
| A ferramenta aponta que o nome acessível do logotipo não inclui a palavra "LOGO" do marcador provisório | Nenhum na prática | Some quando o logotipo oficial for configurado |
| Rota inexistente responde HTTP 200 (limitação de SPA). A página mostra "não encontrada" e tem `noindex` | Baixo para SEO | Aceitável. Para um 404 real seria preciso pré-renderizar, o que é mudança grande |
| Servidor precisa de *fallback* SPA (todas as rotas → `index.html`) | **Bloqueia a publicação** se esquecido: abrir `/motos/...` direto daria 404 do servidor | Configurar quando a hospedagem for escolhida (Netlify `_redirects`, Vercel `rewrites`, etc.). Não incluí arquivo de nenhum provedor porque a hospedagem ainda não foi escolhida |
| Cabeçalhos de segurança (HTTPS, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, CSP) | Médio | Configurar na hospedagem. Uma CSP precisa liberar Google Fonts (e Unsplash enquanto houver fotos de exemplo) |
| JavaScript em um único arquivo de 486 KB (152 KB gzip) | Baixo/médio em 3G | Aceitável para o tamanho do site. Dividir por rota seria uma otimização futura |
| Google Fonts e Unsplash carregados de terceiros | Desempenho e privacidade (LGPD: o IP do visitante vai ao Google) | Com fotos reais, remover o `preconnect` do Unsplash em `index.html`. Hospedar as fontes localmente é opcional (**pede aprovação**, pois mexe nas fontes) |
| Teste em aparelhos reais (iPhone/Android) e Lighthouse | Não executados neste ambiente | Fazer no checklist de publicação |

---

## 4. Informações e materiais pendentes do cliente

Todo conteúdo fictício está marcado no site com os selos "Moto de exemplo", "Imagem demonstrativa" ou "a informar". O `npm run build` lista o que falta.

- [ ] Nome comercial (hoje "Nome da Empresa") e descrição institucional
- [ ] Logotipo e favicon (hoje marcador "LOGO")
- [ ] Domínio oficial (libera indexação, sitemap e dados estruturados)
- [ ] **Número de WhatsApp comercial** (hoje vazio: os botões abrem o aviso demonstrativo)
- [ ] Telefone e e-mail
- [ ] Endereço, link do mapa e horário de atendimento
- [ ] Redes sociais
- [ ] Razão social e CNPJ
- [ ] **Frota real**: as 7 motos atuais (Urbana 160, Naked 300, Clássica 350, Sport 400, Custom 650, Sport 600, Touring 800) são exemplos fictícios (`demo: true`)
- [ ] **Fotos reais** de cada moto (hoje Unsplash, ilustrativas) e fotos institucionais (fachada, equipe)
- [ ] História da empresa (o 2º parágrafo de "Sobre nós" é provisório)
- [ ] Modalidades de locação confirmadas e se existe possibilidade de aquisição (hoje desligada)
- [ ] Preços e disponibilidade, se a empresa quiser exibi-los (hoje "sob consulta")
- [ ] Política de privacidade e links legais, se houver
- [ ] Identidade visual definitiva (as cores atuais são provisórias)
- [ ] Confirmação do escopo: só motos, ou também carros

Não há depoimentos, preços, prazos ou números inventados no site.

---

## 5. Testes e verificações de compilação

| Verificação | Comando | Resultado |
| --- | --- | --- |
| Testes automatizados | `npm test` | ✅ 68/68 (5 arquivos), antes e depois das correções |
| Lint | `npm run lint` (oxlint) | ✅ Sem avisos |
| Tipos + build | `npm run build` | ✅ JS 486,5 KB (152,3 KB gzip), CSS 64,7 KB (11,1 KB gzip). O build lista 12 dados oficiais pendentes, como esperado |
| Dependências | `npm audit --omit=dev` | ✅ 0 vulnerabilidades |
| Acessibilidade | axe-core em 6 páginas × 2 larguras | 5 tipos de problema corrigidos. Restam os contrastes listados na seção 3 |
| Rolagem lateral | 8 larguras × 6 páginas | ✅ Nenhuma |
| Fluxos no navegador | WhatsApp (todos os botões), formulário, galeria, menu, âncoras, aviso sem WhatsApp | ✅ |

Limitação do ambiente de teste: as fotos do Unsplash não carregam aqui (rede bloqueada). Por isso testei os espaços reservados de falha, mas não a aparência das fotos.

---

## 6. Checklist de publicação

**Antes de publicar (dados)**
- [ ] Preencher `src/config/site.ts` (nome, logo, domínio, WhatsApp, contatos, endereço, horário, redes, CNPJ)
- [ ] Cadastrar a frota real em `src/config/motorcycles.ts`, remover os exemplos `demo: true` e usar `fleetPhoto()`
- [ ] Trocar as fotos institucionais e o texto provisório em `src/config/content.ts`
- [ ] Confirmar modalidades/aquisição em `src/config/commercial.ts`
- [ ] `showDemoNotices: false`
- [ ] `npm run build` sem nenhum dado pendente listado
- [ ] Remover o `preconnect` do Unsplash em `index.html` quando não houver mais fotos de lá

**Verificações**
- [ ] `npm test`, `npm run lint` e `npm run build` sem erros
- [ ] WhatsApp abre a conversa certa no celular (app) e no computador (WhatsApp Web), com a moto correta na mensagem
- [ ] Teste em iPhone e Android reais e em um navegador de desktop
- [ ] Lighthouse (desempenho, acessibilidade, SEO) na URL publicada

**Hospedagem** (escolha e contratação dependem do cliente)
- [ ] *Fallback* SPA: todas as rotas devolvem `index.html`
- [ ] HTTPS ativo e redirecionamento de `http` para `https`
- [ ] Cabeçalhos de segurança (HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, CSP)
- [ ] `https://dominio/robots.txt` libera a indexação e `https://dominio/sitemap.xml` abre
- [ ] Sitemap enviado ao Google Search Console
- [ ] Prévia de compartilhamento conferida em uma página de moto
- [ ] Publicação aprovada pelo cliente

---

## 7. Nota de prontidão técnica: **8,5 / 10**

- **O que sustenta a nota:** testes, lint e build passam, não há erro de JavaScript nem rolagem lateral, o WhatsApp está correto em todos os pontos de contato, os dados estão centralizados e documentados, nada é inventado e o SEO se adapta ao ambiente.
- **O que falta para 10:** teste em aparelhos reais e Lighthouse na URL final, configuração de hospedagem (*fallback* SPA e cabeçalhos de segurança) e os pequenos ajustes de contraste que dependem de aprovação.
- **Prontidão comercial**, separada da técnica: o site **ainda não pode ir ao ar** até que o cliente envie WhatsApp, nome, domínio, frota e fotos reais.

Não publiquei o site, não contratei nem configurei serviços pagos e não alterei nenhum conteúdo comercial.
