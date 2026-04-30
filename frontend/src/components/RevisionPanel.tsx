import { useState } from 'react'

const SECTIONS = [
  { value: 'yrkande', label: 'Yrkande' },
  { value: 'sakframstallning', label: 'Sakframställning' },
  { value: 'grunder', label: 'Grunder för överklagandet' },
  { value: 'bevisning', label: 'Bevisning' },
  { value: 'hela', label: 'Hela dokumentet' },
]

interface Props {
  onRevise: (section: string, instruction: string) => Promise<void>
  loading: boolean
}

export default function RevisionPanel({ onRevise, loading }: Props) {
  const [section, setSection] = useState(SECTIONS[0].value)
  const [instruction, setInstruction] = useState('')

  const handleSubmit = async () => {
    if (!instruction.trim()) return
    await onRevise(section, instruction.trim())
    setInstruction('')
    setSection(SECTIONS[0].value)
  }

  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Revidera avsnitt</h2>
      <p className="text-sm text-slate-500 mb-4">
        Välj vilket avsnitt du vill revidera och beskriv ändringen.
      </p>

      <div className="space-y-3">
        <div>
          <label className="form-label">Avsnitt</label>
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            className="form-input"
          >
            {SECTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Instruktion</label>
          <textarea
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            rows={3}
            placeholder="Beskriv hur avsnittet ska ändras..."
            className="form-input resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!instruction.trim() || loading}
          className="btn-primary"
        >
          {loading ? 'Reviderar...' : 'Revidera'}
        </button>
      </div>
    </div>
  )
}
