import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../shared/api/authApi'
import { isBadRequest } from '../shared/api/unauthorized'
import { setToken } from '../shared/auth/tokenStorage'
import { AuthInput } from '../shared/ui/AuthInput'
import { AUTH_FORM_ERROR_MESSAGE, isValidEmail } from '../shared/validation/messages'

const MIN_PASSWORD_LENGTH = 4

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [showFormError, setShowFormError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isFormValid = isValidEmail(email) && password.trim().length >= MIN_PASSWORD_LENGTH

  const clearFieldError = (field: 'email' | 'password') => {
    setShowFormError(false)
    if (field === 'email') setEmailError(false)
    else setPasswordError(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const hasEmailError = !isValidEmail(email)
    const hasPasswordError = password.trim().length < MIN_PASSWORD_LENGTH
    if (hasEmailError || hasPasswordError) {
      setEmailError(hasEmailError)
      setPasswordError(hasPasswordError)
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
    } catch (error) {
      if (isBadRequest(error)) {
        setEmailError(true)
        setPasswordError(true)
      }
      setShowFormError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="content content_auth">
      <div className="window window_auth">
        <h2 className="title window__title">Вход</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            type="text"
            label="Эл. почта"
            value={email}
            hasError={emailError}
            onChange={(value) => {
              setEmail(value)
              clearFieldError('email')
            }}
          />
          <AuthInput
            type="password"
            label="Пароль"
            value={password}
            hasError={passwordError}
            onChange={(value) => {
              setPassword(value)
              clearFieldError('password')
            }}
          />
          {showFormError ? <p className="auth-form__error">{AUTH_FORM_ERROR_MESSAGE}</p> : null}
          <button
            type="submit"
            className={`window__btn btn auth-form__submit${showFormError ? ' auth-form__submit_after-error' : ''}`}
            disabled={(showFormError && !isFormValid) || submitting}
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
