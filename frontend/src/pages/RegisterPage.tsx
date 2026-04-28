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
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-2/5 bg-navy-900 flex-col items-center justify-center px-10 relative">
        <div className="flex flex-col items-center text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-6 opacity-90"
            aria-hidden="true"
          >
            <path d="M12 22V4M5 8h14M5 8l-2 6a3 3 0 006 0L5 8zm14 0l-2 6a3 3 0 006 0L19 8z" />
            <path d="M9 22h6" />
          </svg>
          <h1 className="text-2xl font-semibold text-white mb-3">{t.appName}</h1>
          <p className="text-navy-200 text-sm leading-relaxed max-w-xs">
            Juridisk hjälp för överklaganden till migrationsdomstolen
          </p>
        </div>
        <div className="absolute bottom-10 left-10 right-10">
          <div className="border-l-2 border-navy-600 pl-3">
            <p className="text-navy-200 text-sm leading-relaxed">
              Verktyget hjälper dig att förbereda ett formellt överklagande enligt svensk migrationsrätt.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 md:w-3/5 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Skapa konto</h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">E-postadress</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="din@email.se"
              />
            </div>
            <div>
              <label className="form-label">Lösenord</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="form-input"
                placeholder="Minst 8 tecken"
              />
            </div>
            <div>
              <label className="form-label">Bekräfta lösenord</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? 'Registrerar...' : 'Skapa konto'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Har du redan ett konto?{' '}
            <Link to="/login" className="text-navy-700 hover:underline font-medium">
              Logga in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
