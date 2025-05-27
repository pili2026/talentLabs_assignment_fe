<template>
  <header class="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
    <div class="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
      <h1 class="text-xl font-bold">{{ t('system_title') }}</h1>

      <div v-if="auth.username" class="flex items-center gap-4">
        <span class="text-sm">{{ t('hello') }}, <strong>{{ auth.username }}</strong></span>
        <select v-model="$i18n.locale" class="border border-gray-500 bg-black px-3 py-1 rounded-lg text-sm">
          <option value="zh-TW">繁體中文</option>
          <option value="en">English</option>
        </select>
        <button @click="logout" class="border border-gray-500 px-4 py-1 rounded-lg text-sm">
          {{ t('logout') }}
        </button>
      </div>
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
