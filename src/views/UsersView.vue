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
                  <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ t('users.title') }}</h1>
                  <p class="text-sm text-gray-500 mt-1">{{ t('users.description') }}</p>
                </div>
                <button 
                  @click="showAddModal = true"
                  class="flex items-center space-x-2 px-4 py-2.5 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="font-medium hidden sm:inline">{{ t('users.addNew') }}</span>
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
                    :placeholder="t('users.searchPlaceholder')"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                  />
                </div>

                <!-- Role Filter -->
                <select
                  v-model="roleFilter"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all bg-white"
                >
                  <option value="">{{ t('users.allRoles') }}</option>
                  <option value="USER">{{ t('users.roleUser') }}</option>
                  <option value="ADMIN">{{ t('users.roleAdmin') }}</option>
                </select>

                <!-- Status Filter -->
                <select
                  v-model="statusFilter"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all bg-white"
                >
                  <option value="">{{ t('users.allStatuses') }}</option>
                  <option value="true">{{ t('users.statusActive') }}</option>
                  <option value="false">{{ t('users.statusInactive') }}</option>
                </select>

                <!-- Sort By -->
                <select
                  v-model="sortBy"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all bg-white"
                >
                  <option value="name">{{ t('users.name') }}</option>
                  <option value="email">{{ t('users.email') }}</option>
                  <option value="role">{{ t('users.role') }}</option>
                  <option value="date">{{ t('users.createdAt') }}</option>
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

            <!-- Error State -->
            <div v-if="error" class="p-6">
              <div class="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm p-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-red-800">Unable to load users</h3>
                    <p class="text-sm text-red-700 mt-1">{{ error }}</p>
                    <button
                      @click="fetchUsers"
                      class="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Users Table -->
            <div v-else class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full table-fixed">
                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                      {{ t('users.nameEmail') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('users.role') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('users.status') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                      {{ t('users.createdAt') }}
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('users.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody v-if="loading" class="bg-white divide-y divide-gray-200">
                  <tr v-for="i in 5" :key="`skeleton-${i}`" class="hover:bg-gray-50">
                    <td class="px-4 py-3">
                      <div class="flex items-center space-x-3">
                        <SkeletonLoader width="40px" height="40px" custom-class="rounded-full" />
                        <div class="space-y-2">
                          <SkeletonLoader width="120px" height="16px" />
                          <SkeletonLoader width="180px" height="12px" />
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <SkeletonLoader width="70px" height="20px" custom-class="rounded-full" />
                    </td>
                    <td class="px-4 py-3">
                      <SkeletonLoader width="70px" height="20px" custom-class="rounded-full" />
                    </td>
                    <td class="px-4 py-3">
                      <div class="space-y-1">
                        <SkeletonLoader width="90px" height="14px" />
                        <SkeletonLoader width="70px" height="12px" />
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <SkeletonLoader width="100%" height="24px" />
                    </td>
                  </tr>
                </tbody>
                <tbody v-else class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="user in paginatedUsers"
                    :key="user.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <!-- Name & Email -->
                    <td class="px-4 py-3">
                      <div>
                        <div class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</div>
                        <div class="text-sm text-gray-500 truncate">{{ user.email }}</div>
                      </div>
                    </td>

                    <!-- Role -->
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span
                        :class="[
                          'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          user.globalRole === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        ]"
                      >
                        {{ user.globalRole === 'ADMIN' ? t('users.roleAdmin') : t('users.roleUser') }}
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span
                        :class="[
                          'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          user.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        ]"
                      >
                        {{ user.enabled ? t('users.enabled') : t('users.disabled') }}
                      </span>
                    </td>

                    <!-- Created At -->
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(user.createdAt) }}</div>
                      <div class="text-sm text-gray-500">{{ formatTime(user.createdAt) }}</div>
                    </td>

                    <!-- Actions -->
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end space-x-1">
                        <button
                          @click="viewUser(user)"
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          :title="t('users.view')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          @click="editUser(user)"
                          class="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          :title="t('users.edit')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="confirmDelete(user)"
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          :title="t('users.delete')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="filteredUsers.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center">
                      <div class="flex flex-col items-center justify-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">{{ t('users.emptyTitle') }}</h3>
                        <p class="text-sm text-gray-500">{{ t('users.emptyDescription') }}</p>
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
                    {{ t('places.pagination.of') }} {{ filteredUsers.length }} {{ t('places.pagination.entries') }}
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
              {{ t('users.deleteTitle') }}
            </h3>
            <p class="text-sm text-gray-600 mb-1">
              {{ t('users.confirmDelete') }}
            </p>
            <p class="text-sm font-semibold text-gray-900">
              "{{ userToDelete?.name }}"
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end space-x-3">
          <button
            @click="cancelDelete"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('places.delete.cancel') }}
          </button>
          <button
            @click="deleteUser"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg v-if="deleting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ deleting ? t('places.delete.deleting') : t('places.delete.confirm') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddUserModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @success="onUserAdded"
    />
    
    <EditUserModal
      v-if="selectedUserForEdit"
      :user="selectedUserForEdit"
      @close="selectedUserForEdit = null"
      @success="onUserUpdated"
    />
    
    <ViewUserModal
      v-if="selectedUserForView"
      :user="selectedUserForView"
      @close="selectedUserForView = null"
      @edit="editUser"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import AddUserModal from '@/components/AddUserModal.vue'
