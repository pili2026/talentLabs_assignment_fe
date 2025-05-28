<template>
  <div class="min-h-screen bg-black text-white px-6 py-10 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">{{ t('edit_job') }}</h2>

    <router-link to="/">
      <button class="mb-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
        {{ t('back_to_list') }}
      </button>
    </router-link>

    <form v-if="form" @submit.prevent="submit" class="grid gap-4">
      <input
        v-model="form.title"
        :placeholder="t('title')"
        required
        class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm"
      />
      <input
        v-model="form.description"
        :placeholder="t('description')"
        required
        class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm"
      />
      <input
        v-model="form.location"
        :placeholder="t('location')"
        required
        class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm"
      />

      <div class="flex gap-4">
        <input
          v-model="form.salaryMin"
          type="number"
          :placeholder="t('salary_min')"
          class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm w-full"
        />
        <input
          v-model="form.salaryMax"
          type="number"
          :placeholder="t('salary_max')"
          class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm w-full"
        />
      </div>

      <input
        v-model="form.posting_date"
        type="date"
        :placeholder="t('posting_date')"
        required
        class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm"
      />
      <input
        v-model="form.expiration_date"
        type="date"
        :placeholder="t('expiration_date')"
        required
        class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm"
      />

      <input
        v-model="form.company_name"
        :placeholder="t('company_name')"
        readonly
        class="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg text-sm text-gray-400"
      />

      <select
        v-model="form.status"
        required
        class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm"
      >
        <option value="active">{{ t('status_active') }}</option>
        <option value="scheduled">{{ t('status_scheduled') }}</option>
        <option value="expired">{{ t('status_expired') }}</option>
      </select>

      <textarea
        v-model="form.required_skills"
        :placeholder="t('required_skills_hint')"
        class="bg-black border border-gray-500 px-4 py-2 rounded-lg text-sm min-h-[100px]"
      ></textarea>

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
      >
        {{ t('update_job') }}
      </button>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </form>

    <LoadingSpinner v-else />
  </div>
</template>

<script setup lang="ts">
import { getJobDetail, updateJob } from '@/api/job'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
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
