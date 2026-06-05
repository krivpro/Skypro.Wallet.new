import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clearToken } from '../shared/auth/tokenStorage'

type HeaderProps = {
  variant: 'auth' | 'app'
}

export function Header({ variant }: HeaderProps) {
  const navigate = useNavigate()

  const logoTo = variant === 'app' ? '/expenses' : '/'

  return (
    <header className="header container">
      <Link to={logoTo} className="header__logo-link">
        <img src="/img/logo.svg" alt="логотип" className="header__logo-img" />
      </Link>
      {variant === 'app' && (
        <>
          <nav className="header__nav">
            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `header__link${isActive ? ' header__link_active' : ''}`
              }
            >
              Мои расходы
            </NavLink>
            <NavLink
              to="/analysis"
              className={({ isActive }) =>
                `header__link${isActive ? ' header__link_active' : ''}`
              }
            >
              Анализ расходов
            </NavLink>
          </nav>
          <button
            type="button"
            className="header__btn"
            onClick={() => {
              clearToken()
              navigate('/')
            }}
          >
            Выйти
          </button>
        </>
      )}
    </header>
  )
}
