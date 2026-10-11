# Fase 8 — Otimização comercial e experiência do usuário

Data: 11/10/2026. Trabalho feito na nuvem, sem publicar o site e sem mexer em serviços externos.

## Antes de tudo: qual versão do código foi usada

Na pasta do projeto havia duas versões do código:

- `locacao-veiculos/` (pasta): uma versão **anterior**, sem `src/lib/publishing.ts` nem a geração automática de `robots.txt`/`sitemap.xml`.
- `locacao-motos-codigo.zip`: a versão **mais recente** (fase 7), com tudo isso.

A fase 8 foi feita sobre o **zip**, para não perder o trabalho da fase 7. A pasta `locacao-veiculos/` não foi alterada.

**Atenção:** o `PUBLICACAO.md` da raiz do projeto descreve recursos que não existem em nenhuma das duas versões (`favicon`/`shareImage` em `site.ts` e cadastro de carros com `type: 'carro'`). Se esse código existe só no seu computador, aplique o arquivo `fase8.patch` sobre ele (são 10 arquivos e poucas linhas) em vez de substituir a pasta pelo zip.

## Sobre "carros e motos"

O pedido fala em locação de carros e motos, mas o site aprovado e todos os dados são de **locação de motos**. Não foi criado nenhum carro, categoria ou texto sobre carros, porque isso seria inventar frota. Se a empresa também aluga carros, é preciso enviar os veículos reais. Os textos gerais (hero, menu, títulos) também precisariam ser revistos, o que exige aprovação.

---

## 1. Problemas identificados

Jornada auditada: início → catálogo → moto → contato, em 320, 360, 390, 414 e 768 px e no computador (1366 px).

| # | Problema | Gravidade |
|---|---|---|
| P1 | **Rolagem lateral no celular, no catálogo (`/motos`).** O botão "Consultar disponibilidade pelo WhatsApp" não quebrava linha e deixava a página com 425 px de largura em telas de 320 a 414 px. A página inteira "escorregava" para os lados. | Alta |
| P2 | Por causa do P1, o **aviso de contato abria descentralizado e cortado** no celular. | Alta |
| P3 | Em telas de 320 px, a home e a página da moto também tinham rolagem lateral (13 a 25 px), por botões que não quebravam linha. | Média |
| P4 | O hero não deixava claro que o serviço é **aluguel**. O título "Sua próxima moto começa aqui" e o subtítulo também serviriam para uma loja. Só o selo pequeno dizia "Locação". | Média |
| P5 | As mensagens do WhatsApp não seguiam o formato pedido ("Tenho interesse na locação da [moto]. Gostaria de receber mais informações."). | Baixa |
| P6 | Acessibilidade: a grade de motos era uma região `aria-live`. A cada troca de filtro, o leitor de tela lia todos os cards. | Baixa |
| P7 | Desempenho: as fotos da primeira dobra (hero e foto principal da moto) começavam invisíveis e só apareciam depois de um fade de 0,7 s, o que atrasava a percepção de carregamento. | Baixa |

O que já estava correto e foi mantido: filtros por estilo (com contagem e URL `?estilo=`), proporção fixa 4:3 das fotos (sem saltos de layout), botões com ação previsível, nenhum número fictício, aviso "canal em configuração" quando o WhatsApp não está configurado, nome da moto vindo dos dados centralizados, barra fixa de contato no celular, galeria com toque, teclado e ampliação, trilha de navegação e "Ver outras motos" para voltar ao catálogo, 404 com sugestões.

## 2. Melhorias implementadas

1. **Fim da rolagem lateral no celular (P1, P2, P3).** No celular, botões com texto longo agora quebram em duas linhas. A partir de 640 px, o comportamento é o mesmo de antes. No bloco "Não encontrou a moto?", o botão ocupa a largura toda no celular e o bloco tem um pouco menos de margem interna. Depois da correção, a verificação em 320, 360 e 390 px não encontrou rolagem lateral em nenhuma página.
2. **Hero mais claro (P4).** O título aprovado foi mantido. O subtítulo agora diz: *"Alugue a moto certa para trabalhar e se deslocar no dia a dia. Escolha no catálogo e consulte as condições direto com a nossa equipe."* Não há preços, vantagens ou promessas.
3. **Mensagens do WhatsApp no formato pedido (P5)**, com o nome da moto (fabricante + nome) vindo de `motorcycles.ts`:
   - Página da moto: *"Olá! Tenho interesse na locação da moto [marca e modelo]. Gostaria de receber mais informações."*
   - Card do catálogo e da home: *"Olá! Vi a moto [marca e modelo] no catálogo do site e tenho interesse na locação. Gostaria de receber mais informações."*
4. **Acessibilidade dos filtros (P6).** A grade não é mais anunciada inteira. O leitor de tela anuncia só a contagem ("3 motos"), no catálogo (como já era) e agora também na home.
5. **Primeira dobra mais rápida (P7).** Imagens prioritárias aparecem assim que carregam, sem esperar o fade. As demais imagens mantêm a transição.

