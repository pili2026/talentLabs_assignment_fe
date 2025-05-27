<template>
  <LanguageSwitcher class="mb-4" />
  <form @submit.prevent="submit">
    <input v-model="username" :placeholder="t('username')" />
    <input v-model="password" type="password" :placeholder="t('password')" />
    <button type="submit">{{ t('login') }}</button>
    <p v-if="error" style="color: red">{{ error }}</p>
    <p>
      {{ t('not_registered') }}
      <router-link to="/register">{{ t('go_to_registration') }}</router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { login } from '@/api/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
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
