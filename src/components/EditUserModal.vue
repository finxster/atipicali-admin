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
              <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 sm:px-6 py-3 sm:py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {{ t('editUser.title') }}
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
                    {{ t('editUser.name') }}
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    :placeholder="t('editUser.namePlaceholder')"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('editUser.email') }}
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    :placeholder="t('editUser.emailPlaceholder')"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <!-- Password -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('editUser.password') }}
                  </label>
                  <input
                    v-model="form.password"
                    type="password"
                    :placeholder="t('editUser.passwordPlaceholder')"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    minlength="6"
                  />
                  <p class="text-xs text-gray-500 mt-1">{{ t('editUser.passwordHint') }}</p>
                </div>

                <!-- Role -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('editUser.role') }}
                  </label>
                  <select
                    v-model="form.globalRole"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="USER">{{ t('editUser.roleUser') }}</option>
                    <option value="ADMIN">{{ t('editUser.roleAdmin') }}</option>
                  </select>
                </div>

                <!-- Enabled -->
                <div class="flex items-center">
                  <input
                    v-model="form.enabled"
                    type="checkbox"
                    id="enabled-edit"
                    class="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <label for="enabled-edit" class="ml-2 text-sm text-gray-700">
                    {{ t('editUser.enableAccount') }}
                  </label>
                </div>

                <!-- Info Note -->
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-xs text-blue-700">{{ t('editUser.updateNote') }}</p>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>

                <!-- Success Message -->
                <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p class="text-sm text-green-700">{{ t('editUser.success') }}</p>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                  <button
                    type="button"
                    @click="handleClose"
                    class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    :disabled="isSubmitting"
                  >
                    {{ t('editUser.cancel') }}
                  </button>
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSubmitting ? t('editUser.updating') : t('editUser.update') }}
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import apiClient from '@/utils/axios'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const { t } = useI18n()

const form = ref({
  name: '',
  email: '',
  password: '',
  globalRole: 'USER',
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

  // Build update payload - only include changed fields
  const payload = {}
  
  if (form.value.name && form.value.name !== props.user.name) {
    payload.name = form.value.name
  }
  
  if (form.value.email && form.value.email !== props.user.email) {
    payload.email = form.value.email
  }
  
  if (form.value.password) {
    if (form.value.password.length < 6) {
      error.value = t('editUser.passwordTooShort')
      return
    }
    payload.password = form.value.password
  }
  
  if (form.value.globalRole !== props.user.globalRole) {
    payload.globalRole = form.value.globalRole
  }
  
  if (form.value.enabled !== props.user.enabled) {
    payload.enabled = form.value.enabled
  }

  // Check if there are any changes
  if (Object.keys(payload).length === 0) {
    error.value = t('editUser.noChanges')
    return
  }

  isSubmitting.value = true

  try {
    await apiClient.put(`/api/admin/users/${props.user.id}`, payload)

    success.value = true

    // Close modal after 1.5 seconds
    setTimeout(() => {
      emit('success')
    }, 1500)
  } catch (err) {
    console.error('Error updating user:', err)
    error.value = err.response?.data?.message || t('editUser.error')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Initialize form with user data
  form.value = {
    name: props.user.name,
    email: props.user.email,
    password: '',
    globalRole: props.user.globalRole,
    enabled: props.user.enabled
  }
})
</script>
