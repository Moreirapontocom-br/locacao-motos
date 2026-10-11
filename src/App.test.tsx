import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { motorcycles } from './config/motorcycles'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('homepage', () => {
  it('exibe o título de motos e os CTAs principais', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /sua próxima moto começa aqui/i })).toBeInTheDocument()
    // Todos os CTAs "Conhecer as motos" (hero, seções e contato) levam ao catálogo.
    for (const link of screen.getAllByRole('link', { name: /conhecer as motos/i })) {
      expect(link).toHaveAttribute('href', '/motos')
    }
    expect(screen.getAllByRole('link', { name: /como funciona/i }).length).toBeGreaterThan(0)
  })

  it('não menciona carros em nenhum texto visível', () => {
    const { container } = renderAt('/')
    expect(container.textContent).not.toMatch(/\bcarros?\b|automóve|\bSUV\b|sedã/i)
  })

  it('filtra as motos em destaque por estilo', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const section = screen.getByRole('region', { name: /encontre sua próxima moto/i })
    await user.click(within(section).getByRole('button', { name: 'Esportiva' }))
    await waitFor(() => {
      const names = within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
      expect(names.length).toBeGreaterThan(0)
      expect(names.every((n) => motorcycles.some((m) => m.name === n && m.style === 'esportiva'))).toBe(true)
    })
  })

  it('não promete aquisição da moto', () => {
    renderAt('/')
    const section = screen.getByRole('region', { name: /consulte as condições/i })
    expect(within(section).getByText(/não é automática nem está prometida/i)).toBeInTheDocument()
  })

  it('abre itens do FAQ', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const question = screen.getByRole('button', { name: /é possível ficar com a moto/i })
    expect(question).toHaveAttribute('aria-expanded', 'false')
    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('catálogo', () => {
  it('aplica o filtro de estilo vindo da URL', () => {
    renderAt('/motos?estilo=esportiva')
    const count = motorcycles.filter((m) => m.style === 'esportiva').length
    expect(screen.getByRole('heading', { level: 1, name: 'Motos Esportiva' })).toBeInTheDocument()
    expect(screen.getByText(`${count} motos`)).toBeInTheDocument()
  })

  it('troca de filtro ao clicar', async () => {
    const user = userEvent.setup()
    renderAt('/motos')
    expect(screen.getByText(`${motorcycles.length} motos`)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^naked/i }))
    expect(screen.getByRole('button', { name: /^naked/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('1 moto')).toBeInTheDocument()
  })

  it('redireciona links antigos de /veiculos', () => {
    renderAt('/veiculos')
    expect(screen.getByRole('heading', { level: 1, name: 'Encontre sua próxima moto' })).toBeInTheDocument()
  })

  it('cards oferecem consulta direta da moto', async () => {
    const user = userEvent.setup()
    renderAt('/motos')
    const [moto] = motorcycles
    await user.click(screen.getByRole('button', { name: `Consultar ${moto.name} pelo WhatsApp` }))
    expect(screen.getByRole('dialog')).toHaveTextContent(moto.name)
  })
})

describe('detalhes da moto', () => {
  it('mostra a moto, a ficha técnica e as condições sob consulta', () => {
    const [moto] = motorcycles
    renderAt(`/motos/${moto.slug}`)
    expect(screen.getByRole('heading', { level: 1, name: moto.name })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ficha técnica' })).toBeInTheDocument()
    expect(screen.getAllByText('Sob consulta').length).toBeGreaterThan(0)
  })

  it('sem contato configurado, mostra o estado demonstrativo com a mensagem da moto', async () => {
    const user = userEvent.setup()
    const [moto] = motorcycles
    renderAt(`/motos/${moto.slug}`)
    await user.click(screen.getByRole('button', { name: 'Consultar pelo WhatsApp' }))
    const dialog = screen.getByRole('dialog', { name: /canal de atendimento em configuração/i })
    expect(within(dialog).getByText(new RegExp(`interesse na moto ${moto.name}`))).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('redireciona detalhes antigos e exibe 404 para moto inexistente', () => {
    renderAt(`/veiculos/${motorcycles[0].slug}`)
    expect(screen.getByRole('heading', { level: 1, name: motorcycles[0].name })).toBeInTheDocument()
  })

  it('exibe estado próprio para moto inexistente, com sugestões que funcionam', () => {
    renderAt('/motos/nao-existe')
    expect(screen.getByRole('heading', { level: 1, name: /moto não encontrada/i })).toBeInTheDocument()
    const suggestions = screen.getByRole('region', { name: /conheça outras motos/i })
    expect(within(suggestions).getAllByRole('link', { name: motorcycles[0].name })[0]).toHaveAttribute(
      'href',
      `/motos/${motorcycles[0].slug}`,
    )
  })

  it('bloco comercial tem CTA principal e link para outras motos', () => {
    renderAt(`/motos/${motorcycles[0].slug}`)
    const panel = screen.getByRole('region', { name: /locação desta moto/i })
    expect(within(panel).getByRole('button', { name: 'Consultar pelo WhatsApp' })).toBeInTheDocument()
    expect(within(panel).getByRole('link', { name: /ver outras motos/i })).toHaveAttribute('href', '/motos')
    // Sem disponibilidade confirmada, a linha não aparece.
    expect(within(panel).queryByText('Disponibilidade')).not.toBeInTheDocument()
  })

  it('galeria: miniaturas, setas e foto ampliada', async () => {
    const user = userEvent.setup()
    const [moto] = motorcycles
    renderAt(`/motos/${moto.slug}`)
    const gallery = screen.getByRole('region', { name: `Galeria de fotos: ${moto.name}` })
    const total = moto.images.length
    expect(within(gallery).getByText(`1 / ${total}`)).toBeInTheDocument()
    expect(within(gallery).getAllByText('Imagem demonstrativa').length).toBeGreaterThan(0)

    await user.click(within(gallery).getByRole('button', { name: 'Próxima foto' }))
    expect(within(gallery).getByText(`2 / ${total}`)).toBeInTheDocument()
    await user.click(within(gallery).getByRole('button', { name: `Ver foto 1 de ${total}` }))
    expect(within(gallery).getByText(`1 / ${total}`)).toBeInTheDocument()

    await user.click(within(gallery).getByRole('button', { name: 'Ampliar foto' }))
    const lightbox = screen.getByRole('dialog', { name: `Fotos ampliadas: ${moto.name}` })
    await user.click(within(lightbox).getAllByRole('button', { name: 'Foto anterior' })[0])
    expect(within(lightbox).getByText(`${total} / ${total}`)).toBeInTheDocument()
    await user.click(within(lightbox).getByRole('button', { name: 'Fechar fotos ampliadas' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('barra fixa de contato só aparece quando o botão principal sai da tela e o rodapé não está visível', async () => {
    let notify: (entries: { target: Element; isIntersecting: boolean }[]) => void = () => {}
    const targets: Element[] = []
    const Original = globalThis.IntersectionObserver
    globalThis.IntersectionObserver = class {
      constructor(cb: typeof notify) {
        notify = cb
      }
      observe(el: Element) {
        targets.push(el)
      }
      disconnect() {}
    } as unknown as typeof IntersectionObserver

    try {
      renderAt(`/motos/${motorcycles[0].slug}`)
      const [cta, footer] = targets
      const bar = () => screen.queryByRole('region', { name: 'Contato rápido' })

      act(() => notify([{ target: cta, isIntersecting: true }, { target: footer, isIntersecting: false }]))
      expect(bar()).not.toBeInTheDocument()
      act(() => notify([{ target: cta, isIntersecting: false }]))
      expect(bar()).toBeInTheDocument()
      act(() => notify([{ target: footer, isIntersecting: true }]))
      await waitFor(() => expect(bar()).not.toBeInTheDocument())
    } finally {
      globalThis.IntersectionObserver = Original
    }
  })

  it('"Você também pode gostar" leva a outras motos e navega entre elas', async () => {
    const user = userEvent.setup()
    const [moto] = motorcycles
    renderAt(`/motos/${moto.slug}`)
    const section = screen.getByRole('region', { name: 'Você também pode gostar' })
    const names = within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(names.length).toBeGreaterThan(0)
    expect(names.length).toBeLessThanOrEqual(3)
    expect(names).not.toContain(moto.name)

    const next = motorcycles.find((m) => m.name === names[0])!
    await user.click(within(section).getByRole('link', { name: next.name }))
    expect(screen.getByRole('heading', { level: 1, name: next.name })).toBeInTheDocument()
  })
})
