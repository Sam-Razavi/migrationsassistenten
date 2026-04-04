import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EvidenceChecklist from '../components/EvidenceChecklist'
import TimelineBuilder from '../components/TimelineBuilder'
import CounterArguments, { type CounterArgument } from '../components/CounterArguments'
import DeadlineBadge from '../components/DeadlineBadge'
import { useCase, type EvidenceItem, type TimelineEntry } from '../hooks/useCase'

export default function CaseBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCase, updateCase, loading, error } = useCase()
  const [evidence, setEvidence] = useState<EvidenceItem[]>([])
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [counterArguments, setCounterArguments] = useState<CounterArgument[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [caseData, setCaseData] = useState<{ applicant_name: string; case_number: string; appeal_deadline?: string } | null>(null)

  useEffect(() => {
    if (!id) return
    getCase(Number(id)).then(c => {
      setEvidence(c.evidence ?? [])
      setTimeline(c.timeline ?? [])
      setCounterArguments((c.counter_arguments as CounterArgument[]) ?? [])
      setCaseData({ applicant_name: c.applicant_name, case_number: c.case_number, appeal_deadline: c.appeal_deadline })
    })
  }, [id, getCase])

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    try {
      await updateCase(Number(id), {
        evidence,
        timeline,
        counter_arguments: counterArguments,
      })
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
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <p className="text-gray-600">{caseData.applicant_name} · {caseData.case_number}</p>
              <DeadlineBadge appealDeadline={caseData.appeal_deadline} />
            </div>
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

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Egna argument</h2>
            <p className="text-sm text-gray-500 mb-4">
              Lägg till dina egna argument per kategori — de inkluderas i det genererade överklagandet.
            </p>
            <CounterArguments items={counterArguments} onChange={setCounterArguments} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
