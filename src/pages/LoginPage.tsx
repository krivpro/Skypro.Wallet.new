import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../shared/api/authApi'
import { ApiError } from '../shared/api/client'
import { authErrorFieldCh } from '../shared/auth/authFieldCh'
import { setToken } from '../shared/auth/tokenStorage'
import { AUTH_FORM_ERROR_MESSAGE, isValidEmail } from '../shared/validation/messages'

const PH_EMAIL = 'Эл. почта'
const PH_PASSWORD = 'Пароль'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [showFormError, setShowFormError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isValid = isValidEmail(email) && password.trim().length >= 4

  const clearFieldError = (field: 'email' | 'password') => {
    setShowFormError(false)
    if (field === 'email') setEmailError(false)
    else setPasswordError(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const badEmail = !isValidEmail(email)
    const badPassword = password.trim().length < 4
    if (badEmail || badPassword) {
      setEmailError(badEmail)
      setPasswordError(badPassword)
      setShowFormError(true)
      return
    }
    setSubmitting(true)
    try {
      const user = await loginUser({
        login: email.trim(),
        password: password.trim(),
      })
      setToken(user.token)
      setEmailError(false)
      setPasswordError(false)
      setShowFormError(false)
      navigate('/expenses')
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setEmailError(true)
        setPasswordError(true)
        setShowFormError(true)
      } else {
        setShowFormError(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="content content_auth">
      <div className="window window_auth">
        <h2 className="title window__title">Вход</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div
            className={`window__input-field${emailError ? ' window__input-field_error' : ''}`}
          >
            <input
              type="text"
              className={`window__input-field__control${emailError ? ' window__input-field__control--error-sized' : ''}`}
              style={
                emailError
                  ? ({ ['--auth-ch' as string]: authErrorFieldCh(email, `${PH_EMAIL} *`) } as React.CSSProperties)
                  : undefined
              }
              placeholder={emailError ? `${PH_EMAIL} *` : PH_EMAIL}
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value)
                clearFieldError('email')
              }}
            />
            {emailError && email ? (
              <>
                {' '}
                <span className="window__input-field__star">*</span>
              </>
            ) : null}
          </div>
          <div
            className={`window__input-field${passwordError ? ' window__input-field_error' : ''}`}
          >
            <input
              type="password"
              className={`window__input-field__control${passwordError ? ' window__input-field__control--error-sized' : ''}`}
              style={
                passwordError
                  ? ({
                      ['--auth-ch' as string]: authErrorFieldCh(password, `${PH_PASSWORD} *`),
                    } as React.CSSProperties)
                  : undefined
              }
              placeholder={passwordError ? `${PH_PASSWORD} *` : PH_PASSWORD}
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value)
                clearFieldError('password')
              }}
            />
            {passwordError && password ? (
              <>
                {' '}
                <span className="window__input-field__star">*</span>
              </>
            ) : null}
          </div>
          {showFormError ? <p className="auth-form__error">{AUTH_FORM_ERROR_MESSAGE}</p> : null}
          <button
            type="submit"
            className={`window__btn btn auth-form__submit${showFormError ? ' auth-form__submit_after-error' : ''}`}
            disabled={(showFormError && !isValid) || submitting}
          >
            {submitting ? 'Вход…' : 'Войти'}
          </button>
        </form>
        <p className="window__text">Нужно зарегистрироваться?</p>
        <Link to="/register" className="window__link">
          Регистрируйтесь здесь
        </Link>
      </div>
    </div>
  )
}
