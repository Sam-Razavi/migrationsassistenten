import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageContext, useI18nState } from './i18n'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import NewCase from './pages/NewCase'
import CaseBuilder from './pages/CaseBuilder'
import GenerateDocument from './pages/GenerateDocument'
import Preview from './pages/Preview'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFound from './pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/new" element={<ProtectedRoute><NewCase /></ProtectedRoute>} />
      <Route path="/case/:id" element={<ProtectedRoute><CaseBuilder /></ProtectedRoute>} />
      <Route path="/case/:id/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
      <Route path="/case/:id/generate" element={<ProtectedRoute><GenerateDocument /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  const i18n = useI18nState()

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageContext.Provider value={i18n}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LanguageContext.Provider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
