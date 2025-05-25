<template>
  <header class="header">
    <span class="welcome">Welcome!</span>
    <button @click="logout">Logout</button>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.clearToken()
  router.push('/login')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f0f0;
  padding: 1rem;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
