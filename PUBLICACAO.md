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

### Roteiro rápido da personalização final

1. `src/config/site.ts`: nome, descrição, logotipo, domínio, WhatsApp, telefone, e-mail, endereço, mapa, horário, redes e CNPJ (seções 1 a 3).
2. `public/`: logotipo e favicon. `public/images/frota/`: fotos das motos (seções 2 e 5).
3. `src/config/motorcycles.ts`: cadastre as motos reais e **apague os exemplos** com `demo: true` (seção 4).
4. `src/config/commercial.ts`: só as modalidades que a empresa confirmar. Deixe `acquisition.confirmed: false` até haver confirmação por escrito (seção 6).
5. `src/config/content.ts`: história, fotos institucionais e textos revisados pelo cliente.
6. Cores e fontes, se houver identidade definitiva: tokens `@theme` em `src/index.css` e o link das fontes em `index.html`.
7. `npm run build` sem dados pendentes e `showDemoNotices: false` (seção 7).
8. Hospedagem e publicação (seção 8 e checklist no fim).

Nunca preencha um campo com dado provisório "só para testar" e esqueça lá: campo vazio é tratado como "a informar"; dado inventado seria publicado como verdadeiro.

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
- Sem fotos (`images: []`), o card e a página da moto mostram "Fotos em breve"; foto que não carrega mostra um espaço reservado.
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

## 8. Hospedagem e segurança

O site é estático: `npm run build` gera a pasta `dist/`, que pode ser servida por qualquer hospedagem de arquivos
estáticos com HTTPS. Node.js 20.19+ ou 22.12+ é necessário só para o build (campo `engines` do `package.json`).

**Fallback de SPA (obrigatório).** As rotas `/motos` e `/motos/<slug>` existem só no navegador. O servidor precisa
devolver o `index.html` para qualquer caminho que não seja um arquivo real; sem isso, abrir um link de moto
direto (ou recarregar a página) dá erro 404 do servidor. Arquivos reais (`/assets/...`, `robots.txt`,
`sitemap.xml`, imagens) continuam sendo servidos normalmente.

### Hospedagem escolhida: Cloudflare (plano gratuito)

| Critério | Cloudflare (Workers) | Netlify (grátis) | Vercel (Hobby) |
| --- | --- | --- | --- |
| Uso comercial no plano gratuito | Permitido | Permitido | **Proibido** (só uso pessoal; o comercial exige o Pro, US$ 20/mês) |
| Tráfego do site | Arquivos estáticos ilimitados | ~15 GB/mês (300 créditos) | 100 GB/mês |
| Se passar do limite | Arquivos estáticos continuam no ar | **O site é pausado** até o mês seguinte | Recursos bloqueados até o período seguinte |
| Fallback de SPA, cabeçalhos e HTTPS | Sim | Sim | Sim |
| Deploy automático pelo GitHub | Sim | Sim | Sim |

A Cloudflare foi escolhida porque é a única das três que permite site comercial no plano gratuito **sem risco de
o site sair do ar por excesso de visitas**. Também oferece HTTPS e CDN incluídos e, se a empresa quiser, gerencia o
domínio (DNS). Valores conferidos em out/2026; os planos dos provedores mudam com frequência.

**Já está configurado no repositório** (sem efeito até o repositório ser conectado a uma conta Cloudflare):

| Arquivo | O que faz |
| --- | --- |
| `wrangler.jsonc` | Publica a pasta `dist/` e ativa o fallback de SPA (`not_found_handling: single-page-application`) |
| `public/_headers` | Cabeçalhos de segurança, CSP e cache longo de `/assets/*` (copiado para `dist/` no build; não é servido como página) |

Testado localmente com o simulador oficial (`wrangler dev`): `/motos/<slug>` e rotas inexistentes abrem a
aplicação, `robots.txt` e `/assets/*` são servidos como arquivo, todos os cabeçalhos aparecem e o navegador não
registra nenhum bloqueio de CSP.

**Passo a passo (feito pelo responsável da conta, quando a publicação for aprovada):**

1. Criar uma conta gratuita em <https://dash.cloudflare.com>, de preferência com o e-mail da empresa (a conta e o
   domínio devem ficar no nome do cliente). Não é preciso cadastrar cartão.
2. Em **Workers & Pages → Create → Import a repository**, autorizar o GitHub e escolher
   `Moreirapontocom-br/locacao-motos`, branch `main`.
3. Conferir os comandos: build `npm run build` e deploy `npx wrangler deploy` (padrões). Salvar e implantar.
4. O site fica disponível em um endereço provisório `locacao-motos.<conta>.workers.dev`, bom para homologação.
   Enquanto `siteConfig.url` estiver vazio, o `robots.txt` bloqueia os buscadores.
