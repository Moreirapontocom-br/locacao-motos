# Relatório da Fase 14: reposicionamento visual e experiência premium

Branch `fase-14`, com PR para a `main`. Nada foi mesclado nem publicado.

## 1. Resumo das alterações

A home ganhou ritmo de campanha automotiva, com um foco visual por seção e alternância entre fundos escuros e claros:

| # | Seção | Fundo | Foco |
|---|---|---|---|
| 1 | Hero | Grafite, foto em tela cheia | A foto, com título curto e duas ações |
| 2 | Frota | Claro | Cards grandes, foto em destaque, filtro por estilo |
| 3 | Editorial (mobilidade) | Grafite | Foto ampla que vaza até a borda |
| 4 | Encontre sua próxima moto (novo) | Branco | Seletor em etapas |
| 5 | Modalidades (comparação) | Grafite | Duas colunas com as mesmas linhas |
| 6 | Como funciona (processo) | Claro | Abas por modalidade (mantidas) |
| 7 | Perguntas frequentes | Branco | Acordeão mais compacto, todo fechado |
| 8 | Contato final | Claro com painel grafite | Mantido |

- **Hero:** a foto ocupa todo o banner (antes ficava à direita, recortada). Sobre ela ficam só o rótulo, o título "Sua próxima moto começa aqui.", um subtítulo de uma frase, o botão principal **"Ver motos disponíveis"** (leva à frota) e o secundário **"Falar com a equipe"** (contato real ou aviso demonstrativo). A lista de três pontos com ícones saiu. No celular o texto fica na base da foto; no desktop, à esquerda, com degradê só onde há texto.
- **Frota:** cards sem caixa, com a foto como protagonista (4:3), nome em maiúsculas, papel do modelo ("Modelo principal da locação" / "Opção adicional"), estilo e cilindrada. A grade de três dados, a frase "Condições sob consulta" repetida em todo card e o botão "Ver detalhes" foram substituídos por uma seta circular na foto (o card inteiro continua clicável) e o botão de WhatsApp. Preço ou modalidades só aparecem no card se forem cadastrados oficialmente na moto. Duas colunas no desktop e no tablet, uma no celular.
- **Filtro na home:** Todas, Street, Naked e Trail, gerado a partir dos dados (some sozinho se houver menos de dois estilos). Os cards trocam com transição curta.
- **Encontre sua próxima moto:** etapa 1 (Trabalhar, Dia a dia, Interesse em aquisição futura, Explorar opções), etapa 2 (as duas modalidades de `modalities.ts`, mais "Ainda não decidi") e etapa 3 (resultado). Uma etapa por vez, "Etapa X de 3" com barra de progresso e lista de etapas no desktop, botão "Voltar" que mantém a resposta marcada, "Recomeçar", transição lateral entre etapas e foco levado ao título de cada etapa.
- **Resultado honesto:** não existe dado oficial que ligue objetivos ou modalidades a modelos. Por isso o resultado mostra as motos do catálogo com o aviso "Ainda não temos informações oficiais para indicar modelos por perfil…", sem dizer que são ideais. Quando uma moto tiver `modalities` oficiais em `motorcycles.ts`, o resultado passa a filtrar por elas sozinho (`src/lib/finder.ts`). O objetivo de uso nunca filtra nada.
- **Saídas do seletor:** cada moto leva à sua página (com evento `moto_interest_click`, origem `finder`), e o botão "Falar com a equipe sobre minha escolha" envia o objetivo e a modalidade na mensagem. A modalidade escolhida também segue para o contato final e o formulário, como já acontecia com os cards de modalidade.
- **Modalidades:** viraram uma comparação lado a lado no fundo grafite, com as mesmas três linhas nas duas colunas (Uso da moto, Aquisição da moto, Valores, prazos e requisitos). A lista de benefícios com ícones saiu. O selo "Maior destaque" virou um rótulo discreto "Destaque" com filete laranja. Nenhum preço, prazo, caução, parcela ou transferência foi afirmado.
- **Microinterações:** zoom suave na foto e seta que acende no hover dos cards, anel de foco no card inteiro, filtro com indicador animado, transições do seletor, entrada discreta por rolagem (`Reveal`). Tudo respeita "reduzir movimento" (`MotionConfig reducedMotion="user"` + regra CSS existente; no seletor o deslocamento lateral é zerado).

## 2. Arquivos modificados

