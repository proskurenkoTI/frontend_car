import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ComparePage from './pages/ComparePage'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ComparePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
