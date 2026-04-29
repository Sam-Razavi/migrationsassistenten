import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
        <p className="text-lg font-semibold text-gray-900 mb-2">Sidan hittades inte</p>
        <p className="text-sm text-slate-500 mb-6">Sidan du letar efter finns inte eller har flyttats.</p>
        <Link to="/" className="btn-primary px-6">
          Till startsidan
        </Link>
      </div>
    </div>
  )
}
