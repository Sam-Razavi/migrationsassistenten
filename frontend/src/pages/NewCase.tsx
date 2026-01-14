import { useNavigate } from 'react-router-dom'
import CaseForm, { CaseFormData } from '../components/CaseForm'
import { useCase } from '../hooks/useCase'

export default function NewCase() {
  const navigate = useNavigate()
  const { createCase, error } = useCase()

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
        <div className="mb-8">
          <a href="/" className="text-sm text-blue-600 hover:underline">← Tillbaka</a>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Nytt ärende</h1>
          <p className="mt-1 text-gray-600">Fyll i uppgifter om klaganden och Migrationsverkets beslut.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700 text-sm">{error}</div>
        )}

        <div className="rounded-xl bg-white p-8 shadow-sm">
          <CaseForm onSubmit={handleSubmit} submitLabel="Spara och fortsätt" />
        </div>
      </div>
    </div>
  )
}
