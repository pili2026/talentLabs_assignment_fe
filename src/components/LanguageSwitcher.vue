<template>
  <select v-model="locale" class="border border-gray-500 px-3 py-2 rounded text-sm">
    <option value="zh-TW">繁體中文</option>
    <option value="en">English</option>
  </select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>
