<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    
    <div class="flex">
      <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
      
      <main class="flex-1 p-3 sm:p-4 lg:p-6">
        <div class="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ t('pendingPlaces.title') }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ t('pendingPlaces.description') }}</p>
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
                <h3 class="text-sm font-medium text-red-800">{{ t('pendingPlaces.errorTitle') }}</h3>
                <p class="text-sm text-red-700 mt-1">{{ error }}</p>
                <button
                  @click="fetchPendingPlaces"
                  class="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-lg transition-colors"
                >
                  {{ t('pendingPlaces.retry') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="space-y-4">
            <SkeletonLoader v-for="i in 3" :key="i" width="100%" height="150px" />
          </div>

          <!-- Empty State -->
          <div v-else-if="!error && pendingPlaces.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-12 h-12 text-atipical-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('pendingPlaces.emptyTitle') }}</h3>
            <p class="text-sm text-gray-500">{{ t('pendingPlaces.emptyDescription') }}</p>
          </div>

          <!-- Pending Places List -->
          <div v-else class="space-y-4">
            <div
              v-for="place in pendingPlaces"
              :key="place.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div class="flex items-start space-x-4">
                <!-- Place Image -->
                <div class="flex-shrink-0">
                  <img
                    v-if="place.imageUrl"
                    :src="place.imageUrl"
                    :alt="place.name"
                    class="w-24 h-24 object-cover rounded-lg"
                  />
                  <div v-else class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <!-- Place Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ place.name }}</h3>
                      <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ place.description }}</p>
                      
                      <div class="flex flex-wrap gap-2 mb-2">
                        <!-- Service Types -->
                        <span
                          v-for="serviceType in place.serviceTypes"
                          :key="serviceType.id"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-atipical-blue"
                        >
                          {{ serviceType.namePt }}
                        </span>
                      </div>

                      <!-- Address -->
                      <div class="flex items-start space-x-2 text-sm text-gray-500 mb-2">
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{{ place.address }}</span>
                      </div>

                      <!-- Created By and Date -->
                      <div class="flex items-center space-x-4 text-xs text-gray-500">
                        <div class="flex items-center space-x-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{{ place.createdByName }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{{ formatDate(place.createdAt) }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Action Button -->
                    <button
                      @click="openReviewModal(place)"
                      class="ml-4 px-4 py-2 bg-atipical-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {{ t('pendingPlaces.reviewButton') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Review Place Modal -->
    <ReviewPlaceModal
      :is-open="showReviewModal"
      :place="selectedPlace"
      @close="closeReviewModal"
      @success="handleReviewSuccess"
    />

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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import apiClient from '@/utils/axios'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import ReviewPlaceModal from '@/components/ReviewPlaceModal.vue'

const { t } = useI18n()

// Sidebar state
const sidebarOpen = ref(false)

// Data
const loading = ref(true)
const error = ref(null)
const pendingPlaces = ref([])
const showReviewModal = ref(false)
const selectedPlace = ref(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Fetch pending places
const fetchPendingPlaces = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await apiClient.get('/api/places/pending')
    pendingPlaces.value = response.data
  } catch (err) {
    console.error('Error fetching pending places:', err)
    
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      error.value = t('pendingPlaces.networkError')
    } else if (err.response) {
      error.value = err.response.data?.message || `${t('pendingPlaces.serverError')}: ${err.response.status}`
    } else {
      error.value = err.message || t('pendingPlaces.unexpectedError')
    }
  } finally {
    loading.value = false
  }
}

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Open review modal
const openReviewModal = (place) => {
  selectedPlace.value = place
  showReviewModal.value = true
}

// Close review modal
const closeReviewModal = () => {
  showReviewModal.value = false
  selectedPlace.value = null
}

// Handle successful review action
const handleReviewSuccess = (message) => {
  closeReviewModal()
  successMessage.value = message
  showSuccessMessage.value = true
  
  // Refresh the list
  fetchPendingPlaces()
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 5000)
}

// Load data on mount
onMounted(() => {
  fetchPendingPlaces()
})
</script>
