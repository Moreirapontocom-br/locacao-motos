import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { motorcycles } from '../../config/motorcycles'
import { MotorcycleCard } from './MotorcycleCard'
import { MotorcycleGallery } from './MotorcycleGallery'

describe('card de moto', () => {
  it('moto cadastrada sem fotos mostra "Fotos em breve" em vez de quebrar a página', () => {
    const moto = { ...motorcycles[0], images: [] }
    render(
      <MemoryRouter>
        <MotorcycleCard moto={moto} origin="catalog" />
      </MemoryRouter>,
    )
    expect(screen.getByText('Fotos em breve')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: moto.name })).toBeInTheDocument()
  })

  it('galeria sem fotos mostra o espaço reservado', () => {
    render(<MotorcycleGallery images={[]} title="Moto X" />)
    expect(screen.getByRole('img', { name: 'Moto X: fotos em breve' })).toHaveTextContent('Fotos em breve')
  })
})
