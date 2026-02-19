import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Sidan hittades inte</p>
        <Link to="/" className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
          Till startsidan
        </Link>
      </div>
    </div>
  )
}
