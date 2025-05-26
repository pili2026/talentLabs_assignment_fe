// src/router/index.ts
import { getAuthStoreInstance } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

import JobCreatePage from '@/views/JobCreatePage.vue'
import JobDetailPage from '@/views/JobDetailPage.vue'
import JobEditPage from '@/views/JobEditPage.vue'
import JobListPage from '@/views/JobListPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'

const routes = [
  { path: '/', component: JobListPage, meta: { requiresAuth: true } },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/job/create', component: JobCreatePage, meta: { requiresAuth: true } },
  { path: '/job/edit/:job_id', component: JobEditPage, meta: { requiresAuth: true } },
  { path: '/job/:id', component: JobDetailPage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = getAuthStoreInstance()

  if (to.meta.requiresAuth && !auth.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
