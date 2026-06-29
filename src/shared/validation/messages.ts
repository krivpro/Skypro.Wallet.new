export const AUTH_FORM_ERROR_MESSAGE =
  'Упс! Введенные вами данные некорректны. Введите данные корректно и повторите попытку.'

export function isValidEmail(value: string): boolean {
  const v = value.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function isValidExpenseDate(value: string): boolean {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim())
  if (!m) return false
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return false
  const d = new Date(year, month - 1, day)
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
}

export function isValidExpenseDescription(value: string): boolean {
  return value.trim().length >= 4
}

export function normalizeExpenseAmount(value: string): string {
  return value.trim().replace(/\s/g, '').replace(',', '.')
}

export function parseExpenseAmount(value: string): number {
  return Number(normalizeExpenseAmount(value))
}

export function isValidExpenseAmount(value: string): boolean {
  const normalized = normalizeExpenseAmount(value)
  if (!normalized) return false
  const amount = Number(normalized)
  return Number.isFinite(amount) && amount > 0
}
