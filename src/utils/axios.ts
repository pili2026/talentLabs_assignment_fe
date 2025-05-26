import { getAuthStoreInstance } from '@/stores/auth'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://0.0.0.0:8000/api',
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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      auth.refreshToken
    ) {
      originalRequest._retry = true
      try {
        const res = await axios.post('http://0.0.0.0:8000/api/auth/refresh/', {
          refresh: auth.refreshToken,
        })
        const newAccessToken = res.data.access
        auth.setToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch {
        auth.logout()
      }
    }

    return Promise.reject(error)
  }
)

export default api
