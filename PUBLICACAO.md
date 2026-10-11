# Guia de atualização e publicação

Este guia explica como trocar os dados provisórios pelos oficiais. Quase tudo fica em **três arquivos**:

| Arquivo | O que contém |
| --- | --- |
| `src/config/site.ts` | Dados da empresa: nome, logotipo, domínio, WhatsApp, telefone, e-mail, endereço, horário, redes sociais, razão social/CNPJ |
| `src/config/motorcycles.ts` | Frota: cada moto, com fotos, ficha técnica, modalidades, preços e disponibilidade |
| `src/config/commercial.ts` | Modalidades confirmadas, aquisição e textos das mensagens do WhatsApp |

Textos institucionais (hero, "Como funciona", "Sobre nós", FAQ) ficam em `src/config/content.ts`.
Título da aba, descrição para buscadores, `robots.txt`, `sitemap.xml` e dados estruturados são **gerados
automaticamente** a partir de `site.ts` e `motorcycles.ts` — não edite o `index.html` à mão.

Ao rodar `npm run build`, o terminal lista os **dados oficiais pendentes**. Quando a lista sumir, a parte de dados está completa.

---

## 1. Nome da empresa

Em `src/config/site.ts`:

```ts
name: 'Nome Oficial',
tagline: 'Locação de motos',           // aparece no título das páginas e no rodapé
description: 'Descrição institucional', // descrição para buscadores e compartilhamento
```

O nome é usado no cabeçalho, rodapé, títulos das páginas, metadados e dados estruturados.
Enquanto o nome for `'Nome da Empresa'`, nenhum dado estruturado (schema.org) é publicado.

Preencha também `legal.companyName` (razão social) e `legal.cnpj`, exibidos no rodapé.

## 2. Logotipo

1. Coloque o arquivo em `public/` (ex.: `public/logo.svg`; SVG ou PNG com fundo transparente, legível sobre fundo escuro).
2. Em `src/config/site.ts`: `logo: { src: '/logo.svg', alt: 'Nome Oficial' }`.

Com `src` vazio, o site mostra o marcador provisório "LOGO". Para trocar o ícone da aba, substitua `public/favicon.svg`.

## 3. WhatsApp e contato

Em `src/config/site.ts`, bloco `contact`:

```ts
whatsapp: '55DDNNNNNNNNN',   // somente dígitos: 55 + DDD + número
phone: 'DDNNNNNNNN',          // telefone com DDD (com ou sem 55)
phoneDisplay: '(DD) NNNN-NNNN',
email: 'contato@empresa.com.br',
```

- **Um único número** atende todos os botões do site (cabeçalho, catálogo, página da moto, formulário, botão flutuante).
- Sem número válido, **nenhum link falso é criado**: o botão usa telefone ou e-mail, se houver; senão abre um aviso
  "canal em configuração" mostrando a mensagem que seria enviada.
- As mensagens de cada botão ficam em `src/config/commercial.ts` (`contactMessages`). A moto escolhida entra
  automaticamente no texto.
- Depois de configurar, teste no celular e no computador (ver checklist).

Endereço, mapa e horário:

```ts
address: { street: 'Rua X, 123', district: 'Bairro', city: 'Cidade', state: 'UF', zip: '00000-000' },
mapsUrl: 'https://maps.app.goo.gl/...',
openingHours: ['Segunda a sexta, 8h às 18h', 'Sábado, 8h às 12h'],
```

Redes sociais: preencha `url` em `social`. Redes sem `url` não viram link.

## 4. Adicionar uma moto

Em `src/config/motorcycles.ts`, acrescente um item à lista `motorcycles`:

```ts
{
  slug: 'honda-cg-160-fan',          // único; vira a URL /motos/honda-cg-160-fan
  name: 'CG 160 Fan',
  model: 'Honda CG 160 Fan',
  brand: 'Honda',                     // opcional
  year: 2024,                         // opcional
  displacement: 160,                  // opcional (cc)
  transmission: 'Manual, 5 marchas',  // opcional
  style: 'street',                    // street | naked | scooter | trail | classica | custom | esportiva | touring | eletrica
  featured: true,                     // aparece na página inicial
  summary: 'Resumo curto para o card e buscadores.',
  description: 'Descrição completa (opcional).',
  images: [
    fleetPhoto('cg-160-frente.jpg', 'Honda CG 160 Fan vermelha vista de frente'),
    fleetPhoto('cg-160-lateral.jpg', 'Honda CG 160 Fan vista lateral'),
  ],
  specs: [{ label: 'Partida', value: 'Elétrica' }],
  features: ['Freios CBS'],           // opcional
  modalities: [],                     // ex.: ['Locação semanal']; vazio = "sob consulta"
  prices: [],                         // SOMENTE valores oficiais; vazio = "sob consulta"
  availability: '',                   // SOMENTE se confirmada pela empresa
},
```

