# Relatório da Fase 14.2: refinamento visual premium intermediário

As alterações estão **só no ambiente de trabalho do Claude**, na branch local `fase-14-2`, criada a partir da `main` publicada. Por pedido do Rafa, **nada foi enviado ao Git e nada foi publicado**. O site no ar continua igual ao da Fase 14.

## 1. Diagnóstico inicial

- **Estrutura:** React + Vite + Tailwind 4, com os tokens em `src/index.css` (`@theme`), os textos em `src/config/content.ts`, a frota em `src/config/motorcycles.ts` e as modalidades em `src/config/modalities.ts`. Componentes reutilizáveis: `Button`, `ContactButton`, `SmartImage`, `SectionHeading`, `MotorcycleCard`, `StyleFilter`, `Reveal`.
- **Hero:** a foto cobria o banner inteiro, inclusive atrás do texto, e o degradê escurecia a imagem por igual. O botão secundário tinha o mesmo peso visual do principal.
- **Cards da frota:** o texto ficava solto embaixo da foto, sem um limite claro do card. O nome em maiúsculas pesava, e a seta sobre a foto só fazia sentido com mouse (no celular, o caminho para os detalhes não ficava evidente).
- **Fotos ausentes:** o espaço reservado mostrava a descrição longa da foto (ex.: "Moto street escura estacionada (foto ilustrativa)"), que parecia um erro.
- **Seletor:** a opção escolhida virava um bloco grafite inteiro, pesado demais; a barra de progresso era um traço único; os resultados eram miniaturas pequenas com nomes cortados.
- **Tipografia:** quase todos os títulos de seção estavam em maiúsculas, o que tirava hierarquia. A distância entre o título e o conteúdo variava de seção para seção.

## 2. Alterações por componente

- **Hero (`Hero.tsx`):** no desktop, a foto ocupa os 3/4 da direita e se funde ao fundo pela esquerda, ficando longe do texto. Os degradês novos escurecem só a área do texto e deixam a moto com luz natural. A fonte do título ficou mais forte (extra-bold), com uma sombra suave para legibilidade. Subtítulo e espaçamentos foram ajustados. O CTA principal ganhou brilho laranja e uma leve elevação no hover. O secundário, "Falar com a equipe", passou a ser um link discreto sublinhado. A hierarquia ficou: título → descrição → ação principal → ação secundária. Nenhum selo ou texto novo.
- **Cards da frota (`MotorcycleCard.tsx`):** card branco com cantos arredondados e borda fina, foto em cima (4:3, sem distorção), corpo com espaço interno de 24–28 px, papel do modelo em laranja pequeno, nome maior e sem maiúsculas, e estilo · cilindrada discretos. No rodapé do card ficam "Ver detalhes" (sempre visível, também no celular) e o botão de WhatsApp, menor. No desktop, o hover eleva o card 4 px com uma sombra mais profunda e um zoom leve na foto. O anel de foco do teclado contorna o card inteiro. Os dados continuam vindo de `motorcycles.ts`. A mudança vale também para `/motos` e para "Você também pode gostar".
- **Espaço sem foto (`SmartImage.tsx`):** textura de listras finas, ícone dentro de um círculo e rótulo curto: "Fotos em breve" (moto sem foto cadastrada) ou "Imagem indisponível" (falha ao carregar). A descrição completa continua para leitores de tela. Na hero, o espaço fica liso, sem texto atrás do título.
- **Seletor (`MotoFinder.tsx`):** a opção escolhida fica com fundo branco, borda laranja, halo laranja suave e marca de seleção. As opções sobem 1 px no hover e reagem ao clique. O progresso virou três segmentos que se preenchem com animação (transform). O botão "Voltar" ganhou contorno, como os demais. Perguntas e opções ficaram mais espaçadas, e os títulos saíram das maiúsculas. No resultado, as respostas aparecem em selos, o aviso "ainda não temos informações oficiais…" ficou em um bloco informativo com filete laranja, e cada moto virou um card com foto grande (16:10), nome, estilo · cilindrada e "Detalhes". A lógica não mudou: o resultado continua sem recomendar modelos por conta própria.
- **Seções:** os títulos de Frota, Seletor, Modalidades, Como funciona, FAQ e Contato estão em caixa normal (as maiúsculas ficaram só na hero e na editorial, que são as peças de campanha). Há uma distância padrão entre título e conteúdo (`--space-head`, utilitário `mt-head`). Os painéis escuros (modalidades e contato) ganharam um filete de luz no topo para dar profundidade.
- **Botões (`Button.tsx`):** nova variante `ghost-light` (ação secundária discreta em fundo escuro). O botão principal sobe 1 px no hover, e esse movimento é desligado quando o usuário pede menos movimento.

