import { useState } from 'react'
import type { TimelineEntry } from '../hooks/useCase'

interface Props {
  entries: TimelineEntry[]
  onChange: (entries: TimelineEntry[]) => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function TimelineBuilder({ entries, onChange }: Props) {
  const [newDate, setNewDate] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))

  const add = () => {
    if (!newDate || !newDesc.trim()) return
    onChange([...entries, { id: generateId(), date: newDate, description: newDesc.trim() }])
    setNewDate('')
    setNewDesc('')
  }

  const remove = (id: string) => {
    onChange(entries.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-4">
      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map(entry => (
            <div key={entry.id} className="flex items-start justify-between rounded-md border border-slate-200 bg-white px-4 py-2.5">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 rounded bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700 whitespace-nowrap">
                  {entry.date}
                </span>
                <p className="text-sm text-gray-800">{entry.description}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                className="ml-4 text-xs text-red-500 hover:text-red-700 transition-colors shrink-0"
              >
                Ta bort
              </button>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">Inga tidpunkter tillagda ännu</p>
      )}

      <div className="rounded-md border border-dashed border-slate-300 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Lägg till tidpunkt</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="t.ex. Ansökan om familjeåterförening inlämnad"
              className="form-input"
              onKeyDown={e => e.key === 'Enter' && add()}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!newDate || !newDesc.trim()}
          className="mt-2 btn-secondary text-xs px-3 py-1.5"
        >
          Lägg till
        </button>
      </div>
    </div>
  )
}
