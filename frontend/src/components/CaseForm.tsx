import { useState } from 'react'

export interface CaseFormData {
  case_number: string
  applicant_name: string
  dob: string
  nationality: string
  rejection_date: string
  mv_reference: string
  decision_type: string
  rejection_reason: string
}

interface Props {
  initialData?: Partial<CaseFormData>
  onSubmit: (data: CaseFormData) => Promise<void>
  submitLabel?: string
}

const emptyForm: CaseFormData = {
  case_number: '',
  applicant_name: '',
  dob: '',
  nationality: '',
  rejection_date: '',
  mv_reference: '',
  decision_type: '',
  rejection_reason: '',
}

export default function CaseForm({ initialData, onSubmit, submitLabel = 'Spara' }: Props) {
  const [form, setForm] = useState<CaseFormData>({ ...emptyForm, ...initialData })
  const [errors, setErrors] = useState<Partial<CaseFormData>>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const errs: Partial<CaseFormData> = {}
    if (!form.case_number.trim()) errs.case_number = 'Ange målnummer'
    if (!form.applicant_name.trim()) errs.applicant_name = 'Ange klagandens fullständiga namn'
    if (!form.dob.trim()) errs.dob = 'Ange ett giltigt födelsedatum'
    if (!form.nationality.trim()) errs.nationality = 'Ange nationalitet'
    if (!form.rejection_date.trim()) errs.rejection_date = 'Ange datum för Migrationsverkets beslut'
    if (!form.decision_type) errs.decision_type = 'Välj ärendetyp för att fortsätta'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  const set = (field: keyof CaseFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-5">
        <div>
          <label className="form-label">Målnummer *</label>
          <input
            type="text"
            value={form.case_number}
            onChange={set('case_number')}
            className="form-input mt-1"
            placeholder="t.ex. UM 1234-25"
          />
          {errors.case_number && <p className="mt-1 text-xs text-red-600">{errors.case_number}</p>}
        </div>

        <div>
          <label className="form-label">Klagandens fullständiga namn *</label>
          <input
            type="text"
            value={form.applicant_name}
            onChange={set('applicant_name')}
            className="form-input mt-1"
          />
          {errors.applicant_name && <p className="mt-1 text-xs text-red-600">{errors.applicant_name}</p>}
        </div>

        <div>
          <label className="form-label">Födelsedatum *</label>
          <input
            type="date"
            value={form.dob}
            onChange={set('dob')}
            className="form-input mt-1"
          />
          {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
        </div>

        <div>
          <label className="form-label">Nationalitet *</label>
          <input
            type="text"
            value={form.nationality}
            onChange={set('nationality')}
            className="form-input mt-1"
          />
          {errors.nationality && <p className="mt-1 text-xs text-red-600">{errors.nationality}</p>}
        </div>

        <div>
          <label className="form-label">Avslagsdatum *</label>
          <input
            type="date"
            value={form.rejection_date}
            onChange={set('rejection_date')}
            className="form-input mt-1"
          />
          {errors.rejection_date && <p className="mt-1 text-xs text-red-600">{errors.rejection_date}</p>}
        </div>

        <div>
          <label className="form-label">Migrationsverkets referensnummer</label>
          <input
            type="text"
            value={form.mv_reference}
            onChange={set('mv_reference')}
            className="form-input mt-1"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Ärendetyp *</label>
        <select
          value={form.decision_type}
          onChange={set('decision_type')}
          className="form-input mt-1"
        >
          <option value="">Välj ärendetyp...</option>
          <option value="family_reunification">Familjeåterförening</option>
          <option value="asylum">Asyl</option>
          <option value="permanent_residence">Permanent uppehållstillstånd</option>
          <option value="work_permit">Arbetstillstånd</option>
        </select>
        {errors.decision_type && <p className="mt-1 text-xs text-red-600">{errors.decision_type}</p>}
      </div>

      <div>
        <label className="form-label">Migrationsverkets avslagsskäl</label>
        <textarea
          value={form.rejection_reason}
          onChange={set('rejection_reason')}
          rows={4}
          className="form-input mt-1"
          placeholder="Beskriv varför Migrationsverket avslog ansökan..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
        >
          {submitting ? 'Sparar...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
