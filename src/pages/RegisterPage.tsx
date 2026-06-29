import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../shared/api/authApi'
import { ApiError } from '../shared/api/client'
import { isBadRequest } from '../shared/api/unauthorized'
import { setToken } from '../shared/auth/tokenStorage'
import { AuthInput } from '../shared/ui/AuthInput'
import { AUTH_FORM_ERROR_MESSAGE, isValidEmail } from '../shared/validation/messages'

const MIN_NAME_LENGTH = 2
const MIN_PASSWORD_LENGTH = 6

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [showFormError, setShowFormError] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState(AUTH_FORM_ERROR_MESSAGE)
  const [submitting, setSubmitting] = useState(false)

  const isFormValid =
    name.trim().length >= MIN_NAME_LENGTH &&
    isValidEmail(email) &&
    password.trim().length >= MIN_PASSWORD_LENGTH

  const clearFieldError = (field: 'name' | 'email' | 'password') => {
    setShowFormError(false)
    if (field === 'name') setNameError(false)
    else if (field === 'email') setEmailError(false)
    else setPasswordError(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const hasNameError = name.trim().length < MIN_NAME_LENGTH
    const hasEmailError = !isValidEmail(email)
    const hasPasswordError = password.trim().length < MIN_PASSWORD_LENGTH
    if (hasNameError || hasEmailError || hasPasswordError) {
      setNameError(hasNameError)
      setEmailError(hasEmailError)
      setPasswordError(hasPasswordError)
      setFormErrorMessage(AUTH_FORM_ERROR_MESSAGE)
      setShowFormError(true)
      return
    }

    setSubmitting(true)
    try {
      const user = await registerUser({
        login: email.trim(),
        name: name.trim(),
        password: password.trim(),
      })
      setToken(user.token)
      setNameError(false)
      setEmailError(false)
      setPasswordError(false)
      setShowFormError(false)
      navigate('/expenses')
    } catch (error) {
      if (isBadRequest(error)) {
        setEmailError(true)
        setFormErrorMessage(error.message)
      } else {
        setFormErrorMessage(error instanceof ApiError ? error.message : AUTH_FORM_ERROR_MESSAGE)
      }
      setShowFormError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="content content_auth">
      <div className="window window_auth">
        <h2 className="title window__title">Регистрация</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            type="text"
            label="Имя"
            value={name}
            hasError={nameError}
            onChange={(value) => {
              setName(value)
              clearFieldError('name')
            }}
          />
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
          {showFormError ? <p className="auth-form__error">{formErrorMessage}</p> : null}
          <button
            type="submit"
            className={`window__btn btn auth-form__submit${showFormError ? ' auth-form__submit_after-error' : ''}`}
            disabled={(showFormError && !isFormValid) || submitting}
          >
            {submitting ? 'Регистрация…' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="window__text">Уже есть аккаунт?</p>
        <Link to="/" className="window__link">
          Войдите здесь
        </Link>
      </div>
    </div>
  )
}
