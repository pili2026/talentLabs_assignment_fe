<template>
  <div class="job-list-page">
    <h2>Job List</h2>

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
      <button type="submit">Search</button>
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
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getJobList } from '@/api/job'

const jobs = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const pagination = reactive({
  page: 1,
  page_size: 5,
  total: 0,
})

const filters = reactive({
  search: '',
  status: '',
  order_by: 'posting_date',
  sort_order: 'desc',
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
    Object.entries(rawParams).filter(([_, v]) => v !== '')
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

const nextPage = () => {
  if (pagination.page < totalPages.value) {
    pagination.page++
    loadJobs()
  }
}

const prevPage = () => {
  if (pagination.page > 1) {
    pagination.page--
    loadJobs()
  }
}

onMounted(loadJobs)
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
</style>
