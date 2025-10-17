<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <img src="@/assets/logo.png" alt="AtipicALI Logo" class="w-24 h-24" />
        </div>
        <h1 class="text-4xl font-bold text-atipical-green mb-2">{{ t('app.title') }}</h1>
        <p class="text-gray-600">{{ t('app.subtitle') }}</p>
      </div>

      <div class="card">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ t('auth.createAccount') }}</h2>
          <p class="text-gray-600 mt-1">{{ t('auth.registerSubtitle') }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
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
              minlength="6"
              class="input-field"
              :placeholder="t('auth.password')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('auth.confirmPassword') }}
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              class="input-field"
              :placeholder="t('auth.confirmPassword')"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-600">{{ success }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            <span v-if="loading">{{ t('auth.register') }}...</span>
            <span v-else>{{ t('auth.signUp') }}</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {{ t('auth.hasAccount') }}
            <router-link to="/login" class="text-atipical-green font-medium hover:underline">
              {{ t('auth.login') }}
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  if (form.value.password !== form.value.confirmPassword) {
    error.value = t('errors.passwordMismatch')
    return
  }

  loading.value = true

  const result = await authStore.register(form.value.email, form.value.password)

  if (result.success) {
    success.value = t('success.registerSuccess')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } else {
    error.value = result.message || t('errors.registerFailed')
  }

  loading.value = false
}
</script>
