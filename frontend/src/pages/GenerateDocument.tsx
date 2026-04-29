import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCase } from '../hooks/useCase'
import { useGenerate } from '../hooks/useGenerate'
import { useVersions } from '../hooks/useVersions'
import DocumentPreview from '../components/DocumentPreview'
import RevisionPanel from '../components/RevisionPanel'
import VersionHistory from '../components/VersionHistory'

export default function GenerateDocument() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCase } = useCase()
  const { generate, revise, document, setDocument, generating, revising, error } = useGenerate()
  const { restoreVersion } = useVersions()
  const [caseData, setCaseData] = useState<{ applicant_name: string; case_number: string } | null>(null)
  const [versionRefresh, setVersionRefresh] = useState(0)

  useEffect(() => {
    if (!id) return
    getCase(Number(id)).then(c => {
      setCaseData({ applicant_name: c.applicant_name, case_number: c.case_number })
      if (c.generated_document) setDocument(c.generated_document)
    })
  }, [id, getCase])

  const handleGenerate = async () => {
    if (!id) return
    await generate(Number(id))
    setVersionRefresh(r => r + 1)
  }

  const handleRevise = async (section: string, instruction: string) => {
    if (!id) return
    await revise(Number(id), section, instruction, document)
    setVersionRefresh(r => r + 1)
  }

  const handleRestoreVersion = async (versionId: number) => {
    if (!id) return
    await restoreVersion(Number(id), versionId)
    const c = await getCase(Number(id))
    setDocument(c.generated_document ?? '')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-sm text-navy-700 hover:underline">
          ← Tillbaka
        </button>
        <h1 className="mt-2 text-xl font-semibold text-gray-900">Generera överklagande</h1>
        {caseData && (
          <p className="mt-0.5 text-sm text-slate-500">{caseData.applicant_name} · {caseData.case_number}</p>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!document && !generating && (
        <div className="card p-10 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400" aria-hidden="true">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Inget överklagande genererat ännu</h3>
          <p className="text-sm text-slate-500 mb-6">
            Klicka på knappen nedan för att generera ett formellt överklagande baserat på ärendets uppgifter.
          </p>
          <button
            onClick={handleGenerate}
            className="btn-success px-8 py-2.5 text-base"
          >
            Generera överklagande
          </button>
        </div>
      )}

      {generating && !document && (
        <div className="card p-10 text-center">
          <div className="animate-pulse text-slate-400">Genererar överklagande...</div>
        </div>
      )}

      {document && (
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <DocumentPreview
              document={document}
              caseId={Number(id)}
              onChange={setDocument}
              generating={generating}
              onRegenerate={handleGenerate}
            />
          </div>
          <div className="mt-6 lg:mt-0 space-y-4">
            <RevisionPanel onRevise={handleRevise} loading={revising} />
            <VersionHistory
              caseId={Number(id)}
              refreshTrigger={versionRefresh}
              onRestore={handleRestoreVersion}
            />
          </div>
        </div>
      )}
    </div>
  )
}
