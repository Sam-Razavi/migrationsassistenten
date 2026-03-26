import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCase } from '../useCase'

vi.mock('../../api/client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}))

import client from '../../api/client'

const mockCase = {
  id: 1,
  case_number: 'UM-001',
  applicant_name: 'Test Person',
  dob: '1990-01-01',
  nationality: 'Afghansk',
  rejection_date: '2026-01-01',
  decision_type: 'asylum',
  created_at: '2026-01-01T00:00:00',
  updated_at: '2026-01-01T00:00:00',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useCase', () => {
  it('createCase calls POST /cases/ and returns case', async () => {
    vi.mocked(client.post).mockResolvedValue({ data: mockCase })
    const { result } = renderHook(() => useCase())

    let created
    await act(async () => {
      created = await result.current.createCase({
        case_number: 'UM-001',
        applicant_name: 'Test Person',
        dob: '1990-01-01',
        nationality: 'Afghansk',
        rejection_date: '2026-01-01',
        decision_type: 'asylum',
      })
    })

    expect(client.post).toHaveBeenCalledWith('/cases/', expect.any(Object))
    expect(created).toEqual(mockCase)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('getCase calls GET /cases/:id', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: mockCase })
    const { result } = renderHook(() => useCase())

    let fetched
    await act(async () => {
      fetched = await result.current.getCase(1)
    })

    expect(client.get).toHaveBeenCalledWith('/cases/1')
    expect(fetched).toEqual(mockCase)
  })

  it('getCases calls GET /cases/', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [mockCase] })
    const { result } = renderHook(() => useCase())

    let cases
    await act(async () => {
      cases = await result.current.getCases()
    })

    expect(client.get).toHaveBeenCalledWith('/cases/')
    expect(cases).toHaveLength(1)
  })

  it('updateCase calls PUT /cases/:id', async () => {
    const updated = { ...mockCase, rejection_reason: 'Updated reason' }
    vi.mocked(client.put).mockResolvedValue({ data: updated })
    const { result } = renderHook(() => useCase())

    let result_data
    await act(async () => {
      result_data = await result.current.updateCase(1, { rejection_reason: 'Updated reason' })
    })

    expect(client.put).toHaveBeenCalledWith('/cases/1', { rejection_reason: 'Updated reason' })
    expect(result_data).toEqual(updated)
  })

  it('sets error state on failed createCase', async () => {
    vi.mocked(client.post).mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useCase())

    await act(async () => {
      try {
        await result.current.createCase({
          case_number: 'X',
          applicant_name: 'X',
          dob: '1990-01-01',
          nationality: 'X',
          rejection_date: '2026-01-01',
          decision_type: 'asylum',
        })
      } catch {}
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.loading).toBe(false)
  })
})
