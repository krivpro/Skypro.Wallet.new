import type { NavigateFunction } from 'react-router-dom'
import { ApiError } from './client'

export function isUnauthorized(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401
}

export function isBadRequest(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 400
}

export function redirectIfUnauthorized(error: unknown, navigate: NavigateFunction): boolean {
  if (isUnauthorized(error)) {
    navigate('/', { replace: true })
    return true
  }
  return false
}
