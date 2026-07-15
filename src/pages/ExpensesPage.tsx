import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EXPENSE_CATEGORY_OPTIONS } from '../features/expenses/model/categories'
import { getCategoryApiKey } from '../features/expenses/model/categoryMap'
import { useExpenses } from '../features/expenses/model/useExpenses'
import type { ExpenseCategoryOption } from '../features/expenses/model/types'
import { ExpenseCategoryPicker } from '../features/expenses/ui/ExpenseCategoryPicker'
import { ExpenseTextField } from '../features/expenses/ui/ExpenseTextField'
import { ExpensesTable } from '../features/expenses/ui/ExpensesTable'
import { isBadRequest, redirectIfUnauthorized } from '../shared/api/unauthorized'
import { formatExpenseDateInput, uiDateToApiDate } from '../shared/lib/dateFormat'
import {
  formatExpenseAmountInput,
  isValidExpenseAmount,
  isValidExpenseDate,
  isValidExpenseDescription,
  parseExpenseAmount,
} from '../shared/validation/messages'

type ExpenseField = 'description' | 'category' | 'date' | 'amount'

const EMPTY_FIELD_ERRORS: Record<ExpenseField, boolean> = {
  description: false,
  category: false,
  date: false,
  amount: false,
}

export function ExpensesPage() {
  const navigate = useNavigate()
  const { rows, loading, deletingId, addExpense, removeExpense } = useExpenses()

  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategoryOption | null>(null)
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [fieldErrors, setFieldErrors] = useState(EMPTY_FIELD_ERRORS)
  const [showSubmitErrors, setShowSubmitErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isDescriptionValid = isValidExpenseDescription(description)
  const isCategoryValid = selectedCategory != null
  const isDateValid = isValidExpenseDate(date)
  const isAmountValid = isValidExpenseAmount(amount)
  const isFormValid = isDescriptionValid && isCategoryValid && isDateValid && isAmountValid

  const clearFieldError = (field: ExpenseField) => {
    setFieldErrors((prev) => ({ ...prev, [field]: false }))
    setShowSubmitErrors(false)
  }

  const resetForm = () => {
    setDescription('')
    setSelectedCategory(null)
    setDate('')
    setAmount('')
    setFieldErrors(EMPTY_FIELD_ERRORS)
    setShowSubmitErrors(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const nextFieldErrors = {
      description: !isDescriptionValid,
      category: !isCategoryValid,
      date: !isDateValid,
      amount: !isAmountValid,
    }
    if (Object.values(nextFieldErrors).some(Boolean)) {
      setFieldErrors(nextFieldErrors)
      setShowSubmitErrors(true)
      return
    }
    if (!selectedCategory) return

    setSubmitting(true)
    try {
      await addExpense({
        description: description.trim(),
        sum: parseExpenseAmount(amount),
        category: getCategoryApiKey(selectedCategory),
        date: uiDateToApiDate(date),
      })
      resetForm()
    } catch (error) {
      if (isBadRequest(error)) {
        setShowSubmitErrors(true)
      } else {
        redirectIfUnauthorized(error, navigate)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="content">
      <div className="content__nav-panel">
        <h1 className="title main__title">Мои расходы</h1>
      </div>
      <div className="window window_big">
        <h2 className="title window__title">Таблица расходов</h2>
        {loading ? (
          <p className="window__text">Загрузка…</p>
        ) : (
          <ExpensesTable
            rows={rows}
            deletingId={deletingId}
            onDeleteRow={(id) => void removeExpense(id)}
          />
        )}
      </div>
      <div className="window window_small">
        <h2 className="title window__title">Новый расход</h2>
        <form className="window__form form" onSubmit={handleSubmit}>
          <ExpenseTextField
            title="Описание"
            placeholder="Введите описание"
            value={description}
            hasError={fieldErrors.description}
            onChange={(value) => {
              setDescription(value)
              clearFieldError('description')
            }}
          />
          <div className="form__item">
            <h3 className="title form__title">
              Категория
              {fieldErrors.category ? <span className="form__title-asterisk">*</span> : null}
            </h3>
            <ExpenseCategoryPicker
              options={EXPENSE_CATEGORY_OPTIONS}
              selectedLabel={selectedCategory?.label ?? null}
              onSelect={(category) => {
                setSelectedCategory(category)
                clearFieldError('category')
              }}
            />
          </div>
          <ExpenseTextField
            title="Дата"
            placeholder="ДД.ММ.ГГГГ"
            value={date}
            hasError={fieldErrors.date}
            inputMode="numeric"
            maxLength={10}
            onChange={(value) => {
              setDate(formatExpenseDateInput(value))
              clearFieldError('date')
            }}
          />
          <ExpenseTextField
            title="Сумма"
            placeholder="Введите сумму"
            value={amount}
            hasError={fieldErrors.amount}
            inputMode="decimal"
            onChange={(value) => {
              setAmount(formatExpenseAmountInput(value))
              clearFieldError('amount')
            }}
          />
          <button type="submit" className="btn" disabled={(showSubmitErrors && !isFormValid) || submitting}>
            {submitting ? 'Добавление…' : 'Добавить новый расход'}
          </button>
        </form>
      </div>
    </div>
  )
}
