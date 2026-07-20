import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from './tokenStorage'

export function useLogout() {
  const navigate = useNavigate()

  return useCallback(() => {
    clearToken()
    navigate('/', { replace: true })
  }, [navigate])
}
