<template>
  <form @submit.prevent="submit">
    <input v-model="username" placeholder="Username" />
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
    <button type="submit">Register</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { register } from '@/api/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const submit = async () => {
  error.value = ''

  if (!username.value || !password.value || !confirmPassword.value) {
    error.value = 'Full name, password, and confirm password are required'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
    error.value = 'Email format is invalid'
    return
  }

  try {
    await register(username.value, password.value, email.value)
    alert('Registration successful! You can now log in.')
    router.replace('/login')
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Registration failed. Please try again.'
  }
}
</script>
