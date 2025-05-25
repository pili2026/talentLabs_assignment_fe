// src/router/index.ts
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

import JobListPage from '@/views/JobListPage.vue'
import LoginPage from '@/views/LoginPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/',
    name: 'Home',
    component: JobListPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    next('/login')
  } else {
    next()
  }
})

export { router }
