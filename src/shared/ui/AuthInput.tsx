import { authInputWidthCh } from '../auth/authInputWidth'

type AuthInputProps = {
  type: 'text' | 'password'
  label: string
  value: string
  hasError: boolean
  onChange: (value: string) => void
}

export function AuthInput({ type, label, value, hasError, onChange }: AuthInputProps) {
  const placeholder = hasError ? `${label} *` : label

  return (
    <div className={`window__input-field${hasError ? ' window__input-field_error' : ''}`}>
      <input
        type={type}
        className={`window__input-field__control${hasError ? ' window__input-field__control--error-sized' : ''}`}
        style={
          hasError
            ? ({ ['--auth-ch' as string]: authInputWidthCh(value, placeholder) } as React.CSSProperties)
            : undefined
        }
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hasError && value ? <span className="window__input-field__star">*</span> : null}
    </div>
  )
}
