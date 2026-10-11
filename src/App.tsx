import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { CatalogPage } from './pages/CatalogPage'
import { HomePage } from './pages/HomePage'
import { MotorcycleDetailPage } from './pages/MotorcycleDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

/** Mantém funcionando links antigos (/veiculos/<slug>) da versão anterior. */
function LegacyDetailRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/motos/${slug ?? ''}`} replace />
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="motos" element={<CatalogPage />} />
        <Route path="motos/:slug" element={<MotorcycleDetailPage />} />
        <Route path="veiculos" element={<Navigate to="/motos" replace />} />
        <Route path="veiculos/:slug" element={<LegacyDetailRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
