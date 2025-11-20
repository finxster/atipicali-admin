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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
              <!-- Modal Header -->
              <div class="bg-gradient-to-r from-atipical-blue to-blue-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-xl font-bold text-white flex items-center gap-2">
                    <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    {{ t('viewUser.title') }}
                  </DialogTitle>
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
              <div class="px-6 py-6">
                <!-- User Avatar and Basic Info -->
                <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div class="flex-shrink-0 h-20 w-20 bg-atipical-blue rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-2xl">{{ getInitials(user.name) }}</span>
                  </div>
                  <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
                    <p class="text-gray-600">{{ user.email }}</p>
                    <div class="flex gap-2 mt-2">
                      <span
                        :class="[
                          'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          user.globalRole === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        ]"
                      >
                        {{ user.globalRole === 'ADMIN' ? t('viewUser.roleAdmin') : t('viewUser.roleUser') }}
                      </span>
                      <span
                        :class="[
                          'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          user.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        ]"
                      >
                        {{ user.enabled ? t('viewUser.enabled') : t('viewUser.disabled') }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- User Details Grid -->
                <div class="space-y-6">
                  <!-- Account Information -->
                  <div>
                    <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ t('viewUser.accountInfo') }}
                    </h3>
                    <div class="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p class="text-xs text-gray-500 mb-1">{{ t('viewUser.userId') }}</p>
                        <p class="text-sm font-medium text-gray-900 font-mono">{{ user.id }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-1">{{ t('viewUser.createdAt') }}</p>
                        <p class="text-sm font-medium text-gray-900">{{ formatDateTime(user.createdAt) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div>
                    <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ t('viewUser.contactInfo') }}
                    </h3>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-xs text-gray-500 mb-1">{{ t('viewUser.fullName') }}</p>
                          <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 mb-1">{{ t('viewUser.email') }}</p>
                          <p class="text-sm font-medium text-gray-900">{{ user.email }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Permissions -->
                  <div>
                    <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {{ t('viewUser.permissions') }}
                    </h3>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-xs text-gray-500 mb-1">{{ t('viewUser.globalRole') }}</p>
                          <p class="text-sm font-medium text-gray-900">
                            {{ user.globalRole === 'ADMIN' ? t('viewUser.administrator') : t('viewUser.regularUser') }}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 mb-1">{{ t('viewUser.accountStatus') }}</p>
                          <p class="text-sm font-medium text-gray-900">
                            {{ user.enabled ? t('viewUser.active') : t('viewUser.inactive') }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="bg-gray-50 px-6 py-4 flex justify-between border-t border-gray-200">
                <button
                  @click="handleClose"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  {{ t('viewUser.close') }}
                </button>
                <button
                  @click="handleEdit"
                  class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ t('viewUser.edit') }}
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
import { useI18n } from 'vue-i18n'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit'])

const { t, locale } = useI18n()

const handleClose = () => {
  emit('close')
}

const handleEdit = () => {
  emit('edit', props.user)
}

const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
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
</script>
