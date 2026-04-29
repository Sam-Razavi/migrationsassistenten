import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCase, type Case } from '../hooks/useCase'
import { useLanguage } from '../i18n'
import LanguageToggle from '../components/LanguageToggle'
import DeadlineBadge from '../components/DeadlineBadge'

const DECISION_LABELS: Record<string, string> = {
  family_reunification: 'Familjeåterförening',
  asylum: 'Asyl',
  permanent_residence: 'Permanent uppehållstillstånd',
  work_permit: 'Arbetstillstånd',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card mb-4 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="px-5 py-4">
        {children}
      </div>
    </div>
  )
}

export default function Preview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCase, loading } = useCase()
  const { t } = useLanguage()
  const [caseData, setCaseData] = useState<Case | null>(null)

  useEffect(() => {
    if (!id) return
    getCase(Number(id)).then(setCaseData)
  }, [id, getCase])

  if (loading || !caseData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-slate-400">{t.loading}</div>
      </div>
    )
  }

  const checkedEvidence = (caseData.evidence ?? []).filter(e => e.checked)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-navy-700 hover:underline">
            {t.back}
          </button>
          <h1 className="mt-2 text-xl font-semibold text-gray-900">{t.preview}</h1>
          <div className="mt-1 flex items-center gap-3 flex-wrap">
            <p className="text-sm text-slate-500">Granska ärendets uppgifter innan du genererar överklagandet.</p>
            <DeadlineBadge appealDeadline={caseData.appeal_deadline} />
          </div>
        </div>
        <LanguageToggle />
      </div>

      <div>
        <Section title="Klagande">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-xs uppercase tracking-wide text-slate-400">Namn</dt>
            <dd className="text-sm text-gray-900 font-medium">{caseData.applicant_name}</dd>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Födelsedatum</dt>
            <dd className="text-sm text-gray-900 font-medium">{caseData.dob}</dd>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Nationalitet</dt>
            <dd className="text-sm text-gray-900 font-medium">{caseData.nationality}</dd>
          </dl>
        </Section>

        <Section title="Migrationsverkets beslut">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-xs uppercase tracking-wide text-slate-400">Målnummer</dt>
            <dd className="text-sm text-gray-900 font-medium">{caseData.case_number}</dd>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Ärendetyp</dt>
            <dd className="text-sm text-gray-900 font-medium">{DECISION_LABELS[caseData.decision_type] ?? caseData.decision_type}</dd>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Avslagsdatum</dt>
            <dd className="text-sm text-gray-900 font-medium">{caseData.rejection_date}</dd>
            {caseData.rejection_reason && (
              <>
                <dt className="text-xs uppercase tracking-wide text-slate-400 col-span-2 mt-2">Avslagsskäl</dt>
                <dd className="text-sm text-gray-900 col-span-2">{caseData.rejection_reason}</dd>
              </>
            )}
          </dl>
        </Section>

        {checkedEvidence.length > 0 && (
          <Section title={`Bevisning (${checkedEvidence.length} handlingar)`}>
            <ul className="space-y-1">
              {checkedEvidence.map(e => (
                <li key={e.id} className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5 text-sm">✓</span>
                  <span className="text-sm text-gray-800">{e.label}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(caseData.timeline ?? []).length > 0 && (
          <Section title="Tidslinje">
            <ul className="space-y-2">
              {[...(caseData.timeline ?? [])].sort((a, b) => a.date.localeCompare(b.date)).map(e => (
                <li key={e.id} className="flex items-start gap-3">
                  <span className="rounded bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700 whitespace-nowrap">{e.date}</span>
                  <span className="text-sm text-gray-800">{e.description}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(caseData.counter_arguments ?? []).length > 0 && (
          <Section title="Klagandens argument">
            {(() => {
              const CATEGORY_LABELS: Record<string, string> = {
                ekonomisk_etablering: 'Ekonomisk etablering',
                familjeband: 'Familjeband',
                humanitart_skal: 'Humanitärt skäl',
                procedurfel: 'Procedurfel',
                proportionalitet: 'Proportionalitet',
              }
              const grouped: Record<string, string[]> = {}
              for (const arg of caseData.counter_arguments ?? []) {
                const label = CATEGORY_LABELS[arg.category] ?? arg.category
                if (!grouped[label]) grouped[label] = []
                grouped[label].push(arg.text)
              }
              return (
                <div className="space-y-3">
                  {Object.entries(grouped).map(([cat, texts]) => (
                    <div key={cat}>
                      <span className="inline-block rounded bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700 mb-1">{cat}</span>
                      <ul className="space-y-1">
                        {texts.map((text, i) => (
                          <li key={i} className="text-sm text-gray-800 pl-3 border-l-2 border-navy-200">{text}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )
            })()}
          </Section>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate(`/case/${id}/generate`)}
          className="btn-success px-8 py-2.5"
        >
          {t.generate} →
        </button>
      </div>
    </div>
  )
}
