import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../shared/api/authApi'
import { ApiError } from '../shared/api/client'
import { authErrorFieldCh } from '../shared/auth/authFieldCh'
import { setToken } from '../shared/auth/tokenStorage'
import { AUTH_FORM_ERROR_MESSAGE, isValidEmail } from '../shared/validation/messages'

const PH_NAME = 'Имя'
const PH_EMAIL = 'Эл. почта'
const PH_PASSWORD = 'Пароль'

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

  const isValid =
    name.trim().length >= 2 && isValidEmail(email) && password.trim().length >= 6

  const clearFieldError = (field: 'name' | 'email' | 'password') => {
    setShowFormError(false)
    if (field === 'name') setNameError(false)
    else if (field === 'email') setEmailError(false)
    else setPasswordError(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const badName = name.trim().length < 2
    const badEmail = !isValidEmail(email)
    const badPassword = password.trim().length < 6
    if (badName || badEmail || badPassword) {
      setNameError(badName)
      setEmailError(badEmail)
      setPasswordError(badPassword)
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
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setEmailError(true)
        setFormErrorMessage(err.message)
        setShowFormError(true)
      } else {
        setFormErrorMessage(err instanceof ApiError ? err.message : AUTH_FORM_ERROR_MESSAGE)
        setShowFormError(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="content content_auth">
      <div className="window window_auth">
        <h2 className="title window__title">Регистрация</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className={`window__input-field${nameError ? ' window__input-field_error' : ''}`}>
            <input
              type="text"
              className={`window__input-field__control${nameError ? ' window__input-field__control--error-sized' : ''}`}
              style={
                nameError
                  ? ({ ['--auth-ch' as string]: authErrorFieldCh(name, `${PH_NAME} *`) } as React.CSSProperties)
                  : undefined
              }
              placeholder={nameError ? `${PH_NAME} *` : PH_NAME}
              value={name}
              onChange={(ev) => {
                setName(ev.target.value)
                clearFieldError('name')
              }}
            />
            {nameError && name ? (
              <>
                {' '}
                <span className="window__input-field__star">*</span>
              </>
            ) : null}
          </div>
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
          {showFormError ? <p className="auth-form__error">{formErrorMessage}</p> : null}
          <button
            type="submit"
            className={`window__btn btn auth-form__submit${showFormError ? ' auth-form__submit_after-error' : ''}`}
            disabled={(showFormError && !isValid) || submitting}
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
