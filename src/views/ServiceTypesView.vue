<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    
    <div class="flex flex-1">
      <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
      
      <main class="flex-1 p-3 sm:p-4 lg:p-6 flex flex-col">
        <div class="flex-1 flex flex-col">
          <!-- Main content card wrapper -->
          <div class="h-full bg-white rounded-xl shadow-lg flex flex-col">
            <!-- Header Section -->
            <div class="border-b border-gray-200 p-3 sm:p-4 lg:p-6 flex-shrink-0">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ t('serviceTypes.title') }}</h1>
                  <p class="text-sm text-gray-500 mt-1">{{ t('serviceTypes.subtitle') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <button 
                    @click="openAddModal"
                    class="flex items-center space-x-2 px-4 py-2.5 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="font-medium hidden sm:inline">{{ t('serviceTypes.addNew') }}</span>
                  </button>
                </div>
              </div>

              <!-- Search and Sort Bar -->
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
                    :placeholder="t('serviceTypes.searchPlaceholder')"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                  />
                </div>

                <!-- Sort By -->
                <select
                  v-model="sortBy"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all bg-white"
                >
                  <option value="namePt">{{ t('serviceTypes.sortBy.namePt') }}</option>
                  <option value="nameEn">{{ t('serviceTypes.sortBy.nameEn') }}</option>
                  <option value="date">{{ t('serviceTypes.sortBy.date') }}</option>
                </select>

                <!-- Sort Direction -->
                <button
                  @click="toggleSortDirection"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                  :title="sortDirection === 'asc' ? t('serviceTypes.ascending') : t('serviceTypes.descending')"
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
            <div v-if="loading" class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full table-fixed">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                      {{ t('serviceTypes.table.namePt') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                      {{ t('serviceTypes.table.nameEn') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('serviceTypes.table.id') }}
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                      {{ t('serviceTypes.table.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="i in 5" :key="`skeleton-${i}`" class="hover:bg-gray-50">
                    <!-- Name PT -->
                    <td class="px-4 py-3">
                      <SkeletonLoader width="180px" height="16px" />
                    </td>
                    
                    <!-- Name EN -->
                    <td class="px-4 py-3">
                      <SkeletonLoader width="180px" height="16px" />
                    </td>
                    
                    <!-- ID -->
                    <td class="px-4 py-3">
                      <SkeletonLoader width="80px" height="14px" />
                    </td>
                    
                    <!-- Actions -->
                    <td class="px-4 py-3">
                      <div class="flex justify-end space-x-2">
                        <SkeletonLoader width="32px" height="32px" />
                        <SkeletonLoader width="32px" height="32px" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-6">
              <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-red-800">{{ t('serviceTypes.error.title') }}</h3>
                    <p class="text-sm text-red-700 mt-1">{{ error }}</p>
                    <button
                      @click="fetchServiceTypes"
                      class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      {{ t('serviceTypes.error.retry') }}
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
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                      {{ t('serviceTypes.table.namePt') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                      {{ t('serviceTypes.table.nameEn') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('serviceTypes.table.id') }}
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                      {{ t('serviceTypes.table.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="serviceType in paginatedServiceTypes"
                    :key="serviceType.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <!-- Name PT -->
                    <td class="px-4 py-3">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ serviceType.namePt }}</p>
                    </td>

                    <!-- Name EN -->
                    <td class="px-4 py-3">
                      <p class="text-sm text-gray-700 truncate">{{ serviceType.nameEn }}</p>
                    </td>

                    <!-- ID -->
                    <td class="px-4 py-3">
                      <p class="text-xs text-gray-500 font-mono truncate">{{ serviceType.id.substring(0, 8) }}...</p>
                    </td>

                    <!-- Actions -->
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end space-x-1">
                        <button
                          @click="editServiceType(serviceType)"
                          class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          :title="t('serviceTypes.actions.edit')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="confirmDelete(serviceType)"
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          :title="t('serviceTypes.actions.delete')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="paginatedServiceTypes.length === 0">
                    <td colspan="4" class="px-6 py-12 text-center">
                      <div class="flex flex-col items-center justify-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">{{ t('serviceTypes.empty.title') }}</h3>
                        <p class="text-sm text-gray-500">{{ t('serviceTypes.empty.description') }}</p>
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
                  <span class="text-sm text-gray-700">{{ t('serviceTypes.pagination.showing') }}</span>
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
                    {{ t('serviceTypes.pagination.of') }} {{ filteredServiceTypes.length }} {{ t('serviceTypes.pagination.entries') }}
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

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ t('serviceTypes.delete.title') }}
            </h3>
            <p class="text-sm text-gray-600 mb-1">
              {{ t('serviceTypes.delete.message') }}
            </p>
            <p class="text-sm font-semibold text-gray-900">
              "{{ serviceTypeToDelete?.namePt }}" / "{{ serviceTypeToDelete?.nameEn }}"
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end space-x-3">
          <button
            @click="cancelDelete"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('serviceTypes.delete.cancel') }}
          </button>
          <button
            @click="deleteServiceType"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg v-if="deleting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ deleting ? t('serviceTypes.delete.deleting') : t('serviceTypes.delete.confirm') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-6 right-6 z-50"
      >
        <div class="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm font-medium">{{ successMessage }}</p>
          <button
            @click="showSuccessMessage = false"
            class="flex-shrink-0 ml-4 text-white hover:text-green-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Add Service Type Modal -->
    <AddServiceTypeModal
      :is-open="showAddModal"
      @close="closeAddModal"
      @success="handleServiceTypeAdded"
    />

    <!-- Edit Service Type Modal -->
    <EditServiceTypeModal
      :is-open="showEditModal"
      :service-type="selectedServiceType"
      @close="closeEditModal"
      @success="handleServiceTypeUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import AddServiceTypeModal from '@/components/AddServiceTypeModal.vue'
import EditServiceTypeModal from '@/components/EditServiceTypeModal.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import apiClient from '@/utils/axios'

const { t } = useI18n()

// Sidebar state
const sidebarOpen = ref(false)

// Search and Filter State
const searchQuery = ref('')
const sortBy = ref('namePt')
const sortDirection = ref('asc')

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Data State
const serviceTypes = ref([])
const loading = ref(false)
const error = ref(null)

// Delete State
const showDeleteModal = ref(false)
const serviceTypeToDelete = ref(null)
const deleting = ref(false)

// Add Modal State
const showAddModal = ref(false)

// Edit Modal State
const showEditModal = ref(false)

// Selected Service Type State
const selectedServiceType = ref(null)

// Success notification
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Fetch service types from API
const fetchServiceTypes = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/api/admin/service-types')
    serviceTypes.value = response.data
  } catch (err) {
    error.value = err.message || 'Failed to fetch service types'
    console.error('Error fetching service types:', err)
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchServiceTypes()
})

// Delete Functions
const confirmDelete = (serviceType) => {
  serviceTypeToDelete.value = serviceType
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  serviceTypeToDelete.value = null
}

const deleteServiceType = async () => {
  if (!serviceTypeToDelete.value) {
    return
  }
  
  deleting.value = true
  
  try {
    await apiClient.delete(`/api/admin/service-types/${serviceTypeToDelete.value.id}`)
    
    // Store the name for the success message
    const deletedName = serviceTypeToDelete.value.namePt
    
    // Remove from local array
    serviceTypes.value = serviceTypes.value.filter(st => st.id !== serviceTypeToDelete.value.id)
    
    // Close modal
    showDeleteModal.value = false
    serviceTypeToDelete.value = null
    
    // Show success message
    successMessage.value = t('serviceTypes.delete.success', { name: deletedName })
    showSuccessMessage.value = true
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
  } catch (err) {
    console.error('Error deleting service type:', err)
    error.value = err.response?.data?.message || 'Failed to delete service type'
  } finally {
    deleting.value = false
  }
}

// Computed: Filtered Service Types
const filteredServiceTypes = computed(() => {
  let result = [...serviceTypes.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(serviceType =>
      serviceType.namePt.toLowerCase().includes(query) ||
      serviceType.nameEn.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'namePt':
        comparison = a.namePt.localeCompare(b.namePt)
        break
      case 'nameEn':
        comparison = a.nameEn.localeCompare(b.nameEn)
        break
      case 'date':
        comparison = a.id.localeCompare(b.id)
        break
    }

    return sortDirection.value === 'asc' ? comparison : -comparison
  })

  return result
})

// Computed: Paginated Service Types
const paginatedServiceTypes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredServiceTypes.value.slice(start, end)
})

// Computed: Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredServiceTypes.value.length / itemsPerPage.value)
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

// Add Modal Functions
const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const handleServiceTypeAdded = (newServiceType) => {
  // Add the new service type to the beginning of the list
  serviceTypes.value.unshift(newServiceType)
  
  // Show success message
  successMessage.value = t('serviceTypes.add.successMessage', { name: newServiceType.namePt })
  showSuccessMessage.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
  
  // Reset to first page to show the new service type
  currentPage.value = 1
}

// Edit Modal Functions
const editServiceType = (serviceType) => {
  selectedServiceType.value = serviceType
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedServiceType.value = null
}

const handleServiceTypeUpdated = (updatedServiceType) => {
  // Find and update the service type in the list
  const index = serviceTypes.value.findIndex(st => st.id === updatedServiceType.id)
  if (index !== -1) {
    serviceTypes.value[index] = updatedServiceType
  }
  
  // Show success message
  successMessage.value = t('serviceTypes.edit.successMessage', { name: updatedServiceType.namePt })
  showSuccessMessage.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}
</script>
