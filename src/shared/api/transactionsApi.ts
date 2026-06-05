import { apiRequest } from './client'
import type { ApiTransaction, CreateTransactionPayload, PeriodPayload } from './types'

export async function fetchTransactions(params?: {
  sortBy?: 'date' | 'sum'
  filterBy?: string
}): Promise<ApiTransaction[]> {
  const search = new URLSearchParams()
  if (params?.sortBy) search.set('sortBy', params.sortBy)
  if (params?.filterBy) search.set('filterBy', params.filterBy)
  const query = search.toString()
  return apiRequest<ApiTransaction[]>(`/transactions${query ? `?${query}` : ''}`)
}

export async function createTransaction(
  payload: CreateTransactionPayload,
): Promise<ApiTransaction[]> {
  const data = await apiRequest<{ transactions: ApiTransaction[] }>('/transactions', {
    method: 'POST',
    body: payload,
  })
  return data.transactions
}

export async function deleteTransaction(id: string): Promise<ApiTransaction[]> {
  const data = await apiRequest<{ transactions: ApiTransaction[] }>(`/transactions/${id}`, {
    method: 'DELETE',
  })
  return data.transactions
}

export async function fetchTransactionsByPeriod(
  payload: PeriodPayload,
): Promise<ApiTransaction[]> {
  return apiRequest<ApiTransaction[]>('/transactions/period', {
    method: 'POST',
    body: payload,
  })
}
