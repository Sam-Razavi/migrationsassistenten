import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
  const [activeTab, setActiveTab] = useState(0)

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
      <div className="flex items-center justify-center py-24">
        <div className="text-slate-400">Laddar...</div>
      </div>
    )
  }

  const tabs = [
    { label: 'Bevisning', count: evidence.filter(e => e.checked).length },
    { label: 'Tidslinje', count: timeline.length },
    { label: 'Argument', count: counterArguments.length },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link to="/" className="text-sm text-navy-700 hover:underline">
          ← Ärenden
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-gray-900">
          {caseData?.applicant_name ?? 'Laddar...'}
        </h1>
        {caseData && (
          <div className="mt-1 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-slate-500">{caseData.case_number}</span>
            <DeadlineBadge appealDeadline={caseData.appeal_deadline} />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex border-b border-slate-200 mb-5">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === i
                ? 'border-navy-700 text-navy-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="card p-5">
        {activeTab === 0 && (
          <EvidenceChecklist items={evidence} onChange={setEvidence} />
        )}
        {activeTab === 1 && (
          <TimelineBuilder entries={timeline} onChange={setTimeline} />
        )}
        {activeTab === 2 && (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Lägg till dina egna argument per kategori — de inkluderas i det genererade överklagandet.
            </p>
            <CounterArguments items={counterArguments} onChange={setCounterArguments} />
          </>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Sparar...' : saved ? '✓ Sparat' : 'Spara'}
        </button>

        <button
          type="button"
          onClick={() => navigate(`/case/${id}/preview`)}
          className="btn-secondary"
        >
          Förhandsgranska →
        </button>
      </div>
    </div>
  )
}
