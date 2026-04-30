import { useState } from 'react'

export interface CounterArgument {
  id: string
  category: string
  text: string
}

export const CATEGORIES: { value: string; label: string; labelEn: string }[] = [
  { value: 'ekonomisk_etablering', label: 'Ekonomisk etablering', labelEn: 'Economic establishment' },
  { value: 'familjeband', label: 'Familjeband', labelEn: 'Family ties' },
  { value: 'humanitart_skal', label: 'Humanitärt skäl', labelEn: 'Humanitarian grounds' },
  { value: 'procedurfel', label: 'Procedurfel', labelEn: 'Procedural error' },
  { value: 'proportionalitet', label: 'Proportionalitet', labelEn: 'Proportionality' },
]

interface Props {
  items: CounterArgument[]
  onChange: (items: CounterArgument[]) => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function CounterArguments({ items, onChange }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].value)
  const [text, setText] = useState('')

  const add = () => {
    if (!text.trim()) return
    onChange([...items, { id: generateId(), category: selectedCategory, text: text.trim() }])
    setText('')
  }

  const remove = (id: string) => {
    onChange(items.filter(i => i.id !== id))
  }

  const getCategoryLabel = (value: string) =>
    CATEGORIES.find(c => c.value === value)?.label ?? value

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              selectedCategory === cat.value
                ? 'bg-navy-800 text-white border-navy-800'
                : 'bg-white text-slate-600 border-slate-300 hover:border-navy-400 hover:text-navy-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          placeholder={`Beskriv ditt argument under "${getCategoryLabel(selectedCategory)}"...`}
          className="form-input resize-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!text.trim()}
          className="btn-primary text-xs px-3 py-1.5"
        >
          Lägg till argument
        </button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2 mt-4">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5"
            >
              <div className="flex-1 min-w-0">
                <span className="inline-block rounded bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700 mb-1">
                  {getCategoryLabel(item.category)}
                </span>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.text}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="ml-3 text-xs text-red-500 hover:text-red-700 transition-colors shrink-0"
              >
                Ta bort
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-3">Inga argument tillagda ännu</p>
      )}
    </div>
  )
}
