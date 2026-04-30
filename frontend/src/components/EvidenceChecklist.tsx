import { useState } from 'react'
import type { EvidenceItem } from '../hooks/useCase'

const PRESET_ITEMS: Omit<EvidenceItem, 'id' | 'checked'>[] = [
  { label: 'Vigselbevis / äktenskapsintyg', description: '', is_preset: true },
  { label: 'Födelsebevis för barn', description: '', is_preset: true },
  { label: 'Sambobevis / hyreskontrakt', description: '', is_preset: true },
  { label: 'Ekonomiska handlingar (lönespecifikationer, skattebesked)', description: '', is_preset: true },
  { label: 'Foton (familjebilder, gemensamt boende)', description: '', is_preset: true },
  { label: 'Korrespondens (e-post, meddelanden)', description: '', is_preset: true },
  { label: 'Pass och identitetshandlingar', description: '', is_preset: true },
  { label: 'Arbetsgivarintyg', description: '', is_preset: true },
]

interface Props {
  items: EvidenceItem[]
  onChange: (items: EvidenceItem[]) => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function EvidenceChecklist({ items, onChange }: Props) {
  const [newLabel, setNewLabel] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const togglePreset = (preset: Omit<EvidenceItem, 'id' | 'checked'>) => {
    const existing = items.find(i => i.is_preset && i.label === preset.label)
    if (existing) {
      onChange(items.map(i => i.label === preset.label && i.is_preset ? { ...i, checked: !i.checked } : i))
    } else {
      onChange([...items, { ...preset, id: generateId(), checked: true }])
    }
  }

  const isChecked = (label: string) => items.some(i => i.is_preset && i.label === label && i.checked)

  const addCustom = () => {
    if (!newLabel.trim()) return
    onChange([...items, { id: generateId(), label: newLabel.trim(), description: newDesc.trim(), is_preset: false, checked: true }])
    setNewLabel('')
    setNewDesc('')
  }

  const removeItem = (id: string) => {
    onChange(items.filter(i => i.id !== id))
  }

  const customItems = items.filter(i => !i.is_preset)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Vanliga bevishandlingar</h3>
        <div className="space-y-2">
          {PRESET_ITEMS.map(preset => (
            <label
              key={preset.label}
              className="flex items-center gap-3 rounded-md border border-slate-200 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={isChecked(preset.label)}
                onChange={() => togglePreset(preset)}
                className="h-4 w-4 rounded border-slate-300 text-navy-700 focus:ring-navy-600"
              />
              <span className="text-sm text-gray-800">{preset.label}</span>
            </label>
          ))}
        </div>
      </div>

      {customItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Egna bevishandlingar</h3>
          <div className="space-y-2">
            {customItems.map(item => (
              <div key={item.id} className="flex items-start justify-between rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors ml-4"
                >
                  Ta bort
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-md border border-dashed border-slate-300 p-4 mt-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Lägg till egen bevishandling</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="Namn på handlingen"
            className="form-input"
          />
          <input
            type="text"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Kort beskrivning (valfritt)"
            className="form-input"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!newLabel.trim()}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            Lägg till
          </button>
        </div>
      </div>
    </div>
  )
}
