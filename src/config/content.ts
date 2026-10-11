/**
 * CONTEÚDO INSTITUCIONAL E TEXTOS DO SITE
 * ------------------------------------------------------------------
 * Empresa especializada em LOCAÇÃO DE MOTOS.
 * Textos marcados como provisórios devem ser revisados com a empresa.
 * Nenhum texto aqui afirma valores, prazos, entrada, parcelas, benefícios
 * contratuais ou aquisição/transferência de propriedade.
 */
import { FileText, MessageCircle, Search, SlidersHorizontal } from 'lucide-react'
import { unsplash } from '../lib/images'
import type { FaqItem, ImageAsset, NavItem, Step } from '../types'

export const navigation: NavItem[] = [
  { label: 'Motos', to: '/motos' },
  { label: 'Como funciona', to: '/#como-funciona' },
  { label: 'Sobre nós', to: '/#sobre' },
  { label: 'Contato', to: '/#contato' },
]

export const hero = {
  eyebrow: 'Locação de motos',
  title: 'Sua próxima moto começa aqui.',
  subtitle:
    'Alugue a moto certa para trabalhar e se deslocar no dia a dia. Escolha no catálogo e consulte as condições direto com a nossa equipe.',
  primaryCta: { label: 'Conhecer as motos', to: '/motos' },
  secondaryCta: { label: 'Como funciona', to: '/#como-funciona' },
  /** Fotos demonstrativas — substituir por fotos da frota real. */
  images: {
    main: unsplash('photo-1558981403-c5f9899a28bc', 'Moto urbana moderna estacionada junto a parede de azulejos', {
      ratio: 4 / 3,
      focus: { x: 0.5, y: 0.6, zoom: 1.05 },
      widths: [640, 960, 1280, 1600],
    }),
    secondary: unsplash('photo-1558980664-10e7170b5df9', 'Motociclista inclinando a moto em uma curva', {
      ratio: 4 / 5,
      focus: { x: 0.5, y: 0.55, zoom: 1.15 },
      widths: [400, 640, 900],
    }),
  },
  points: ['Motos para trabalho e dia a dia', 'Fotos e detalhes de cada moto', 'Atendimento direto com a equipe'],
}

export const featured = {
  eyebrow: 'Catálogo',
  title: 'Encontre sua próxima moto',
  description: 'Veja fotos e informações de cada moto. Disponibilidade e condições são confirmadas pela equipe.',
}

export const howItWorks = {
  eyebrow: 'Como funciona',
  title: 'Da escolha da moto à conversa com a equipe',
  description: 'Simples e transparente: você conhece as condições antes de decidir qualquer coisa.',
  steps: [
    {
      icon: Search,
      title: 'Explore as motos',
      description: 'Veja os modelos no catálogo e compare estilo, cilindrada e as informações de cada moto.',
    },
    {
      icon: SlidersHorizontal,
      title: 'Escolha a opção ideal',
      description: 'Encontre a moto que combina com a sua rotina de trabalho e deslocamentos.',
    },
    {
      icon: FileText,
      title: 'Consulte as condições',
      description: 'Pergunte sobre modalidades, valores, prazos e requisitos para a moto escolhida.',
    },
    {
      icon: MessageCircle,
      title: 'Fale com nossa equipe',
      description: 'Tire suas dúvidas no atendimento e, se fizer sentido para você, siga com a locação.',
    },
  ] satisfies Step[],
  note: 'A locação é combinada diretamente com a equipe — o site não faz reservas nem contratações automáticas.',
}

/**
 * Seção "Modalidades e aquisição".
 * As condições comerciais ainda NÃO foram confirmadas: o texto apenas convida
 * à consulta, sem prometer aquisição, transferência de propriedade, prazos ou valores.
 */
