import { useEffect, useState } from 'react'
import { useVersions, type DocumentVersion } from '../hooks/useVersions'

interface Props {
  caseId: number
  onRestore: (versionId: number) => Promise<void>
  refreshTrigger?: number
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('sv-SE', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function VersionHistory({ caseId, onRestore, refreshTrigger }: Props) {
  const { fetchVersions, loading, error } = useVersions()
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [restoring, setRestoring] = useState<number | null>(null)

  useEffect(() => {
    fetchVersions(caseId).then(setVersions).catch(() => {})
  }, [caseId, fetchVersions, refreshTrigger])

  const handleRestore = async (id: number) => {
    setRestoring(id)
    try {
      await onRestore(id)
      const updated = await fetchVersions(caseId)
      setVersions(updated)
    } finally {
      setRestoring(null)
    }
  }

  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Versionshistorik</h2>
      <p className="text-sm text-slate-500 mb-4">
        Varje generering och revidering sparas automatiskt. Klicka Återställ för att gå tillbaka till en tidigare version.
      </p>

      {loading && <p className="text-sm text-slate-400">Laddar versioner...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && versions.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-3">Inga versioner sparade ännu</p>
      )}

      {versions.length > 0 && (
        <ul className="space-y-2">
          {versions.map((v, idx) => (
            <li
              key={v.id}
              className="flex justify-between px-4 py-3 rounded-md border border-slate-200 text-sm"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {v.label ?? 'Version'}
                  {idx === 0 && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 font-medium">aktuell</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(v.created_at)}</p>
              </div>
              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleRestore(v.id)}
                  disabled={restoring === v.id}
                  className="text-navy-700 text-sm hover:underline disabled:opacity-40"
                >
                  {restoring === v.id ? 'Återställer...' : 'Återställ'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
