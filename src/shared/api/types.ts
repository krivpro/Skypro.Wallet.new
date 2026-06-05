export type ApiUser = {
  id: number
  login: string
  name: string
  token: string
}

export type ApiTransaction = {
  _id: string
  userId: string
  description: string
  category: ApiCategory
  date: string
  sum: number
}

export type ApiCategory =
  | 'food'
  | 'transport'
  | 'housing'
  | 'joy'
  | 'education'
  | 'others'

export type CreateTransactionPayload = {
  description: string
  sum: number
  category: ApiCategory
  date: string
}

export type PeriodPayload = {
  start: string
  end: string
}
