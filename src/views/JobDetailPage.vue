<template>
  <div class="job-detail-page">
    <h2>Job Detail</h2>

    <router-link to="/">
        <button class="back-button">← Back to Job List</button>
    </router-link>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <p><strong>Title:</strong> {{ job.title }}</p>
      <p><strong>Company:</strong> {{ job.company_name }}</p>
      <p><strong>Location:</strong> {{ job.location }}</p>
      <p><strong>Status:</strong> {{ job.status }}</p>
      <p><strong>Posting Date:</strong> {{ job.posting_date }}</p>
      <p><strong>Expiration Date:</strong> {{ job.expiration_date }}</p>
      <p><strong>Description:</strong> {{ job.description }}</p>
      <p><strong>Salary Range:</strong> {{ job.salary_range || '-' }}</p>
      <p><strong>Required Skills:</strong> {{ job.required_skills.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getJobDetail } from '@/api/job'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const jobId = route.params.id as string

const job = ref<any | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    job.value = await getJobDetail(jobId)
  } catch (e) {
    error.value = 'Failed to load job.'
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

