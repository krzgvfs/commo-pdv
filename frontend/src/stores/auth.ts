import { defineStore } from 'pinia'
import router from '@/router'
import { getUser, renewToken, loginUser } from '@/services/userPreference'
import type { LoginCredentials, User } from '@/types'

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    const decoded = JSON.parse(jsonPayload)
    return typeof decoded.exp === 'number' ? decoded : null
  } catch {
    return null
  }
}

function shouldRefreshToken(token: string): boolean {
  const decoded = parseJwt(token)
  if (!decoded) return true
  const expirationTime = decoded.exp * 1000
  const twentyMinutesBeforeExpiration = expirationTime - 20 * 60 * 1000
  return Date.now() >= twentyMinutesBeforeExpiration
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isRefreshing: boolean
  sessionCheckerInterval: number | null
  isAuthInitialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isRefreshing: false,
    sessionCheckerInterval: null,
    isAuthInitialized: false,
  }),
  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const response = await loginUser(credentials)
        if (!response) {
          throw new Error('Login failed')
        }
        const { data } = response
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
        await this.fetchUser()
        this.startSessionChecker()
        await router.push({ name: 'Home' })
      } catch (error) {
        throw error
      }
    },
    async logout() {
      if (this.sessionCheckerInterval) {
        clearInterval(this.sessionCheckerInterval)
        this.sessionCheckerInterval = null
      }
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      this.$reset()
      if (router.currentRoute.value.name !== 'Login') {
        await router.push({ name: 'Login' })
      }
    },
    async fetchUser() {
      if (!localStorage.getItem('access')) {
        await this.logout()
        return
      }
      try {
        const response = await getUser()
        this.user = {
          ...response.data,
          groups: response.data.groups || [],
        }
        this.isAuthenticated = true
      } catch {
        await this.logout()
      }
    },
    async initAuth() {
      const token = localStorage.getItem('access')
      if (token) {
        await this.fetchUser()
        if (this.isAuthenticated) {
          this.startSessionChecker()
        }
      }
      this.isAuthInitialized = true
    },
    async refreshSession() {
      if (this.isRefreshing) return
      this.isRefreshing = true
      try {
        const refreshToken = localStorage.getItem('refresh')
        if (!refreshToken) {
          await this.logout()
          return
        }
        const { data } = await renewToken(refreshToken)
        if (data.access) {
          localStorage.setItem('access', data.access)
          if (data.refresh) {
            localStorage.setItem('refresh', data.refresh)
          }
        } else {
          await this.logout()
        }
      } catch {
        await this.logout()
      } finally {
        this.isRefreshing = false
      }
    },
    startSessionChecker() {
      if (this.sessionCheckerInterval) {
        clearInterval(this.sessionCheckerInterval)
      }
      this.sessionCheckerInterval = setInterval(
        () => {
          if (!this.isAuthenticated) return
          const token = localStorage.getItem('access')
          if (!token || shouldRefreshToken(token)) {
            this.refreshSession()
          }
        },
        5 * 60 * 1000,
      )
    },
  },
  getters: {
    hasGroup: (state) => (group: string | string[]) => {
      if (!state.user?.groups) return false
      const userGroups = state.user.groups.map((g: string) => g.toLowerCase())
      if (Array.isArray(group)) {
        return group.some((g) => userGroups.includes(g.toLowerCase()))
      }
      return userGroups.includes(group.toLowerCase())
    },
  },
})
