import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
} from '../../../shared/api/transactionsApi'
import type { ApiTransaction, CreateTransactionPayload } from '../../../shared/api/types'
import { redirectIfUnauthorized } from '../../../shared/api/unauthorized'
import { mapTransactionsToRows } from './transactionMappers'
import type { ExpenseTableRow } from './types'

export function useExpenses() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<ExpenseTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const applyTransactions = useCallback((transactions: ApiTransaction[]) => {
    setRows(mapTransactionsToRows(transactions))
  }, [])

  const loadExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const transactions = await fetchTransactions()
      applyTransactions(transactions)
    } catch (error) {
      redirectIfUnauthorized(error, navigate)
    } finally {
      setLoading(false)
    }
  }, [applyTransactions, navigate])

  const addExpense = useCallback(
    async (payload: CreateTransactionPayload) => {
      const transactions = await createTransaction(payload)
      applyTransactions(transactions)
    },
    [applyTransactions],
  )

  const removeExpense = useCallback(
    async (id: string) => {
      setDeletingId(id)
      try {
        const transactions = await deleteTransaction(id)
        applyTransactions(transactions)
      } catch (error) {
        redirectIfUnauthorized(error, navigate)
      } finally {
        setDeletingId(null)
      }
    },
    [applyTransactions, navigate],
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadExpenses()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadExpenses])

  return {
    rows,
    loading,
    deletingId,
    loadExpenses,
    addExpense,
    removeExpense,
  }
}
