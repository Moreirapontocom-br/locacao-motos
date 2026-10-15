import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { motorcycles } from './config/motorcycles'
import { clearTrackedEvents, getTrackedEvents } from './lib/analytics'
import { finderResults } from './lib/finder'

function renderHome() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  return screen.getByRole('region', { name: /duas perguntas/i })
}

const preparedMessage = () => screen.getByRole('dialog').querySelector('blockquote')?.textContent ?? ''

afterEach(() => clearTrackedEvents())

describe('Encontre sua próxima moto', () => {
  it('mostra uma pergunta por vez, com progresso', () => {
    const finder = renderHome()
    expect(within(finder).getByRole('heading', { level: 3, name: /para que você vai usar a moto/i })).toBeInTheDocument()
    expect(within(finder).queryByRole('heading', { name: /qual modalidade/i })).not.toBeInTheDocument()
    expect(within(finder).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
    expect(within(finder).getByText(/etapa 1 de 3/i)).toBeInTheDocument()
    for (const label of ['Trabalhar', 'Dia a dia', 'Interesse em aquisição futura', 'Explorar opções']) {
      expect(within(finder).getByRole('button', { name: new RegExp(label, 'i') })).toBeInTheDocument()
    }
    expect(within(finder).queryByRole('button', { name: /voltar/i })).not.toBeInTheDocument()
  })

  it('avança, volta mantendo a resposta e leva o foco ao título da etapa', async () => {
    const user = userEvent.setup()
    const finder = renderHome()
    await user.click(within(finder).getByRole('button', { name: /^trabalhar/i }))
    const step2 = await within(finder).findByRole('heading', { name: /qual modalidade você prefere/i })
    expect(step2).toHaveFocus()
    expect(within(finder).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')

    await user.click(within(finder).getByRole('button', { name: /voltar/i }))
    await within(finder).findByRole('heading', { name: /para que você vai usar a moto/i })
    expect(within(finder).getByRole('button', { name: /^trabalhar/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('funciona só pelo teclado', async () => {
    const user = userEvent.setup()
    const finder = renderHome()
    within(finder).getByRole('button', { name: /^dia a dia/i }).focus()
    await user.keyboard('{Enter}')
    await within(finder).findByRole('heading', { name: /qual modalidade/i })
    // O foco está no título da etapa; a próxima tecla Tab chega à primeira opção.
    await user.tab()
    expect(document.activeElement).toHaveAccessibleName(/locação com aquisição/i)
    await user.keyboard('{Enter}')
    expect(await within(finder).findByRole('heading', { name: /motos do catálogo/i })).toHaveFocus()
  })

  it('sem dados oficiais, mostra as motos do catálogo sem afirmar que são ideais', async () => {
    const user = userEvent.setup()
    const finder = renderHome()
    await user.click(within(finder).getByRole('button', { name: /^trabalhar/i }))
    await user.click(await within(finder).findByRole('button', { name: /^locação tradicional/i }))
    const results = await within(finder).findByRole('list', { name: 'Motos do resultado' })
    const available = motorcycles.filter((m) => !m.unavailable)
    expect(within(results).getAllByRole('link')).toHaveLength(available.length)
    expect(finder).toHaveTextContent(/ainda não temos informações oficiais para indicar modelos por perfil/i)
    expect(finder.textContent).not.toMatch(/ideal|recomendad|perfeita|compatível com você/i)
    expect(finder.textContent).not.toMatch(/R\$|399/)
    // Motos de exemplo continuam identificadas.
    expect(within(results).getAllByText('Exemplo')).toHaveLength(available.filter((m) => m.demo).length)
  })

  it('leva à página da moto, com evento de origem', async () => {
    const user = userEvent.setup()
    const finder = renderHome()
    await user.click(within(finder).getByRole('button', { name: /^explorar opções/i }))
    await user.click(await within(finder).findByRole('button', { name: /ainda não decidi/i }))
    const moto = motorcycles[0]
    await user.click(await within(finder).findByRole('link', { name: new RegExp(moto.name) }))
    expect(screen.getByRole('heading', { level: 1, name: moto.name })).toBeInTheDocument()
    expect(getTrackedEvents()).toContainEqual(expect.objectContaining({ name: 'moto_interest_click', origin: 'finder', slug: moto.slug }))
  })

  it('o contato leva as respostas e a modalidade segue para o contato final', async () => {
    const user = userEvent.setup()
    const finder = renderHome()
    await user.click(within(finder).getByRole('button', { name: /^interesse em aquisição futura/i }))
    await user.click(await within(finder).findByRole('button', { name: /^locação com aquisição/i }))
    await user.click(await within(finder).findByRole('button', { name: /falar com a equipe sobre minha escolha/i }))
    expect(preparedMessage()).toContain('• Objetivo: Interesse em aquisição futura')
    expect(preparedMessage()).toContain('• Modalidade: Locação com aquisição')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /fechar/i }))

    const contact = screen.getByRole('region', { name: /pronto para escolher sua próxima moto/i })
    expect(within(contact).getByRole('status')).toHaveTextContent('Locação com aquisição')
  })

  it('"Ainda não decidi" não inventa modalidade e "Recomeçar" volta ao início', async () => {
    const user = userEvent.setup()
    const finder = renderHome()
    await user.click(within(finder).getByRole('button', { name: /^dia a dia/i }))
    await user.click(await within(finder).findByRole('button', { name: /ainda não decidi/i }))
    await user.click(await within(finder).findByRole('button', { name: /falar com a equipe sobre minha escolha/i }))
    expect(preparedMessage()).toContain('• Modalidade: ainda não decidi')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /fechar/i }))
    const contact = screen.getByRole('region', { name: /pronto para escolher sua próxima moto/i })
    expect(within(contact).queryByRole('status')).not.toBeInTheDocument()

    await user.click(within(finder).getByRole('button', { name: /recomeçar/i }))
    expect(await within(finder).findByRole('heading', { name: /para que você vai usar a moto/i })).toBeInTheDocument()
    expect(within(finder).getByRole('button', { name: /^dia a dia/i })).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('finderResults', () => {
  const [a, b] = motorcycles

  it('sem modalidades cadastradas, devolve todas as motos disponíveis sem correspondência', () => {
    const list = [{ ...a, modalities: [] }, { ...b, modalities: [] }, { ...b, slug: 'x', unavailable: true }]
    expect(finderResults(list, 'Locação tradicional')).toEqual({ matched: false, motorcycles: list.slice(0, 2) })
  })

  it('filtra só pela modalidade oficial cadastrada na moto', () => {
    const list = [{ ...a, modalities: ['Locação tradicional'] }, { ...b, modalities: ['Locação com aquisição'] }]
    expect(finderResults(list, 'Locação com aquisição')).toEqual({ matched: true, motorcycles: [list[1]] })
    expect(finderResults(list, undefined).matched).toBe(false)
  })
})
