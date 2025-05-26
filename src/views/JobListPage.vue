<template>
  <div class="job-list-page">
    <h2>Job List</h2>

    <div class="toolbar">
      <router-link to="/job/create">
        <button class="create-button">Create New Job</button>
      </router-link>
    </div>

    <form @submit.prevent="loadJobs" class="filter-form">
      <input v-model="filters.search" placeholder="Search..." />

      <select v-model="filters.status">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
        <option value="scheduled">Scheduled</option>
      </select>

      <select v-model="filters.order_by">
        <option value="posting_date">Posting Date</option>
        <option value="expiration_date">Expiration Date</option>
      </select>

      <select v-model="filters.sort_order">
        <option value="desc">DESC</option>
        <option value="asc">ASC</option>
      </select>

      <div class="skill-checkbox-group">
        <label>Skills:</label>
        <div class="skills-list">
          <label v-for="skill in availableSkills" :key="skill" class="skill-option">
            <input
              type="checkbox"
              :value="skill"
              v-model="filters.skills"
            />
            {{ skill }}
          </label>
        </div>
      </div>

      <button type="submit">Search</button>
      <button type="button" @click="resetFilters">Clear</button>
    </form>

    <div v-if="pagination.total > 0" class="pagination">
      <button :disabled="pagination.page <= 1" @click="prevPage">Prev</button>
      <span>Page {{ pagination.page }} / {{ totalPages }}</span>
      <button :disabled="pagination.page >= totalPages" @click="nextPage">Next</button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="job in jobs" :key="job.id" class="job-item">
        <h3>{{ job.title }}</h3>
        <p><strong>Company:</strong> {{ job.company_name }}</p>
        <p><strong>Location:</strong> {{ job.location }}</p>
        <p><strong>Status:</strong> {{ job.status }}</p>
        <p><strong>Posted:</strong> {{ job.posting_date }}</p>

        <div class="actions">
          <router-link :to="`/job/edit/${job.id}`">
            <button>Edit</button>
          </router-link>
          <button @click="confirmDelete(job.id)">Delete</button>
          <router-link :to="`/job/${job.id}`">
            <button>Detail</button>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { deleteJob, getJobList, getSkillList } from '@/api/job'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'


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
