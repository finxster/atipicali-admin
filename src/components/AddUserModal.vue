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
            <DialogPanel class="w-full h-full sm:h-auto sm:max-w-md transform overflow-hidden sm:rounded-2xl bg-white shadow-xl transition-all">
              <!-- Modal Header -->
              <div class="bg-gradient-to-r from-atipical-blue to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {{ t('addUser.title') }}
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
              <form @submit.prevent="submitForm" class="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('addUser.name') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    :placeholder="t('addUser.namePlaceholder')"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent"
                    required
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('addUser.email') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="contato@atipicali.com"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent"
                    required
                  />
                </div>

                <!-- Password -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('addUser.password') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.password"
                    type="password"
                    :placeholder="t('addUser.passwordPlaceholder')"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent"
                    minlength="6"
                    required
                  />
                  <p class="text-xs text-gray-500 mt-1">{{ t('addUser.passwordHint') }}</p>
                </div>

                <!-- Role -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('addUser.role') }} <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.globalRole"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent"
                    required
                  >
                    <option value="">{{ t('addUser.selectRole') }}</option>
                    <option value="USER">{{ t('addUser.roleUser') }}</option>
                    <option value="ADMIN">{{ t('addUser.roleAdmin') }}</option>
                  </select>
                </div>

                <!-- Enabled -->
                <div class="flex items-center">
                  <input
                    v-model="form.enabled"
                    type="checkbox"
                    id="enabled"
                    class="w-4 h-4 text-atipical-blue border-gray-300 rounded focus:ring-atipical-blue"
                  />
                  <label for="enabled" class="ml-2 text-sm text-gray-700">
                    {{ t('addUser.enableAccount') }}
                  </label>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>

                <!-- Success Message -->
                <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p class="text-sm text-green-700">{{ t('addUser.success') }}</p>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                  <button
                    type="button"
                    @click="handleClose"
                    class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    :disabled="isSubmitting"
                  >
                    {{ t('addUser.cancel') }}
                  </button>
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="flex-1 px-4 py-2 bg-atipical-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSubmitting ? t('addUser.creating') : t('addUser.create') }}
                  </button>
                </div>
              </form>
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

const emit = defineEmits(['close', 'success'])

const { t } = useI18n()

const form = ref({
  name: '',
  email: '',
  password: '',
  globalRole: '',
  enabled: true
})

const isSubmitting = ref(false)
const error = ref(null)
const success = ref(false)

const handleClose = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

const submitForm = async () => {
  error.value = null
  success.value = false

  // Validation
  if (!form.value.name.trim()) {
    error.value = t('addUser.nameRequired')
    return
  }

  if (!form.value.email.trim()) {
    error.value = t('addUser.emailRequired')
    return
  }

  if (!form.value.password || form.value.password.length < 6) {
    error.value = t('addUser.passwordRequired')
    return
  }

  if (!form.value.globalRole) {
    error.value = t('addUser.roleRequired')
    return
  }

  isSubmitting.value = true

  try {
    await apiClient.post('/api/admin/users', form.value)

    success.value = true

    // Close modal after 1.5 seconds
    setTimeout(() => {
      emit('success')
    }, 1500)
  } catch (err) {
    console.error('Error creating user:', err)
    error.value = err.response?.data?.message || t('addUser.error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