## 3. Arquivos modificados

`src/index.css`, `src/components/ui/Button.tsx`, `src/components/ui/SmartImage.tsx`, `src/components/motorcycles/MotorcycleCard.tsx`, `src/sections/Hero.tsx`, `src/sections/FeaturedMotorcycles.tsx`, `src/sections/MotoFinder.tsx`, `src/sections/RentalModes.tsx`, `src/sections/HowItWorks.tsx`, `src/sections/Faq.tsx`, `src/sections/FinalCta.tsx` (11 arquivos, +190 −117 linhas). Nenhum arquivo de configuração, teste ou biblioteca foi alterado.

## 4. Tokens novos (design system)

`--color-graphite-900` (grafite mais profundo, usado na hero), `--text-title` (título de card), `--radius-pill`, `--shadow-lift` (hover dos cards), `--shadow-inset-line` (filete de luz em superfícies escuras), `--ease-standard`, `--space-head` e `--lift`, além dos utilitários `mt-head`, `scrim-hero-desktop`, `scrim-hero-mobile` e `placeholder-texture(-dark)`. As cores continuam as mesmas: preto, grafite, branco e laranja.

## 5. Funcionalidades preservadas

Ordem das seções, textos comerciais, catálogo, filtros, páginas individuais, galerias, seletor (etapas, voltar, recomeçar, resultado honesto), WhatsApp e aviso demonstrativo, formulário, navegação e responsividade. Nenhum preço, moto, vantagem ou condição foi criado, e o R$ 399,90 não aparece.

## 6. Testes executados

| Verificação | Resultado |
|---|---|
| `npm run lint` | Sem avisos |
| `npm run typecheck` | Sem erros |
| `npm test` | **89 de 89** passando (sem alterar nenhum teste) |
| `npm run build` | OK. CSS 82,1 kB (gzip 13,8), JS 495,5 kB (gzip 154,5) |
| Playwright (Chromium, build de produção) em 360, 390, 768, 1024 e 1440 px | 0 rolagem horizontal, 0 erros de JavaScript; seletor percorrido até o resultado, seleção e voltar conferidos |

Os testes automáticos cobrem os CTAs (mensagens de WhatsApp por origem), o seletor por clique e por teclado, os espaços sem foto e a ausência de preços. Não foram feitos Lighthouse nem teste com leitor de tela real.

## 7. Pendências e recomendações

- **Fotos:** o ambiente bloqueia o Unsplash, então todas as fotos aparecem como "Imagem indisponível" nas capturas. A composição nova da hero (moto à direita) precisa ser conferida com a foto real. O ideal é uma foto horizontal de CG 160 com a moto no centro-direita.
- Capturas em `/mnt/project-files/fase14-2/capturas/`. Os arquivos `antes-*` são da Fase 14, para comparação.
- Para publicar: quando o Rafa aprovar, envio a branch e abro o PR. Mesclar continua dependendo de "pode mesclar".
- Dados do cliente ainda pendentes: nome, logotipo, WhatsApp, domínio, fotos reais, preços e condições, e quais motos entram em cada modalidade.
