<template>
  <div class="job-create-page">
    <h2>Create a New Job</h2>
    <form @submit.prevent="submit">
      <input v-model="form.title" placeholder="Title" required />
      <input v-model="form.description" placeholder="Description" required />
      <input v-model="form.location" placeholder="Location" required />

      <input v-model="form.salaryMin" type="number" placeholder="Salary Min" />
      <input v-model="form.salaryMax" type="number" placeholder="Salary Max" />

      <input v-model="form.posting_date" type="date" placeholder="Posting Date" required />
      <input v-model="form.expiration_date" type="date" placeholder="Expiration Date" required />

      <input v-model="form.company_name" placeholder="Company Name" required />

      <select v-model="form.status" required>
        <option value="active">active</option>
        <option value="scheduled">scheduled</option>
        <option value="expired">expired</option>
      </select>

      <textarea v-model="form.required_skills" placeholder="Required Skills (comma-separated)"></textarea>

      <button type="submit">Create Job</button>
      <p v-if="error" style="color:red">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { createJob } from '@/api/job'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const error = ref('')
const form = ref({
  title: '',
  description: '',
  location: '',
  salaryMin: null as number | null,
  salaryMax: null as number | null,
  posting_date: '',
  expiration_date: '',
  company_name: '',
  status: 'active',
  required_skills: '',
})

const submit = async () => {
  error.value = ''

  try {
    const payload = {
      ...form.value,
      salary_range: {
        min: form.value.salaryMin,
        max: form.value.salaryMax,
      },
      required_skills: form.value.required_skills
        ? form.value.required_skills.split(',').map((s) => s.trim())
        : [],
    }

    await createJob(payload)
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Failed to create job'
  }
}
</script>
