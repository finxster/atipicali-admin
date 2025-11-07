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
                  <h1 class="text-2xl font-bold text-gray-900">{{ t('news.title') }}</h1>
                  <p class="text-sm text-gray-500 mt-1">{{ t('news.subtitle') }}</p>
                </div>
                <button 
                  @click="openAddModal"
                  class="flex items-center space-x-2 px-4 py-2.5 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="font-medium">{{ t('news.addNew') }}</span>
                </button>
              </div>

              <!-- Search Bar -->
              <div class="flex gap-3">
                <div class="flex-1 relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('news.searchPlaceholder')"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.title') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.author') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.readingTime') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.createdAt') }}
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="i in 5" :key="`skeleton-${i}`">
                    <td class="px-6 py-4">
                      <SkeletonLoader width="200px" height="16px" />
                    </td>
                    <td class="px-6 py-4">
                      <SkeletonLoader width="100px" height="14px" />
                    </td>
                    <td class="px-6 py-4">
                      <SkeletonLoader width="60px" height="14px" />
                    </td>
                    <td class="px-6 py-4">
                      <SkeletonLoader width="120px" height="14px" />
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex justify-end gap-2">
                        <SkeletonLoader width="32px" height="32px" custom-class="rounded-lg" />
                        <SkeletonLoader width="32px" height="32px" custom-class="rounded-lg" />
                        <SkeletonLoader width="32px" height="32px" custom-class="rounded-lg" />
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
                    <h3 class="text-sm font-medium text-red-800">{{ t('news.error.title') }}</h3>
                    <p class="text-sm text-red-700 mt-1">{{ error }}</p>
                    <button
                      @click="fetchNews"
                      class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      {{ t('news.error.retry') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Data Table -->
            <div v-else-if="filteredNews.length > 0" class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.title') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.author') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.readingTime') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.createdAt') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.image') }}
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {{ t('news.table.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="article in paginatedNews" :key="article.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ article.title }}</div>
                      <div class="text-xs text-gray-500 mt-1 line-clamp-2" v-html="article.summary"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ article.author }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-600">{{ article.readingTime }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-600">{{ formatDate(article.createdAt) }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-center">
                        <span
                          v-if="article.imageUrl && article.imageUrl.trim()"
                          class="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100 text-green-800"
                          :title="t('news.hasImage')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="text-xs font-medium">{{ t('news.hasImageLabel') }}</span>
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500"
                          :title="t('news.noImage')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="text-xs font-medium">{{ t('news.noImageLabel') }}</span>
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex justify-end gap-2">
                        <button
                          @click="viewArticle(article)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          :title="t('news.actions.view')"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          @click="editArticle(article)"
                          class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          :title="t('news.actions.edit')"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="confirmDelete(article)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          :title="t('news.actions.delete')"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-else class="flex-1 flex items-center justify-center">
              <div class="text-center py-12">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('news.emptyState.title') }}</h3>
                <p class="text-gray-500 mb-4">{{ t('news.emptyState.description') }}</p>
                <button
                  @click="openAddModal"
                  class="inline-flex items-center space-x-2 px-4 py-2 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{{ t('news.addNew') }}</span>
                </button>
              </div>
            </div>

            <!-- Pagination Section -->
            <div v-if="!loading && !error && filteredNews.length > 0" class="border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-700">{{ t('news.pagination.showing') }}</span>
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
                    {{ t('news.pagination.of') }} {{ filteredNews.length }} {{ t('news.pagination.entries') }}
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

    <!-- Modals -->
    <AddNewsModal 
      v-if="showAddModal" 
      @close="closeAddModal" 
      @news-added="handleNewsAdded"
      @error="handleError"
    />
    <EditNewsModal 
      v-if="showEditModal" 
      :article="selectedArticle"
      @close="closeEditModal" 
      @news-updated="handleNewsUpdated"
      @error="handleError"
    />
    <ViewNewsModal 
      v-if="showViewModal" 
      :article="selectedArticle"
      @close="closeViewModal"
      @edit="editArticle"
    />

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
              {{ t('news.delete.title') }}
            </h3>
            <p class="text-sm text-gray-600 mb-1">
              {{ t('news.delete.message') }}
            </p>
            <p class="text-sm font-semibold text-gray-900">
              "{{ articleToDelete?.title }}"
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end space-x-3">
          <button
            @click="cancelDelete"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('news.delete.cancel') }}
          </button>
          <button
            @click="deleteArticle"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg v-if="deleting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ deleting ? t('news.delete.deleting') : t('news.delete.confirm') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 z-50"
      >
        <div 
          :class="[
            'px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md',
            toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          ]"
        >
          <div class="flex-shrink-0">
            <svg v-if="toastType === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm font-medium">{{ toastMessage }}</p>
          <button
            @click="showToast = false"
            class="flex-shrink-0 ml-4 hover:opacity-80 transition-opacity"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import AddNewsModal from '@/components/AddNewsModal.vue'
import EditNewsModal from '@/components/EditNewsModal.vue'
import ViewNewsModal from '@/components/ViewNewsModal.vue'
import api from '@/utils/axios'

const { t } = useI18n()

// Search State
const searchQuery = ref('')

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(10)

// State
const news = ref([])
const loading = ref(true)
const error = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedArticle = ref(null)

// Delete State
const showDeleteModal = ref(false)
const articleToDelete = ref(null)
const deleting = ref(false)

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' or 'error'

// Computed
const filteredNews = computed(() => {
  if (!searchQuery.value) return news.value
  
  const query = searchQuery.value.toLowerCase()
  return news.value.filter(article => 
    article.title?.toLowerCase().includes(query) ||
    article.author?.toLowerCase().includes(query) ||
    article.summary?.toLowerCase().includes(query)
  )
})

// Computed: Paginated News
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredNews.value.slice(start, end)
})

// Computed: Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredNews.value.length / itemsPerPage.value)
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

const showToastNotification = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const fetchNews = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await api.get('/api/news')
    news.value = response.data
  } catch (err) {
    console.error('Error fetching news:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to fetch news'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const handleNewsAdded = () => {
  closeAddModal()
  fetchNews()
  showToastNotification(t('news.addSuccess'))
}

const viewArticle = (article) => {
  selectedArticle.value = article
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedArticle.value = null
}

const editArticle = (article) => {
  selectedArticle.value = article
  showViewModal.value = false
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedArticle.value = null
}

const handleNewsUpdated = () => {
  closeEditModal()
  fetchNews()
  showToastNotification(t('news.updateSuccess'))
}

const handleError = (errorMessage) => {
  showToastNotification(errorMessage, 'error')
}

const confirmDelete = (article) => {
  articleToDelete.value = article
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  articleToDelete.value = null
}

const deleteArticle = async () => {
  if (!articleToDelete.value) {
    return
  }
  
  deleting.value = true
  
  try {
    await api.delete(`/api/news/${articleToDelete.value.id}`)
    
    // Store the title for the success message
    const deletedArticleTitle = articleToDelete.value.title
    
    // Remove from local array
    news.value = news.value.filter(a => a.id !== articleToDelete.value.id)
    
    // Close modal
    showDeleteModal.value = false
    articleToDelete.value = null
    
    // Show success message
    showToastNotification(t('news.deleteSuccess'))
  } catch (error) {
    console.error('Error deleting news:', error)
    showToastNotification(t('news.errors.deleteFailed'), 'error')
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchNews()
})

// Watchers - Reset to page 1 when search or items per page changes
watch([searchQuery, itemsPerPage], () => {
  currentPage.value = 1
})
</script>
