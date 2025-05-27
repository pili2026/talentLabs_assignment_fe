<template>
  <div class="job-edit-page">
    <h2>{{ t('edit_job') }}</h2>

    <router-link to="/">
      <button class="back-button">{{ t('back_to_list') }}</button>
    </router-link>

    <form v-if="form" @submit.prevent="submit">
      <input v-model="form.title" :placeholder="t('title')" required />
      <input v-model="form.description" :placeholder="t('description')" required />
      <input v-model="form.location" :placeholder="t('location')" required />

      <input v-model="form.salaryMin" type="number" :placeholder="t('salary_min')" />
      <input v-model="form.salaryMax" type="number" :placeholder="t('salary_max')" />

      <input v-model="form.posting_date" type="date" :placeholder="t('posting_date')" required />
      <input v-model="form.expiration_date" type="date" :placeholder="t('expiration_date')" required />

      <input v-model="form.company_name" :placeholder="t('company_name')" readonly />

      <select v-model="form.status" required>
        <option value="active">{{ t('status_active') }}</option>
        <option value="scheduled">{{ t('status_scheduled') }}</option>
        <option value="expired">{{ t('status_expired') }}</option>
      </select>

      <textarea
        v-model="form.required_skills"
        :placeholder="t('required_skills_hint')"
      ></textarea>

      <button type="submit">{{ t('update_job') }}</button>
      <p v-if="error" style="color:red">{{ error }}</p>
    </form>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { getJobDetail, updateJob } from '@/api/job'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { t } = useI18n()
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
    error.value = t('error_load')
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
    error.value = err.response?.data?.detail || t('error_update')
  }
}
</script>

<style scoped>
.job-edit-page {
  max-width: 800px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

form input,
form select,
form textarea {
  flex: 1 1 30%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

form button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form button:hover {
  background-color: #0056b3;
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
