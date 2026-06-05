import { Navigate, Outlet } from 'react-router-dom'
import { hasToken } from '../shared/auth/tokenStorage'

export function RequireAuth() {
  if (!hasToken()) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
