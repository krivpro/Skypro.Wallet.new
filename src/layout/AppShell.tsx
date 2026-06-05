import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'

const authPaths = new Set(['/', '/register'])

export function AppShell() {
  const { pathname } = useLocation()
  const variant = authPaths.has(pathname) ? 'auth' : 'app'

  return (
    <>
      <Header variant={variant} />
      <main className="main container">
        <Outlet />
      </main>
    </>
  )
}
