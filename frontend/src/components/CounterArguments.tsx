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
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
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
          className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!text.trim()}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lägg till argument
        </button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2 mt-4">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 mb-1">
                  {getCategoryLabel(item.category)}
                </span>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.text}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="ml-3 text-red-400 hover:text-red-600 text-sm shrink-0"
              >
                Ta bort
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-3">Inga argument tillagda ännu</p>
      )}
    </div>
  )
}
