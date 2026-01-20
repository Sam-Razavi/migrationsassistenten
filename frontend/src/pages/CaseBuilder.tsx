import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EvidenceChecklist from '../components/EvidenceChecklist'
import TimelineBuilder from '../components/TimelineBuilder'
import { useCase, type EvidenceItem, type TimelineEntry } from '../hooks/useCase'

export default function CaseBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCase, updateCase, loading, error } = useCase()
  const [evidence, setEvidence] = useState<EvidenceItem[]>([])
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [caseData, setCaseData] = useState<{ applicant_name: string; case_number: string } | null>(null)

  useEffect(() => {
    if (!id) return
    getCase(Number(id)).then(c => {
      setEvidence(c.evidence ?? [])
      setTimeline(c.timeline ?? [])
      setCaseData({ applicant_name: c.applicant_name, case_number: c.case_number })
    })
  }, [id, getCase])

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    try {
      await updateCase(Number(id), { evidence, timeline })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading && !caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Laddar...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <a href="/" className="text-sm text-blue-600 hover:underline">← Tillbaka</a>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Bygg ärende</h1>
          {caseData && (
            <p className="mt-1 text-gray-600">
              {caseData.applicant_name} · {caseData.case_number}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700 text-sm">{error}</div>
        )}

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bevisning</h2>
            <EvidenceChecklist items={evidence} onChange={setEvidence} />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tidslinje</h2>
            <TimelineBuilder entries={timeline} onChange={setTimeline} />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Sparar...' : saved ? '✓ Sparat' : 'Spara'}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/case/${id}/preview`)}
              className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Förhandsgranska →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
