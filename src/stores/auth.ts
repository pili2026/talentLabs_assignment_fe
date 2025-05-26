import router from '@/router'
import { defineStore } from 'pinia'

let authStoreInstance: ReturnType<typeof useAuthStore> | null = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    refreshToken: '',
    username: '',
  }),
  actions: {
    init() {
      this.token = localStorage.getItem('access_token') || ''
      this.refreshToken = localStorage.getItem('refresh_token') || ''
      this.username = localStorage.getItem('username') || ''
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('access_token', token)
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
      localStorage.setItem('refresh_token', refreshToken)
    },
    setUsername(username: string) {
      this.username = username
      localStorage.setItem('username', username)
    },
    clearTokens() {
      this.token = ''
      this.refreshToken = ''
      this.username = ''
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('username')
    },
    logout() {
      this.clearTokens()
      router.replace('/login')
    },
  },
})

export function getAuthStoreInstance() {
  if (!authStoreInstance) {
    authStoreInstance = useAuthStore()
    authStoreInstance.init()
  }
  return authStoreInstance
}