- **Não use `demo: true`** em motos reais. Esse campo marca os exemplos (selo "Moto de exemplo").
- Remova os exemplos (todas as motos com `demo: true`) quando a frota oficial estiver cadastrada.
- Catálogo, página inicial, página individual, recomendações, formulário e sitemap usam esta mesma lista.
- `unavailable: true` mantém a página da moto acessível, mas a tira das recomendações.

## 5. Fotografias

Detalhes em `public/images/frota/LEIAME.txt`. Resumo:

- Coloque os arquivos em `public/images/frota/` (JPG ou WebP, proporção **4:3**, ex.: 1600×1200, até ~300 KB).
- Use `fleetPhoto('arquivo.jpg', 'texto alternativo descritivo')`. A primeira foto é a capa.
- Quantas fotos quiser: a galeria, as miniaturas e a visualização ampliada se adaptam.
- Sem fotos, aparece "Fotos em breve"; foto que não carrega mostra um espaço reservado.
- Fotos do Unsplash (`unsplash(...)`) são **ilustrativas** e sempre aparecem com o selo "Imagem demonstrativa".
  Elas não são usadas como imagem de compartilhamento.

Fotos institucionais (hero, "Sobre nós", chamada final) ficam em `src/config/content.ts`.

## 6. Informações comerciais

Em `src/config/commercial.ts`:

- `modalities`: modalidades **confirmadas** (ex.: `['Locação semanal', 'Locação mensal']`).
- `acquisition.confirmed`: só mude para `true` se a empresa confirmar a locação com possibilidade de aquisição.

Preços e disponibilidade são por moto (`prices`, `availability` em `motorcycles.ts`). Nunca preencha com estimativas.

## 7. Domínio, buscadores e avisos

- `site.ts` → `url: 'https://www.dominio.com.br'` (sem barra final). **Só com o domínio preenchido** o build libera a
  indexação no `robots.txt`, gera o `sitemap.xml` (sem as motos de exemplo) e publica os dados estruturados.
  Sem domínio, o `robots.txt` bloqueia os buscadores (adequado para homologação).
- `showDemoNotices: false` desliga os avisos "a informar". Os selos "Moto de exemplo" e "Imagem demonstrativa"
  continuam aparecendo enquanto houver exemplos, para que nunca pareçam frota real.

---

## Dados que ainda precisam ser confirmados pelo cliente

- [ ] Nome comercial e descrição institucional
- [ ] Logotipo (e favicon, se houver)
- [ ] Domínio oficial
- [ ] Número de WhatsApp comercial
- [ ] Telefone e e-mail
- [ ] Endereço e link do mapa (ou confirmação de que não haverá atendimento presencial)
- [ ] Horário de atendimento
- [ ] Redes sociais
- [ ] Razão social e CNPJ
- [ ] Frota oficial: modelos, ano, cilindrada, ficha técnica e descrição de cada moto
- [ ] Fotografias reais de cada moto
- [ ] Modalidades de locação oferecidas (e se há possibilidade de aquisição)
- [ ] Preços e disponibilidade, se a empresa quiser exibi-los
- [ ] Fotos institucionais e textos de "Sobre nós" (hoje provisórios)
- [ ] Política de privacidade / links legais, se houver
- [ ] Identidade visual definitiva (as cores atuais são provisórias, em `src/index.css`)

## Checklist de publicação

**Dados**
- [ ] `npm run build` não lista nenhum dado oficial pendente
- [ ] Nenhuma moto com `demo: true` e nenhuma foto `unsplash(...)` na frota
- [ ] `showDemoNotices: false`
- [ ] Textos de `content.ts` revisados pelo cliente

**Contato**
- [ ] WhatsApp abre a conversa certa no celular (app) e no computador (WhatsApp Web)
- [ ] Mensagem da página da moto cita a moto correta
- [ ] Formulário opcional monta a mensagem com moto, modalidade e uso
- [ ] Telefone e e-mail do rodapé e da seção de contato funcionam

**Qualidade**
- [ ] `npm test` e `npm run lint` sem erros
- [ ] Navegação testada: home → catálogo → filtro → moto → galeria → condições → WhatsApp
- [ ] Teste em celular real (iPhone e Android) e em um navegador de desktop
- [ ] Navegação por teclado (Tab, Enter, Esc na galeria ampliada)

**Hospedagem**
- [ ] Servidor configurado para SPA: todas as rotas devolvem `index.html`
      (Netlify: `public/_redirects` com `/* /index.html 200`; Vercel: `rewrites`)
- [ ] HTTPS ativo no domínio oficial
- [ ] `https://dominio/robots.txt` libera a indexação e `https://dominio/sitemap.xml` abre
- [ ] Sitemap enviado ao Google Search Console
- [ ] Prévia de compartilhamento conferida (WhatsApp/Facebook) em uma página de moto
- [ ] Publicação aprovada pelo cliente
