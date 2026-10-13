/**
 * FROTA DE MOTOS
 * ------------------------------------------------------------------
 * ATENÇÃO: as fotos abaixo são ilustrativas (Unsplash, licença livre) e não
 * são das motos da empresa. Motos com `demo: true` são opções provisórias.
 *
 * Para cadastrar uma moto real, preencha:
 *  - slug          identificador da URL (/motos/<slug>), único
 *  - name / model  nome comercial e modelo/versão
 *  - brand         fabricante (opcional)
 *  - year          ano (opcional; só aparece se informado)
 *  - displacement  cilindrada em cc (opcional)
 *  - transmission  tipo de transmissão (opcional)
 *  - style         'street' | 'naked' | 'scooter' | 'trail' | 'classica' | 'custom' | 'esportiva' | 'touring' | 'eletrica'
 *  - images        fotos reais, ex.: fleetPhoto('moto-1.jpg', 'descrição da foto')
 *                  (importe `fleetPhoto` de '../lib/images'; ver public/images/frota/LEIAME.txt)
 *  - summary / description
 *  - specs         especificações extras (partida, freios, etc.)
 *  - features      características principais em frases curtas (opcional)
 *  - modalities    modalidades oferecidas (vazio = "sob consulta")
 *  - prices        valores OFICIAIS, somente se fornecidos (vazio = "sob consulta")
 *  - availability  disponibilidade CONFIRMADA pela empresa (vazio = não exibida)
 *  - unavailable   true = fora das recomendações ("Você também pode gostar")
 * e remova `demo: true`. Campos opcionais vazios simplesmente não aparecem.
 */
import { unsplash } from '../lib/images'
import type { Motorcycle } from '../types'

type Focus = { x: number; y: number; zoom?: number }

/**
 * Galeria demonstrativa: foto principal (enquadramento padronizado) + recortes
 * de detalhe da mesma imagem.
 */
function demoGallery(id: string, alt: string, cover: Focus, details: { x: number; y: number }[]) {
  return [
    unsplash(id, alt, { focus: cover, ratio: 4 / 3 }),
    ...details.map((focus, i) =>
      unsplash(id, `${alt} — detalhe ${i + 1}`, { focus: { ...focus, zoom: 2 } }),
    ),
  ]
}

/**
 * Fase 11: frota enxuta de 4 motos Honda, a pedido do cliente.
 * - CG 160 Start e CG 160 Fan: modelos principais da locação (informados pelo cliente).
 * - CB 300F Twister e XRE 300 Sahara: opções adicionais provisórias (`demo: true`),
 *   escolhidas para o catálogo ficar apresentável até a frota oficial ser confirmada.
 * Ficha técnica: somente dados de fábrica comuns a todas as versões (cilindrada,
 * câmbio, partida). Ano, freios (CBS/ABS), preços e disponibilidade dependem da
 * unidade e só entram quando a empresa informar. Fotos: ilustrativas (Unsplash),
 * não são das motos da empresa; trocar por fleetPhoto(...) quando houver fotos reais.
 */
const noConditions: Pick<Motorcycle, 'modalities' | 'prices'> = { modalities: [], prices: [] }

export const motorcycles: Motorcycle[] = [
  {
    ...noConditions,
    slug: 'honda-cg-160-start',
    name: 'Honda CG 160 Start',
    model: 'Modelo principal da locação',
    brand: 'Honda',
    displacement: 162.7,
    transmission: 'Manual, 5 marchas',
    style: 'street',
    featured: true,
    summary: 'A CG de entrada: simples, econômica e prática para trabalhar e rodar na cidade todos os dias.',
    description:
      'A Honda CG 160 Start é um dos modelos principais da nossa locação. Ano, versão e condições de cada unidade são informados pela equipe no atendimento.',
    images: demoGallery('photo-1591637333184-19aa84b3e01f', 'Moto street escura estacionada (foto ilustrativa)', { x: 0.5, y: 0.6, zoom: 1.1 }, [
      { x: 0.45, y: 0.55 },
      { x: 0.7, y: 0.6 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...noConditions,
    slug: 'honda-cg-160-fan',
    name: 'Honda CG 160 Fan',
    model: 'Modelo principal da locação',
    brand: 'Honda',
    displacement: 162.7,
    transmission: 'Manual, 5 marchas',
    style: 'street',
    featured: true,
    summary: 'A CG para o dia a dia de trabalho, com o mesmo motor 160 e acabamento um pouco mais completo que a Start.',
    description:
      'A Honda CG 160 Fan é um dos modelos principais da nossa locação. Ano, versão e condições de cada unidade são informados pela equipe no atendimento.',
    images: demoGallery('photo-1558981403-c5f9899a28bc', 'Moto urbana estacionada junto a parede de azulejos (foto ilustrativa)', { x: 0.5, y: 0.6, zoom: 1.05 }, [
      { x: 0.42, y: 0.58 },
      { x: 0.66, y: 0.6 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...noConditions,
    demo: true,
    slug: 'honda-cb-300f-twister',
    name: 'Honda CB 300F Twister',
    model: 'Opção adicional',
    brand: 'Honda',
    displacement: 293.5,
    transmission: 'Manual, 6 marchas',
    style: 'naked',
    featured: true,
    summary: 'Naked de 300 cc para quem roda na cidade e também pega estrada.',
    images: demoGallery('photo-1517846693594-1567da72af75', 'Moto naked preta e vermelha em área urbana à noite (foto ilustrativa)', { x: 0.5, y: 0.6, zoom: 1.05 }, [
      { x: 0.4, y: 0.6 },
      { x: 0.6, y: 0.5 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...noConditions,
    demo: true,
    slug: 'honda-xre-300-sahara',
    name: 'Honda XRE 300 Sahara',
    model: 'Opção adicional',
    brand: 'Honda',
    displacement: 293.5,
    transmission: 'Manual, 6 marchas',
    style: 'trail',
    featured: true,
    summary: 'Trail de 300 cc, confortável em ruas irregulares e trechos de terra.',
    images: demoGallery('photo-1593771332065-1a56e718cef8', 'Motociclista em moto trail vermelha e branca (foto ilustrativa)', { x: 0.5, y: 0.6, zoom: 1.05 }, [
      { x: 0.45, y: 0.6 },
      { x: 0.6, y: 0.55 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
]
