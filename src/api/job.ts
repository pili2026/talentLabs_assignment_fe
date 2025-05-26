import api from '../utils/axios'

export const getJobList = async (params?: Record<string, any>) => {
  const res = await api.get('/job/', { params })
  return res.data
}

export const getJobDetail = async (id: string) => {
  const res = await api.get(`/job/${id}`)
  return res.data
}

export const createJob = async (job: any) => {
  const res = await api.post('/job/', job)
  return res.data
}

export const updateJob = async (id: string, job: any) => {
  const res = await api.put(`/job/${id}`, job)
  return res.data
}

export const deleteJob = async (id: string) => {
  await api.delete(`/job/${id}`)
}

export const getSkillList = async (): Promise<string[]> => {
  const res = await api.get('/job/skill_list')
  return res.data
}