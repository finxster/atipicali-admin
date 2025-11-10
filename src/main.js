import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './style.css'

import en from './locales/en.json'
import pt from './locales/pt.json'

const browserLanguage = navigator.language.split('-')[0]
const supportedLanguages = ['en', 'pt']
const defaultLanguage = supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || defaultLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    pt
  },
  missing: (locale, key) => {
    console.warn(`Missing translation key: ${key} for locale: ${locale}`)
    return key
  }
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize auth from localStorage before mounting
import { useAuthStore } from './store/auth'
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
