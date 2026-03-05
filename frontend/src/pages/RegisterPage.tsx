import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n'
import client from '../api/client'

export default function RegisterPage() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Lösenorden stämmer inte överens.')
      return
    }
    if (password.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await client.post('/auth/register', { email, password })
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)
      const { data } = await client.post<{ access_token: string }>('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      const me = await client.get<{ id: number; email: string }>('/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      })
      login(data.access_token, { id: me.data.id, email: me.data.email })
      navigate('/')
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(detail ?? 'Registrering misslyckades. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">{t.appName}</h1>

        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skapa konto</h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">E-postadress</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lösenord</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bekräfta lösenord</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Registrerar...' : 'Skapa konto'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Har du redan ett konto?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Logga in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
