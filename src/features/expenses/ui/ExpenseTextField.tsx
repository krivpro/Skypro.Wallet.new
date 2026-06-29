type ExpenseTextFieldProps = {
  title: string
  placeholder: string
  value: string
  hasError: boolean
  onChange: (value: string) => void
}

export function ExpenseTextField({
  title,
  placeholder,
  value,
  hasError,
  onChange,
}: ExpenseTextFieldProps) {
  return (
    <div className="form__item">
      <h3 className="title form__title">
        {title}
        {hasError ? <span className="form__title-asterisk">*</span> : null}
      </h3>
      <input
        type="text"
        className={`window__input${hasError ? ' window__input_error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
