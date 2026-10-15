# Relatório — Fase 15: Redesign visual da home

Data: 15/10/2026 · Branch: `fase-15` · Base: `main` (Fase 14.2)

## Resumo

Redesign da camada visual da home, sem reconstruir o site. A paleta, as fontes (Sora e Inter), o conceito comercial, as duas modalidades e toda a lógica das perguntas foram mantidos. A imagem de referência foi usada só para a composição: o nome "MOTORA", os modelos Yamaha Fazer 250 e Honda PCX 160 e a faixa de benefícios ("Sem burocracia", "Planos flexíveis"...) **não** foram copiados, porque não são dados confirmados.

## Principais mudanças visuais

### 1. Capa (hero)
- A capa ficou mais minimalista: rótulo, título em duas linhas ("Sua próxima moto" em branco, "começa aqui." em laranja), uma linha de apoio e o cartão de perguntas.
- O subtítulo foi reduzido para "Locação tradicional ou com possibilidade de aquisição.".
- **As perguntas interativas agora ficam dentro da capa**, à esquerda, como na referência. A foto da moto ocupa a direita no desktop e o topo no celular, fundindo-se ao fundo.
- O título não está mais em maiúsculas. O botão laranja grande deu lugar ao cartão de perguntas como ação principal. "Ver motos disponíveis" e "Falar com a equipe" continuam na capa, como links discretos abaixo do cartão.
- O selo "Foto ilustrativa" continua.

### 2. Perguntas interativas ("Encontre sua próxima moto")
- Mesmas perguntas, respostas, regras e lógica da Fase 14 (`lib/finder.ts` não foi alterado).
- Novo cartão escuro translúcido com contador "01 / 03", barra de progresso em 3 segmentos e botão circular de voltar.
- Opções em blocos compactos com um ícone discreto cada, estado selecionado em laranja com marca de seleção.
- Resultado em lista compacta (miniatura, nome, estilo e cilindrada, selo "Exemplo"), com o aviso de que não há indicação oficial por perfil, o botão "Falar com a equipe sobre minha escolha" e "Recomeçar".
- Transição lateral suave entre as etapas, que respeita "reduzir movimento". O foco continua indo para o título de cada etapa.
- A seção separada "Duas perguntas. Um caminho." saiu do meio da home: o seletor agora é só o da capa (mantém o `id="encontre"`, então os links para `/#encontre` continuam funcionando).

### 3. Frota
- Fundo branco, cabeçalho com "Ver todas as motos" ao lado do título.
- Cards com a foto em destaque sobre um fundo claro neutro, quatro por linha no desktop (2 no tablet, 1 no celular).
- Menos informações visíveis: só o nome, uma etiqueta (estilo · cilindrada) e a seta de detalhes. A linha do modelo e o ano saíram do card (continuam na página da moto).
- O atalho de WhatsApp de cada moto foi para o canto da foto, discreto.
- Dados, links, filtro por estilo e selos "Moto de exemplo" foram preservados. O mesmo card é usado no catálogo `/motos`.

### 4. Demais seções
- **Cabeçalho**: fundo transparente sobre a capa e CTA em formato de pílula, "Falar no WhatsApp".
- **Como funciona**: título "Em poucos passos, você chega à sua moto.", abas em pílula e etapas com ícone numerado em vez dos números gigantes vazados. O aviso final virou uma linha simples.
- **CTA final**: título com destaque em laranja ("Pronto para escolher **sua próxima moto?**"), foto à direita (topo no celular), botão principal com mais peso e canais de contato em linha discreta. O formulário opcional e o aviso de demonstração continuam.
- **Hierarquia**: todos os títulos de seção agora usam o mesmo padrão (rótulo com filete → título h2 sem maiúsculas → uma linha de apoio). A faixa editorial deixou de usar o título gigante em maiúsculas.
- Modalidades e FAQ mantiveram o conteúdo e o visual da Fase 14.2.

## Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/sections/Hero.tsx` | Nova composição da capa, com o seletor dentro |
| `src/sections/MotoFinder.tsx` | Seletor redesenhado como cartão da capa (lógica igual) |
| `src/pages/HomePage.tsx` | Seletor removido do meio da página (agora na capa) |
| `src/components/motorcycles/MotorcycleCard.tsx` | Card da frota redesenhado |
| `src/sections/FeaturedMotorcycles.tsx` | Cabeçalho, filtro e grade da frota |
| `src/sections/HowItWorks.tsx` | Etapas simplificadas |
| `src/sections/FinalCta.tsx` | CTA final redesenhado |
| `src/sections/Editorial.tsx` | Título no padrão das demais seções |
| `src/components/layout/Header.tsx` | Cabeçalho transparente e CTA "Falar no WhatsApp" |
| `src/config/content.ts` | Textos mais curtos (subtítulo da capa, frota, como funciona) e títulos em duas partes |
| `src/lib/whatsapp.ts` | O rótulo "Falar no WhatsApp" também se adapta quando o canal é telefone ou e-mail |
| `src/index.css` | Máscara da foto da capa no celular e degradê da capa ajustado |

## Testes realizados
- `npm run build` (TypeScript + Vite): compila sem erros.
- `npm run lint` (oxlint): sem avisos.
- `npm test` (Vitest): **89 de 89 testes passando**, incluindo os fluxos do seletor (uma pergunta por vez, voltar mantendo a resposta, foco no título, uso só pelo teclado, "Ainda não decidi", "Recomeçar", contato levando objetivo e modalidade, modalidade seguindo para o contato final), filtro da frota, abas do "Como funciona", FAQ, catálogo e página da moto.
- Capturas em 1440 px e 390 px da home, da capa, das três etapas do seletor, da frota, do "Como funciona", do contato e do catálogo (pasta `capturas/`).

## Observações
- O ambiente de nuvem bloqueia o Unsplash, por isso as capturas mostram os espaços das fotos vazios ("Imagem indisponível"). No site publicado as fotos ilustrativas aparecem normalmente.
- Continua faltando a foto oficial da CG 160 para a capa e as fotos reais da frota.
- Nada foi publicado: o PR aguarda o "pode lançar" para entrar na `main`.
