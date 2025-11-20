<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-0 sm:p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full h-full sm:h-auto sm:max-w-4xl transform overflow-hidden sm:rounded-2xl bg-white shadow-xl transition-all">
              <!-- Modal Header -->
              <div class="bg-gradient-to-r from-atipical-blue to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-lg sm:text-xl font-bold text-white">
                    {{ t('reviewPlace.title') }}
                  </DialogTitle>
                  <button
                    @click="handleClose"
                    class="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Modal Content -->
              <div class="px-4 sm:px-6 py-3 sm:py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div v-if="place">
                  <!-- Tab Navigation -->
                  <div class="border-b border-gray-200 mb-6">
                    <nav class="-mb-px flex space-x-8">
                      <button
                        @click="activeTab = 'details'"
                        :class="[
                          activeTab === 'details'
                            ? 'border-atipical-blue text-atipical-blue'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        ]"
                      >
                        {{ t('reviewPlace.tabs.details') }}
                      </button>
                      <button
                        @click="activeTab = 'history'"
                        :class="[
                          activeTab === 'history'
                            ? 'border-atipical-blue text-atipical-blue'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        ]"
                      >
                        {{ t('reviewPlace.tabs.history') }}
                      </button>
                    </nav>
                  </div>

                  <!-- Details Tab -->
                  <div v-if="activeTab === 'details'" class="space-y-4 sm:space-y-6">
                    <!-- Place Image -->
                    <div v-if="place.imageUrl" class="rounded-lg overflow-hidden">
                      <img :src="place.imageUrl" :alt="place.name" class="w-full h-64 object-cover" />
                    </div>

                    <!-- Basic Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviewPlace.fields.name') }}</label>
                        <p class="text-gray-900">{{ place.name }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviewPlace.fields.status') }}</label>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {{ place.status }}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviewPlace.fields.description') }}</label>
                      <p class="text-gray-900">{{ place.description }}</p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviewPlace.fields.address') }}</label>
                      <p class="text-gray-900">{{ place.address }}</p>
                    </div>

                    <!-- Coordinates -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviewPlace.fields.latitude') }}</label>
                        <p class="text-gray-900">{{ place.latitude }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviewPlace.fields.longitude') }}</label>
                        <p class="text-gray-900">{{ place.longitude }}</p>
                      </div>
                    </div>

                    <!-- Service Types -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('reviewPlace.fields.serviceTypes') }}</label>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="serviceType in place.serviceTypes"
                          :key="serviceType.id"
                          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-atipical-blue"
                        >
                          {{ serviceType.namePt }} / {{ serviceType.nameEn }}
                        </span>
                      </div>
                    </div>

                    <!-- Contact Information -->
                    <div v-if="place.contactInfo && place.contactInfo.length > 0">
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('reviewPlace.fields.contactInfo') }}</label>
                      <div class="space-y-2">
                        <div
                          v-for="contact in place.contactInfo"
                          :key="contact.id"
                          class="flex items-center space-x-2 text-sm"
                        >
                          <span class="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{{ contact.type }}</span>
                          <span class="text-gray-900">{{ contact.contactValue }}</span>
                          <span v-if="contact.isPrimary" class="text-xs text-atipical-blue font-medium">(Primary)</span>
                        </div>
                      </div>
                    </div>

                    <!-- Social Links -->
                    <div v-if="place.socialLinks && place.socialLinks.length > 0">
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('reviewPlace.fields.socialLinks') }}</label>
                      <div class="space-y-2">
                        <div
                          v-for="social in place.socialLinks"
                          :key="social.id"
                          class="flex items-center space-x-2 text-sm"
                        >
                          <span class="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{{ social.platform }}</span>
                          <span class="text-gray-900">{{ social.account }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Creator Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviewPlace.fields.createdBy') }}</label>
                        <p class="text-gray-900">{{ place.createdByName }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(place.createdAt) }}</p>
                      </div>
                      <div v-if="place.lastReviewedByName">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviewPlace.fields.lastReviewedBy') }}</label>
                        <p class="text-gray-900">{{ place.lastReviewedByName }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(place.lastReviewedAt) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- History Tab -->
                  <div v-if="activeTab === 'history'">
                    <!-- Loading State -->
                    <div v-if="loadingHistory" class="space-y-3">
                      <SkeletonLoader v-for="i in 3" :key="i" width="100%" height="80px" />
                    </div>

                    <!-- Error State -->
                    <div v-else-if="historyError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p class="text-sm text-red-800">{{ historyError }}</p>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="reviewHistory.length === 0" class="text-center py-8">
                      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p class="text-sm text-gray-500">{{ t('reviewPlace.noHistory') }}</p>
                    </div>

                    <!-- History Timeline -->
                    <div v-else class="space-y-4">
                      <div
                        v-for="(action, index) in reviewHistory"
                        :key="action.id"
                        class="relative pl-8 pb-4"
                        :class="{ 'border-l-2 border-gray-200': index < reviewHistory.length - 1 }"
                      >
                        <!-- Timeline Dot -->
                        <div
                          class="absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px]"
                          :class="{
                            'bg-green-500': action.newStatus === 'APPROVED',
                            'bg-yellow-500': action.newStatus === 'PENDING',
                            'bg-red-500': action.newStatus === 'REJECTED',
                            'bg-blue-500': action.newStatus === 'CHANGES_REQUESTED'
                          }"
                        ></div>

                        <!-- Action Card -->
                        <div class="bg-gray-50 rounded-lg p-4">
                          <div class="flex items-start justify-between mb-2">
                            <div>
                              <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="{
                                  'bg-green-100 text-green-800': action.newStatus === 'APPROVED',
                                  'bg-yellow-100 text-yellow-800': action.newStatus === 'PENDING',
                                  'bg-red-100 text-red-800': action.newStatus === 'REJECTED',
                                  'bg-blue-100 text-blue-800': action.newStatus === 'CHANGES_REQUESTED'
                                }"
                              >
                                {{ action.newStatus }}
                              </span>
                            </div>
                            <span class="text-xs text-gray-500">{{ formatDate(action.timestamp) }}</span>
                          </div>
                          <p class="text-sm font-medium text-gray-900 mb-1">{{ action.adminName }}</p>
                          <p v-if="action.comments" class="text-sm text-gray-600 italic">"{{ action.comments }}"</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Review Actions Section -->
                  <div class="mt-6 pt-6 border-t">
                    <h3 class="text-sm font-medium text-gray-700 mb-3">{{ t('reviewPlace.actionsTitle') }}</h3>
                    
                    <!-- Comments Input -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium mb-2" :class="hasValidationError ? 'text-red-700' : 'text-gray-700'">
                        {{ t('reviewPlace.commentsLabel') }}
                        <span v-if="hasValidationError" class="text-red-600">*</span>
                      </label>
                      <textarea
                        ref="commentsTextarea"
                        v-model="comments"
                        rows="3"
                        :class="[
                          'w-full px-3 py-2 border rounded-lg transition-colors',
                          hasValidationError
                            ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-2 focus:ring-atipical-blue focus:border-transparent'
                        ]"
                        :placeholder="t('reviewPlace.commentsPlaceholder')"
                        @input="clearValidationError"
                      ></textarea>
                      <p v-if="hasValidationError" class="mt-1 text-sm text-red-600">
                        {{ t('reviewPlace.commentsRequired') }}
                      </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap gap-3">
                      <button
                        @click="handleAction('approve')"
                        :disabled="submitting"
                        class="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg v-if="!submitting || actionType !== 'approve'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ t('reviewPlace.actions.approve') }}</span>
                      </button>

                      <button
                        @click="handleAction('request-changes')"
                        :disabled="submitting"
                        class="flex-1 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg v-if="!submitting || actionType !== 'request-changes'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ t('reviewPlace.actions.requestChanges') }}</span>
                      </button>

                      <button
                        @click="handleAction('reject')"
                        :disabled="submitting"
                        class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg v-if="!submitting || actionType !== 'reject'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ t('reviewPlace.actions.reject') }}</span>
                      </button>
                    </div>

                    <!-- Error Message -->
                    <div v-if="actionError" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p class="text-sm text-red-800">{{ actionError }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import apiClient from '@/utils/axios'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const { t } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  place: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

// Tab management
const activeTab = ref('details')

// Review history
const loadingHistory = ref(false)
const historyError = ref(null)
const reviewHistory = ref([])

// Review actions
const comments = ref('')
const commentsTextarea = ref(null)
const submitting = ref(false)
const actionError = ref(null)
const actionType = ref(null)
const hasValidationError = ref(false)

// Watch for place changes to load history
watch(() => props.place, async (newPlace) => {
  if (newPlace && props.isOpen) {
    await fetchReviewHistory()
  }
}, { immediate: true })

// Watch for modal opening
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.place) {
    fetchReviewHistory()
  } else {
    // Reset state when closing
    activeTab.value = 'details'
    comments.value = ''
    actionError.value = null
    hasValidationError.value = false
  }
})

