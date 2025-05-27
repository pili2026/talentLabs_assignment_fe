<template>
  <div class="min-h-screen bg-black text-white px-6 py-10 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">{{ t('job_detail') }}</h2>

    <router-link to="/">
      <button class="mb-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
        {{ t('back_to_list') }}
      </button>
    </router-link>

    <LoadingSpinner v-if="loading" />
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else class="space-y-3">
      <p><strong>{{ t('title') }}:</strong> {{ job.title }}</p>
      <p><strong>{{ t('company_name') }}:</strong> {{ job.company_name }}</p>
      <p><strong>{{ t('location') }}:</strong> {{ job.location }}</p>
      <p><strong>{{ t('status') }}:</strong> {{ job.status }}</p>
      <p><strong>{{ t('posting_date') }}:</strong> {{ job.posting_date }}</p>
      <p><strong>{{ t('expiration_date') }}:</strong> {{ job.expiration_date }}</p>
      <p><strong>{{ t('description') }}:</strong> {{ job.description }}</p>
      <p><strong>{{ t('required_skills') }}:</strong> {{ job.required_skills.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getJobDetail } from '@/api/job'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const jobId = route.params.id as string

const job = ref<any | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    job.value = await getJobDetail(jobId)
  } catch (e) {
    error.value = t('error_load')
  } finally {
    loading.value = false
  }
})
</script>
