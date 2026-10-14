# Relatório da Fase 13: reconstrução comercial da página inicial

Branch `fase-13`, com PR para a `main`. Nada foi mesclado nem publicado.

## A. Resumo executivo

A home deixou de ser um conjunto de seções genéricas e passou a explicar o modelo de negócio nos primeiros segundos: a empresa aluga motos, existem **duas modalidades** (locação com aquisição, em maior destaque, e locação tradicional), valores e condições são consultados com a equipe e há um caminho curto até o contato.

Nova ordem: **1** Hero, **2** Escolha sua modalidade, **3** Como funciona (abas), **4** Vitrine de motos, **5** Editorial, **6** Perguntas frequentes, **7** Conversão final. A seção antiga "Modalidades e aquisição" (que dizia que a aquisição não estava confirmada) foi substituída pelas duas modalidades confirmadas. Nenhum preço, prazo ou condição foi inventado, e o valor de R$ 399,90 de concorrente não aparece em lugar nenhum (há teste para isso).

## B. Arquivos modificados

| Arquivo | Alteração |
|---|---|
| `src/config/modalities.ts` (novo) | Fonte única das duas modalidades: nome, título, descrição, destaque, situação das condições (`a-confirmar`), benefícios, CTA, etapas e `confirmed` (dados contratuais, hoje ausente) |
| `src/config/commercial.ts` | As modalidades do formulário vêm de `modalities.ts`; aquisição passa a `confirmed: true` (a modalidade existe; as condições não); mensagem de WhatsApp por modalidade |
| `src/config/content.ts` | Textos do hero, modalidades, como funciona, vitrine, editorial, FAQ (8 perguntas) e contato final; navegação com "Modalidades" no lugar de "Sobre nós" |
| `src/lib/whatsapp.ts` | Contato final da home leva a modalidade escolhida; formulário diz "ainda não decidi" quando não há escolha |
| `src/components/contact/modalityContext.ts` (novo) | Guarda a modalidade escolhida na home até o contato final e o formulário |
| `src/components/contact/InterestForm.tsx` | Campo de modalidade chega pré-selecionado; primeira opção "Ainda não decidi" |
| `src/components/ui/ContactButton.tsx` | Props `onContact` e `srSuffix` (nome acessível distinto em botões de mesmo rótulo) |
| `src/components/ui/SectionHeading.tsx` | Opção `uppercase` |
| `src/pages/HomePage.tsx` | Nova ordem e provedor da modalidade escolhida |
| `src/sections/Hero.tsx` | Nova copy, botões "Conhecer modalidades" (`/#modalidades`) e "Explorar motos" (`/#motos`); removidos a foto secundária e os rótulos duplicados |
| `src/sections/RentalModes.tsx` (novo) | Dois cards de modalidade |
| `src/sections/HowItWorks.tsx` | Abas acessíveis com 4 etapas por modalidade |
| `src/sections/FeaturedMotorcycles.tsx` | Vitrine em grade (2 colunas, 1 no celular) com os cards do catálogo |
| `src/sections/Editorial.tsx` (novo) | Peça de campanha com foto ampla |
| `src/sections/Faq.tsx` | Título em maiúsculas (conteúdo vem de `content.ts`) |
| `src/sections/FinalCta.tsx` | Nova copy, WhatsApp com a modalidade, formulário existente, canal "Atendimento" |
| `src/sections/Acquisition.tsx` | Removido (substituído por `RentalModes`) |
| Testes | `App.test.tsx`, `conversion.test.tsx`, `lib/whatsapp.test.ts` atualizados e ampliados |

`src/sections/About.tsx` e o conteúdo `about` continuam no código, mas **não aparecem na home** (o roteiro tem sete seções, sem "Sobre nós"). Voltam quando houver história e fotos reais da empresa.

## C. Componentes

- **Criados:** `RentalModes`, `Editorial`, `modalityContext`.
- **Reescritos:** `HowItWorks` (abas), `FeaturedMotorcycles` (grade), `Hero`, `FinalCta`.
- **Reutilizados da Fase 12:** `MotorcycleCard`, `Accordion`, `Button`, `ContactButton`, `InterestFormDisclosure`, `SmartImage`, `DemoBadge`/`DemoNotice`, `Reveal`, `SectionHeading`, tokens de `src/index.css` (nenhuma cor nova, nenhum hex solto).

