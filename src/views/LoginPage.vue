<template>
  <form @submit.prevent="submit">
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const submit = async () => {
  try {
    const res = await login(username.value, password.value)
    auth.setToken(res.access)
    router.push('/')
  } catch (e) {
    alert('Login failed')
  }
}
</script>
