<template>
  <div class="job-create-page">
    <h2>{{ t('create_job') }}</h2>

    <!-- 返回列表按鈕 -->
    <router-link to="/">
      <button class="back-button">{{ t('back_to_list') }}</button>
    </router-link>

    <form @submit.prevent="submit">
      <input v-model="form.title" :placeholder="t('title')" required />
      <input v-model="form.description" :placeholder="t('description')" required />
      <input v-model="form.location" :placeholder="t('location')" required />

      <input v-model="form.salaryMin" type="number" :placeholder="t('salary_min')" />
      <input v-model="form.salaryMax" type="number" :placeholder="t('salary_max')" />

      <input v-model="form.posting_date" type="date" :placeholder="t('posting_date')" required />
      <input v-model="form.expiration_date" type="date" :placeholder="t('expiration_date')" required />

      <input v-model="form.company_name" :placeholder="t('company_name')" required />

      <select v-model="form.status" required>
        <option value="active">{{ t('status_active') }}</option>
        <option value="scheduled">{{ t('status_scheduled') }}</option>
        <option value="expired">{{ t('status_expired') }}</option>
      </select>

      <textarea
        v-model="form.required_skills"
        :placeholder="t('required_skills_hint')"
      ></textarea>

      <button type="submit">{{ t('create_job') }}</button>
      <p v-if="error" style="color:red">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { createJob } from '@/api/job'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
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
    error.value = err.response?.data?.detail || t('error_create')
  }
}
</script>

<style scoped>
.job-create-page {
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