// Fetch review history
const fetchReviewHistory = async () => {
  if (!props.place) return
  
  try {
    loadingHistory.value = true
    historyError.value = null
    const response = await apiClient.get(`/api/places/${props.place.id}/review-actions`)
    reviewHistory.value = response.data
  } catch (err) {
    console.error('Error fetching review history:', err)
    historyError.value = t('reviewPlace.historyError')
  } finally {
    loadingHistory.value = false
  }
}

// Handle review actions
const handleAction = async (action) => {
  if (!props.place) return
  
  actionType.value = action
  actionError.value = null
  hasValidationError.value = false
  
  // Validate comments for request-changes and reject
  if ((action === 'request-changes' || action === 'reject') && !comments.value.trim()) {
    hasValidationError.value = true
    // Scroll to the comments field and focus it
    if (commentsTextarea.value) {
      commentsTextarea.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      commentsTextarea.value.focus()
    }
    return
  }
  
  try {
    submitting.value = true
    
    const response = await apiClient.post(`/api/places/${props.place.id}/${action}`, {
      comments: comments.value.trim()
    })
    
    // Emit success with message
    const successMessage = response.data.message || t(`reviewPlace.success.${action}`)
    emit('success', successMessage)
    
  } catch (err) {
    console.error(`Error performing ${action}:`, err)
    
    if (err.response) {
      actionError.value = err.response.data?.message || t('reviewPlace.actionError')
    } else {
      actionError.value = t('reviewPlace.actionError')
    }
  } finally {
    submitting.value = false
    actionType.value = null
  }
}

// Clear validation error when user starts typing
const clearValidationError = () => {
  if (hasValidationError.value) {
    hasValidationError.value = false
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

// Handle modal close
const handleClose = () => {
  if (!submitting.value) {
    emit('close')
  }
}
</script>
