/**
 * CONFIGURAÇÃO DA EMPRESA
 * ------------------------------------------------------------------
 * Todos os dados institucionais ficam aqui. Campos vazios ('') são
 * tratados pela interface como "a informar" e nunca geram links falsos.
 * Substitua pelos dados oficiais quando forem recebidos.
 */
import type { ImageAsset, SocialLink } from '../types'

export const siteConfig = {
  /** Nome provisório — trocar pelo nome oficial. */
  name: 'Nome da Empresa',
  tagline: 'Locação de motos',
  description:
    'Locação de motocicletas para trabalho e dia a dia. Conheça as motos e consulte modalidades e condições diretamente com a nossa equipe.',

  /** Domínio oficial, sem barra final (usado em SEO). Ex.: 'https://www.suaempresa.com.br' */
  url: '',

  /** Logotipo oficial. Com `src` vazio, o site exibe um marcador provisório. */
  logo: { src: '', alt: 'Logotipo' } satisfies ImageAsset,

  /**
   * Exibe os avisos de "conteúdo demonstrativo / a informar".
   * Mantenha `true` até que todos os dados oficiais estejam preenchidos.
   */
  showDemoNotices: true,

  contact: {
    /**
     * WHATSAPP COMERCIAL — número único usado por todos os botões de contato.
     * Somente dígitos, com DDI 55 e DDD. Ex.: '55DDNNNNNNNNN'.
     * Vazio ou inválido = nenhuma conversa é aberta; o site usa telefone/e-mail
     * (se houver) ou mostra o aviso de canal em configuração.
     * As mensagens de cada botão ficam em src/config/commercial.ts.
     */
    whatsapp: '',
    /** Telefone somente com dígitos (com DDD) e a forma de exibição. */
    phone: '',
    phoneDisplay: '',
    email: '',
    address: {
      street: '',
      district: '',
      city: '',
      state: '',
      zip: '',
    },
    /** Link do Google Maps para o endereço. */
    mapsUrl: '',
    /** Ex.: ['Segunda a sexta, 8h às 18h', 'Sábado, 8h às 12h'] */
    openingHours: [] as string[],
  },

  /** Somente redes com `url` preenchida aparecem como link. */
  social: [
    { network: 'instagram', label: 'Instagram', url: '' },
    { network: 'facebook', label: 'Facebook', url: '' },
    { network: 'youtube', label: 'YouTube', url: '' },
  ] as SocialLink[],

  legal: {
    companyName: '',
    cnpj: '',
    /** Ex.: [{ label: 'Política de privacidade', url: '/privacidade' }] */
    links: [] as { label: string; url: string }[],
  },
}

export type SiteConfig = typeof siteConfig