## D. Modelo comercial

- Duas modalidades em `rentalModes` (`locacao-aquisicao`, `locacao-tradicional`), sem preço, prazo, caução ou taxa. O campo `confirmed` aceita `{ label, value }` quando a empresa informar; enquanto estiver ausente, nada é exibido.
- O card da aquisição diz que ela depende do cumprimento das condições contratuais. O card tradicional não promete flexibilidade, cancelamento gratuito nem ausência de taxas.
- As modalidades **não** são ligadas a modelos de moto.
- **Fluxo da escolha:** o botão do card guarda a modalidade, abre o canal existente (WhatsApp, telefone, e-mail ou aviso demonstrativo) com a mensagem pedida ("Olá! Tenho interesse na modalidade de locação com aquisição. Gostaria de conhecer as condições."). Na conversão final aparece "Modalidade de interesse: X" (com "Remover"), o botão de WhatsApp leva a modalidade e o formulário abre com ela pré-selecionada. Sem escolha, nenhuma preferência é inventada.
- Formulário: opções "Locação com aquisição", "Locação tradicional" e "Ainda não decidi". Campo opcional, sem novos dados pessoais.

## E. Preservação

Verificado por testes e no navegador: rotas (`/`, `/motos`, `/motos/:slug`, `/veiculos`, 404), catálogo, páginas individuais, formulário (campos, validações, mensagem organizada, eventos), diálogo demonstrativo sem WhatsApp, selo "Moto de exemplo", fotos ilustrativas com selo, cabeçalho, rodapé, botão flutuante e configuração de deploy (`wrangler.jsonc`, `_headers`) sem alteração. `src/config/site.ts` e `src/config/motorcycles.ts` não foram alterados.

**Mudanças de comportamento deliberadas, por pedido do roteiro:** (1) o formulário passou a oferecer as duas modalidades (antes, sem modalidade confirmada, só dizia que a equipe apresenta as opções); (2) a navegação trocou "Sobre nós" por "Modalidades"; (3) a home usa grade em vez de carrossel (o carrossel continua em `/motos`).

## F. Testes

| Comando | Resultado |
|---|---|
| `npm run lint` | Sem avisos |
| `npm run typecheck` | Sem erros |
| `npm test` | **79 de 79** passando (6 arquivos; eram 73) |
| `npm run build` | OK. CSS 74,2 kB (gzip 12,8), JS 484,7 kB (gzip 152,0), sem bibliotecas novas |
| Playwright (Chromium, build de produção) em 360, 390, 768, 1024 e 1440 px | 0 rolagem horizontal e 0 erros de console |

Testes novos: âncoras da navegação, duas modalidades sem preços (nenhum "R$" ou "399" na home), abas por clique e teclado, mensagem de cada card, modalidade chegando ao contato final e ao formulário, sem escolha sem preferência inventada, vitrine com os dados centrais e selo de exemplo, FAQ.

## G. Pendências e limitações

- **Fotos:** o ambiente bloqueia `images.unsplash.com`, então as capturas mostram espaços reservados no lugar das fotos. O enquadramento do hero e da seção editorial precisa ser conferido no ar. Todas as fotos da home continuam ilustrativas, com selo. **Pendência: foto oficial de uma CG 160 sendo pilotada para o hero** (formato 4:3, `public/images/frota/`, trocar em `content.ts`).
- Capturas em `/mnt/project-files/fase13/capturas/` (390, 768 e 1440 px). Não houve Lighthouse nem leitor de tela.
- **Dados oficiais necessários:** nome e identidade da empresa, WhatsApp, preços, prazos, caução, taxas, documentos, critérios de aprovação, manutenção, seguro, devolução, multas e cancelamento, condições e procedimento de aquisição, disponibilidade de cada modelo por modalidade, e a confirmação das motos de 300 cc.
- Mensagem de WhatsApp por modalidade fica no aviso demonstrativo enquanto o número não for configurado.

## H. Próxima fase

Páginas individuais das motos: mostrar quais modalidades cada modelo aceita (só com dado oficial), usar a modalidade escolhida na home como contexto no contato, fotos reais e galeria, e as ferramentas de conversão que a empresa aprovar.
