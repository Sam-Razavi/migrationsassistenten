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
      const a = globalThis.document.createElement('a')
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
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs text-slate-500">{wordCount} ord</span>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="btn-secondary text-xs py-1.5"
          >
            {copied ? '✓ Kopierat' : 'Kopiera text'}
          </button>
          <button
            onClick={downloadPdf}
            disabled={downloading || generating}
            className="btn-secondary text-xs py-1.5"
          >
            {downloading ? 'Hämtar PDF...' : 'Ladda ner PDF'}
          </button>
          <button
            onClick={onRegenerate}
            disabled={generating}
            className="btn-success text-xs py-1.5"
          >
            {generating ? 'Genererar...' : 'Regenerera'}
          </button>
        </div>
      </div>

      <textarea
        value={document}
        onChange={e => onChange(e.target.value)}
        className="w-full p-6 font-mono text-[13px] leading-relaxed text-gray-800 border-0 focus:ring-0 resize-none min-h-[500px]"
        placeholder="Det genererade överklagandet visas här..."
        spellCheck={true}
        lang="sv"
      />
    </div>
  )
}
