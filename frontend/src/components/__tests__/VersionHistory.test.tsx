import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import VersionHistory from '../VersionHistory'

const mockFetchVersions = vi.hoisted(() =>
  vi.fn().mockResolvedValue([
    { id: 1, case_id: 42, label: 'Genererat', created_at: '2026-04-10T12:00:00' },
    { id: 2, case_id: 42, label: 'Reviderat: Yrkande', created_at: '2026-04-11T09:30:00' },
  ])
)
const mockRestoreVersion = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))

vi.mock('../../hooks/useVersions', () => ({
  useVersions: () => ({
    fetchVersions: mockFetchVersions,
    restoreVersion: mockRestoreVersion,
    loading: false,
    error: null,
  }),
}))

describe('VersionHistory', () => {
  it('renders version list after load', async () => {
    render(<VersionHistory caseId={42} onRestore={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('Reviderat: Yrkande')).toBeInTheDocument()
      expect(screen.getByText('Genererat')).toBeInTheDocument()
    })
  })

  it('marks first (newest) version as current', async () => {
    render(<VersionHistory caseId={42} onRestore={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('aktuell')).toBeInTheDocument()
    })
  })

  it('shows Restore button only for non-current versions', async () => {
    render(<VersionHistory caseId={42} onRestore={vi.fn()} />)
    await waitFor(() => {
      const restoreButtons = screen.getAllByRole('button', { name: /återställ/i })
      expect(restoreButtons).toHaveLength(1)
    })
  })

  it('calls onRestore with correct version id', async () => {
    const onRestore = vi.fn().mockResolvedValue(undefined)
    render(<VersionHistory caseId={42} onRestore={onRestore} />)
    await waitFor(() => screen.getAllByRole('button', { name: /återställ/i }))
    fireEvent.click(screen.getByRole('button', { name: /återställ/i }))
    await waitFor(() => {
      expect(onRestore).toHaveBeenCalledWith(expect.any(Number))
    })
  })
})
