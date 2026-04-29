import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CaseForm, { type CaseFormData } from '../components/CaseForm'
import { useCase } from '../hooks/useCase'
import { useLanguage } from '../i18n'

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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link to="/" className="text-sm text-navy-700 hover:underline">
          ← Ärenden
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-gray-900">{t.newCase}</h1>
        <p className="mt-0.5 text-sm text-slate-500">Fyll i uppgifter om klaganden och Migrationsverkets beslut.</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-slate-500">Använd mall:</span>
        <button
          type="button"
          onClick={() => setTemplate(TEMPLATES.family_reunification)}
          className="rounded-md border border-navy-200 px-3 py-1.5 text-sm text-navy-700 bg-navy-50 hover:bg-navy-100"
        >
          Familjeåterförening
        </button>
        <button
          type="button"
          onClick={() => setTemplate(TEMPLATES.asylum)}
          className="rounded-md border border-navy-200 px-3 py-1.5 text-sm text-navy-700 bg-navy-50 hover:bg-navy-100"
        >
          Asyl
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="card p-6">
        <CaseForm
          key={JSON.stringify(template)}
          initialData={template}
          onSubmit={handleSubmit}
          submitLabel={t.saveAndContinue}
        />
      </div>
    </div>
  )
}
