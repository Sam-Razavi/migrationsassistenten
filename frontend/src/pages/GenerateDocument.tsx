import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCase } from '../hooks/useCase'
import DocumentPreview from '../components/DocumentPreview'

export default function GenerateDocument() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCase } = useCase()
  const [caseData, setCaseData] = useState<{ applicant_name: string; case_number: string } | null>(null)
  const [document, setDocument] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!id) return
    getCase(Number(id)).then(c => {
      setCaseData({ applicant_name: c.applicant_name, case_number: c.case_number })
      if (c.generated_document) {
        setDocument(c.generated_document)
        setDone(true)
      }
    })
  }, [id, getCase])

  const generate = async () => {
    if (!id) return
    setGenerating(true)
    setError(null)
    setDocument('')
    setDone(false)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/generate/${id}`,
        { method: 'POST' }
      )

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break

        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') {
            setDone(true)
          } else if (data.startsWith('[ERROR]')) {
            throw new Error(data.slice(8))
          } else {
            accumulated += data.replace(/\\n/g, '\n')
            setDocument(accumulated)
          }
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Okänt fel'
      setError(
        `Generering misslyckades: ${msg}. ` +
        'Kontrollera att ANTHROPIC_API_KEY är konfigurerad och försök igen.'
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">
            ← Tillbaka
          </button>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Generera överklagande</h1>
          {caseData && (
            <p className="mt-1 text-gray-600">{caseData.applicant_name} · {caseData.case_number}</p>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!document && !generating && (
          <div className="rounded-xl bg-white p-8 shadow-sm text-center">
            <p className="text-gray-600 mb-6">
              Klicka på knappen nedan för att generera ett formellt överklagande baserat på ärendets uppgifter.
            </p>
            <button
              onClick={generate}
              className="rounded-md bg-green-600 px-8 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Generera överklagande
            </button>
          </div>
        )}

        {generating && !document && (
          <div className="rounded-xl bg-white p-8 shadow-sm text-center">
            <div className="animate-pulse text-gray-500">Genererar överklagande...</div>
          </div>
        )}

        {document && (
          <DocumentPreview
            document={document}
            caseId={Number(id)}
            onChange={setDocument}
            generating={generating}
            onRegenerate={generate}
          />
        )}
      </div>
    </div>
  )
}
