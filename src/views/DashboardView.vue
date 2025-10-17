<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
    <Navbar />
    
    <div class="flex">
      <Sidebar />
      
      <main class="flex-1 p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Main content card wrapper for depth effect -->
          <div class="bg-white rounded-2xl shadow-2xl p-8">
            <!-- Header -->
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ t('dashboard.title') }}</h1>
            </div>

            <!-- Welcome Message Card -->
            <div class="bg-gradient-to-r from-atipical-blue to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div class="flex items-center space-x-3 mb-2">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <h2 class="text-2xl font-bold">{{ t('dashboard.welcome') }}, Admin User!</h2>
              </div>
              <p class="text-blue-100">
                This is your main administrative panel. The API URL being used is: 
                <code class="bg-white/20 px-2 py-1 rounded text-sm font-mono">{{ apiUrl }}</code>
              </p>
            </div>

            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <!-- Total Users Card -->
              <div class="bg-gradient-to-br from-atipical-blue to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-white overflow-hidden relative">
                <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-4">
                    <p class="text-blue-100 font-semibold text-sm uppercase tracking-wide">Total Users</p>
                    <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-4xl font-bold">1,234</p>
                  <p class="text-blue-100 text-sm mt-2">↑ 12% from last month</p>
                </div>
              </div>

              <!-- Active Tasks Card -->
              <div class="bg-gradient-to-br from-atipical-green to-green-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-white overflow-hidden relative">
                <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-4">
                    <p class="text-green-100 font-semibold text-sm uppercase tracking-wide">Active Tasks</p>
                    <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-4xl font-bold">42</p>
                  <p class="text-green-100 text-sm mt-2">8 completed today</p>
                </div>
              </div>

              <!-- Pending Approvals Card -->
              <div class="bg-gradient-to-br from-atipical-yellow to-orange-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-white overflow-hidden relative">
                <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-4">
                    <p class="text-yellow-100 font-semibold text-sm uppercase tracking-wide">Pending Approvals</p>
                    <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-4xl font-bold">8</p>
                  <p class="text-yellow-100 text-sm mt-2">Requires attention</p>
                </div>
              </div>

              <!-- Critical Alerts Card -->
              <div class="bg-gradient-to-br from-atipical-red to-red-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-white overflow-hidden relative">
                <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-4">
                    <p class="text-red-100 font-semibold text-sm uppercase tracking-wide">Critical Alerts</p>
                    <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-4xl font-bold">2</p>
                  <p class="text-red-100 text-sm mt-2">Immediate action needed</p>
                </div>
              </div>
            </div>

            <!-- Next Steps Card -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6 border border-gray-200">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-atipical-blue rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Next Steps</h2>
              </div>
              
              <ul class="space-y-3">
                <li class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span class="text-atipical-blue text-sm font-bold">1</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-gray-700">
                      The authentication logic is <code class="bg-gray-200 px-2 py-0.5 rounded text-sm font-mono">**mocked**</code> in 
                      <code class="bg-gray-200 px-2 py-0.5 rounded text-sm font-mono">src/store/auth.js</code>. 
                      Replace it with real API calls using <code class="bg-gray-200 px-2 py-0.5 rounded text-sm font-mono">apiClient</code>.
                    </p>
                  </div>
                </li>
                
                <li class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span class="text-atipical-green text-sm font-bold">2</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-gray-700">
                      Implement actual API logic in <code class="bg-gray-200 px-2 py-0.5 rounded text-sm font-mono">src/utils/axios.js</code> 
                      for interceptors, like refreshing the token on 401.
                    </p>
                  </div>
                </li>
                
                <li class="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                    <span class="text-atipical-yellow text-sm font-bold">3</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-gray-700">
                      Expand the sidebar and add more routes to <code class="bg-gray-200 px-2 py-0.5 rounded text-sm font-mono">src/router/index.js</code>.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

const { t } = useI18n()
const apiUrl = computed(() => import.meta.env.VITE_API_BASE_URL)
</script>