<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="flex">
      <Sidebar />
      
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Main content card wrapper for depth effect -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <!-- Header -->
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900">{{ t('dashboard.title') }}</h1>
              <p class="text-sm text-gray-500 mt-1">{{ t('dashboard.welcome') }}</p>
            </div>

            <!-- Welcome Message Card -->
            <div class="bg-gradient-to-r from-blue-50 to-white border-l-4 border-atipical-blue rounded-lg shadow-sm p-4 mb-6">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-atipical-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-700 font-medium">Admin User!</p>
                  <p class="text-xs text-gray-600 mt-1">
                    This is your main administrative panel. API URL: 
                    <code class="bg-blue-100 text-atipical-blue px-2 py-0.5 rounded text-xs font-mono">{{ apiUrl }}</code>
                  </p>
                </div>
              </div>
            </div>

            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <!-- Total Users Card -->
              <div class="bg-gradient-to-r from-blue-50 to-white border-l-4 border-atipical-blue rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Users</p>
                    <p class="text-2xl font-bold text-gray-900">1,234</p>
                    <p class="text-xs text-green-600 mt-1">↑ 12% from last month</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-atipical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Active Tasks Card -->
              <div class="bg-gradient-to-r from-green-50 to-white border-l-4 border-atipical-green rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Active Tasks</p>
                    <p class="text-2xl font-bold text-gray-900">42</p>
                    <p class="text-xs text-gray-600 mt-1">8 completed today</p>
                  </div>
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-atipical-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Pending Approvals Card -->
              <div class="bg-gradient-to-r from-yellow-50 to-white border-l-4 border-atipical-yellow rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Pending Approvals</p>
                    <p class="text-2xl font-bold text-gray-900">8</p>
                    <p class="text-xs text-orange-600 mt-1">Requires attention</p>
                  </div>
                  <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-atipical-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Critical Alerts Card -->
              <div class="bg-gradient-to-r from-red-50 to-white border-l-4 border-atipical-red rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Critical Alerts</p>
                    <p class="text-2xl font-bold text-gray-900">2</p>
                    <p class="text-xs text-red-600 mt-1">Immediate action needed</p>
                  </div>
                  <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-atipical-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Grid - More space for future content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <!-- Next Steps Card - Takes 2 columns -->
              <div class="lg:col-span-2 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm p-5 border border-gray-100">
                <div class="flex items-center space-x-2 mb-4">
                  <div class="w-8 h-8 bg-atipical-blue rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 class="text-lg font-bold text-gray-900">Next Steps</h2>
                </div>
                
                <ul class="space-y-2">
                  <li class="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-atipical-blue hover:shadow-sm transition-all">
                    <div class="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span class="text-atipical-blue text-xs font-bold">1</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-700">
                        The authentication logic is <code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">**mocked**</code> in 
                        <code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">src/store/auth.js</code>. 
                        Replace it with real API calls using <code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">apiClient</code>.
                      </p>
                    </div>
                  </li>
                  
                  <li class="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-atipical-blue hover:shadow-sm transition-all">
                    <div class="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span class="text-atipical-green text-xs font-bold">2</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-700">
                        Implement actual API logic in <code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">src/utils/axios.js</code> 
                        for interceptors, like refreshing the token on 401.
                      </p>
                    </div>
                  </li>
                  
                  <li class="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-atipical-blue hover:shadow-sm transition-all">
                    <div class="flex-shrink-0 w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                      <span class="text-atipical-yellow text-xs font-bold">3</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-700">
                        Expand the sidebar and add more routes to <code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">src/router/index.js</code>.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Quick Actions Card - Takes 1 column -->
              <div class="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-sm p-5 border border-gray-100">
                <h2 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div class="space-y-2">
                  <button class="w-full text-left px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-atipical-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700 flex items-center justify-between group">
                    <span>Add New User</span>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-atipical-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button class="w-full text-left px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-atipical-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700 flex items-center justify-between group">
                    <span>View Reports</span>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-atipical-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button class="w-full text-left px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-atipical-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700 flex items-center justify-between group">
                    <span>System Settings</span>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-atipical-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Recent Activity Section -->
            <div class="mt-4 bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <h2 class="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div class="space-y-3">
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-atipical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">New user registered</p>
                    <p class="text-xs text-gray-500">john.doe@example.com • 5 minutes ago</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-atipical-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">Task completed</p>
                    <p class="text-xs text-gray-500">Project review • 15 minutes ago</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-atipical-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">Pending approval</p>
                    <p class="text-xs text-gray-500">Budget request #4521 • 1 hour ago</p>
                  </div>
                </div>
              </div>
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