import { useState, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('migration_jwt')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function readSseStream(
  response: Response,
  onChunk: (text: string) => void,
): Promise<void> {
  if (!response.body) throw new Error('No response body')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const lines = decoder.decode(value).split('\n')
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') return
      if (data.startsWith('[ERROR]')) throw new Error(data.slice(8))
      onChunk(data.replace(/\\n/g, '\n'))
    }
  }
}

export function useGenerate() {
  const [document, setDocument] = useState('')
  const [generating, setGenerating] = useState(false)
  const [revising, setRevising] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (caseId: number) => {
    setGenerating(true)
    setError(null)
    setDocument('')

    try {
      const response = await fetch(`${API_BASE}/generate/${caseId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      let accumulated = ''
      await readSseStream(response, chunk => {
        accumulated += chunk
        setDocument(accumulated)
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Okänt fel'
      setError(`Generering misslyckades: ${msg}`)
    } finally {
      setGenerating(false)
    }
  }, [])

  const revise = useCallback(
    async (caseId: number, section: string, instruction: string, currentDoc: string) => {
      setRevising(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE}/generate/${caseId}/revise`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ section, instruction, current_document: currentDoc }),
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        let accumulated = ''
        await readSseStream(response, chunk => {
          accumulated += chunk
          setDocument(accumulated)
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Okänt fel'
        setError(`Revidering misslyckades: ${msg}`)
      } finally {
        setRevising(false)
      }
    },
    [],
  )

  return { generate, revise, document, setDocument, generating, revising, error }
}