## 3. Melhorias propostas, que exigem sua aprovação

| # | Proposta | Por quê |
|---|---|---|
| A1 | **Botão de contato no hero** (ex.: "Falar com a equipe"), ao lado de "Conhecer as motos". | Hoje, no celular, a primeira tela não tem nenhum botão de contato. O botão flutuante só aparece depois de rolar. Muda o visual do hero. |
| A2 | **Nome da moto acima da galeria no celular.** | No celular, a foto vem primeiro e o nome só aparece depois de rolar. A barra fixa de baixo já mostra o nome, mas o título no topo deixaria mais claro. Muda a ordem dos blocos. |
| A3 | **Título do hero mais explícito** (ex.: "Alugue a moto certa para a sua rotina."). | O subtítulo já resolve boa parte. Trocar o título mexe no texto aprovado. |
| A4 | **Carregar as páginas sob demanda** (dividir o JavaScript por rota). | Reduziria o carregamento inicial (hoje 152 KB compactados), mas adiciona telas de carregamento e um pouco de complexidade. |
| A5 | **Carros no catálogo.** | Só com veículos reais. Exige rever os textos gerais, o menu e os filtros (tipo: carro/moto). |
| A6 | Ao voltar pela trilha de navegação ("Motos"), **manter o filtro** que o visitante tinha escolhido. | Hoje o botão "voltar" do navegador já mantém o filtro, mas o link da trilha não. |

## 4. Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/components/ui/Button.tsx` | Quebra de linha no celular (fim da rolagem lateral) |
| `src/pages/CatalogPage.tsx` | Bloco "Não encontrou a moto?" adaptado ao celular |
| `src/config/content.ts` | Subtítulo do hero |
| `src/config/commercial.ts` | Mensagens do WhatsApp (catálogo e página da moto) |
| `src/components/motorcycles/MotorcycleGrid.tsx` | Remoção do `aria-live` da grade |
| `src/sections/FeaturedMotorcycles.tsx` | Contagem anunciada ao filtrar na home |
| `src/components/ui/SmartImage.tsx` | Imagens prioritárias sem fade |
| `src/lib/lib.test.ts`, `src/lib/whatsapp.test.ts`, `src/App.test.tsx` | Testes atualizados para o novo texto das mensagens |

As diferenças exatas estão em `fase8.patch`.

## 5. Testes executados

| Verificação | Resultado |
|---|---|
| `npm test` (Vitest + Testing Library) | **68 de 68 passaram** (5 arquivos) |
| `npm run lint` (oxlint) | Sem erros |
| `npm run build` (checagem de tipos + build de produção) | **OK**. O build lista os dados oficiais pendentes (esperado). |
| Navegador (Chromium) em 320, 360, 390, 414, 768 e 1366 px: início, catálogo, moto, moto inexistente | Sem rolagem lateral em nenhuma página e sem erros de JavaScript |
| Aviso de contato sem WhatsApp configurado (celular) | Centralizado, com a mensagem nova e o nome da moto |

Limitação: o ambiente de teste não acessa o Unsplash, então as fotos de exemplo apareceram como espaço reservado nas capturas. O layout e as proporções foram verificados mesmo assim.

## 6. Pendências de dados oficiais da empresa

Sem esses dados, o site continua em modo demonstrativo (lista gerada pelo próprio build):

- Nome comercial, logotipo e domínio oficial
- **WhatsApp comercial**: sem ele, os botões mostram o aviso "canal em configuração" (nenhum número fictício é usado)
- Telefone, e-mail, endereço e horário de atendimento
- Redes sociais, razão social e CNPJ
- **Frota real**: as 7 motos atuais são exemplos, com fotos ilustrativas
- Modalidades, valores, disponibilidade e requisitos (hoje "Sob consulta")
- Confirmação se a empresa também aluga **carros** (e, se sim, os veículos)
- História da empresa e fotos institucionais (seção "Sobre nós")

## 7. Avaliação (0 a 10)

| Critério | Nota | Justificativa |
|---|---|---|
| Qualidade visual | **8,5** | A identidade é consistente (grafite + laranja, tipografia, cartões e fotos padronizados), com acabamento cuidadoso. Não chega a 9+ porque as fotos ainda são ilustrativas e o logotipo é provisório, o que pesa muito na percepção de marca. |
| Experiência de navegação | **8,5** | A jornada é curta e clara: filtros que funcionam, página da moto completa, trilha para voltar e barra de contato no celular. A rolagem lateral no celular era o principal defeito e foi corrigida. Os pontos A1 e A2 elevariam a nota. |
| Potencial de conversão | **7** | A estrutura está pronta (mensagens contextualizadas, contato em todas as páginas, formulário opcional), mas hoje nenhum contato real acontece, porque não há WhatsApp configurado e a frota é de exemplo. Com o número oficial e as motos reais, a estimativa sobe para 8,5–9. |
