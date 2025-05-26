<template>
  <Header v-if="auth.token" />
  <router-view />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onBeforeMount } from 'vue'
import Header from './components/Header.vue'

const auth = useAuthStore()

onBeforeMount(() => {
  auth.init()
})
</script>
