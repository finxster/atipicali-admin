<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="flex flex-1">
      <Sidebar />
      
      <main class="flex-1 p-6 flex flex-col">
        <div class="flex-1 flex flex-col">
          <!-- Main content card wrapper -->
          <div class="h-full bg-white rounded-xl shadow-lg flex flex-col">
            <!-- Header Section -->
            <div class="border-b border-gray-200 p-6 flex-shrink-0">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">{{ t('places.title') }}</h1>
                  <p class="text-sm text-gray-500 mt-1">{{ t('places.subtitle') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <button 
                    @click="openBatchImportModal"
                    class="flex items-center space-x-2 px-4 py-2.5 bg-white border-2 border-atipical-blue text-atipical-blue rounded-lg hover:bg-blue-50 transition-colors shadow-sm hover:shadow-md"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span class="font-medium">{{ t('places.batchImport.button') }}</span>
                  </button>
                  <button 
                    @click="openAddPlaceModal"
                    class="flex items-center space-x-2 px-4 py-2.5 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="font-medium">{{ t('places.addNew') }}</span>
                  </button>
                </div>
              </div>

              <!-- Search and Filter Bar -->
              <div class="flex flex-col md:flex-row gap-3">
                <!-- Search Input -->
                <div class="flex-1 relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('places.searchPlaceholder')"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                  />
                </div>

                <!-- Status Filter -->
                <select
                  v-model="statusFilter"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all bg-white"
                >
                  <option value="">{{ t('places.allStatuses') }}</option>
                  <option value="PENDING">{{ t('places.status.PENDING') }}</option>
                  <option value="CHANGES_REQUESTED">{{ t('places.status.CHANGES_REQUESTED') }}</option>
                  <option value="APPROVED">{{ t('places.status.APPROVED') }}</option>
                  <option value="REJECTED">{{ t('places.status.REJECTED') }}</option>
                </select>

                <!-- Sort By -->
                <select
                  v-model="sortBy"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all bg-white"
                >
                  <option value="name">{{ t('places.sortBy.name') }}</option>
                  <option value="status">{{ t('places.sortBy.status') }}</option>
                  <option value="date">{{ t('places.sortBy.date') }}</option>
                </select>

                <!-- Sort Direction -->
                <button
                  @click="toggleSortDirection"
                  class="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
                  :title="sortDirection === 'asc' ? t('places.ascending') : t('places.descending')"
                >
                  <svg
                    class="w-5 h-5 text-gray-600 transition-transform"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full table-fixed">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                      {{ t('places.table.name') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                      {{ t('places.table.address') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('places.table.status') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                      {{ t('places.table.image') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                      {{ t('places.table.location') }}
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                      {{ t('places.table.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="i in 5" :key="`skeleton-${i}`" class="hover:bg-gray-50">
                    <!-- Name & Description -->
                    <td class="px-4 py-3">
                      <div class="space-y-2">
                        <SkeletonLoader width="120px" height="16px" />
                        <SkeletonLoader width="180px" height="12px" />
                      </div>
                    </td>
                    
                    <!-- Address -->
                    <td class="px-4 py-3">
                      <SkeletonLoader width="full" height="14px" />
                    </td>
                    
                    <!-- Status -->
                    <td class="px-4 py-3">
                      <SkeletonLoader width="70px" height="20px" custom-class="rounded-full" />
                    </td>
                    
                    <!-- Image -->
                    <td class="px-4 py-3">
                      <SkeletonLoader width="48px" height="48px" />
                    </td>
                    
                    <!-- Location -->
                    <td class="px-4 py-3">
                      <SkeletonLoader width="56px" height="24px" />
                    </td>
                    
                    <!-- Actions -->
                    <td class="px-4 py-3">
                      <div class="flex justify-end space-x-2">
                        <SkeletonLoader width="32px" height="32px" />
                        <SkeletonLoader width="32px" height="32px" />
                        <SkeletonLoader width="32px" height="32px" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-6">
              <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-red-800">{{ t('places.error.title') }}</h3>
                    <p class="text-sm text-red-700 mt-1">{{ error }}</p>
                    <button
                      @click="fetchPlaces"
                      class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      {{ t('places.error.retry') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Table Section -->
            <div v-else class="flex-1 overflow-x-auto overflow-y-auto">
              <table class="w-full table-fixed">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                      {{ t('places.table.name') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                      {{ t('places.table.address') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      {{ t('places.table.status') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                      {{ t('places.table.image') }}
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                      {{ t('places.table.location') }}
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                      {{ t('places.table.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="place in paginatedPlaces"
                    :key="place.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <!-- Name & Description -->
                    <td class="px-4 py-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900 truncate">{{ place.name }}</p>
                        <p class="text-xs text-gray-500 truncate" :title="place.description">
                          {{ place.description.length > 50 ? place.description.substring(0, 50) + '...' : place.description }}
                        </p>
                      </div>
                    </td>

                    <!-- Address -->
                    <td class="px-4 py-3">
                      <p class="text-sm text-gray-700 truncate" :title="place.address">{{ place.address }}</p>
                    </td>

                    <!-- Status -->
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                        :class="getStatusClass(place.status)"
                      >
                        <span
                          class="w-1.5 h-1.5 rounded-full mr-1"
                          :class="getStatusDotClass(place.status)"
                        ></span>
                        {{ t(`places.status.${place.status}`) }}
                      </span>
                    </td>

                    <!-- Image -->
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-center">
                        <span
                          v-if="place.imageUrl && place.imageUrl.trim()"
                          class="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100 text-green-800"
                          :title="t('places.hasImage')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="text-xs font-medium">{{ t('places.hasImageLabel') }}</span>
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500"
                          :title="t('places.noImage')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span class="text-xs font-medium">{{ t('places.noImageLabel') }}</span>
                        </span>
                      </div>
                    </td>

                    <!-- Location -->
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-center">
                        <span
                          v-if="hasValidLocation(place)"
                          class="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                          :title="t('places.hasLocation')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span class="text-xs font-medium">{{ t('places.hasLocationLabel') }}</span>
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500"
                          :title="t('places.noLocation')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span class="text-xs font-medium">{{ t('places.noLocationLabel') }}</span>
                        </span>
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end space-x-1">
                        <button
                          @click="viewPlace(place)"
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          :title="t('places.actions.view')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          @click="editPlace(place)"
                          class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          :title="t('places.actions.edit')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="confirmDelete(place)"
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          :title="t('places.actions.delete')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="paginatedPlaces.length === 0">
                    <td colspan="6" class="px-6 py-12 text-center">
                      <div class="flex flex-col items-center justify-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">{{ t('places.empty.title') }}</h3>
                        <p class="text-sm text-gray-500">{{ t('places.empty.description') }}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Section -->
            <div class="border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-700">{{ t('places.pagination.showing') }}</span>
                  <select
                    v-model.number="itemsPerPage"
                    class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent text-sm"
                  >
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                  </select>
                  <span class="text-sm text-gray-700">
                    {{ t('places.pagination.of') }} {{ filteredPlaces.length }} {{ t('places.pagination.entries') }}
                  </span>
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div class="flex items-center space-x-1">
                    <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="currentPage = page"
                      class="px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      :class="currentPage === page
                        ? 'bg-atipical-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'"
                    >
                      {{ page }}
                    </button>
                  </div>

                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ t('places.delete.title') }}
            </h3>
            <p class="text-sm text-gray-600 mb-1">
              {{ t('places.delete.message') }}
            </p>
            <p class="text-sm font-semibold text-gray-900">
              "{{ placeToDelete?.name }}"
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end space-x-3">
          <button
            @click="cancelDelete"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('places.delete.cancel') }}
          </button>
          <button
            @click="deletePlace"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg v-if="deleting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ deleting ? t('places.delete.deleting') : t('places.delete.confirm') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-6 right-6 z-50"
      >
        <div class="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm font-medium">{{ successMessage }}</p>
          <button
            @click="showSuccessMessage = false"
            class="flex-shrink-0 ml-4 text-white hover:text-green-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Add Place Modal -->
    <AddPlaceModal
      :is-open="showAddPlaceModal"
      @close="closeAddPlaceModal"
      @success="handlePlaceAdded"
    />

    <!-- View Place Modal -->
    <ViewPlaceModal
      :is-open="showViewPlaceModal"
      :place="selectedPlace"
      @close="closeViewPlaceModal"
      @edit="handleEditFromView"
    />

    <!-- Edit Place Modal -->
    <EditPlaceModal
      :is-open="showEditPlaceModal"
      :place="selectedPlace"
      @close="closeEditPlaceModal"
      @success="handlePlaceUpdated"
    />

    <!-- Batch Import Modal -->
    <BatchImportModal
      :is-open="showBatchImportModal"
      @close="closeBatchImportModal"
      @import-complete="handleBatchImportComplete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import AddPlaceModal from '@/components/AddPlaceModal.vue'
import ViewPlaceModal from '@/components/ViewPlaceModal.vue'
import EditPlaceModal from '@/components/EditPlaceModal.vue'
import BatchImportModal from '@/components/BatchImportModal.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import apiClient from '@/utils/axios'

const { t } = useI18n()

// Search and Filter State
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('name')
const sortDirection = ref('asc')

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Data State
const places = ref([])
const loading = ref(false)
const error = ref(null)

// Delete State
const showDeleteModal = ref(false)
const placeToDelete = ref(null)
const deleting = ref(false)

// Add Place Modal State
const showAddPlaceModal = ref(false)

// View Place Modal State
const showViewPlaceModal = ref(false)

// Edit Place Modal State
const showEditPlaceModal = ref(false)

// Batch Import Modal State
const showBatchImportModal = ref(false)

// Selected Place State
const selectedPlace = ref(null)

// Success notification
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Fetch places from API
const fetchPlaces = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/api/places')
    places.value = response.data
  } catch (err) {
    error.value = err.message || 'Failed to fetch places'
    console.error('Error fetching places:', err)
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchPlaces()
})

// Delete Functions
const confirmDelete = (place) => {
  placeToDelete.value = place
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  placeToDelete.value = null
}

const deletePlace = async () => {
  console.log('deletePlace called')
  console.log('placeToDelete:', placeToDelete.value)
  
  if (!placeToDelete.value) {
    console.log('No place to delete, returning')
    return
  }
  
  deleting.value = true
  console.log('Sending DELETE request for ID:', placeToDelete.value.id)
  console.log('Token from localStorage:', localStorage.getItem('token'))
  
  try {
    const response = await apiClient.delete(`/api/places/${placeToDelete.value.id}`)
    console.log('Delete successful:', response)
    
    // Store the name for the success message
    const deletedPlaceName = placeToDelete.value.name
    
    // Remove from local array
    places.value = places.value.filter(p => p.id !== placeToDelete.value.id)
    
    // Close modal
    showDeleteModal.value = false
    placeToDelete.value = null
    
    // Show success message
    successMessage.value = t('places.delete.success', { name: deletedPlaceName })
    showSuccessMessage.value = true
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
  } catch (err) {
    console.error('Error deleting place:', err)
    console.error('Error response:', err.response)
    console.error('Error response data:', err.response?.data)
    console.error('Error response status:', err.response?.status)
    console.error('Error response headers:', err.response?.headers)
    error.value = err.response?.data?.message || 'Failed to delete place'
  } finally {
    deleting.value = false
  }
}

// Computed: Filtered Places
const filteredPlaces = computed(() => {
  let result = [...places.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(place =>
      (place.name && place.name.toLowerCase().includes(query)) ||
      (place.description && place.description.toLowerCase().includes(query)) ||
      (place.address && place.address.toLowerCase().includes(query))
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(place => place.status === statusFilter.value)
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'date':
        comparison = a.id - b.id
        break
    }

    return sortDirection.value === 'asc' ? comparison : -comparison
  })

  return result
})

// Computed: Paginated Places
const paginatedPlaces = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPlaces.value.slice(start, end)
})

// Computed: Total Pages
const totalPages = computed(() => {
  return Math.ceil(filteredPlaces.value.length / itemsPerPage.value)
})

// Computed: Visible Pages for Pagination
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 5

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(total)
    }
  }

  return pages
})

// Methods
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const getStatusClass = (status) => {
  const classes = {
    APPROVED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CHANGES_REQUESTED: 'bg-orange-100 text-orange-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status) => {
  const classes = {
    APPROVED: 'bg-green-500',
    PENDING: 'bg-yellow-500',
    CHANGES_REQUESTED: 'bg-orange-500',
    REJECTED: 'bg-red-500'
  }
  return classes[status] || 'bg-gray-500'
}

// Check if place has valid location (coordinates)
const hasValidLocation = (place) => {
  const lat = place.latitude
  const lng = place.longitude
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && (lat !== 0 || lng !== 0)
}

// Add Place Modal Functions
const openAddPlaceModal = () => {
  showAddPlaceModal.value = true
}

const closeAddPlaceModal = () => {
  showAddPlaceModal.value = false
}

const handlePlaceAdded = (newPlace) => {
  // Add the new place to the beginning of the list
  places.value.unshift(newPlace)
  
  // Show success message
  successMessage.value = t('places.addPlace.successMessage', { name: newPlace.name })
  showSuccessMessage.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
  
  // Reset to first page to show the new place
  currentPage.value = 1
}

// View Place Modal Functions
const viewPlace = (place) => {
  selectedPlace.value = place
  showViewPlaceModal.value = true
}

const closeViewPlaceModal = () => {
  showViewPlaceModal.value = false
  selectedPlace.value = null
}

const handleEditFromView = (place) => {
  // Close view modal
  showViewPlaceModal.value = false
  // Use nextTick to ensure the view modal is fully closed before opening edit modal
  // This ensures the EditPlaceModal's watch triggers properly with the new place data
  setTimeout(() => {
    selectedPlace.value = place
    showEditPlaceModal.value = true
  }, 0)
}

// Edit Place Modal Functions
const editPlace = (place) => {
  selectedPlace.value = place
  showEditPlaceModal.value = true
}

const closeEditPlaceModal = () => {
  showEditPlaceModal.value = false
  selectedPlace.value = null
}

const handlePlaceUpdated = (updatedPlace) => {
  // Find and update the place in the list
  const index = places.value.findIndex(p => p.id === updatedPlace.id)
  if (index !== -1) {
    places.value[index] = updatedPlace
  }
  
  // Show success message
  successMessage.value = t('places.editPlace.successMessage', { name: updatedPlace.name })
  showSuccessMessage.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// Batch Import Modal Functions
const openBatchImportModal = () => {
  showBatchImportModal.value = true
}

const closeBatchImportModal = () => {
  showBatchImportModal.value = false
}

const handleBatchImportComplete = () => {
  // Refresh the places list after batch import
  fetchPlaces()
  
  // Show success message
  successMessage.value = 'Batch import completed successfully!'
  showSuccessMessage.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}
</script>
