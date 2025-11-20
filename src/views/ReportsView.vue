<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    
    <div class="flex">
      <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
      
      <main class="flex-1 p-3 sm:p-4 lg:p-6">
        <div class="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ t('reports.title') }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ t('reports.description') }}</p>
          </div>

          <!-- Status Filter Tabs -->
          <div class="mb-6 border-b border-gray-200">
            <nav class="flex space-x-8" aria-label="Tabs">
              <button
                v-for="status in statusFilters"
                :key="status.value"
                @click="currentStatus = status.value"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  currentStatus === status.value
                    ? 'border-atipical-blue text-atipical-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ status.label }}
                <span
                  v-if="status.count !== undefined"
                  :class="[
                    'ml-2 py-0.5 px-2.5 rounded-full text-xs',
                    currentStatus === status.value
                      ? 'bg-blue-100 text-atipical-blue'
                      : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ status.count }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Error State -->
          <div v-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm p-4 mb-6">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-medium text-red-800">{{ t('reports.errorTitle') }}</h3>
                <p class="text-sm text-red-700 mt-1">{{ error }}</p>
                <button
                  @click="fetchReports"
                  class="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-lg transition-colors"
                >
                  {{ t('reports.retry') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="space-y-4">
            <SkeletonLoader v-for="i in 5" :key="i" width="100%" height="120px" />
          </div>

          <!-- Empty State -->
          <div v-else-if="!error && reports.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-12 h-12 text-atipical-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('reports.emptyTitle') }}</h3>
            <p class="text-sm text-gray-500">{{ t('reports.emptyDescription') }}</p>
          </div>

          <!-- Reports Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('reports.place') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('reports.reportType') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('reports.reportedBy') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('reports.date') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('reports.status') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('reports.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="report in reports"
                  :key="report.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <!-- Place Name -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ report.placeName || t('reports.unknownPlace') }}
                        </div>
                        <div class="text-sm text-gray-500">
                          ID: {{ report.placeId }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Report Type -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getReportTypeClass(report.reportType)
                      ]"
                    >
                      {{ getReportTypeLabel(report.reportType) }}
                    </span>
                  </td>

                  <!-- Reported By -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ report.userName || t('reports.anonymous') }}</div>
                    <div class="text-sm text-gray-500">{{ report.userEmail || '-' }}</div>
                  </td>

                  <!-- Date -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(report.createdAt) }}</div>
                    <div class="text-sm text-gray-500">{{ formatTime(report.createdAt) }}</div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getStatusClass(report.status)
                      ]"
                    >
                      {{ getStatusLabel(report.status) }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="openReportModal(report)"
                      :class="[
                        'inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium',
                        report.status === 'PENDING' || report.status === 'UNDER_REVIEW'
                          ? 'bg-atipical-blue text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      ]"
                    >
                      <!-- Magnifying glass for review states -->
                      <svg v-if="report.status === 'PENDING' || report.status === 'UNDER_REVIEW'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <!-- Eye for final states -->
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {{ report.status === 'PENDING' || report.status === 'UNDER_REVIEW' ? t('reports.review') : t('reports.view') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && !error && totalPages > 1" class="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div class="text-sm text-gray-700">
              {{ t('reports.showing') }} {{ (currentPage * pageSize) + 1 }} - {{ Math.min((currentPage + 1) * pageSize, totalReports) }} {{ t('reports.of') }} {{ totalReports }}
            </div>
            <div class="flex space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 0"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ t('reports.previous') }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage >= totalPages - 1"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ t('reports.next') }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- View Report Modal -->
    <ViewReportModal
      v-if="selectedReport"
      :report="selectedReport"
      @close="selectedReport = null"
      @updated="onReportUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import ViewReportModal from '@/components/ViewReportModal.vue'
import apiClient from '@/utils/axios'

const { t, locale } = useI18n()

// Sidebar state
const sidebarOpen = ref(false)

const reports = ref([])
const loading = ref(false)
const error = ref(null)
const selectedReport = ref(null)
const currentStatus = ref('PENDING')
const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalReports = ref(0)

// Status counts
const statusCounts = ref({
  PENDING: 0,
  UNDER_REVIEW: 0,
  RESOLVED: 0,
  REJECTED: 0
})

const statusFilters = computed(() => [
  { value: 'PENDING', label: t('reports.statusPending'), count: statusCounts.value.PENDING },
  { value: 'UNDER_REVIEW', label: t('reports.statusUnderReview'), count: statusCounts.value.UNDER_REVIEW },
  { value: 'RESOLVED', label: t('reports.statusResolved'), count: statusCounts.value.RESOLVED },
  { value: 'REJECTED', label: t('reports.statusRejected'), count: statusCounts.value.REJECTED }
])

const fetchReports = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await apiClient.get('/api/admin/reports', {
      params: {
        status: currentStatus.value,
        page: currentPage.value,
        size: pageSize.value
      }
    })

    reports.value = response.data.content || []
    totalPages.value = response.data.totalPages || 0
    totalReports.value = response.data.totalElements || 0
  } catch (err) {
    console.error('Error fetching reports:', err)
    error.value = err.response?.data?.message || t('reports.errorMessage')
  } finally {
    loading.value = false
  }
}

const fetchStatusCounts = async () => {
  try {
    const response = await apiClient.get('/api/admin/reports/stats')
    // Map camelCase response to UPPER_SNAKE_CASE
    const data = response.data
    statusCounts.value = {
      PENDING: data.pending || 0,
      UNDER_REVIEW: data.underReview || 0,
      RESOLVED: data.resolved || 0,
      REJECTED: data.rejected || 0
    }
  } catch (err) {
    console.error('Error fetching status counts:', err)
  }
}

const getReportTypeLabel = (type) => {
  const labels = {
    'INCORRECT_INFO': t('reports.typeIncorrectInfo'),
    'HARMFUL_CONTENT': t('reports.typeHarmfulContent'),
    'CLOSED': t('reports.typeClosed'),
    'SPAM': t('reports.typeSpam'),
    'OTHER': t('reports.typeOther')
  }
  return labels[type] || type
}

const getReportTypeClass = (type) => {
  const classes = {
    'INCORRECT_INFO': 'bg-yellow-100 text-yellow-800',
    'HARMFUL_CONTENT': 'bg-red-100 text-red-800',
    'CLOSED': 'bg-gray-100 text-gray-800',
    'SPAM': 'bg-orange-100 text-orange-800',
    'OTHER': 'bg-blue-100 text-blue-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': t('reports.statusPending'),
    'UNDER_REVIEW': t('reports.statusUnderReview'),
    'RESOLVED': t('reports.statusResolved'),
    'REJECTED': t('reports.statusRejected')
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
    'RESOLVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openReportModal = (report) => {
  selectedReport.value = report
}

const onReportUpdated = () => {
  selectedReport.value = null
  fetchReports()
  fetchStatusCounts()
}

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

// Watch for status filter changes
watch(currentStatus, () => {
  currentPage.value = 0
  fetchReports()
})

// Watch for page changes
watch(currentPage, () => {
  fetchReports()
})

onMounted(() => {
  fetchReports()
  fetchStatusCounts()
})
</script>
