import { useState, useCallback } from 'react'
import client from '../api/client'

export interface DocumentVersion {
  id: number
  case_id: number
  label: string | null
  created_at: string
}

export interface DocumentVersionDetail extends DocumentVersion {
  content: string
}

export function useVersions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVersions = useCallback(async (caseId: number): Promise<DocumentVersion[]> => {
    setLoading(true)
    setError(null)
    try {
      const res = await client.get<DocumentVersion[]>(`/cases/${caseId}/versions`)
      return res.data
    } catch {
      const msg = 'Kunde inte hämta versioner.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreVersion = useCallback(async (caseId: number, versionId: number): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await client.post(`/cases/${caseId}/versions/${versionId}/restore`)
    } catch {
      const msg = 'Kunde inte återställa versionen.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchVersions, restoreVersion, loading, error }
}
