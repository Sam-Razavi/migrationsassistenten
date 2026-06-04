import { useState, useCallback } from 'react'
import client from '../api/client'

export interface EvidenceItem {
  id: string
  label: string
  description: string
  is_preset: boolean
  checked: boolean
}

export interface TimelineEntry {
  id: string
  date: string
  description: string
}

export interface Case {
  id: number
  case_number: string
  applicant_name: string
  dob: string
  nationality: string
  rejection_date: string
  mv_reference?: string
  decision_type: string
  rejection_reason?: string
  evidence?: EvidenceItem[]
  timeline?: TimelineEntry[]
  generated_document?: string
  created_at: string
  updated_at: string
}

export interface CaseCreateData {
  case_number: string
  applicant_name: string
  dob: string
  nationality: string
  rejection_date: string
  mv_reference?: string
  decision_type: string
  rejection_reason?: string
}

export function useCase() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCase = useCallback(async (data: CaseCreateData): Promise<Case> => {
    setLoading(true)
    setError(null)
    try {
      const response = await client.post<Case>('/cases/', data)
      return response.data
    } catch (err) {
      const msg = 'Kunde inte spara ärendet. Försök igen.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const getCase = useCallback(async (id: number): Promise<Case> => {
    setLoading(true)
    setError(null)
    try {
      const response = await client.get<Case>(`/cases/${id}`)
      return response.data
    } catch {
      const msg = 'Kunde inte hämta ärendet.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const getCases = useCallback(async (): Promise<Case[]> => {
    setLoading(true)
    setError(null)
    try {
      const response = await client.get<Case[]>('/cases/')
      return response.data
    } catch {
      const msg = 'Kunde inte hämta ärenden.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCase = useCallback(async (id: number, data: Partial<Case>): Promise<Case> => {
    setLoading(true)
    setError(null)
    try {
      const response = await client.put<Case>(`/cases/${id}`, data)
      return response.data
    } catch {
      const msg = 'Kunde inte uppdatera ärendet.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { createCase, getCase, getCases, updateCase, loading, error }
}
