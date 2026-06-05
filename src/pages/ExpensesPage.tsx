import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EXPENSE_CATEGORY_OPTIONS } from '../features/expenses/model/categories'
import { getCategoryApiKey } from '../features/expenses/model/categoryMap'
import { mapTransactionsToRows } from '../features/expenses/model/transactionMappers'
import type { ExpenseCategoryOption, ExpenseTableRow } from '../features/expenses/model/types'
import { ExpenseCategoryPicker } from '../features/expenses/ui/ExpenseCategoryPicker'
import { ExpensesTable } from '../features/expenses/ui/ExpensesTable'
import { ApiError } from '../shared/api/client'
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
} from '../shared/api/transactionsApi'
import { uiDateToApiDate } from '../shared/lib/dateFormat'
import {
  isValidExpenseAmount,
  isValidExpenseDate,
  isValidExpenseDescription,
} from '../shared/validation/messages'

function parseAmount(value: string): number {
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.')
  return Number(normalized)
}

export function ExpensesPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<ExpenseTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategoryOption | null>(null)
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [descriptionError, setDescriptionError] = useState(false)
  const [categoryError, setCategoryError] = useState(false)
  const [dateError, setDateError] = useState(false)
  const [amountError, setAmountError] = useState(false)
  const [showSubmitErrors, setShowSubmitErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const descriptionOk = isValidExpenseDescription(description)
  const categoryOk = selectedCategory != null
  const dateOk = isValidExpenseDate(date)
  const amountOk = isValidExpenseAmount(amount)
  const formValid = descriptionOk && categoryOk && dateOk && amountOk

  const loadTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTransactions()
      setRows(mapTransactionsToRows(data))
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    void loadTransactions()
  }, [loadTransactions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const badDescription = !descriptionOk
    const badCategory = !categoryOk
    const badDate = !dateOk
    const badAmount = !amountOk
    if (badDescription || badCategory || badDate || badAmount) {
      setDescriptionError(badDescription)
      setCategoryError(badCategory)
      setDateError(badDate)
      setAmountError(badAmount)
      setShowSubmitErrors(true)
      return
    }
    if (!selectedCategory) return

    setSubmitting(true)
    try {
      const list = await createTransaction({
        description: description.trim(),
        sum: parseAmount(amount),
        category: getCategoryApiKey(selectedCategory),
        date: uiDateToApiDate(date),
      })
      setRows(mapTransactionsToRows(list))
      setDescriptionError(false)
      setCategoryError(false)
      setDateError(false)
      setAmountError(false)
      setShowSubmitErrors(false)
      setDescription('')
      setSelectedCategory(null)
      setDate('')
      setAmount('')
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setShowSubmitErrors(true)
      } else if (err instanceof ApiError && err.status === 401) {
        navigate('/')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const list = await deleteTransaction(id)
      setRows(mapTransactionsToRows(list))
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate('/')
      }
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
          <ExpensesTable rows={rows} onDeleteRow={(id) => void handleDelete(id)} />
        )}
      </div>
      <div className="window window_small">
        <h2 className="title window__title">Новый расход</h2>
        <form action="#" className="window__form form" onSubmit={handleSubmit}>
          <div className="form__item">
            <h3 className="title form__title">
              Описание
              {descriptionError ? <span className="form__title-asterisk">*</span> : null}
            </h3>
            <input
              type="text"
              className={`window__input${descriptionError ? ' window__input_error' : ''}`}
              placeholder="Введите описание"
              value={description}
              onChange={(ev) => {
                setDescription(ev.target.value)
                setDescriptionError(false)
                setShowSubmitErrors(false)
              }}
            />
          </div>
          <div className="form__item">
            <h3 className="title form__title">
              Категория
              {categoryError ? <span className="form__title-asterisk">*</span> : null}
            </h3>
            <ExpenseCategoryPicker
              options={EXPENSE_CATEGORY_OPTIONS}
              selectedLabel={selectedCategory?.label ?? null}
              onSelect={(c) => {
                setSelectedCategory(c)
                setCategoryError(false)
                setShowSubmitErrors(false)
              }}
            />
          </div>
          <div className="form__item">
            <h3 className="title form__title">
              Дата
              {dateError ? <span className="form__title-asterisk">*</span> : null}
            </h3>
            <input
              type="text"
              className={`window__input${dateError ? ' window__input_error' : ''}`}
              placeholder="Введите дату"
              value={date}
              onChange={(ev) => {
                setDate(ev.target.value)
                setDateError(false)
                setShowSubmitErrors(false)
              }}
            />
          </div>
          <div className="form__item">
            <h3 className="title form__title">
              Сумма
              {amountError ? <span className="form__title-asterisk">*</span> : null}
            </h3>
            <input
              type="text"
              className={`window__input${amountError ? ' window__input_error' : ''}`}
              placeholder="Введите сумму"
              value={amount}
              onChange={(ev) => {
                setAmount(ev.target.value)
                setAmountError(false)
                setShowSubmitErrors(false)
              }}
            />
          </div>
          <button type="submit" className="btn" disabled={(showSubmitErrors && !formValid) || submitting}>
            {submitting ? 'Добавление…' : 'Добавить новый расход'}
          </button>
        </form>
      </div>
    </div>
  )
}
