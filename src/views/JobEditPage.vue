<template>
  <div class="job-edit-page">
    <h2>Edit Job</h2>
    <form v-if="form" @submit.prevent="submit">
      <input v-model="form.title" placeholder="Title" required />
      <input v-model="form.description" placeholder="Description" required />
      <input v-model="form.location" placeholder="Location" required />

      <input v-model="form.salaryMin" type="number" placeholder="Salary Min" />
      <input v-model="form.salaryMax" type="number" placeholder="Salary Max" />

      <input v-model="form.posting_date" type="date" required />
      <input v-model="form.expiration_date" type="date" required />

      <input v-model="form.company_name" placeholder="Company Name" disabled />

      <select v-model="form.status" required>
        <option value="active">active</option>
        <option value="scheduled">scheduled</option>
        <option value="expired">expired</option>
      </select>

      <textarea v-model="form.required_skills" placeholder="Required Skills (comma-separated)"></textarea>

      <button type="submit">Update Job</button>
      <p v-if="error" style="color:red">{{ error }}</p>
    </form>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { getJobDetail, updateJob } from '@/api/job'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const jobId = route.params.job_id as string

const form = ref<any | null>(null)
const error = ref('')

onMounted(async () => {
  try {
    const job = await getJobDetail(jobId)
    form.value = {
      ...job,
      salaryMin: job.salary_range.min ?? '',
      salaryMax: job.salary_range.max ?? '',
      required_skills: (job.required_skills || []).join(', '),
    }
  } catch (e) {
    error.value = 'Failed to load job data.'
  }
})

const submit = async () => {
  try {
    const payload = {
      title: form.value.title,
      description: form.value.description,
      location: form.value.location,
      posting_date: form.value.posting_date,
      expiration_date: form.value.expiration_date,
      status: form.value.status,
      salary_range: {
        min: form.value.salaryMin,
        max: form.value.salaryMax,
      },
      required_skills: form.value.required_skills
        ? form.value.required_skills.split(',').map((s: string) => s.trim())
        : [],
    }

    await updateJob(jobId, payload)
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to update job'
  }
}

</script>