import EditUserModal from '@/components/EditUserModal.vue'
import ViewUserModal from '@/components/ViewUserModal.vue'
import apiClient from '@/utils/axios'

const { t, locale } = useI18n()

// Sidebar state
const sidebarOpen = ref(false)

// State
const users = ref([])
const loading = ref(false)
const error = ref(null)
const showAddModal = ref(false)
const selectedUserForEdit = ref(null)
const selectedUserForView = ref(null)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const sortBy = ref('date')
const sortDirection = ref('desc')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Delete modal
const showDeleteModal = ref(false)
const userToDelete = ref(null)
const deleting = ref(false)

// Debounce
let searchTimeout = null

// Fetch users
const fetchUsers = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      page: 0,
      size: 1000, // Fetch all for client-side pagination
      sort: 'createdAt,desc'
    }

    const response = await apiClient.get('/api/admin/users', { params })
    users.value = response.data.content || []
  } catch (err) {
    console.error('Error fetching users:', err)
    
    // Provide user-friendly error messages
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      error.value = 'Unable to connect to the server. Please check if the backend is running.'
    } else if (err.response) {
      error.value = err.response.data?.message || `Server error: ${err.response.status}`
    } else {
      error.value = err.message || 'An unexpected error occurred while loading users.'
    }
    
    users.value = []
  } finally {
    loading.value = false
  }
}

// Debounced search
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 300)
})

// Reset page on filter change
watch([roleFilter, statusFilter], () => {
  currentPage.value = 1
})

// Toggle sort direction
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

// Filtered users
const filteredUsers = computed(() => {
  let result = [...users.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    )
  }

  // Apply role filter
  if (roleFilter.value) {
    result = result.filter(user => user.globalRole === roleFilter.value)
  }

  // Apply status filter
  if (statusFilter.value !== '') {
    const enabled = statusFilter.value === 'true'
    result = result.filter(user => user.enabled === enabled)
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '')
        break
      case 'email':
        comparison = (a.email || '').localeCompare(b.email || '')
        break
      case 'role':
        comparison = (a.globalRole || '').localeCompare(b.globalRole || '')
        break
      case 'date':
        comparison = new Date(a.createdAt) - new Date(b.createdAt)
        break
    }

    return sortDirection.value === 'asc' ? comparison : -comparison
  })

  return result
})

// Paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const halfVisible = Math.floor(maxVisible / 2)
  
  let startPage = Math.max(1, currentPage.value - halfVisible)
  let endPage = Math.min(totalPages.value, currentPage.value + halfVisible)
  
  if (endPage - startPage < maxVisible - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages.value, maxVisible)
    } else {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// Helper functions
const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
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

// CRUD operations
const viewUser = (user) => {
  selectedUserForView.value = user
}

const editUser = (user) => {
  selectedUserForView.value = null
  selectedUserForEdit.value = user
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const cancelDelete = () => {
  if (!deleting.value) {
    userToDelete.value = null
    showDeleteModal.value = false
  }
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  deleting.value = true

  try {
    await apiClient.delete(`/api/admin/users/${userToDelete.value.id}`)
    await fetchUsers()
    showDeleteModal.value = false
    userToDelete.value = null
  } catch (err) {
    console.error('Error deleting user:', err)
    alert(err.response?.data?.message || t('users.deleteError'))
  } finally {
    deleting.value = false
  }
}

const onUserAdded = () => {
  showAddModal.value = false
  fetchUsers()
}

const onUserUpdated = () => {
  selectedUserForEdit.value = null
  fetchUsers()
}

// Pagination controls
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

onMounted(() => {
  fetchUsers()
})
</script>
