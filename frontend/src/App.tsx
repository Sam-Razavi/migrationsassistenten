import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageContext, useI18nState } from './i18n'
import Home from './pages/Home'
import NewCase from './pages/NewCase'
import CaseBuilder from './pages/CaseBuilder'
import GenerateDocument from './pages/GenerateDocument'
import Preview from './pages/Preview'
import NotFound from './pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new" element={<NewCase />} />
      <Route path="/case/:id" element={<CaseBuilder />} />
      <Route path="/case/:id/preview" element={<Preview />} />
      <Route path="/case/:id/generate" element={<GenerateDocument />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  const i18n = useI18nState()

  return (
    <LanguageContext.Provider value={i18n}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageContext.Provider>
  )
}
