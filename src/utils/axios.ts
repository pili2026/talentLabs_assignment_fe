import { getAuthStoreInstance } from '@/stores/auth'
import axios from 'axios'
import qs from 'qs'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
})

api.interceptors.request.use((config) => {
  const auth = getAuthStoreInstance()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const auth = getAuthStoreInstance()

    if (error.response?.status === 401 && !originalRequest._retry && auth.refreshToken) {
      originalRequest._retry = true
      try {
        const res = await api.post('/auth/refresh', {
          refresh: auth.refreshToken,
        })

        const newAccessToken = res.data.access
        auth.setToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        auth.logout()
      }
    }

    return Promise.reject(error)
  },
)

export default api
