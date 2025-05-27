<template>
  <div class="job-detail-page">
    <h2>{{ t('job_detail') }}</h2>

    <router-link to="/">
      <button class="back-button">{{ t('back_to_list') }}</button>
    </router-link>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
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

<style scoped>
.job-detail-page {
  max-width: 800px;
  margin: 2rem auto;
}
.error {
  color: red;
}
.back-button {
  margin-bottom: 1rem;
  background-color: #444;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.back-button:hover {
  background-color: #666;
}
</style>
