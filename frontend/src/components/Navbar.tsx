import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LanguageToggle from './LanguageToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-navy-900 hover:opacity-80 transition-opacity">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-navy-700"
              aria-hidden="true"
            >
              <path d="M12 22V4M5 8h14M5 8l-2 6a3 3 0 006 0L5 8zm14 0l-2 6a3 3 0 006 0L19 8z" />
              <path d="M9 22h6" />
            </svg>
            <span className="font-semibold text-sm text-navy-900">Migrationsassistenten</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            {user && (
              <>
                <span className="hidden sm:block text-xs text-slate-500">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Logga ut
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
