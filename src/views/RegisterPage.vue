<template>
  <form @submit.prevent="submit">
    <input v-model="username" :placeholder="t('username')" />
    <input v-model="email" type="email" :placeholder="t('email')" />
    <input v-model="password" type="password" :placeholder="t('password')" />
    <input v-model="confirmPassword" type="password" :placeholder="t('confirm_password')" />
    <button type="submit">{{ t('register') }}</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { register } from '@/api/auth'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const submit = async () => {
  error.value = ''

  if (!username.value || !password.value || !confirmPassword.value) {
    error.value = t('register_required')
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = t('password_mismatch')
    return
  }
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
    error.value = t('invalid_email')
    return
  }

  try {
    await register(username.value, password.value, email.value)
    alert(t('register_success'))
    router.replace('/login')
  } catch (err: any) {
    error.value = err.response?.data?.detail || t('register_failed')
  }
}
</script>
