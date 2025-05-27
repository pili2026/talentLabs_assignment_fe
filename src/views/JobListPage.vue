<template>
  <div class="min-h-screen bg-black text-white">
    <main class="px-6 py-8 max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">{{ t('job_list') }}</h2>

      <div class="flex justify-between items-center mb-4">
        <router-link to="/job/create">
          <button class="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg text-sm">
            {{ t('create_job') }}
          </button>
        </router-link>

        <select v-model="$i18n.locale" class="border border-gray-500 bg-black px-3 py-2 rounded-lg text-sm">
          <option value="zh-TW">繁體中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <form @submit.prevent="loadJobs" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-end">
        <input
          v-model="filters.search"
          :placeholder="t('search')"
          class="border border-gray-500 bg-black px-4 py-2 rounded-lg text-sm col-span-1"
        />

        <select v-model="filters.status" class="border border-gray-500 bg-black px-3 py-2 rounded-lg text-sm col-span-1">
          <option value="">{{ t('status') }}</option>
          <option value="active">active</option>
          <option value="expired">expired</option>
          <option value="scheduled">scheduled</option>
        </select>

        <div class="flex gap-2 col-span-1">
          <select v-model="filters.order_by" class="border border-gray-500 bg-black px-3 py-2 rounded-lg text-sm w-full">
            <option value="posting_date">{{ t('posting_date') }}</option>
            <option value="expiration_date">{{ t('expiration_date') }}</option>
          </select>
          <select v-model="filters.sort_order" class="border border-gray-500 bg-black px-3 py-2 rounded-lg text-sm w-full">
            <option value="desc">{{ t('sort_desc') }}</option>
            <option value="asc">{{ t('sort_asc') }}</option>
          </select>
        </div>

        <div class="lg:col-span-3">
          <label class="block mb-2 font-semibold">{{ t('required_skills') }}:</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="skill in availableSkills"
              :key="skill"
              class="skill-option flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg border border-gray-600 text-sm"
            >
              <input type="checkbox" :value="skill" v-model="filters.skills" class="accent-blue-500" />
              <span>{{ skill }}</span>
            </label>
          </div>
        </div>

        <div class="flex gap-3 lg:col-span-3">
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm">
            {{ t('search') }}
          </button>
          <button type="button" @click="resetFilters" class="border border-gray-500 px-5 py-2 rounded-lg text-sm">
            {{ t('clear') }}
          </button>
        </div>
      </form>

      <div v-if="pagination.total > 0" class="flex items-center gap-4 mb-6">
        <button :disabled="pagination.page <= 1" @click="prevPage" class="px-4 py-2 border rounded-lg text-sm">
          {{ t('prev') }}
        </button>
        <span class="text-sm">Page {{ pagination.page }} / {{ totalPages }}</span>
        <button :disabled="pagination.page >= totalPages" @click="nextPage" class="px-4 py-2 border rounded-lg text-sm">
          {{ t('next') }}
        </button>
      </div>

      <LoadingSpinner v-if="loading" />
      <div v-else-if="error" class="text-red-500">{{ error }}</div>

      <ul v-else class="space-y-6">
        <li v-for="job in jobs" :key="job.id" class="job-item border-b border-gray-700 pb-4">
          <h3 class="text-xl font-semibold">{{ job.title }}</h3>
          <p><strong>{{ t('company_name') }}:</strong> {{ job.company_name }}</p>
          <p><strong>{{ t('location') }}:</strong> {{ job.location }}</p>
          <p><strong>{{ t('status') }}:</strong> {{ job.status }}</p>
          <p><strong>{{ t('posting_date') }}:</strong> {{ job.posting_date }}</p>

          <div class="actions mt-3 flex gap-3">
            <router-link :to="`/job/edit/${job.id}`">
              <button class="border border-gray-500 px-4 py-2 rounded-lg text-sm">{{ t('edit') }}</button>
            </router-link>
            <button @click="confirmDelete(job.id)" class="border border-gray-500 px-4 py-2 rounded-lg text-sm">
              {{ t('delete') }}
            </button>
            <router-link :to="`/job/${job.id}`">
              <button class="border border-gray-500 px-4 py-2 rounded-lg text-sm">{{ t('detail') }}</button>
            </router-link>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>



