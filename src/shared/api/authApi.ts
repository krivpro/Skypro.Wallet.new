import { apiRequest } from './client'
import type { ApiUser } from './types'

type AuthResponse = { user: ApiUser }

export async function registerUser(payload: {
  login: string
  name: string
  password: string
}): Promise<ApiUser> {
  const data = await apiRequest<AuthResponse>('/user', {
    method: 'POST',
    body: payload,
    auth: false,
  })
  return data.user
}

export async function loginUser(payload: {
  login: string
  password: string
}): Promise<ApiUser> {
  const data = await apiRequest<AuthResponse>('/user/login', {
    method: 'POST',
    body: payload,
    auth: false,
  })
  return data.user
}
