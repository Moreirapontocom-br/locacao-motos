/**
 * CONFIGURAÇÃO COMERCIAL E MENSAGENS DE ATENDIMENTO
 * ------------------------------------------------------------------
 * O número de WhatsApp fica em `siteConfig.contact.whatsapp` (src/config/site.ts).
 * Aqui ficam as modalidades CONFIRMADAS e os textos das mensagens enviadas
 * para o WhatsApp em cada ponto do site.
 *
 * Nada aqui deve prometer valores, prazos, entrada, parcelas ou aquisição.
 */

export const commercialConfig = {
  /**
   * Modalidades CONFIRMADAS pela empresa (aparecem no formulário de interesse).
   * Ex.: ['Locação semanal', 'Locação mensal']. Vazio = a equipe apresenta as opções.
   * Uma moto com `modalities` próprias usa as dela.
   */
  modalities: [] as string[],

  /**
   * Aquisição só aparece como opção quando a empresa CONFIRMAR a modalidade.
   * Enquanto `confirmed` for false, o site não oferece nem promete aquisição.
   */
  acquisition: {
    confirmed: false,
    label: 'Locação com possibilidade de aquisição',
  },

  /** Objetivo de utilização (opcional no formulário). */
  purposes: [
    { value: 'trabalho', label: 'Trabalho' },
    { value: 'pessoal', label: 'Uso pessoal' },
    { value: 'avaliando', label: 'Ainda avaliando' },
  ],
}

export type PurposeValue = 'trabalho' | 'pessoal' | 'avaliando'

/** Textos curtos de cada contexto de contato. Edite livremente, mantendo-os objetivos. */
export const contactMessages = {
  /** Cabeçalho, menu, botão flutuante e bloco de contato da home. */
  general: 'Olá! Vim pelo site e tenho interesse em alugar uma moto.',
  /** Card do catálogo/home: interesse no modelo clicado. */
  catalog: (moto: string) =>
    `Olá! Vi a moto ${moto} no catálogo do site e tenho interesse na locação. Gostaria de receber mais informações.`,
  /** Página individual: consulta sobre aquela moto. */
  detail: (moto: string) => `Olá! Tenho interesse na locação da moto ${moto}. Gostaria de receber mais informações.`,
  /** Seção de modalidades. */
  modality: (modality?: string) =>
    modality
      ? `Olá! Gostaria de informações sobre a modalidade "${modality}".`
      : 'Olá! Gostaria de conhecer as modalidades de locação de motos.',
  /** Seção de perguntas frequentes. */
  faq: 'Olá! Tenho uma dúvida sobre a locação de motos.',
  /** Catálogo: quem não encontrou a moto procurada. */
  availability: 'Olá! Vim pelo site e gostaria de saber quais motos estão disponíveis para locação.',
  /** Abertura da mensagem montada pelo formulário de interesse. */
  formIntro: 'Olá! Vim pelo site e gostaria de consultar a locação de uma moto.',
}
