import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCase, type Case } from '../hooks/useCase'

const DECISION_TYPE_LABELS: Record<string, string> = {
  family_reunification: 'Familjeåterförening',
  asylum: 'Asyl',
  permanent_residence: 'Permanent uppehållstillstånd',
  work_permit: 'Arbetstillstånd',
}

export default function Home() {
  const { getCases, loading } = useCase()
  const [cases, setCases] = useState<Case[]>([])

  useEffect(() => {
    getCases().then(setCases)
  }, [getCases])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Migrationsassistenten</h1>
            <p className="mt-1 text-gray-600">Hjälp med överklaganden till migrationsdomstolen</p>
          </div>
          <Link
            to="/new"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            + Nytt ärende
          </Link>
        </div>

        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Sparade ärenden</h2>
          </div>

          {loading && (
            <div className="px-6 py-12 text-center text-gray-400">Laddar ärenden...</div>
          )}

          {!loading && cases.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">Inga ärenden ännu.</p>
              <Link to="/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                Skapa ditt första ärende →
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
                      {c.case_number} · {DECISION_TYPE_LABELS[c.decision_type] ?? c.decision_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/case/${c.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Bevisning
                    </Link>
                    <Link
                      to={`/case/${c.id}/generate`}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 transition-colors"
                    >
                      Generera
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
