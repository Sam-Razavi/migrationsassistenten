import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCase, type Case } from '../hooks/useCase'
import { useLanguage } from '../i18n'
import LanguageToggle from '../components/LanguageToggle'

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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.appName}</h1>
            <p className="mt-1 text-gray-600">{t.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              to="/new"
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              + {t.newCase}
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{t.savedCases}</h2>
          </div>

          {loading && (
            <div className="px-6 py-12 text-center text-gray-400">{t.loading}</div>
          )}

          {!loading && cases.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">{t.noCases}</p>
              <Link to="/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                {t.createFirst}
              </Link>
            </div>
          )}

          {!loading && cases.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {cases.map(c => (
                <li key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{c.applicant_name}</p>
                    <p className="text-sm text-gray-500">
                      {c.case_number} · {DECISION_TYPE_LABELS[c.decision_type]?.[lang] ?? c.decision_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link to={`/case/${c.id}`} className="text-sm text-blue-600 hover:underline">
                      {t.evidence}
                    </Link>
                    <Link
                      to={`/case/${c.id}/generate`}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 transition-colors"
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
    </div>
  )
}
