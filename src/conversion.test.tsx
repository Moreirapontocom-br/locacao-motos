import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { contactMessages } from './config/commercial'
import { motorcycles } from './config/motorcycles'
import { clearTrackedEvents, getTrackedEvents } from './lib/analytics'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

/** Sem WhatsApp configurado, o clique abre o aviso demonstrativo com a mensagem preparada. */
const preparedMessage = () => screen.getByRole('dialog').querySelector('blockquote')?.textContent ?? ''

const moto = motorcycles[0]

beforeEach(() => clearTrackedEvents())
afterEach(() => clearTrackedEvents())

describe('formulário de interesse (página da moto)', () => {
  it('é opcional: o contato direto existe sem abrir o formulário', () => {
    renderAt(`/motos/${moto.slug}`)
    expect(screen.getByRole('button', { name: 'Consultar pelo WhatsApp' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /detalhar minha consulta/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByLabelText('Moto desejada')).not.toBeInTheDocument()
  })

  it('abre pelo teclado, vem com a moto preenchida e gera a mensagem organizada', async () => {
    const user = userEvent.setup()
    renderAt(`/motos/${moto.slug}`)

    const toggle = screen.getByRole('button', { name: /detalhar minha consulta/i })
    toggle.focus()
    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(getTrackedEvents()).toContainEqual(
      expect.objectContaining({ name: 'interest_form_open', origin: 'detail', slug: moto.slug }),
    )

    expect(screen.getByLabelText('Moto desejada')).toHaveValue(moto.slug)

    // Objetivo escolhido só com o teclado (foco no rádio + barra de espaço).
    const work = screen.getByRole('radio', { name: 'Trabalho' })
    work.focus()
    await user.keyboard(' ')
    expect(work).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Continuar pelo WhatsApp' }))
    const message = preparedMessage()
    expect(message).toContain(`• Moto: ${moto.name}`)
    expect(message).toContain('• Modalidade: ainda não decidi')
    expect(message).toContain('• Uso: Trabalho')
    expect(getTrackedEvents()).toContainEqual(
      expect.objectContaining({ name: 'contact_click', origin: 'form/detail', slug: moto.slug, channel: 'unconfigured' }),
    )
  })

  it('oferece as duas modalidades e "Ainda não decidi", sem associá-las a preços', async () => {
    const user = userEvent.setup()
    renderAt(`/motos/${moto.slug}`)
    await user.click(screen.getByRole('button', { name: /detalhar minha consulta/i }))
    const select = screen.getByLabelText('Modalidade de interesse')
    expect(within(select).getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Ainda não decidi',
      'Locação com aquisição',
      'Locação tradicional',
    ])
    expect(select).toHaveValue('')
    const form = screen.getByRole('button', { name: 'Continuar pelo WhatsApp' }).closest('form')!
    expect(form).not.toHaveTextContent(/R\$/)
  })

  it('não pede dados pessoais', async () => {
    const user = userEvent.setup()
    renderAt(`/motos/${moto.slug}`)
    await user.click(screen.getByRole('button', { name: /detalhar minha consulta/i }))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})

describe('formulário de interesse (home, sem moto selecionada)', () => {
  it('permite seguir sem escolher moto', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const contact = screen.getByRole('region', { name: /pronto para escolher sua próxima moto/i })
    await user.click(within(contact).getByRole('button', { name: /detalhar minha consulta/i }))
    expect(within(contact).getByLabelText('Moto desejada')).toHaveValue('')
    await user.click(within(contact).getByRole('button', { name: 'Continuar pelo WhatsApp' }))
    expect(preparedMessage()).toContain('• Moto: ainda não escolhi')
  })

  it('motos de exemplo aparecem identificadas como exemplo', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const contact = screen.getByRole('region', { name: /pronto para escolher sua próxima moto/i })
    await user.click(within(contact).getByRole('button', { name: /detalhar minha consulta/i }))
    const demo = motorcycles.find((m) => m.demo)!
    expect(within(contact).getByRole('option', { name: `${demo.name} (exemplo)` })).toBeInTheDocument()
    // As CG 160 são modelos informados pela empresa: sem o sufixo de exemplo.
    expect(within(contact).getByRole('option', { name: moto.name })).toBeInTheDocument()
  })
})

describe('CTAs contextuais', () => {
  it('home: interesse geral em alugar', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: 'Solicitar informações pelo WhatsApp' }))
    expect(preparedMessage()).toContain(contactMessages.general)
  })

  it('FAQ: dúvida', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: 'Tirar uma dúvida pelo WhatsApp' }))
    expect(preparedMessage()).toContain(contactMessages.faq)
  })

  it('modalidades: cada card envia a mensagem da sua modalidade', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: /quero conhecer essa modalidade.*locação com aquisição/i }))
    expect(preparedMessage()).toContain(contactMessages.modality('Locação com aquisição'))
    expect(preparedMessage()).toContain('modalidade de locação com aquisição')
  })

  it('a modalidade escolhida chega ao contato final e ao formulário', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const cards = screen.getByRole('region', { name: /dois caminhos/i })
    await user.click(within(cards).getByRole('button', { name: /quero conhecer essa modalidade.*locação tradicional/i }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /fechar/i }))

    const contact = screen.getByRole('region', { name: /pronto para escolher sua próxima moto/i })
    expect(within(contact).getByRole('status')).toHaveTextContent('Locação tradicional')

    await user.click(within(contact).getByRole('button', { name: 'Solicitar informações pelo WhatsApp' }))
    expect(preparedMessage()).toContain('modalidade de locação tradicional')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /fechar/i }))

    await user.click(within(contact).getByRole('button', { name: /detalhar minha consulta/i }))
    expect(within(contact).getByLabelText('Modalidade de interesse')).toHaveValue('Locação tradicional')
    await user.click(within(contact).getByRole('button', { name: 'Continuar pelo WhatsApp' }))
    expect(preparedMessage()).toContain('• Modalidade: Locação tradicional')
  })

  it('sem escolha de modalidade, o contato final não inventa preferência', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const contact = screen.getByRole('region', { name: /pronto para escolher sua próxima moto/i })
    expect(within(contact).queryByRole('status')).not.toBeInTheDocument()
    await user.click(within(contact).getByRole('button', { name: 'Solicitar informações pelo WhatsApp' }))
    expect(preparedMessage()).not.toMatch(/modalidade/i)
  })

  it('catálogo: interesse no modelo clicado, com evento de origem', async () => {
    const user = userEvent.setup()
    renderAt('/motos')
    await user.click(screen.getByRole('button', { name: `Consultar ${moto.name} pelo WhatsApp` }))
    expect(preparedMessage()).toContain(`moto ${moto.name} no catálogo`)
    expect(getTrackedEvents()).toContainEqual(
      expect.objectContaining({ name: 'contact_click', origin: 'catalog', slug: moto.slug }),
    )
  })

  it('clique em uma moto do catálogo registra interesse e abre a página certa', async () => {
    const user = userEvent.setup()
    renderAt('/motos')
    await user.click(screen.getByRole('link', { name: moto.name }))
    expect(screen.getByRole('heading', { level: 1, name: moto.name })).toBeInTheDocument()
    expect(getTrackedEvents()).toContainEqual(
      expect.objectContaining({ name: 'moto_interest_click', origin: 'catalog', slug: moto.slug }),
    )
  })

  it('botão flutuante aparece na home após rolar (controle do teste abaixo)', async () => {
    renderAt('/')
    const original = Object.getOwnPropertyDescriptor(window, 'scrollY')
    Object.defineProperty(window, 'scrollY', { value: 5000, configurable: true })
    try {
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })
      expect(await screen.findByRole('button', { name: 'Falar pelo WhatsApp' })).toBeInTheDocument()
    } finally {
      if (original) Object.defineProperty(window, 'scrollY', original)
      else Reflect.deleteProperty(window, 'scrollY')
    }
  })

  it('não há botão flutuante concorrente na página da moto', () => {
    renderAt(`/motos/${moto.slug}`)
    const original = Object.getOwnPropertyDescriptor(window, 'scrollY')
    Object.defineProperty(window, 'scrollY', { value: 5000, configurable: true })
    try {
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })
      expect(screen.queryByRole('button', { name: 'Falar pelo WhatsApp' })).not.toBeInTheDocument()
    } finally {
      if (original) Object.defineProperty(window, 'scrollY', original)
      else Reflect.deleteProperty(window, 'scrollY')
    }
  })
})