export const acquisition = {
  eyebrow: 'Modalidades e condições',
  title: 'Quer saber se pode ficar com a moto? Consulte as condições.',
  description:
    'Modalidades de locação e uma eventual possibilidade de aquisição dependem das condições comerciais da empresa. Elas não são garantidas pelo site: a equipe informa o que está disponível para cada moto no atendimento.',
  path: [
    { label: 'Escolha a moto', description: 'No catálogo do site.' },
    { label: 'Consulte', description: 'Modalidades e requisitos.' },
    { label: 'Receba as condições', description: 'Direto da equipe.' },
  ],
  notes: [
    'Nenhuma condição é garantida antes da consulta.',
    'A aquisição da moto não é automática nem está prometida.',
    'Valores, prazos e requisitos são informados pela equipe.',
  ],
  /** Imagem ilustrativa: motociclista na estrada (liberdade de ir). */
  image: unsplash('photo-1558981806-ec527fa84c39', 'Motociclista em estrada ao pôr do sol', {
    ratio: 4 / 5,
    focus: { x: 0.5, y: 0.6, zoom: 1.1 },
    widths: [480, 800, 1100],
  }),
}

export const about = {
  eyebrow: 'Sobre nós',
  title: 'Feito para quem vive a rotina sobre duas rodas',
  /**
   * O primeiro parágrafo usa apenas o que já está confirmado (especialização em motos).
   * O segundo é PROVISÓRIO — substituir pela história oficial da empresa.
   */
  paragraphs: [
    'Somos especializados em locação de motocicletas: uma forma prática de ter mobilidade para trabalhar, se deslocar e cumprir a rotina com mais liberdade.',
    'Este espaço está reservado para a história da empresa: como começou, quem está à frente do negócio e como funciona o atendimento.',
  ],
  /** Valores que orientam a comunicação (não são benefícios contratuais). */
  values: ['Praticidade', 'Mobilidade', 'Confiança', 'Liberdade', 'Atendimento próximo'],
  /** Informações institucionais confirmadas (ex.: { label: 'Atuação', value: 'Cidade/UF' }). */
  facts: [] as { label: string; value: string }[],
  /**
   * Fotos da empresa. Com `src` vazio, é exibido um espaço reservado elegante.
   * `illustrative: true` marca imagens que NÃO são da empresa (exibe selo).
   */
  photos: [
    {
      ...unsplash('photo-1611004061856-ccc3cbe944b2', 'Motociclista de capacete em fundo escuro', {
        ratio: 4 / 5,
        focus: { x: 0.5, y: 0.45, zoom: 1 },
        widths: [480, 720, 960],
      }),
      illustrative: true,
    },
    { src: '', alt: 'Fachada da empresa' },
    { src: '', alt: 'Equipe de atendimento' },
  ] as ImageAsset[],
}

export const faq = {
  eyebrow: 'Dúvidas',
  title: 'Perguntas frequentes',
  items: [
    {
      question: 'Como funciona a locação de motos?',
      answer:
        'Você escolhe a moto, consulta as condições com a nossa equipe e, se fizer sentido, segue com a locação. Modalidades, valores, prazos e requisitos são informados no atendimento, antes de qualquer contratação.',
    },
    {
      question: 'Como consultar as motos disponíveis?',
      answer:
        'O catálogo do site mostra os modelos com fotos e informações. A disponibilidade de cada moto é confirmada pela equipe no atendimento, já que a frota pode mudar.',
    },
    {
      question: 'É possível ficar com a moto?',
      answer:
        'Essa possibilidade depende das condições comerciais da empresa e precisa ser consultada diretamente com a equipe. O site não garante nem promete a aquisição da moto.',
    },
    {
      question: 'Quais documentos são necessários?',
      answer:
        'Os documentos e requisitos para a locação são informados pela equipe no atendimento.',
    },
    {
      question: 'Como entrar em contato?',
      answer:
        'Use o botão de contato em qualquer página ou os canais listados na seção de contato. Na página de uma moto, o botão já envia a mensagem com o nome do modelo.',
    },
  ] satisfies FaqItem[],
}

export const finalCta = {
  eyebrow: 'Contato',
  title: 'Encontre a moto certa para a sua rotina',
  /** Imagem de fundo (ilustrativa) do bloco de contato. */
  image: unsplash('photo-1558980664-769d59546b3d', 'Motociclista em movimento na estrada', { ratio: 4 / 3 }),
  description:
    'Conheça as motos e tire suas dúvidas sobre modalidades e condições diretamente com a nossa equipe.',
}
