# Relatório da Fase 11: foco na Honda CG 160 e catálogo em carrossel

Data: 13/10/2026 · Branch: `fase-11` (criada a partir de `fase-10`)

Nada foi publicado e nada foi mesclado na `main`. Cores, fontes, layout geral e animações aprovados foram mantidos.

## 1. Arquivos alterados

| Arquivo | Alteração |
| --- | --- |
| `src/config/content.ts` | Textos do hero e da seção de destaques com foco na Honda CG 160. Nova foto principal do hero (pessoa pilotando) |
| `src/config/motorcycles.ts` | Frota reduzida de 7 motos de exemplo para 4 motos Honda |
| `src/components/motorcycles/MotorcycleCarousel.tsx` (novo) | Carrossel horizontal de motos |
| `src/sections/FeaturedMotorcycles.tsx` | Destaques da home em carrossel, sem o filtro de estilo |
| `src/pages/CatalogPage.tsx` | Catálogo em carrossel, com título e textos focados em Honda. O filtro de estilo continua |
| `src/sections/Hero.tsx` | Só o comentário da composição de fotos |
| `src/lib/motorcycles.ts` | `formatDisplacement`: cilindrada no formato brasileiro (162,7 cc) |
| `src/components/motorcycles/MotorcycleCard.tsx`, `MotorcycleCommercialPanel.tsx` | Usam `formatDisplacement` |
| `src/types/index.ts` | Comentário do campo `featured` |
| `src/App.test.tsx`, `src/conversion.test.tsx`, `src/lib/lib.test.ts`, `src/lib/publishing.test.ts` | Testes atualizados para a nova frota, mais 3 testes novos |

## 2. Hero

- Selo: "Locação de motos Honda".
- Título: "Honda CG 160 para a sua rotina."
- Subtítulo: "Alugue uma CG 160 Start ou CG 160 Fan para trabalhar e se deslocar no dia a dia. Consulte modalidades e condições direto com a nossa equipe."
- Primeiro item da lista: "Honda CG 160 Start e Fan".
- Foto principal: agora uma pessoa pilotando uma moto urbana (foto ilustrativa do Unsplash, licença livre). A foto menor passou a ser uma moto street estacionada.
- Layout, botões, moldura laranja, linhas de movimento e animações sem mudança.

**Limitação:** não existe foto livre de uma CG 160 sendo pilotada. A foto atual é ilustrativa, com o selo "Fotos ilustrativas". Neste ambiente o Unsplash é bloqueado, então não consegui ver a foto escolhida. Confira na prévia. Para usar a foto oficial, salve em `public/images/frota/` (horizontal, 4:3, até ~300 KB) e troque `hero.images.main` por `fleetPhoto('cg-160-piloto.jpg', 'Motociclista pilotando uma Honda CG 160')`. A instrução está no próprio `content.ts`.

## 3. Catálogo

- 4 motos em vez de 7. As CG 160 vêm primeiro.
- Home: o título passou a ser "CG 160 Start e CG 160 Fan em destaque". As motos aparecem em carrossel, sem filtro de estilo, porque com 4 motos ele só ocupava espaço.
- Página `/motos`: título "Motos Honda para locação", texto "Nosso foco é a Honda CG 160, nas versões Start e Fan…". O filtro de estilo foi mantido (Todas, Street, Naked, Trail) porque a página da moto tem um link para ele.
- Posicionamento: o rótulo laranja acima do nome mostra "Modelo principal da locação" nas CG e "Opção adicional" nas outras duas.
- Aviso único: "Fotos ilustrativas, que não são das motos da empresa. As opções de 300 cc são provisórias. Ano, versão e condições de cada moto são confirmados pela equipe."
- "Você também pode gostar", na página da moto, continua em grade (mostra as outras 3).

## 4. Como o carrossel funciona

- Rolagem nativa do navegador, com encaixe em cada card (`scroll-snap`). No celular, arrasta-se com o dedo. No computador, funciona com o trackpad e com as setas.
- Um pedaço do card seguinte fica visível para indicar que há mais motos. Cards por tela: 1 no celular, 2 no tablet e 3 no computador.
- Setas "Motos anteriores" e "Próximas motos", desligadas nas pontas. Os indicadores (pontos) mostram a posição e também são clicáveis. O número de pontos se ajusta à tela: 4 no celular, 3 no tablet e 2 no computador.
- Acessibilidade: região com nome ("Motos em destaque" ou "Lista de motos"), botões com rótulo e `aria-controls`. Ao navegar com Tab, o card focado entra na tela sozinho. Com "reduzir movimento", a rolagem é instantânea.
- Os cards entram com um deslize curto. O hover dos cards é o mesmo de antes.
- Sem biblioteca nova.

## 5. As 4 motos

| Moto | Situação | Ficha técnica |
| --- | --- | --- |
| Honda CG 160 Start | Modelo principal (informado pelo cliente) | 162,7 cc, manual de 5 marchas, partida elétrica |
| Honda CG 160 Fan | Modelo principal (informado pelo cliente) | 162,7 cc, manual de 5 marchas, partida elétrica |
| Honda CB 300F Twister | Opção adicional provisória (`demo: true`, selo "Moto de exemplo") | 293,5 cc, manual de 6 marchas, partida elétrica |
| Honda XRE 300 Sahara | Opção adicional provisória (`demo: true`, selo "Moto de exemplo") | 293,5 cc, manual de 6 marchas, partida elétrica |

A ficha técnica tem só dados de fábrica comuns a todas as versões. Ano, freios (CBS ou ABS, que variam por versão), preços, modalidades e disponibilidade ficam de fora até a empresa informar. Todas aparecem como "Condições sob consulta".

## 6. Testes

| Verificação | Resultado |
| --- | --- |
| `npm test` | ✅ 73/73 (70 anteriores, alguns ajustados à nova frota, mais 3 novos: carrossel na home, setas do carrossel e formato da cilindrada) |
| `npm run lint` | ✅ Sem avisos |
| `npm run build` | ✅ JS 489,5 KB (153,2 KB gzip), CSS 66,7 KB (11,3 KB gzip). Lista os dados oficiais pendentes, como esperado |
| Navegador (Chromium, 390, 768 e 1366 px) | ✅ Sem rolagem lateral na página. As setas rolam o carrossel. Home e catálogo conferidos por captura |

## 7. Pendências e limitações

- **Fotos:** todas são ilustrativas e não mostram as motos da empresa. As fotos das motos e a do hero devem ser trocadas por fotos reais.
- **CB 300F Twister e XRE 300 Sahara:** são sugestões provisórias. Se o cliente confirmar que tem essas motos, basta remover `demo: true`. Se não confirmar, devem ser trocadas.
- **Dados das CG:** faltam ano, versão, freios e condições.
- **Rotas antigas:** os endereços das 7 motos de exemplo (ex.: `/motos/sport-400`) agora mostram a página "não encontrada". Nunca foram indexados (sem domínio, o `robots.txt` bloqueia).
- Continuam pendentes os dados da empresa: nome, logotipo, WhatsApp, contatos, domínio, CNPJ. A aquisição continua desligada.