5. Domínio oficial: em **Settings → Domains & Routes → Add → Custom domain**. O domínio precisa usar o DNS da
   Cloudflare (a própria Cloudflare orienta a troca dos servidores DNS no registro.br ou no registrador).
   Depois, preencher `url` em `src/config/site.ts` com o domínio e fazer um novo push.
6. No painel do domínio, em **SSL/TLS → Edge Certificates**, ativar **Always Use HTTPS**.
7. A cada push na `main`, a Cloudflare publica a nova versão automaticamente.

**Alternativas** (caso a empresa prefira outro provedor; arquivos em `docs/hospedagem/`, sem efeito até serem copiados):

| Provedor | Arquivo de exemplo | Como usar |
| --- | --- | --- |
| Vercel (exige plano Pro para uso comercial) | `docs/hospedagem/vercel.json` | Copiar para a raiz como `vercel.json` |
| Netlify | `docs/hospedagem/netlify.toml` | Copiar para a raiz como `netlify.toml` |

Os exemplos já trazem fallback de SPA, build (`npm run build` → `dist`), cache longo para `/assets/*` e os
cabeçalhos abaixo. Em outro provedor (Apache, Nginx, hospedagem compartilhada), configure o equivalente.

**HTTPS.** Ative o certificado do domínio oficial (gratuito na Vercel, Netlify e Cloudflare) e o redirecionamento
de `http://` para `https://`. Só ative o HSTS depois de confirmar que o domínio (e os subdomínios, por causa do
`includeSubDomains`) funcionam em HTTPS: o navegador passa a recusar `http://` por um ano.

**Cabeçalhos de segurança** (já nos exemplos):

| Cabeçalho | Valor | Para quê |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Força HTTPS |
| `X-Content-Type-Options` | `nosniff` | Impede o navegador de "adivinhar" tipos de arquivo |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Não envia o endereço completo da página a outros sites |
| `X-Frame-Options` | `DENY` | Impede que o site seja exibido dentro de outro (clickjacking) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Desliga recursos que o site não usa |
| `Content-Security-Policy` | ver abaixo | Limita de onde o site carrega scripts, estilos, fontes e imagens |

**Política de conteúdo (CSP)** usada nos exemplos, testada no navegador com todas as páginas e fluxos
(galeria, formulário, aviso de contato, WhatsApp) sem nenhum bloqueio:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com;
connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
upgrade-insecure-requests
```

- `'unsafe-inline'` em `style-src` é necessário para a animação de reorganização do catálogo (a biblioteca de
  animação insere estilos temporários). Scripts continuam restritos ao próprio site.
- A CSP fica em `public/_headers` (Cloudflare) e nos exemplos de `docs/hospedagem/`; mantenha-os iguais.
- Quando todas as fotos forem próprias, **remova `https://images.unsplash.com`** de `img-src` e o
  `<link rel="preconnect" href="https://images.unsplash.com">` do `index.html`.
- Se um dia for incluída uma ferramenta externa (analytics, mapa incorporado, chat), ela precisa ser
  acrescentada à CSP; caso contrário, o navegador a bloqueia.
- Os links do WhatsApp (`wa.me`), do mapa e das redes sociais são navegação comum e não dependem da CSP.

**Privacidade.** As fontes vêm do Google Fonts, o que envia o IP do visitante ao Google. Se a empresa preferir
evitar isso (LGPD), as fontes podem ser hospedadas no próprio site (mesmas fontes, sem mudança visual).
O site não usa cookies nem ferramentas de rastreamento.

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

**Hospedagem** (seção 8)
- [ ] Repositório conectado à Cloudflare (seção 8), ou exemplo de `docs/hospedagem/` copiado para a raiz se for outro provedor
- [ ] Fallback de SPA: abrir `https://dominio/motos/<slug>` direto e recarregar a página funciona
- [ ] HTTPS ativo no domínio oficial, com redirecionamento de `http://`
- [ ] Cabeçalhos de segurança conferidos (ex.: securityheaders.com) e nenhum erro de CSP no console do navegador
- [ ] `img-src` da CSP e `preconnect` sem o Unsplash, se não houver mais fotos de lá
- [ ] `https://dominio/robots.txt` libera a indexação e `https://dominio/sitemap.xml` abre
- [ ] Sitemap enviado ao Google Search Console
- [ ] Prévia de compartilhamento conferida (WhatsApp/Facebook) em uma página de moto
- [ ] Publicação aprovada pelo cliente
