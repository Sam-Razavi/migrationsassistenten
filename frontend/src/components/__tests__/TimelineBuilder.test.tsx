import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TimelineBuilder from '../TimelineBuilder'
import type { TimelineEntry } from '../../hooks/useCase'

describe('TimelineBuilder', () => {
  it('shows empty state when no entries', () => {
    render(<TimelineBuilder entries={[]} onChange={vi.fn()} />)
    expect(screen.getByText('Inga tidpunkter tillagda ännu')).toBeInTheDocument()
  })

  it('renders existing entries', () => {
    const entries: TimelineEntry[] = [
      { id: 't1', date: '2025-06-01', description: 'Ansökan inlämnad' },
    ]
    render(<TimelineBuilder entries={entries} onChange={vi.fn()} />)
    expect(screen.getByText('Ansökan inlämnad')).toBeInTheDocument()
    expect(screen.getByText('2025-06-01')).toBeInTheDocument()
  })

  it('adds a new entry', () => {
    const onChange = vi.fn()
    render(<TimelineBuilder entries={[]} onChange={onChange} />)

    const dateInput = document.querySelector('input[type="date"]')!
    fireEvent.change(dateInput, { target: { value: '2026-01-15' } })
    fireEvent.change(screen.getByPlaceholderText(/ansökan/i), {
      target: { value: 'Intervju genomförd' },
    })
    fireEvent.click(screen.getByRole('button', { name: /lägg till/i }))

    expect(onChange).toHaveBeenCalledTimes(1)
    const updated: TimelineEntry[] = onChange.mock.calls[0][0]
    expect(updated[0].date).toBe('2026-01-15')
    expect(updated[0].description).toBe('Intervju genomförd')
  })

  it('removes an entry', () => {
    const entries: TimelineEntry[] = [
      { id: 't1', date: '2025-06-01', description: 'Ansökan inlämnad' },
    ]
    const onChange = vi.fn()
    render(<TimelineBuilder entries={entries} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /ta bort/i }))
    const updated: TimelineEntry[] = onChange.mock.calls[0][0]
    expect(updated).toHaveLength(0)
  })

  it('sorts entries by date', () => {
    const entries: TimelineEntry[] = [
      { id: 't2', date: '2026-03-01', description: 'Beslut mottaget' },
      { id: 't1', date: '2025-06-01', description: 'Ansökan inlämnad' },
    ]
    render(<TimelineBuilder entries={entries} onChange={vi.fn()} />)
    const chips = screen.getAllByText(/\d{4}-\d{2}-\d{2}/)
    expect(chips[0].textContent).toBe('2025-06-01')
    expect(chips[1].textContent).toBe('2026-03-01')
  })
})
