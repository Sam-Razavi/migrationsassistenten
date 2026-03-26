import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EvidenceChecklist from '../EvidenceChecklist'
import type { EvidenceItem } from '../../hooks/useCase'

describe('EvidenceChecklist', () => {
  it('renders preset checkboxes', () => {
    render(<EvidenceChecklist items={[]} onChange={vi.fn()} />)
    expect(screen.getByText('Vigselbevis / äktenskapsintyg')).toBeInTheDocument()
    expect(screen.getByText('Pass och identitetshandlingar')).toBeInTheDocument()
  })

  it('toggles preset item on click', () => {
    const onChange = vi.fn()
    render(<EvidenceChecklist items={[]} onChange={onChange} />)
    const checkbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledTimes(1)
    const updated: EvidenceItem[] = onChange.mock.calls[0][0]
    expect(updated[0].checked).toBe(true)
    expect(updated[0].is_preset).toBe(true)
  })

  it('unchecks already-checked preset item', () => {
    const existing: EvidenceItem = {
      id: 'p1',
      label: 'Vigselbevis / äktenskapsintyg',
      description: '',
      is_preset: true,
      checked: true,
    }
    const onChange = vi.fn()
    render(<EvidenceChecklist items={[existing]} onChange={onChange} />)
    const checkbox = screen.getAllByRole('checkbox')[0]
    expect(checkbox).toBeChecked()
    fireEvent.click(checkbox)
    const updated: EvidenceItem[] = onChange.mock.calls[0][0]
    expect(updated[0].checked).toBe(false)
  })

  it('adds custom item', () => {
    const onChange = vi.fn()
    render(<EvidenceChecklist items={[]} onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('Namn på handlingen'), {
      target: { value: 'Hyreskontrakt' },
    })
    fireEvent.click(screen.getByRole('button', { name: /lägg till/i }))
    const updated: EvidenceItem[] = onChange.mock.calls[0][0]
    expect(updated[0].label).toBe('Hyreskontrakt')
    expect(updated[0].is_preset).toBe(false)
    expect(updated[0].checked).toBe(true)
  })

  it('removes custom item', () => {
    const custom: EvidenceItem = {
      id: 'c1',
      label: 'Eget dokument',
      description: '',
      is_preset: false,
      checked: true,
    }
    const onChange = vi.fn()
    render(<EvidenceChecklist items={[custom]} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /ta bort/i }))
    const updated: EvidenceItem[] = onChange.mock.calls[0][0]
    expect(updated).toHaveLength(0)
  })
})
