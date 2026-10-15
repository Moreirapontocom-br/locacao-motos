/**
 * CONTEÚDO INSTITUCIONAL E TEXTOS DO SITE
 * ------------------------------------------------------------------
 * Empresa especializada em LOCAÇÃO DE MOTOS.
 * Textos marcados como provisórios devem ser revisados com a empresa.
 * Nenhum texto aqui afirma valores, prazos, entrada, parcelas, benefícios
 * contratuais ou aquisição/transferência de propriedade.
 */
import { unsplash } from '../lib/images'
import type { FaqItem, ImageAsset, NavItem } from '../types'

export const navigation: NavItem[] = [
  { label: 'Motos', to: '/motos' },
  { label: 'Modalidades', to: '/#modalidades' },
  { label: 'Como funciona', to: '/#como-funciona' },
  { label: 'Contato', to: '/#contato' },
]

export const hero = {
  eyebrow: 'Locação de motos Honda',
  /** Título em duas partes: a segunda recebe a cor de destaque (Fase 15). */
  title: 'Sua próxima moto',
  titleAccent: 'começa aqui.',
  subtitle: 'Locação tradicional ou com possibilidade de aquisição.',
  primaryCta: { label: 'Ver motos disponíveis', to: '/#motos' },
  secondaryCta: { label: 'Falar com a equipe' },
  /**
   * Foto ILUSTRATIVA (Unsplash), com selo na página. Ocupa toda a largura do
   * banner (Fase 14). Quando houver a foto oficial (horizontal, de preferência
   * 16:9 ou 3:2, ~2000 px de largura, até ~400 KB), salve em public/images/frota/ e troque por:
   *   main: fleetPhoto('cg-160-piloto.jpg', 'Motociclista pilotando uma Honda CG 160'),
   */
  images: {
    main: unsplash('photo-1572452571879-3d67d5b2a39f', 'Motociclista pilotando moto urbana pela rua', {
      ratio: 3 / 2,
      focus: { x: 0.5, y: 0.55, zoom: 1 },
      widths: [720, 1080, 1600, 2200],
    }),
  },
}

export const rentalModesSection = {
  eyebrow: 'Modalidades',
  title: 'Dois caminhos. A moto certa para você.',
  description: 'Compare as duas modalidades e escolha a que combina com o seu momento.',
  note: 'Valores, prazos, requisitos e condições contratuais ainda não foram confirmados neste site. A equipe informa tudo no atendimento, antes de qualquer contratação.',
}

export const featured = {
  eyebrow: 'Frota',
  title: 'Motos para a sua rotina.',
  description: 'Disponibilidade e condições de cada moto são confirmadas pela equipe.',
}

/**
 * "Encontre sua próxima moto" (Fase 14): seletor em etapas.
 * As respostas NÃO determinam modelos por conta própria: hoje nenhuma moto tem
 * modalidades cadastradas em motorcycles.ts, então o resultado mostra as motos
 * do catálogo sem afirmar que são ideais para o perfil. Quando uma moto tiver
 * `modalities` oficiais, o resultado passa a filtrar por elas (ver lib/finder.ts).
 */
export const finder = {
  eyebrow: 'Encontre sua próxima moto',
  title: 'Duas perguntas. Um caminho.',
  description: 'Conte como você pretende usar a moto e qual modalidade prefere.',
  steps: ['Objetivo', 'Modalidade', 'Resultado'],
  goalQuestion: 'Para que você vai usar a moto?',
  goals: [
    { value: 'trabalhar', label: 'Trabalhar', description: 'Entregas, aplicativos e serviços na rua.' },
    { value: 'dia-a-dia', label: 'Dia a dia', description: 'Deslocamentos na cidade e compromissos.' },
    { value: 'aquisicao', label: 'Interesse em aquisição futura', description: 'Quer usar hoje e pensa em ter a moto.' },
    { value: 'explorar', label: 'Explorar opções', description: 'Ainda está conhecendo as possibilidades.' },
  ],
  modalityQuestion: 'Qual modalidade você prefere?',
  resultTitle: 'Motos do catálogo',
  /** Mostrado quando não há dados oficiais para relacionar modelos às respostas. */
  resultNoMatch:
    'Ainda não temos informações oficiais para indicar modelos por perfil. Estas são as motos do catálogo: a equipe confirma quais atendem ao que você escolheu.',
  /** Mostrado quando há motos com a modalidade escolhida cadastrada oficialmente. */
  resultMatch: 'Motos do catálogo com a modalidade escolhida cadastrada. Disponibilidade e condições são confirmadas pela equipe.',
}

