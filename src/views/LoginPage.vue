<template>
  <form @submit.prevent="submit">
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
    <p v-if="error" style="color:red">{{ error }}</p>
    <p>
      Not registered yet?
      <router-link to="/register">Go to registration</router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()
const router = useRouter()

const submit = async () => {
  try {
    const res = await login(username.value, password.value)
    auth.setToken(res.access)
    auth.setRefreshToken(res.refresh)
    auth.setUsername(res.username)
    router.push('/')
  } catch {
    error.value = 'Login failed. Please check your credentials.'
  }
}
</script>
