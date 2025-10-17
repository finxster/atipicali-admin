<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <img src="@/assets/logo.png" alt="AtipicALI Logo" class="w-24 h-24" />
        </div>
        <h1 class="text-4xl font-bold text-atipical-blue mb-2">{{ t('app.title') }}</h1>
        <p class="text-gray-600">{{ t('app.subtitle') }}</p>
      </div>

      <div class="card">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ t('auth.welcome') }}</h2>
          <p class="text-gray-600 mt-1">{{ t('auth.loginSubtitle') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('auth.email') }}
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-field"
              :placeholder="t('auth.email')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('auth.password') }}
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input-field"
              :placeholder="t('auth.password')"
            />
          </div>

          <div class="flex items-center justify-between">
            <a href="#" class="text-sm text-atipical-blue hover:underline">
              {{ t('auth.forgotPassword') }}
            </a>
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            <span v-if="loading">{{ t('auth.login') }}...</span>
            <span v-else>{{ t('auth.signIn') }}</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ t('auth.noAccount') }}
            <router-link to="/register" class="text-atipical-blue font-medium hover:underline">
              {{ t('auth.register') }}
            </router-link>
          </p>
        </div>

        <div class="mt-6">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await authStore.login(form.value.email, form.value.password)

  if (!result.success) {
    error.value = result.message || t('errors.loginFailed')
  }

  loading.value = false
}
</script>