export const howItWorks = {
  eyebrow: 'Como funciona',
  title: 'Em poucos passos, você chega à sua moto.',
  description: 'Escolha a modalidade para ver o caminho.',
  note: 'Explicação geral, não é o contrato. As condições, os prazos e os documentos são informados pela equipe, e o site não faz reservas nem contratações.',
}

/** Seção editorial: peça de campanha, sem promessas de custo, renda ou aprovação. */
export const editorial = {
  eyebrow: 'Mobilidade',
  title: 'Mais liberdade para seguir seu caminho.',
  text: 'Uma moto muda a forma de se deslocar, trabalhar e cumprir a rotina. A locação é um jeito de começar sem complicação: você escolhe a moto e a modalidade, e a equipe explica as condições.',
  /** Imagem ilustrativa: motociclista na estrada ao pôr do sol. */
  image: unsplash('photo-1558981806-ec527fa84c39', 'Motociclista em estrada ao pôr do sol', {
    ratio: 4 / 3,
    focus: { x: 0.5, y: 0.6, zoom: 1.05 },
    widths: [640, 960, 1280, 1600],
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
      question: 'Qual a diferença entre locação tradicional e locação com aquisição?',
      answer:
        'Na locação tradicional, você usa a moto durante o período contratado, sem previsão de transferência da propriedade nessa modalidade. Na locação com aquisição, o contrato contempla a possibilidade de adquirir a moto, desde que as condições contratuais sejam cumpridas. As condições de cada modalidade são informadas pela equipe.',
    },
    {
      question: 'Como funciona a possibilidade de adquirir a moto?',
      answer:
        'A aquisição depende do cumprimento das condições estabelecidas em contrato. A transferência da propriedade não é automática nem incondicional. As regras ainda não estão publicadas neste site: a equipe explica no atendimento, antes da contratação.',
    },
    {
      question: 'Qual é o valor da locação?',
      answer:
        'Os valores e as condições dependem da modalidade e da oferta disponível. Entre em contato com nossa equipe para receber as informações atualizadas.',
    },
    {
      question: 'Quais documentos são necessários?',
      answer: 'Os documentos e requisitos ainda não foram divulgados neste site. A equipe informa no atendimento.',
    },
    {
      question: 'Existe caução?',
      answer: 'Essa informação ainda não foi confirmada neste site. Consulte nossa equipe para saber das condições.',
    },
    {
      question: 'Quais motos estão disponíveis?',
      answer:
        'O catálogo mostra os modelos que apresentamos no site; alguns são identificados como exemplo. A disponibilidade de cada moto, e em qual modalidade, é confirmada pela equipe no atendimento.',
    },
    {
      question: 'Como consultar as condições contratuais?',
      answer:
        'Fale com nossa equipe antes de decidir. As condições contratuais são apresentadas no atendimento, e o site não faz contratações ou reservas.',
    },
    {
      question: 'Como solicitar atendimento?',
      answer:
        'Use o botão de contato em qualquer página ou o formulário de interesse. Na página de uma moto, o botão já envia a mensagem com o nome do modelo.',
    },
  ] satisfies FaqItem[],
}

export const finalCta = {
  eyebrow: 'Contato',
  /** Título em duas partes: a segunda recebe a cor de destaque (Fase 15). */
  title: 'Pronto para escolher',
  titleAccent: 'sua próxima moto?',
  /** Imagem de fundo (ilustrativa) do bloco de contato. */
  image: unsplash('photo-1558980664-769d59546b3d', 'Motociclista em movimento na estrada', { ratio: 4 / 3 }),
  description: 'Fale com nossa equipe, conheça as modalidades e solicite informações sobre as condições disponíveis.',
}
