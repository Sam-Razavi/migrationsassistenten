import { useState } from 'react'

interface Props {
  document: string
  caseId: number
  onChange: (text: string) => void
  generating: boolean
  onRegenerate: () => void
}

export default function DocumentPreview({ document, caseId, onChange, generating, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const wordCount = document.trim().split(/\s+/).filter(Boolean).length

  const copy = async () => {
    await navigator.clipboard.writeText(document)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadPdf = async () => {
    setDownloading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/export/${caseId}`
      )
      if (!response.ok) throw new Error('PDF generation failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `overklagande_${caseId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Kunde inte hämta PDF. Försök igen.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{wordCount} ord</div>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copied ? '✓ Kopierat' : 'Kopiera text'}
          </button>
          <button
            onClick={downloadPdf}
            disabled={downloading || generating}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {downloading ? 'Hämtar PDF...' : 'Ladda ner PDF'}
          </button>
          <button
            onClick={onRegenerate}
            disabled={generating}
            className="rounded-md bg-green-600 px-4 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {generating ? 'Genererar...' : 'Regenerera'}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <textarea
          value={document}
          onChange={e => onChange(e.target.value)}
          rows={30}
          className="w-full rounded-xl p-6 font-mono text-sm text-gray-900 border-0 focus:ring-0 resize-none leading-relaxed"
          placeholder="Det genererade överklagandet visas här..."
          spellCheck={true}
          lang="sv"
        />
      </div>
    </div>
  )
}
