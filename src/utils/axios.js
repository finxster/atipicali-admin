import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import router from '@/router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401 Unauthorized or 403 Forbidden with expired token)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Authentication error - session expired or unauthorized')
      const authStore = useAuthStore()
      authStore.logout()
      
      // Only redirect if not already on login page
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
