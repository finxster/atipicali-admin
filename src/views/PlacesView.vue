<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="flex flex-1">
      <Sidebar />
      
      <main class="flex-1 p-6 flex flex-col">
        <div class="flex-1 flex flex-col">
          <!-- Main content card wrapper -->
          <div class="h-full bg-white rounded-xl shadow-lg flex flex-col">
            <!-- Header Section -->
            <div class="border-b border-gray-200 p-6 flex-shrink-0">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">{{ t('places.title') }}</h1>
                  <p class="text-sm text-gray-500 mt-1">{{ t('places.subtitle') }}</p>
                </div>
                <button class="flex items-center space-x-2 px-4 py-2.5 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="font-medium">{{ t('places.addNew') }}</span>
                </button>
              </div>

              <!-- Search and Filter Bar -->
              <div class="flex flex-col md:flex-row gap-3">
                <!-- Search Input -->
                <div class="flex-1 relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('places.searchPlaceholder')"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                  />
                </div>

                <!-- Status Filter -->
                <select
                  v-model="statusFilter"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all bg-white"
                >
                  <option value="">{{ t('places.allStatuses') }}</option>
                  <option value="PENDING">{{ t('places.status.PENDING') }}</option>
                  <option value="CHANGES_REQUESTED">{{ t('places.status.CHANGES_REQUESTED') }}</option>
                  <option value="APPROVED">{{ t('places.status.APPROVED') }}</option>
                  <option value="REJECTED">{{ t('places.status.REJECTED') }}</option>
                </select>

                <!-- Sort By -->
                <select
                  v-model="sortBy"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all bg-white"
                >
                  <option value="name">{{ t('places.sortBy.name') }}</option>
                  <option value="rating">{{ t('places.sortBy.rating') }}</option>
                  <option value="status">{{ t('places.sortBy.status') }}</option>
                  <option value="date">{{ t('places.sortBy.date') }}</option>
                </select>

                <!-- Sort Direction -->
                <button
                  @click="toggleSortDirection"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                  :title="sortDirection === 'asc' ? t('places.ascending') : t('places.descending')"
                >
                  <svg
                    class="w-5 h-5 text-gray-600 transition-transform"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center space-y-3">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-atipical-blue"></div>
                <p class="text-sm text-gray-500">{{ t('places.loading') }}</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-6">
              <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-red-800">{{ t('places.error.title') }}</h3>
                    <p class="text-sm text-red-700 mt-1">{{ error }}</p>
                    <button
                      @click="fetchPlaces"
                      class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      {{ t('places.error.retry') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Table Section -->
            <div v-else class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full table-fixed">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                      {{ t('places.table.name') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                      {{ t('places.table.address') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('places.table.status') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('places.table.rating') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                      {{ t('places.table.image') }}
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                      {{ t('places.table.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="place in paginatedPlaces"
                    :key="place.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <!-- Name & Description -->
                    <td class="px-4 py-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900 truncate">{{ place.name }}</p>
                        <p class="text-xs text-gray-500 truncate" :title="place.description">
                          {{ place.description.length > 50 ? place.description.substring(0, 50) + '...' : place.description }}
                        </p>
                      </div>
                    </td>

                    <!-- Address -->
                    <td class="px-4 py-3">
                      <p class="text-sm text-gray-700 truncate" :title="place.address">{{ place.address }}</p>
                    </td>

                    <!-- Status -->
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                        :class="getStatusClass(place.status)"
                      >
                        <span
                          class="w-1.5 h-1.5 rounded-full mr-1"
                          :class="getStatusDotClass(place.status)"
                        ></span>
                        {{ t(`places.status.${place.status}`) }}
                      </span>
                    </td>

                    <!-- Rating -->
                    <td class="px-4 py-3">
                      <div class="flex items-center space-x-0.5">
                        <svg
                          v-for="star in 5"
                          :key="star"
                          class="w-4 h-4"
                          :class="star <= place.rating ? 'text-yellow-400' : 'text-gray-300'"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span class="text-sm font-medium text-gray-700 ml-1">{{ place.rating }}</span>
                      </div>
                    </td>

                    <!-- Image -->
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-center">
                        <span
                          v-if="place.hasImage"
                          class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800"
                          :title="t('places.hasImage')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400"
                          :title="t('places.noImage')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end space-x-1">
                        <button
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          :title="t('places.actions.view')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          :title="t('places.actions.edit')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          :title="t('places.actions.delete')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="paginatedPlaces.length === 0">
                    <td colspan="6" class="px-6 py-12 text-center">
                      <div class="flex flex-col items-center justify-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">{{ t('places.empty.title') }}</h3>
                        <p class="text-sm text-gray-500">{{ t('places.empty.description') }}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Section -->
            <div class="border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-700">{{ t('places.pagination.showing') }}</span>
                  <select
                    v-model.number="itemsPerPage"
                    class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent text-sm"
                  >
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                  </select>
                  <span class="text-sm text-gray-700">
                    {{ t('places.pagination.of') }} {{ filteredPlaces.length }} {{ t('places.pagination.entries') }}
                  </span>
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div class="flex items-center space-x-1">
                    <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="currentPage = page"
                      class="px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      :class="currentPage === page
                        ? 'bg-atipical-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'"
                    >
                      {{ page }}
                    </button>
                  </div>

                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import apiClient from '@/utils/axios'

const { t } = useI18n()

// Search and Filter State
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('name')
const sortDirection = ref('asc')

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Data State
const places = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch places from API
const fetchPlaces = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/api/places')
    places.value = response.data
  } catch (err) {
    error.value = err.message || 'Failed to fetch places'
    console.error('Error fetching places:', err)
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchPlaces()
})

// Computed: Filtered Places
const filteredPlaces = computed(() => {
  let result = [...places.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(place =>
      place.name.toLowerCase().includes(query) ||
      place.description.toLowerCase().includes(query) ||
      place.address.toLowerCase().includes(query) ||
      place.comment.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(place => place.status === statusFilter.value)
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'rating':
        comparison = a.rating - b.rating
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'date':
        comparison = a.id - b.id
        break
    }

    return sortDirection.value === 'asc' ? comparison : -comparison
  })

  return result
})

// Computed: Paginated Places
const paginatedPlaces = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPlaces.value.slice(start, end)
})

// Computed: Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredPlaces.value.length / itemsPerPage.value)
})

// Computed: Visible Pages for Pagination
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 5

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(total)
    }
  }

  return pages
})

// Methods
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const getStatusClass = (status) => {
  const classes = {
    APPROVED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CHANGES_REQUESTED: 'bg-orange-100 text-orange-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status) => {
  const classes = {
    APPROVED: 'bg-green-500',
    PENDING: 'bg-yellow-500',
    CHANGES_REQUESTED: 'bg-orange-500',
    REJECTED: 'bg-red-500'
  }
  return classes[status] || 'bg-gray-500'
}
</script>
