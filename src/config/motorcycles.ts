/**
 * FROTA DE MOTOS
 * ------------------------------------------------------------------
 * ATENÇÃO: as motos abaixo são EXEMPLOS FICTÍCIOS (`demo: true`) para
 * demonstrar a interface. Não representam o estoque real da empresa,
 * e as fotos são ilustrativas (Unsplash, licença livre).
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

/** Exemplos não têm modalidades nem preços: a interface mostra "sob consulta". */
const demoBase: Pick<Motorcycle, 'demo' | 'modalities' | 'prices'> = { demo: true, modalities: [], prices: [] }

export const motorcycles: Motorcycle[] = [
  {
    ...demoBase,
    slug: 'urbana-160',
    name: 'Urbana 160',
    model: 'Exemplo de moto street',
    displacement: 160,
    style: 'street',
    featured: true,
    summary: 'Exemplo de moto ágil para o trânsito da cidade, trabalho e deslocamentos diários.',
    description:
      'Moto de exemplo, usada apenas para demonstrar a página. As informações reais (modelo, ano, fotos e condições) serão cadastradas quando a frota oficial for recebida.',
    images: demoGallery('photo-1591637333184-19aa84b3e01f', 'Moto street escura estacionada', { x: 0.5, y: 0.6, zoom: 1.1 }, [
      { x: 0.45, y: 0.55 },
      { x: 0.7, y: 0.6 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...demoBase,
    slug: 'naked-300',
    name: 'Naked 300',
    model: 'Exemplo de moto naked',
    displacement: 300,
    style: 'naked',
    featured: true,
    summary: 'Exemplo de naked para quem roda na cidade e também pega estrada.',
    images: demoGallery('photo-1517846693594-1567da72af75', 'Moto naked preta e vermelha em área urbana à noite', { x: 0.5, y: 0.6, zoom: 1.05 }, [
      { x: 0.4, y: 0.6 },
      { x: 0.6, y: 0.5 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...demoBase,
    slug: 'classica-350',
    name: 'Clássica 350',
    model: 'Exemplo de moto clássica',
    displacement: 350,
    style: 'classica',
    featured: true,
    summary: 'Exemplo de moto de visual clássico, confortável para o dia a dia.',
    images: demoGallery('photo-1622185135505-2d795003994a', 'Moto clássica escura sob céu nublado', { x: 0.5, y: 0.62, zoom: 1.1 }, [
      { x: 0.35, y: 0.6 },
      { x: 0.62, y: 0.55 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...demoBase,
    slug: 'sport-400',
    name: 'Sport 400',
    model: 'Exemplo de moto esportiva',
    displacement: 400,
    style: 'esportiva',
    featured: true,
    summary: 'Exemplo de moto carenada, com posição de pilotagem mais esportiva.',
    images: demoGallery('photo-1449426468159-d96dbf08f19f', 'Moto esportiva branca e laranja em pátio', { x: 0.5, y: 0.58, zoom: 1.35 }, [
      { x: 0.4, y: 0.55 },
      { x: 0.62, y: 0.6 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...demoBase,
    slug: 'custom-650',
    name: 'Custom 650',
    model: 'Exemplo de moto custom',
    displacement: 650,
    style: 'custom',
    featured: true,
    summary: 'Exemplo de moto custom, de posição relaxada e visual marcante.',
    images: demoGallery('photo-1558981285-6f0c94958bb6', 'Moto custom preta diante de porta metálica', { x: 0.5, y: 0.62, zoom: 1.1 }, [
      { x: 0.4, y: 0.6 },
      { x: 0.65, y: 0.6 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...demoBase,
    slug: 'sport-600',
    name: 'Sport 600',
    model: 'Exemplo de moto esportiva',
    displacement: 600,
    style: 'esportiva',
    featured: true,
    summary: 'Exemplo de moto esportiva de média cilindrada.',
    images: demoGallery('photo-1547549082-6bc09f2049ae', 'Moto esportiva azul em frente a prédio', { x: 0.5, y: 0.62, zoom: 1.1 }, [
      { x: 0.45, y: 0.6 },
      { x: 0.65, y: 0.6 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
  {
    ...demoBase,
    slug: 'touring-800',
    name: 'Touring 800',
    model: 'Exemplo de moto touring',
    displacement: 800,
    style: 'touring',
    summary: 'Exemplo de moto para viagens e longas distâncias.',
    images: demoGallery('photo-1558981001-792f6c0d5068', 'Moto touring estacionada ao pôr do sol', { x: 0.55, y: 0.62, zoom: 1.1 }, [
      { x: 0.5, y: 0.6 },
      { x: 0.7, y: 0.6 },
    ]),
    specs: [{ label: 'Partida', value: 'Elétrica' }],
  },
]
