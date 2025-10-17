<template>
  <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
    <button
      v-for="lang in languages"
      :key="lang.code"
      @click="changeLanguage(lang.code)"
      :class="[
        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
        currentLocale === lang.code
          ? 'bg-white text-atipical-blue shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      ]"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' }
]

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>
