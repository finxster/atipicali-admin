<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-atipical-blue">{{ t('app.title') }}</h1>
          <span class="text-sm text-gray-500">{{ t('app.subtitle') }}</span>
        </div>

        <div class="flex items-center space-x-4">
          <LanguageSwitcher />
          
          <div class="flex items-center space-x-3 border-l pl-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.email }}</p>
              <p class="text-xs text-gray-500">Administrator</p>
            </div>
            
            <button
              @click="authStore.logout"
              class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              {{ t('auth.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const authStore = useAuthStore()
</script>