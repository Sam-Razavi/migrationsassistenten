import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CaseForm from '../CaseForm'

describe('CaseForm', () => {
  it('renders all required fields', () => {
    render(<CaseForm onSubmit={vi.fn()} />)
    expect(screen.getByText('Målnummer *')).toBeInTheDocument()
    expect(screen.getByText('Klagandens fullständiga namn *')).toBeInTheDocument()
    expect(screen.getByText('Födelsedatum *')).toBeInTheDocument()
    expect(screen.getByText('Nationalitet *')).toBeInTheDocument()
    expect(screen.getByText('Avslagsdatum *')).toBeInTheDocument()
    expect(screen.getByText('Ärendetyp *')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    render(<CaseForm onSubmit={vi.fn()} />)
    fireEvent.submit(screen.getByRole('button', { name: /spara/i }).closest('form')!)
    await waitFor(() => {
      expect(screen.getByText('Ange målnummer')).toBeInTheDocument()
      expect(screen.getByText('Ange klagandens fullständiga namn')).toBeInTheDocument()
      expect(screen.getByText('Välj ärendetyp för att fortsätta')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<CaseForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('t.ex. UM 1234-25'), {
      target: { value: 'UM 1234-26' },
    })
    fireEvent.change(screen.getAllByRole('textbox')[1], {
      target: { value: 'Test Person' },
    })
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: 'asylum' } })

    const dateInputs = document.querySelectorAll('input[type="date"]')
    fireEvent.change(dateInputs[0], { target: { value: '1990-01-01' } })
    fireEvent.change(dateInputs[1], { target: { value: '2026-01-01' } })

    // nationality
    fireEvent.change(screen.getAllByRole('textbox')[2], {
      target: { value: 'Afghansk' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /spara/i }).closest('form')!)
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
  })
})
