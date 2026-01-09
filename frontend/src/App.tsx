import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewCase from './pages/NewCase'
import CaseBuilder from './pages/CaseBuilder'
import GenerateDocument from './pages/GenerateDocument'
import Preview from './pages/Preview'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewCase />} />
        <Route path="/case/:id" element={<CaseBuilder />} />
        <Route path="/case/:id/preview" element={<Preview />} />
        <Route path="/case/:id/generate" element={<GenerateDocument />} />
      </Routes>
    </BrowserRouter>
  )
}
