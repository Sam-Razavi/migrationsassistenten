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
              onClick={handleGenerate}
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
          <>
            <DocumentPreview
              document={document}
              caseId={Number(id)}
              onChange={setDocument}
              generating={generating}
              onRegenerate={handleGenerate}
            />
            <div className="mt-6">
              <RevisionPanel onRevise={handleRevise} loading={revising} />
            </div>
            <div className="mt-6">
              <VersionHistory
                caseId={Number(id)}
                refreshTrigger={versionRefresh}
                onRestore={handleRestoreVersion}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
