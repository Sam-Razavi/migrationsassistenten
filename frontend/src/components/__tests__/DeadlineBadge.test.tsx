import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DeadlineBadge from '../DeadlineBadge'

function toIso(d: Date): string {
  return d.toISOString().split('T')[0]
}

function daysFrom(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toIso(d)
}

describe('DeadlineBadge', () => {
  it('renders nothing when no deadline', () => {
    const { container } = render(<DeadlineBadge appealDeadline={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows green badge for more than 14 days remaining', () => {
    render(<DeadlineBadge appealDeadline={daysFrom(20)} />)
    const badge = screen.getByText(/dagar kvar/)
    expect(badge.className).toContain('emerald')
  })

  it('shows amber badge for 7-14 days remaining', () => {
    render(<DeadlineBadge appealDeadline={daysFrom(10)} />)
    const badge = screen.getByText(/dagar kvar/)
    expect(badge.className).toContain('amber')
  })

  it('shows red badge for 7 or fewer days remaining', () => {
    render(<DeadlineBadge appealDeadline={daysFrom(5)} />)
    const badge = screen.getByText(/dag.*kvar/)
    expect(badge.className).toContain('red')
  })

  it('shows expired message for past deadline', () => {
    render(<DeadlineBadge appealDeadline={daysFrom(-3)} />)
    expect(screen.getByText('Överklagandetiden har gått ut')).toBeInTheDocument()
  })

  it('shows 1 dag (singular) when exactly 1 day left', () => {
    render(<DeadlineBadge appealDeadline={daysFrom(1)} />)
    expect(screen.getByText(/1 dag kvar/)).toBeInTheDocument()
  })
})
