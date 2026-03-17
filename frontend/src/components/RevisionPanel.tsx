import { useState } from 'react'

const SECTIONS = [
  { value: 'yrkande', label: 'Yrkande' },
  { value: 'sakframstallning', label: 'Sakframställning' },
  { value: 'grunder', label: 'Grunder för överklagandet' },
  { value: 'bevisning', label: 'Bevisning' },
  { value: 'hela', label: 'Hela dokumentet' },
]

interface Props {
  onRevise: (section: string, instruction: string) => void
  loading: boolean
}

export default function RevisionPanel({ onRevise, loading }: Props) {
  const [section, setSection] = useState(SECTIONS[0].value)
  const [instruction, setInstruction] = useState('')

  const handleSubmit = () => {
    if (!instruction.trim()) return
    onRevise(section, instruction.trim())
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Revidera avsnitt</h2>
      <p className="text-sm text-gray-500 mb-4">
        Välj vilket avsnitt du vill revidera och beskriv ändringen.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avsnitt</label>
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {SECTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instruktion</label>
          <textarea
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            rows={3}
            placeholder="Beskriv hur avsnittet ska ändras..."
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!instruction.trim() || loading}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Reviderar...' : 'Revidera'}
        </button>
      </div>
    </div>
  )
}
