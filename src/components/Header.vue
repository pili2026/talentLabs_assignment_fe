<template>
  <header class="header">
    <h1>Job Page</h1>
    <div v-if="auth.username">
      <span class="username">Hi, {{ auth.username }}</span>
      <button @click="logout">Logout</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getAuthStoreInstance } from '@/stores/auth'
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
