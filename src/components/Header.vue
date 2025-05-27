<template>
  <header class="header">
    <h1>{{ t('job_page') }}</h1>

    <div v-if="auth.username">
      <span class="username">{{ t('greeting') }}, {{ auth.username }}</span>
      <button @click="logout">{{ t('logout') }}</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getAuthStoreInstance } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const auth = getAuthStoreInstance()

const logout = () => {
  auth.logout()
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #1e1e1e;
  color: #ffffff;
  border-bottom: 1px solid #444;
}

.username {
  margin-right: 1rem;
}
</style>
