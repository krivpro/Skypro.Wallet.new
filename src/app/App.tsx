import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../layout/AppShell'
import { AnalysisPage } from '../pages/AnalysisPage'
import { ExpensesPage } from '../pages/ExpensesPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { GuestOnly } from './GuestOnly'
import { RequireAuth } from './RequireAuth'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<GuestOnly />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
