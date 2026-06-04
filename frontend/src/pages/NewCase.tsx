import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CaseForm, { type CaseFormData } from '../components/CaseForm'
import { useCase } from '../hooks/useCase'
import { useLanguage } from '../i18n'
import LanguageToggle from '../components/LanguageToggle'

const TEMPLATES: Record<string, Partial<CaseFormData>> = {
  family_reunification: {
    decision_type: 'family_reunification',
    rejection_reason:
      'Migrationsverket bedömde att det inte var styrkt att ett verkligt familjeliv föreligger enligt 5 kap. 3 c § UtlL.',
  },
  asylum: {
    decision_type: 'asylum',
    rejection_reason:
      'Migrationsverket bedömde att klaganden inte gjort sin flyktinggrundade fruktan sannolik enligt 4 kap. 1 § UtlL.',
  },
}

export default function NewCase() {
  const navigate = useNavigate()
  const { createCase, error } = useCase()
  const { t } = useLanguage()
  const [template, setTemplate] = useState<Partial<CaseFormData>>({})

  const handleSubmit = async (data: CaseFormData) => {
    const created = await createCase({
      ...data,
      mv_reference: data.mv_reference || undefined,
      rejection_reason: data.rejection_reason || undefined,
    })
    navigate(`/case/${created.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <a href="/" className="text-sm text-blue-600 hover:underline">{t.back}</a>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{t.newCase}</h1>
            <p className="mt-1 text-gray-600">Fyll i uppgifter om klaganden och Migrationsverkets beslut.</p>
          </div>
          <LanguageToggle />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Använd mall:</span>
          <button
            type="button"
            onClick={() => setTemplate(TEMPLATES.family_reunification)}
            className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
          >
            Familjeåterförening
          </button>
          <button
            type="button"
            onClick={() => setTemplate(TEMPLATES.asylum)}
            className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
          >
            Asyl
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700 text-sm">{error}</div>
        )}

        <div className="rounded-xl bg-white p-8 shadow-sm">
          <CaseForm
            key={JSON.stringify(template)}
            initialData={template}
            onSubmit={handleSubmit}
            submitLabel={t.saveAndContinue}
          />
        </div>
      </div>
    </div>
  )
}
