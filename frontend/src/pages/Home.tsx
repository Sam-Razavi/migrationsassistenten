import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCase, type Case } from '../hooks/useCase'
import { useLanguage } from '../i18n'
import DeadlineBadge from '../components/DeadlineBadge'

const DECISION_TYPE_LABELS: Record<string, Record<string, string>> = {
  family_reunification: { sv: 'Familjeåterförening', en: 'Family reunification' },
  asylum: { sv: 'Asyl', en: 'Asylum' },
  permanent_residence: { sv: 'Permanent uppehållstillstånd', en: 'Permanent residence' },
  work_permit: { sv: 'Arbetstillstånd', en: 'Work permit' },
}

export default function Home() {
  const { getCases, loading } = useCase()
  const { t, lang } = useLanguage()
  const [cases, setCases] = useState<Case[]>([])

  useEffect(() => {
    getCases().then(setCases)
  }, [getCases])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t.savedCases}</h1>
          <p className="mt-0.5 text-sm text-slate-500">{t.tagline}</p>
        </div>
        <Link to="/new" className="btn-primary px-5 py-2">
          + {t.newCase}
        </Link>
      </div>

      <div className="card overflow-hidden">
        {loading && (
          <div className="px-6 py-12 text-center text-slate-400">{t.loading}</div>
        )}

        {!loading && cases.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-400">{t.noCases}</p>
            <Link to="/new" className="mt-2 inline-block text-sm text-navy-700 hover:underline">
              {t.createFirst}
            </Link>
          </div>
        )}

        {!loading && cases.length > 0 && (
          <ul>
            {cases.map(c => (
              <li
                key={c.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">{c.applicant_name}</p>
                    <DeadlineBadge appealDeadline={c.appeal_deadline} />
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {c.case_number} · {DECISION_TYPE_LABELS[c.decision_type]?.[lang] ?? c.decision_type}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <Link to={`/case/${c.id}`} className="text-sm text-navy-700 hover:underline">
                    Redigera
                  </Link>
                  <Link
                    to={`/case/${c.id}/generate`}
                    className="btn-success px-3 py-1.5 text-xs"
                  >
                    {t.generate}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
