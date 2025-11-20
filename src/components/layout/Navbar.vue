<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex items-center justify-between">
        <!-- Left side: Hamburger + Logo -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Mobile menu button -->
          <button
            @click="emit('toggle-sidebar')"
            class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <img src="@/assets/logo.png" alt="AtipicALI Logo" class="w-7 h-7 sm:w-8 sm:h-8" />
          <div class="flex items-center space-x-1 sm:space-x-2">
            <h1 class="text-lg sm:text-2xl font-bold text-atipical-blue">{{ t('app.title') }}</h1>
            <span class="hidden md:inline text-sm text-gray-500">{{ t('app.subtitle') }}</span>
          </div>
        </div>

        <!-- Right side: Actions -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <LanguageSwitcher />
          
          <!-- Desktop user info -->
          <div class="hidden md:flex items-center space-x-3 border-l pl-4">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name || authStore.user?.email }}</p>
              <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
            </div>
            
            <button
              @click="authStore.logout"
              class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              {{ t('auth.logout') }}
            </button>
          </div>

          <!-- Mobile user menu button -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
            aria-label="User menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile user dropdown menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showMobileMenu"
        class="md:hidden absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg mx-4"
      >
        <div class="p-4 border-b border-gray-200">
          <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name || authStore.user?.email }}</p>
          <p class="text-xs text-gray-500 truncate mt-1">{{ authStore.user?.email }}</p>
        </div>
        <div class="p-2">
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            {{ t('auth.logout') }}
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const emit = defineEmits(['toggle-sidebar'])
const showMobileMenu = ref(false)

const handleLogout = () => {
  showMobileMenu.value = false
  authStore.logout()
}
</script>