| Arquivo | Alteração |
|---|---|
| `src/pages/HomePage.tsx` | Nova ordem das seções e o seletor |
| `src/sections/Hero.tsx` | Reescrito: foto em tela cheia, CTAs novos |
| `src/sections/FeaturedMotorcycles.tsx` | Cards maiores, filtro por estilo, transição |
| `src/components/motorcycles/MotorcycleCard.tsx` | Novo visual (também usado em `/motos` e nas relacionadas) |
| `src/sections/Editorial.tsx` | Rótulo, texto sobre mobilidade e uma ação ("Encontrar minha moto") |
| `src/sections/RentalModes.tsx` | Comparação em duas colunas, fundo grafite |
| `src/sections/HowItWorks.tsx` | Só fundos (claro), conteúdo e abas mantidos |
| `src/sections/Faq.tsx`, `src/components/ui/Accordion.tsx` | Acordeão começa fechado e com tipografia menor |
| `src/config/content.ts` | Textos do hero, frota, editorial, processo e do seletor (`finder`); `hero.points` removido |
| `src/config/modalities.ts` | `benefits` substituído por `comparison` + `comparisonLabels`; selo "Destaque" |
| `src/config/commercial.ts` | Mensagem `finder` de WhatsApp |
| `src/lib/whatsapp.ts` | Origem `finder` e campo `goal` no contexto |
| `src/App.test.tsx` | Testes do hero e da vitrine atualizados; teste do filtro |

## 3. Novos componentes e arquivos

- `src/sections/MotoFinder.tsx`: seletor "Encontre sua próxima moto".
- `src/lib/finder.ts`: correspondência só por modalidades oficiais cadastradas.
- `src/finder.test.tsx`: 9 testes do seletor e da correspondência.

## 4. Funcionalidades preservadas

Rotas (`/`, `/motos`, `/motos/:slug`, 404), catálogo com carrossel e filtro por URL em `/motos`, páginas individuais, galerias, formulário de interesse, contato por WhatsApp/telefone/e-mail com aviso demonstrativo quando não há número, botão flutuante, barra de contato da página da moto, selos de foto ilustrativa e de moto de exemplo, espaços reservados para fotos ausentes, navegação, rodapé e configuração de publicação (`wrangler.jsonc`, `_headers`). `src/config/site.ts` e `src/config/motorcycles.ts` **não** foram alterados. Nenhuma biblioteca nova. Nenhuma cor ou fonte nova: só os tokens da Fase 12.

**Decisão:** `/motos` continua com o carrossel (pedido do cliente na Fase 11); as duas colunas foram aplicadas na frota da home. Se quiserem grade também em `/motos`, é uma troca pequena.

## 5. Testes executados

| Comando | Resultado |
|---|---|
| `npm run lint` | Sem avisos |
| `npm run typecheck` | Sem erros |
| `npm test` | **89 de 89** passando (7 arquivos; eram 79) |
| `npm run build` | OK. CSS 78,4 kB (gzip 13,1), JS 493,8 kB (gzip 154,0) |
| Playwright (Chromium, build de produção) em 360, 390, 768, 1024 e 1440 px | 0 rolagem horizontal, 0 erros de JavaScript |

Testes novos cobrem: uma pergunta por vez com progresso; avançar, voltar com a resposta mantida e foco no título da etapa; uso só pelo teclado; resultado sem afirmar recomendação, sem "R$" nem "399", com motos de exemplo identificadas; link para a página da moto com evento; mensagem com objetivo e modalidade; modalidade chegando ao contato final; "Ainda não decidi" sem inventar modalidade; "Recomeçar"; correspondência por modalidade oficial; filtro da frota na home; CTAs do hero.

Não foram feitos Lighthouse nem teste com leitor de tela real.

## 6. Problemas e limitações

- **Fotos não verificadas:** o ambiente de trabalho bloqueia `images.unsplash.com`, então as capturas em `/mnt/project-files/fase14/capturas/` mostram espaços vazios no lugar das fotos. O enquadramento do hero em tela cheia (no celular a foto é cortada nas laterais, com o ponto focal um pouco à direita) e da seção editorial precisa ser conferido no ar depois da publicação.
- O hero agora depende muito da foto. Com a foto ilustrativa atual funciona, mas a foto oficial ideal é horizontal (16:9 ou 3:2, ~2000 px), com a moto à direita e área livre à esquerda para o texto.
- O seletor não recomenda modelos porque não há dado que sustente isso. Ele fica mais útil quando cada moto tiver suas modalidades oficiais cadastradas.
- O build de preview da Cloudflare nas branches de PR costuma falhar; isso não tem relação com o código (o build da `main` passa).

## 7. Informações reais que o cliente ainda precisa fornecer

- Nome oficial, logotipo, WhatsApp, telefone, e-mail, endereço, horário e domínio.
- Fotos reais: uma foto horizontal de CG 160 para o hero e fotos de cada moto (4:3).
- Quais modelos aceitam cada modalidade (isso ativa a correspondência do seletor).
- Preços, prazos, caução, taxas, documentos, critérios de aprovação, manutenção, seguro, devolução e regras de aquisição.
- Confirmação das motos de 300 cc (CB 300F Twister e XRE 300 Sahara), hoje marcadas como exemplo.
