import { Navigate, Outlet } from 'react-router-dom'
import { hasToken } from '../shared/auth/tokenStorage'

export function GuestOnly() {
  if (hasToken()) {
    return <Navigate to="/expenses" replace />
  }
  return <Outlet />
}
