<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="handleClose"
    >
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-if="isOpen"
          class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          <!-- Modal Header -->
          <div class="border-b border-gray-200 px-6 py-5">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('serviceTypes.add.title') }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ t('serviceTypes.add.subtitle') }}</p>
              </div>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="px-6 py-5 overflow-y-auto max-h-[calc(90vh-180px)]">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Portuguese Name -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t('serviceTypes.add.namePt') }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.namePt"
                  type="text"
                  :placeholder="t('serviceTypes.add.namePtPlaceholder')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                  :class="{ 'border-red-500': errors.namePt }"
                />
                <p v-if="errors.namePt" class="mt-1 text-sm text-red-600">{{ errors.namePt }}</p>
              </div>

              <!-- English Name -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t('serviceTypes.add.nameEn') }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.nameEn"
                  type="text"
                  :placeholder="t('serviceTypes.add.nameEnPlaceholder')"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                  :class="{ 'border-red-500': errors.nameEn }"
                />
                <p v-if="errors.nameEn" class="mt-1 text-sm text-red-600">{{ errors.nameEn }}</p>
              </div>

              <!-- General Error Message -->
              <div v-if="generalError" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-red-700">{{ generalError }}</p>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div class="flex items-center justify-end space-x-3">
              <button
                @click="handleClose"
                :disabled="submitting"
                type="button"
                class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('serviceTypes.add.cancel') }}
              </button>
              <button
                @click="handleSubmit"
                :disabled="submitting"
                type="submit"
                class="px-5 py-2.5 text-sm font-medium text-white bg-atipical-blue rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg v-if="submitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ submitting ? t('serviceTypes.add.submitting') : t('serviceTypes.add.submit') }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import apiClient from '@/utils/axios'

const { t } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

// Form state
const formData = ref({
  namePt: '',
  nameEn: ''
})

const errors = ref({})
const generalError = ref('')
const submitting = ref(false)

// Reset form when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    formData.value = {
      namePt: '',
      nameEn: ''
    }
    errors.value = {}
    generalError.value = ''
  }
})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.namePt.trim()) {
    errors.value.namePt = t('serviceTypes.add.errors.namePtRequired')
  }
  
  if (!formData.value.nameEn.trim()) {
    errors.value.nameEn = t('serviceTypes.add.errors.nameEnRequired')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  submitting.value = true
  generalError.value = ''
  
  try {
    const response = await apiClient.post('/api/admin/service-types', {
      namePt: formData.value.namePt.trim(),
      nameEn: formData.value.nameEn.trim()
    })
    
    emit('success', response.data)
    emit('close')
  } catch (err) {
    console.error('Error creating service type:', err)
    generalError.value = err.response?.data?.message || t('serviceTypes.add.errors.general')
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  if (!submitting.value) {
    emit('close')
  }
}
</script>
