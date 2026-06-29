import { Link, NavLink } from 'react-router-dom'
import { useLogout } from '../shared/auth/useLogout'

type HeaderProps = {
  variant: 'auth' | 'app'
}

function navLinkClass(isActive: boolean): string {
  return `header__link${isActive ? ' header__link_active' : ''}`
}

export function Header({ variant }: HeaderProps) {
  const logout = useLogout()

  const logoTo = variant === 'app' ? '/expenses' : '/'

  return (
    <header className="header container">
      <Link to={logoTo} className="header__logo-link">
        <img src="/img/logo.svg" alt="логотип" className="header__logo-img" />
      </Link>
      {variant === 'app' && (
        <>
          <nav className="header__nav">
            <NavLink to="/expenses" className={({ isActive }) => navLinkClass(isActive)}>
              Мои расходы
            </NavLink>
            <NavLink to="/analysis" className={({ isActive }) => navLinkClass(isActive)}>
              Анализ расходов
            </NavLink>
          </nav>
          <button type="button" className="header__btn" onClick={logout}>
            Выйти
          </button>
        </>
      )}
    </header>
  )
}