<script setup lang="ts">
import { deleteJob, getJobList, getSkillList } from '@/api/job'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'


const { t, locale } = useI18n()
const jobs = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const route = useRoute()
const router = useRouter()

const filters = reactive({
  search: route.query.search || '',
  status: route.query.status || '',
  order_by: route.query.order_by || 'posting_date',
  sort_order: route.query.sort_order || 'desc',
  skills: (Array.isArray(route.query.skills)
    ? route.query.skills
    : route.query.skills
    ? [route.query.skills]
    : []) as string[],
})

const pagination = reactive({
  page: parseInt(route.query.page as string) || 1,
  page_size: 5,
  total: 0,
})

const totalPages = computed(() =>
  Math.ceil(pagination.total / pagination.page_size)
)

const loadJobs = async () => {
  loading.value = true
  error.value = ''
  try {
    const rawParams = {
      ...filters,
      page: pagination.page,
      page_size: pagination.page_size,
    }

    const cleanedParams = Object.fromEntries(
      Object.entries(rawParams).filter(
        ([_, v]) => v !== '' && !(Array.isArray(v) && v.length === 0)
      )
    )

    const res = await getJobList(cleanedParams)

    jobs.value = res.list
    pagination.total = res.total
  } catch (e) {
    error.value = 'Failed to load jobs.'
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (jobId: string) => {
  const confirmed = window.confirm('Are you sure you want to delete this job?')
  if (!confirmed) return

  try {
    await deleteJob(jobId)
    await loadJobs()
  } catch (err) {
    error.value = 'Failed to delete job.'
  }
}


const nextPage = () => {
  if (pagination.page < totalPages.value) {
    pagination.page++
  }
}

const prevPage = () => {
  if (pagination.page > 1) {
    pagination.page--
  }
}

const availableSkills = ref<string[]>([])
const skillsLoading = ref(false)


const loadSkills = async () => {
  availableSkills.value = await getSkillList()
}

const resetFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.order_by = 'posting_date'
  filters.sort_order = 'desc'
  filters.skills = []
  pagination.page = 1
}

onMounted(() => {
  loadSkills().then(() => {
    console.log('--- Debug Skills ---')
    console.log('skills value =', availableSkills.value)
    console.log('typeof =', typeof availableSkills.value)
    console.log('Array.isArray =', Array.isArray(availableSkills.value))
    console.log('first item =', availableSkills.value[0])
  })
  loadJobs()
})

watch(
  () => ({ ...filters }),
  () => {
    pagination.page = 1
    loadJobs()
  },
  { deep: true }
)

watch(
  () => pagination.page,
  () => {
    loadJobs()
  }
)

watch(
  () => pagination.page_size,
  () => {
    pagination.page = 1
    loadJobs()
  }
)

watch(
  [() => ({ ...filters }), () => pagination.page],
  () => {
    const query = {
      ...filters,
      page: pagination.page,
    }

    router.replace({ query })
  },
  { deep: true }
)

watch(locale, (newLocale) => {
  localStorage.setItem('locale', newLocale)
})

</script>

<style scoped>
.job-list-page {
  max-width: 800px;
  margin: 2rem auto;
}
.filter-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.pagination {
  margin: 1rem 0;
}
.job-item {
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}
.error {
  color: red;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.create-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.create-button:hover {
  background-color: #0056b3;
}
.actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}
.filter-form select[multiple] {
  min-width: 160px;
  min-height: 80px;
  padding: 0.25rem;
  background-color: #fff;
  color: #000;
  border-radius: 4px;
}

.filter-form label {
  font-size: 0.9rem;
  margin-right: 0.5rem;
  color: #ccc;
}

.filter-form > * {
  margin-bottom: 0.5rem;
}

.skills-filter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.skill-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #2c2c2c;
  color: #f8f8f8;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #555;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.skill-option:hover {
  background-color: #3d3d3d;
}

.skill-option input[type='checkbox'] {
  accent-color: #4caf50;
}

.skill-option input:checked + span {
  font-weight: bold;
  color: #90ee90;
}

</style>
