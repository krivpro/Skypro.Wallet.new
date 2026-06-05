import type { ExpenseCategoryOption } from '../model/types'

type ExpenseCategoryPickerProps = {
  options: ExpenseCategoryOption[]
  selectedLabel: string | null
  onSelect?: (option: ExpenseCategoryOption) => void
}

export function ExpenseCategoryPicker({ options, selectedLabel, onSelect }: ExpenseCategoryPickerProps) {
  return (
    <div className="category">
      {options.map((c) => (
        <button
          key={c.label}
          type="button"
          className={`category__item${selectedLabel === c.label ? ' category__item_selected' : ''}`}
          onClick={() => onSelect?.(c)}
        >
          <img src={c.src} alt={c.alt} />
          <p className="category__text">{c.label}</p>
        </button>
      ))}
    </div>
  )
}
