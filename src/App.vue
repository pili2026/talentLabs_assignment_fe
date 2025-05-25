<template>
  <Header v-if="auth.token" />
  <router-view />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import Header from './components/Header.vue'

const auth = useAuthStore()
</script>