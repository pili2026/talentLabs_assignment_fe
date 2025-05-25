import api from './axios'

export const login = async (username: string, password: string) => {
  const res = await api.post('/auth/pair', { username, password })
  return res.data // { access, refresh, username }
}

export const register = async (username: string, password: string, email?: string) => {
  const res = await api.post('/auth/register', { username, password, email })
  return res.data
}
