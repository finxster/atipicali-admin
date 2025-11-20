<template>
  <TransitionRoot appear :show="true" as="template">
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
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
              <!-- Modal Header -->
              <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                    </div>
                    <DialogTitle class="text-xl font-bold text-white">
                      {{ t('viewReport.title') }}
                    </DialogTitle>
                  </div>
                  <button
                    @click="handleClose"
                    class="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Modal Content -->
              <div class="px-6 py-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                <!-- Report Details -->
                <div class="space-y-6">
                  <!-- Status Badge -->
                  <div class="flex items-center justify-between">
                    <span
                      :class="[
                        'px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full',
                        getStatusClass(report.status)
                      ]"
                    >
                      {{ getStatusLabel(report.status) }}
                    </span>
                    <span class="text-sm text-gray-500">
                      ID: {{ report.id }}
                    </span>
                  </div>

                  <!-- Place Information -->
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ t('viewReport.placeInfo') }}
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500 mb-1">{{ t('viewReport.placeName') }}</p>
                        <p class="text-sm font-medium text-gray-900">{{ report.placeName || t('viewReport.unknownPlace') }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">{{ t('viewReport.placeId') }}</p>
                        <p class="text-sm font-medium text-gray-900">{{ report.placeId }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Report Type -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">{{ t('viewReport.reportType') }}</label>
                    <span
                      :class="[
                        'px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full',
                        getReportTypeClass(report.reportType)
                      ]"
                    >
                      {{ getReportTypeLabel(report.reportType) }}
                    </span>
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">{{ t('viewReport.description') }}</label>
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                      <p class="text-gray-900 whitespace-pre-wrap">{{ report.description }}</p>
                    </div>
                  </div>

                  <!-- Reporter Information -->
                  <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {{ t('viewReport.reporterInfo') }}
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500 mb-1">{{ t('viewReport.reporterName') }}</p>
                        <p class="text-sm font-medium text-gray-900">{{ report.userName || t('viewReport.anonymous') }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">{{ t('viewReport.reporterEmail') }}</p>
                        <p class="text-sm font-medium text-gray-900">{{ report.userEmail || '-' }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">{{ t('viewReport.reportDate') }}</p>
                        <p class="text-sm font-medium text-gray-900">{{ formatDateTime(report.createdAt) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Admin Notes (if resolved/rejected) -->
                  <div v-if="report.adminNotes" class="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 class="text-sm font-semibold text-gray-700 mb-2">{{ t('viewReport.adminNotes') }}</h3>
                    <p class="text-sm text-gray-900">{{ report.adminNotes }}</p>
                    <div v-if="report.resolvedAt" class="mt-2 text-xs text-gray-500">
                      {{ t('viewReport.resolvedAt') }}: {{ formatDateTime(report.resolvedAt) }}
                    </div>
                  </div>

                  <!-- Action Form (for pending/under review reports) -->
                  <div v-if="report.status !== 'RESOLVED' && report.status !== 'REJECTED'" class="border-t pt-6">
                    <h3 class="text-sm font-semibold text-gray-700 mb-4">{{ t('viewReport.takeAction') }}</h3>
                    
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          {{ t('viewReport.adminNotesLabel') }}
                        </label>
                        <textarea
                          v-model="adminNotes"
                          :placeholder="t('viewReport.adminNotesPlaceholder')"
                          rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent resize-none"
                        ></textarea>
                      </div>

                      <!-- Error Message -->
                      <div v-if="actionError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p class="text-sm text-red-700">{{ actionError }}</p>
                      </div>

                      <!-- Success Message -->
                      <div v-if="actionSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p class="text-sm text-green-700">{{ actionSuccess }}</p>
                      </div>

                      <!-- Action Buttons -->
                      <div class="grid grid-cols-3 gap-3">
                        <button
                          @click="updateStatus('UNDER_REVIEW')"
                          :disabled="isSubmitting || report.status === 'UNDER_REVIEW'"
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <svg v-if="isSubmitting && actionType === 'UNDER_REVIEW'" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {{ t('viewReport.markUnderReview') }}
                        </button>
                        
                        <button
                          @click="updateStatus('RESOLVED')"
                          :disabled="isSubmitting"
                          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <svg v-if="isSubmitting && actionType === 'RESOLVED'" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {{ t('viewReport.resolve') }}
                        </button>
                        
                        <button
                          @click="updateStatus('REJECTED')"
                          :disabled="isSubmitting"
                          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <svg v-if="isSubmitting && actionType === 'REJECTED'" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {{ t('viewReport.reject') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
                <button
                  @click="handleClose"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  {{ t('viewReport.close') }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import apiClient from '@/utils/axios'

const props = defineProps({
  report: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const { t, locale } = useI18n()

const adminNotes = ref(props.report.adminNotes || '')
const isSubmitting = ref(false)
const actionError = ref(null)
const actionSuccess = ref(null)
const actionType = ref(null)

const handleClose = () => {
  emit('close')
}

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': t('viewReport.statusPending'),
    'UNDER_REVIEW': t('viewReport.statusUnderReview'),
    'RESOLVED': t('viewReport.statusResolved'),
    'REJECTED': t('viewReport.statusRejected')
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

const getReportTypeLabel = (type) => {
  const labels = {
    'INCORRECT_INFO': t('viewReport.typeIncorrectInfo'),
    'HARMFUL_CONTENT': t('viewReport.typeHarmfulContent'),
    'CLOSED': t('viewReport.typeClosed'),
    'SPAM': t('viewReport.typeSpam'),
    'OTHER': t('viewReport.typeOther')
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

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const updateStatus = async (newStatus) => {
  actionError.value = null
  actionSuccess.value = null
  actionType.value = newStatus

  if (!adminNotes.value.trim() && newStatus !== 'UNDER_REVIEW') {
    actionError.value = t('viewReport.adminNotesRequired')
    return
  }

  // Map status to correct backend endpoint
  const endpointMap = {
    'RESOLVED': 'resolve',
    'REJECTED': 'reject',
    'UNDER_REVIEW': 'review'
  }
  const endpoint = endpointMap[newStatus] || 'update'

  isSubmitting.value = true

  try {
    await apiClient.put(`/api/admin/reports/${props.report.id}/${endpoint}`, {
      adminNotes: adminNotes.value.trim() || `Marked as ${newStatus}`,
      status: newStatus
    })

    actionSuccess.value = t('viewReport.updateSuccess')

    // Close modal after 1.5 seconds
    setTimeout(() => {
      emit('updated')
    }, 1500)
  } catch (err) {
    console.error('Error updating report:', err)
    actionError.value = err.response?.data?.message || t('viewReport.updateError')
  } finally {
    isSubmitting.value = false
    actionType.value = null
  }
}
</script>
