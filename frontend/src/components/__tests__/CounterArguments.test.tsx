import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CounterArguments from '../CounterArguments'
import type { CounterArgument } from '../CounterArguments'

describe('CounterArguments', () => {
  it('renders category chips', () => {
    render(<CounterArguments items={[]} onChange={vi.fn()} />)
    expect(screen.getByText('Ekonomisk etablering')).toBeInTheDocument()
    expect(screen.getByText('Familjeband')).toBeInTheDocument()
    expect(screen.getByText('Proportionalitet')).toBeInTheDocument()
  })

  it('shows empty state when no items', () => {
    render(<CounterArguments items={[]} onChange={vi.fn()} />)
    expect(screen.getByText('Inga argument tillagda ännu')).toBeInTheDocument()
  })

  it('adds an argument', () => {
    const onChange = vi.fn()
    render(<CounterArguments items={[]} onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Jag har arbetat i Sverige i 5 år' },
    })
    fireEvent.click(screen.getByRole('button', { name: /lägg till argument/i }))
    expect(onChange).toHaveBeenCalledTimes(1)
    const updated: CounterArgument[] = onChange.mock.calls[0][0]
    expect(updated[0].text).toBe('Jag har arbetat i Sverige i 5 år')
    expect(updated[0].category).toBe('ekonomisk_etablering')
  })

  it('removes an argument', () => {
    const item: CounterArgument = { id: 'x1', category: 'familjeband', text: 'Min familj bor här' }
    const onChange = vi.fn()
    render(<CounterArguments items={[item]} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /ta bort/i }))
    const updated: CounterArgument[] = onChange.mock.calls[0][0]
    expect(updated).toHaveLength(0)
  })

  it('disables add button when text is empty', () => {
    render(<CounterArguments items={[]} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /lägg till argument/i })).toBeDisabled()
  })

  it('selects a different category chip', () => {
    render(<CounterArguments items={[]} onChange={vi.fn()} />)
    fireEvent.click(screen.getByText('Proportionalitet'))
    const chip = screen.getByText('Proportionalitet')
    expect(chip.className).toContain('bg-navy-800')
  })
})
