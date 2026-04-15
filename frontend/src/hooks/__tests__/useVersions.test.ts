import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVersions } from '../useVersions'

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import client from '../../api/client'

const mockVersions = [
  { id: 1, case_id: 5, label: 'Genererat', created_at: '2026-04-10T12:00:00' },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useVersions', () => {
  it('fetchVersions calls GET /cases/:id/versions', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: mockVersions })
    const { result } = renderHook(() => useVersions())

    let versions
    await act(async () => {
      versions = await result.current.fetchVersions(5)
    })

    expect(client.get).toHaveBeenCalledWith('/cases/5/versions')
    expect(versions).toHaveLength(1)
    expect(result.current.loading).toBe(false)
  })

  it('restoreVersion calls POST /cases/:id/versions/:vid/restore', async () => {
    vi.mocked(client.post).mockResolvedValue({ data: {} })
    const { result } = renderHook(() => useVersions())

    await act(async () => {
      await result.current.restoreVersion(5, 1)
    })

    expect(client.post).toHaveBeenCalledWith('/cases/5/versions/1/restore')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets error state on fetchVersions failure', async () => {
    vi.mocked(client.get).mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useVersions())

    await act(async () => {
      try {
        await result.current.fetchVersions(5)
      } catch {}
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.loading).toBe(false)
  })
})
