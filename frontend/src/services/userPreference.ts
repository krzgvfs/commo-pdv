import axios from '@/services/axiosInstance'
import type { LoginCredentials } from '@/types'

// Authentication
export function loginUser(credentials: LoginCredentials) {
  return axios.post('/api/v1/accounts/token/', credentials)
}

export function renewToken(refreshToken: string) {
  return axios.post('/api/v1/accounts/token/refresh/', { refresh: refreshToken })
}

export function getUser() {
  return axios.get('/api/v1/accounts/me/')
}