import axios from 'axios'
import { AxiosError } from 'axios'
import { renewToken } from '@/services/userPreference'

const axiosInstance = axios.create({
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh/')
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh')
        if (!refreshToken) {
          // throw new Error('Refresh token not found')
          return
        }
        const res = await renewToken(refreshToken)
        const newAccessToken = res.data?.access

        if (newAccessToken) {
          localStorage.setItem('access', newAccessToken)
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        } else {
          window.dispatchEvent(new CustomEvent('session-expired'))
          return Promise.reject(new Error('Failed to refresh token'))
        }
      } catch (refreshError) {
        if (refreshError instanceof AxiosError) {
          return
        }

        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.dispatchEvent(new CustomEvent('session-expired'))
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
