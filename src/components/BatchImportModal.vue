<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('places.batchImport.title') }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ t('places.batchImport.subtitle') }}</p>
              </div>
              <button
                @click="closeModal"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Step Indicator -->
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center justify-center">
                <!-- Step 1 -->
                <div class="flex items-center">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors"
                    :class="currentStep === 1 ? 'bg-atipical-blue text-white' : currentStep > 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                  >
                    <span v-if="currentStep <= 1">1</span>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span
                    class="ml-2 font-medium text-sm"
                    :class="currentStep === 1 ? 'text-atipical-blue' : currentStep > 1 ? 'text-green-600' : 'text-gray-600'"
                  >
                    {{ t('places.batchImport.step1') }}
                  </span>
                </div>

                <!-- Arrow -->
                <div class="mx-3 flex-shrink-0">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <!-- Step 2 -->
                <div class="flex items-center">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors"
                    :class="currentStep === 2 ? 'bg-atipical-blue text-white' : currentStep > 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                  >
                    <span v-if="currentStep <= 2">2</span>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span
                    class="ml-2 font-medium text-sm"
                    :class="currentStep === 2 ? 'text-atipical-blue' : currentStep > 2 ? 'text-green-600' : 'text-gray-600'"
                  >
                    {{ t('places.batchImport.step2') }}
                  </span>
                </div>

                <!-- Arrow -->
                <div class="mx-3 flex-shrink-0">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <!-- Step 3 -->
                <div class="flex items-center">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors"
                    :class="currentStep === 3 ? 'bg-atipical-blue text-white' : currentStep > 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                  >
                    <span v-if="currentStep <= 3">3</span>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span
                    class="ml-2 font-medium text-sm"
                    :class="currentStep === 3 ? 'text-atipical-blue' : currentStep > 3 ? 'text-green-600' : 'text-gray-600'"
                  >
                    {{ t('places.batchImport.step3') }}
                  </span>
                </div>

                <!-- Arrow (only show if on step 4) -->
                <div v-if="currentStep === 4" class="mx-3 flex-shrink-0">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <!-- Step 4 (only show if on step 4) -->
                <div v-if="currentStep === 4" class="flex items-center">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors bg-atipical-blue text-white"
                  >
                    ✓
                  </div>
                  <span
                    class="ml-2 font-medium text-sm text-atipical-blue"
                  >
                    {{ t('places.batchImport.results.title') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Step Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Step 1: Upload -->
              <div v-if="currentStep === 1">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('places.batchImport.upload.title') }}</h3>
                
                <!-- File Upload Area -->
                <div
                  @drop.prevent="handleFileDrop"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  class="border-2 border-dashed rounded-lg p-12 text-center transition-colors"
                  :class="isDragging ? 'border-atipical-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
                >
                  <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="mt-4 text-lg text-gray-700">{{ t('places.batchImport.upload.dragDrop') }}</p>
                  <p class="mt-2 text-sm text-gray-500">{{ t('places.batchImport.upload.or') }}</p>
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".csv"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  <button
                    @click="$refs.fileInput.click()"
                    class="mt-4 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {{ t('places.batchImport.upload.browse') }}
                  </button>
                  
                  <div v-if="selectedFile" class="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-gray-700">
                      <span class="font-semibold">{{ selectedFile.name }}</span>
                      <span class="text-gray-500 ml-2">({{ formatFileSize(selectedFile.size) }})</span>
                    </p>
                  </div>
                </div>

                <!-- Download Template -->
                <div class="mt-6">
                  <button
                    @click="downloadTemplate"
                    class="flex items-center text-atipical-blue hover:text-blue-600 font-medium"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {{ t('places.batchImport.upload.downloadTemplate') }}
                  </button>
                </div>

                <!-- Format Requirements -->
                <div class="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 class="font-semibold text-gray-900 mb-3">{{ t('places.batchImport.upload.formatRequirements') }}</h4>
                  <div class="space-y-2 text-sm text-gray-700">
                    <p><strong>{{ t('places.batchImport.upload.requiredFields') }}</strong> name, description, address, rating</p>
                    <p><strong>{{ t('places.batchImport.upload.optionalFields') }}</strong> comment, imageUrl, contactInfo, site, socialLinks, serviceTypes</p>
                    <p class="text-gray-600">• {{ t('places.batchImport.upload.maxFileSize') }}</p>
                    <p class="text-gray-600">• {{ t('places.batchImport.upload.maxRows') }}</p>
                    <p class="text-gray-600 text-xs mt-2">• <strong>socialLinks:</strong> Comma-separated URLs (Instagram, Facebook)</p>
                    <p class="text-gray-600 text-xs">• <strong>serviceTypes:</strong> Comma-separated service type names in quotes</p>
                  </div>
                </div>
              </div>

              <!-- Step 2: Review -->
              <div v-if="currentStep === 2">
                <div v-if="parsedData">
                  <!-- Summary Stats -->
                  <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p class="text-lg text-gray-900">
                      {{ t('places.batchImport.review.summary', { total: parsedData.totalRows }) }} •
                      <span class="text-green-600 font-semibold">{{ t('places.batchImport.review.validCount', { count: parsedData.validRows }) }}</span> •
                      <span class="text-yellow-600 font-semibold">{{ t('places.batchImport.review.warningCount', { count: parsedData.warningRows }) }}</span> •
                      <span class="text-red-600 font-semibold">{{ t('places.batchImport.review.errorCount', { count: parsedData.errorRows }) }}</span>
                    </p>
                  </div>

                  <!-- Filter Bar -->
                  <div class="flex items-center gap-3 mb-4">
                    <button
                      @click="statusFilter = ''"
                      class="px-4 py-2 rounded-lg font-medium transition-colors"
                      :class="statusFilter === '' ? 'bg-atipical-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                      {{ t('places.batchImport.review.filterAll') }}
                    </button>
                    <button
                      @click="statusFilter = 'valid'"
                      class="px-4 py-2 rounded-lg font-medium transition-colors"
                      :class="statusFilter === 'valid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                      {{ t('places.batchImport.review.filterValid') }}
                    </button>
                    <button
                      @click="statusFilter = 'issues'"
                      class="px-4 py-2 rounded-lg font-medium transition-colors"
                      :class="statusFilter === 'issues' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                      {{ t('places.batchImport.review.filterIssues') }}
                    </button>

                    <div class="flex-1">
                      <input
                        v-model="searchQuery"
                        type="text"
                        :placeholder="t('places.batchImport.review.searchPlaceholder')"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent"
                      />
                    </div>

                    <button
                      v-if="parsedData.errorRows > 0"
                      @click="removeAllInvalid"
                      class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      {{ t('places.batchImport.review.removeAllInvalid') }}
                    </button>
                  </div>

                  <!-- Data Table -->
                  <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <div class="overflow-x-auto max-h-96 overflow-y-auto">
                      <table class="w-full">
                        <thead class="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                              {{ t('places.batchImport.review.table.row') }}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                              {{ t('places.batchImport.review.table.status') }}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                              {{ t('places.batchImport.review.table.name') }}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                              {{ t('places.batchImport.review.table.address') }}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                              {{ t('places.batchImport.review.table.rating') }}
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                              {{ t('places.batchImport.review.table.actions') }}
                            </th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                          <template v-for="place in filteredPlaces" :key="place.rowNumber">
                            <!-- Main Row -->
                            <tr class="hover:bg-gray-50 transition-colors">
                              <td class="px-4 py-3 text-sm text-gray-900">
                                {{ place.rowNumber }}
                              </td>
                              <td class="px-4 py-3">
                                <div class="relative group">
                                  <span
                                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold cursor-pointer"
                                    :class="{
                                      'bg-green-100 text-green-800': place.status === 'valid',
                                      'bg-yellow-100 text-yellow-800': place.status === 'warning',
                                      'bg-red-100 text-red-800': place.status === 'error'
                                    }"
                                    @click="toggleExpandRow(place.rowNumber)"
                                  >
                                    <span v-if="place.status === 'valid'">✓</span>
                                    <span v-if="place.status === 'warning'">⚠</span>
                                    <span v-if="place.status === 'error'">✕</span>
                                    <span class="ml-1">{{ t(`places.batchImport.review.status.${place.status}`) }}</span>
                                    <span v-if="place.errors?.length || place.warnings?.length" class="ml-1">
                                      {{ expandedRows.has(place.rowNumber) ? '▼' : '▶' }}
                                    </span>
                                  </span>
                                </div>
                              </td>
                              <td 
                                class="px-4 py-3 text-sm text-gray-900 cursor-pointer hover:bg-blue-50 transition-colors group"
                                @click="startEditing(place.rowNumber, 'name')"
                              >
                                <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'name'">
                                  <input
                                    v-model="editingCell.value"
                                    @blur="saveEdit(place)"
                                    @keyup.enter="saveEdit(place)"
                                    @keyup.esc="cancelEdit"
                                    class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ref="editInput"
                                  />
                                </div>
                                <div v-else class="flex items-center justify-between">
                                  <span>{{ place.data.name || '(empty)' }}</span>
                                  <span class="opacity-0 group-hover:opacity-100 text-blue-600 text-xs ml-2">✏️</span>
                                </div>
                              </td>
                              <td 
                                class="px-4 py-3 text-sm text-gray-600 cursor-pointer hover:bg-blue-50 transition-colors group"
                                @click="startEditing(place.rowNumber, 'address')"
                              >
                                <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'address'">
                                  <input
                                    v-model="editingCell.value"
                                    @blur="saveEdit(place)"
                                    @keyup.enter="saveEdit(place)"
                                    @keyup.esc="cancelEdit"
                                    class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ref="editInput"
                                  />
                                </div>
                                <div v-else class="flex items-center justify-between">
                                  <span>{{ truncate(place.data.address, 40) }}</span>
                                  <span class="opacity-0 group-hover:opacity-100 text-blue-600 text-xs ml-2">✏️</span>
                                </div>
                              </td>
                              <td 
                                class="px-4 py-3 text-sm text-gray-900 cursor-pointer hover:bg-blue-50 transition-colors group"
                                @click="startEditing(place.rowNumber, 'rating')"
                              >
                                <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'rating'">
                                  <input
                                    v-model.number="editingCell.value"
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    @blur="saveEdit(place)"
                                    @keyup.enter="saveEdit(place)"
                                    @keyup.esc="cancelEdit"
                                    class="w-20 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ref="editInput"
                                  />
                                </div>
                                <div v-else class="flex items-center justify-between">
                                  <span>{{ place.data.rating || '-' }}</span>
                                  <span class="opacity-0 group-hover:opacity-100 text-blue-600 text-xs ml-2">✏️</span>
                                </div>
                              </td>
                              <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                  <button
                                    @click="toggleExpandRow(place.rowNumber)"
                                    class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    :title="expandedRows.has(place.rowNumber) ? 'Collapse' : 'Expand details'"
                                  >
                                    <svg v-if="expandedRows.has(place.rowNumber)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
                                    </svg>
                                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </button>
                                  <button
                                    @click="removeRow(place.rowNumber)"
                                    class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    :title="t('places.batchImport.review.actions.remove')"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            
                            <!-- Expanded Details Row -->
                            <tr v-if="expandedRows.has(place.rowNumber)" class="bg-gray-50">
                              <td colspan="6" class="px-4 py-4">
                                <div class="space-y-3">
                                  <!-- Warnings -->
                                  <div v-if="place.warnings?.length" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div class="flex items-start">
                                      <span class="text-yellow-600 mr-2">⚠️</span>
                                      <div class="flex-1">
                                        <p class="font-semibold text-yellow-800 text-sm mb-1">Warnings:</p>
                                        <ul class="list-disc list-inside space-y-1">
                                          <li v-for="(warning, idx) in place.warnings" :key="idx" class="text-sm text-yellow-700">
                                            {{ warning }}
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <!-- Errors -->
                                  <div v-if="place.errors?.length" class="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div class="flex items-start">
                                      <span class="text-red-600 mr-2">❌</span>
                                      <div class="flex-1">
                                        <p class="font-semibold text-red-800 text-sm mb-1">Errors:</p>
                                        <ul class="list-disc list-inside space-y-1">
                                          <li v-for="(error, idx) in place.errors" :key="idx" class="text-sm text-red-700">
                                            {{ error }}
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <!-- All Fields (Editable) -->
                                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                                    <p class="font-semibold text-gray-800 text-sm mb-3">All Fields:</p>
                                    <div class="grid grid-cols-2 gap-4">
                                      <!-- Description -->
                                      <div 
                                        class="cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors group"
                                        @click="startEditing(place.rowNumber, 'description')"
                                      >
                                        <label class="text-xs text-gray-500 block mb-1">Description:</label>
                                        <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'description'">
                                          <textarea
                                            v-model="editingCell.value"
                                            @blur="saveEdit(place)"
                                            @keyup.esc="cancelEdit"
                                            class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            rows="2"
                                            ref="editInput"
                                          ></textarea>
                                        </div>
                                        <div v-else class="flex items-start justify-between">
                                          <span class="text-sm text-gray-900">{{ place.data.description || '(empty)' }}</span>
                                          <span class="opacity-0 group-hover:opacity-100 text-blue-600 text-xs ml-2">✏️</span>
                                        </div>
                                      </div>
                                      
                                      <!-- Comment -->
                                      <div 
                                        class="cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors group"
                                        @click="startEditing(place.rowNumber, 'comment')"
                                      >
                                        <label class="text-xs text-gray-500 block mb-1">Comment:</label>
                                        <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'comment'">
                                          <textarea
                                            v-model="editingCell.value"
                                            @blur="saveEdit(place)"
                                            @keyup.esc="cancelEdit"
                                            class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            rows="2"
                                            ref="editInput"
                                          ></textarea>
                                        </div>
                                        <div v-else class="flex items-start justify-between">
                                          <span class="text-sm text-gray-900">{{ place.data.comment || '(empty)' }}</span>
                                          <span class="opacity-0 group-hover:opacity-100 text-blue-600 text-xs ml-2">✏️</span>
                                        </div>
                                      </div>
                                      
                                      <!-- Image URL -->
                                      <div 
                                        class="col-span-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors group"
                                        @click="startEditing(place.rowNumber, 'imageUrl')"
                                      >
                                        <label class="text-xs text-gray-500 block mb-1">Image URL:</label>
                                        <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'imageUrl'">
                                          <input
                                            v-model="editingCell.value"
                                            @blur="saveEdit(place)"
                                            @keyup.enter="saveEdit(place)"
                                            @keyup.esc="cancelEdit"
                                            class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            ref="editInput"
                                          />
                                        </div>
                                        <div v-else class="flex items-center justify-between">
                                          <span class="text-sm text-gray-900 break-all">{{ place.data.imageUrl || '(empty)' }}</span>
                                          <span class="opacity-0 group-hover:opacity-100 text-blue-600 text-xs ml-2">✏️</span>
                                        </div>
                                      </div>
                                      
                                      <!-- Contact Info -->
                                      <div 
                                        class="cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors group"
                                        @click="startEditing(place.rowNumber, 'contactInfo')"
                                      >
                                        <label class="text-xs text-gray-500 block mb-1">{{ t('places.addPlace.contactInfo') }}:</label>
                                        <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'contactInfo'">
                                          <input
                                            v-model="editingCell.value"
                                            type="tel"
                                            @blur="saveEdit(place)"
                                            @keyup.enter="saveEdit(place)"
                                            @keyup.esc="cancelEdit"
                                            class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            ref="editInput"
                                          />
                                        </div>
                                        <div v-else class="flex items-center justify-between">
                                          <span class="text-sm text-gray-900">{{ place.data.contactInfo || '(empty)' }}</span>
                                          <span class="opacity-0 group-hover:opacity-100 text-blue-600 text-xs ml-2">✏️</span>
                                        </div>
                                      </div>
                                      
                                      <!-- Site -->
                                      <div 
                                        class="cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors group"
                                        @click="startEditing(place.rowNumber, 'site')"
                                      >
                                        <label class="text-xs text-gray-500 block mb-1">{{ t('places.addPlace.site') }}:</label>
                                        <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'site'">
                                          <input
                                            v-model="editingCell.value"
                                            type="url"
                                            @blur="saveEdit(place)"
                                            @keyup.enter="saveEdit(place)"
                                            @keyup.esc="cancelEdit"
                                            class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            ref="editInput"
                                          />
                                        </div>
                                        <div v-else class="flex items-center justify-between">
                                          <span class="text-sm text-gray-900 break-all">{{ place.data.site || '(empty)' }}</span>
                                          <span class="opacity-0 group-hover:opacity-100 text-blue-600 text-xs ml-2">✏️</span>
                                        </div>
                                      </div>
                                      
                                      <!-- Social Links with Icons -->
                                      <div class="col-span-2">
                                        <label class="text-xs text-gray-500 block mb-2">{{ t('places.addPlace.socialLinks') }}:</label>
                                        <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'socialLinks'">
                                          <input
                                            v-model="editingCell.value"
                                            type="text"
                                            @blur="saveEdit(place)"
                                            @keyup.enter="saveEdit(place)"
                                            @keyup.esc="cancelEdit"
                                            class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            ref="editInput"
                                            placeholder="https://instagram.com/account,https://facebook.com/account"
                                          />
                                        </div>
                                        <div v-else-if="place.data.socialLinks && place.data.socialLinks.length > 0" class="flex flex-wrap gap-2">
                                          <!-- Parse and display social links with icons -->
                                          <template v-for="(link, idx) in (Array.isArray(place.data.socialLinks) ? place.data.socialLinks : place.data.socialLinks.split(','))" :key="idx">
                                            <a 
                                              v-if="link && link.trim()"
                                              :href="link.trim()" 
                                              target="_blank"
                                              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                                              :class="link.includes('instagram') ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-blue-600 text-white'"
                                              @click.stop
                                            >
                                              <!-- Instagram Icon -->
                                              <svg v-if="link.includes('instagram')" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                              </svg>
                                              <!-- Facebook Icon -->
                                              <svg v-else-if="link.includes('facebook')" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                              </svg>
                                              <span>{{ extractAccountName(link.trim()) }}</span>
                                              <svg class="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                              </svg>
                                            </a>
                                          </template>
                                          <button
                                            @click="startEditing(place.rowNumber, 'socialLinks')"
                                            class="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                          >
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                            Edit
                                          </button>
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                          <span class="text-sm text-gray-400">(empty)</span>
                                          <button
                                            @click="startEditing(place.rowNumber, 'socialLinks')"
                                            class="text-xs text-blue-600 hover:text-blue-700"
                                          >
                                            + Add
                                          </button>
                                        </div>
                                      </div>
                                      
                                      <!-- Service Types with Tags -->
                                      <div class="col-span-2">
                                        <label class="text-xs text-gray-500 block mb-2">{{ t('places.addPlace.serviceTypes') }}:</label>
                                        <div v-if="editingCell.row === place.rowNumber && editingCell.field === 'serviceTypes'">
                                          <input
                                            v-model="editingCell.value"
                                            type="text"
                                            @blur="saveEdit(place)"
                                            @keyup.enter="saveEdit(place)"
                                            @keyup.esc="cancelEdit"
                                            class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            ref="editInput"
                                            placeholder="ABA, Fonoaudiologia, Psicologia"
                                          />
                                        </div>
                                        <div v-else-if="place.data.serviceTypes && place.data.serviceTypes.length > 0" class="flex flex-wrap gap-2">
                                          <!-- Parse and display service types as tags -->
                                          <template v-for="(type, idx) in (Array.isArray(place.data.serviceTypes) ? place.data.serviceTypes : place.data.serviceTypes.split(','))" :key="idx">
                                            <span 
                                              v-if="type && type.trim()"
                                              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-atipical-blue to-blue-600 text-white"
                                            >
                                              {{ type.trim() }}
                                            </span>
                                          </template>
                                          <button
                                            @click="startEditing(place.rowNumber, 'serviceTypes')"
                                            class="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                          >
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                            Edit
                                          </button>
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                          <span class="text-sm text-gray-400">(empty)</span>
                                          <button
                                            @click="startEditing(place.rowNumber, 'serviceTypes')"
                                            class="text-xs text-blue-600 hover:text-blue-700"
                                          >
                                            + Add
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>

                      <div v-if="filteredPlaces.length === 0" class="p-8 text-center text-gray-500">
                        {{ t('places.batchImport.review.noValidPlaces') }}
                      </div>
                    </div>
                  </div>

                  <!-- Selection Summary -->
                  <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-gray-700">
                      {{ t('places.batchImport.review.selection', { count: validPlacesCount }) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 3: Confirm -->
              <div v-if="currentStep === 3">
                <div class="max-w-2xl mx-auto">
                  <!-- Success Icon -->
                  <div class="flex justify-center mb-6">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <h3 class="text-2xl font-bold text-center text-gray-900 mb-2">{{ t('places.batchImport.confirm.ready') }}</h3>
                  <p class="text-center text-gray-600 mb-8">{{ t('places.batchImport.confirm.aboutToImport') }}</p>

                  <!-- Import Summary -->
                  <div class="bg-gray-50 rounded-lg p-6 space-y-3 mb-6">
                    <div class="flex items-center justify-between text-lg">
                      <span class="text-gray-700">{{ t('places.batchImport.confirm.newPlaces', { count: validPlacesCount }) }}</span>
                      <span class="font-bold text-green-600">{{ validPlacesCount }}</span>
                    </div>
                    <div v-if="skippedCount > 0" class="flex items-center justify-between text-sm">
                      <span class="text-gray-600">{{ t('places.batchImport.confirm.skipped', { count: skippedCount }) }}</span>
                      <span class="font-semibold text-red-600">{{ skippedCount }}</span>
                    </div>
                  </div>

                  <!-- Warning -->
                  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                      <svg class="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p class="font-semibold text-yellow-800">{{ t('places.batchImport.confirm.warning') }}</p>
                        <p class="text-sm text-yellow-700 mt-1">{{ t('places.batchImport.confirm.allPending') }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Progress Bar (shown during import) -->
                  <div v-if="importing" class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700">{{ t('places.batchImport.confirm.importing') }}</span>
                      <span class="text-sm font-medium text-gray-700">
                        {{ t('places.batchImport.confirm.progress', { current: importProgress.current, total: importProgress.total }) }}
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        class="bg-atipical-blue h-3 rounded-full transition-all duration-300"
                        :style="{ width: `${importProgressPercent}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 4: Results -->
              <div v-if="currentStep === 4">
                <div class="max-w-3xl mx-auto">
                  <!-- Success/Failure Icon -->
                  <div class="flex justify-center mb-6">
                    <div 
                      class="w-24 h-24 rounded-full flex items-center justify-center"
                      :class="{
                        'bg-green-100': importResults.success && importResults.failed === 0,
                        'bg-yellow-100': importResults.success && importResults.failed > 0,
                        'bg-red-100': !importResults.success
                      }"
                    >
                      <!-- Success Icon -->
                      <svg v-if="importResults.success && importResults.failed === 0" class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <!-- Partial Success Icon -->
                      <svg v-else-if="importResults.success && importResults.failed > 0" class="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <!-- Error Icon -->
                      <svg v-else class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>

                  <!-- Title -->
                  <h3 
                    class="text-3xl font-bold text-center mb-2"
                    :class="{
                      'text-green-600': importResults.success && importResults.failed === 0,
                      'text-yellow-600': importResults.success && importResults.failed > 0,
                      'text-red-600': !importResults.success
                    }"
                  >
                    {{ importResults.success && importResults.failed === 0 ? t('places.batchImport.results.success') : 
                       importResults.success && importResults.failed > 0 ? t('places.batchImport.results.partialSuccess') : 
                       t('places.batchImport.results.failed') }}
                  </h3>

                  <!-- Message -->
                  <p class="text-center text-gray-600 mb-8">
                    {{ importResults.success && importResults.failed === 0 ? t('places.batchImport.results.successMessage') : 
                       importResults.success && importResults.failed > 0 ? t('places.batchImport.results.partialMessage') : 
                       t('places.batchImport.results.failedMessage') }}
                  </p>

                  <!-- Statistics -->
                  <div class="bg-gray-50 rounded-lg p-6 mb-6">
                    <div class="grid grid-cols-2 gap-4">
                      <!-- Total Processed -->
                      <div class="bg-white rounded-lg p-4 text-center">
                        <p class="text-sm text-gray-600 mb-1">{{ t('places.batchImport.results.stats.total') }}</p>
                        <p class="text-3xl font-bold text-gray-900">{{ importResults.total || 0 }}</p>
                      </div>
                      
                      <!-- Successfully Imported -->
                      <div class="bg-white rounded-lg p-4 text-center">
                        <p class="text-sm text-gray-600 mb-1">{{ t('places.batchImport.results.stats.imported') }}</p>
                        <p class="text-3xl font-bold text-green-600">{{ importResults.imported || 0 }}</p>
                      </div>
                      
                      <!-- Failed -->
                      <div v-if="importResults.failed > 0" class="bg-white rounded-lg p-4 text-center">
                        <p class="text-sm text-gray-600 mb-1">{{ t('places.batchImport.results.stats.failed') }}</p>
                        <p class="text-3xl font-bold text-red-600">{{ importResults.failed }}</p>
                      </div>
                      
                      <!-- Skipped -->
                      <div v-if="skippedCount > 0" class="bg-white rounded-lg p-4 text-center">
                        <p class="text-sm text-gray-600 mb-1">{{ t('places.batchImport.results.stats.skipped') }}</p>
                        <p class="text-3xl font-bold text-gray-600">{{ skippedCount }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Failed Items Details (if any) -->
                  <div v-if="importResults.failedItems && importResults.failedItems.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 class="font-semibold text-red-800 mb-3">{{ t('places.batchImport.results.failedItems') }}</h4>
                    <div class="space-y-2 max-h-48 overflow-y-auto">
                      <div 
                        v-for="(item, idx) in importResults.failedItems" 
                        :key="idx"
                        class="bg-white rounded p-3 text-sm"
                      >
                        <p class="font-medium text-gray-900">Row {{ item.rowNumber }}: {{ item.name }}</p>
                        <p class="text-red-600 text-xs mt-1">{{ item.error }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center justify-center gap-3">
                    <button
                      v-if="!importResults.success"
                      @click="goBack"
                      class="px-6 py-3 bg-white border-2 border-atipical-blue text-atipical-blue rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      {{ t('places.batchImport.results.actions.goBack') }}
                    </button>
                    
                    <button
                      v-if="!importResults.success"
                      @click="resetToStep1"
                      class="px-6 py-3 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      {{ t('places.batchImport.results.actions.tryAgain') }}
                    </button>
                    
                    <button
                      v-if="importResults.success"
                      @click="resetToStep1"
                      class="px-6 py-3 bg-white border-2 border-atipical-blue text-atipical-blue rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      {{ t('places.batchImport.results.actions.startNew') }}
                    </button>
                    
                    <button
                      v-if="importResults.success"
                      @click="closeAndRefresh"
                      class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      {{ t('places.batchImport.results.actions.close') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div v-if="currentStep < 4" class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <button
                  v-if="currentStep > 1"
                  @click="goBack"
                  class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  ← {{ t('places.batchImport.back') }}
                </button>
              </div>

              <div class="flex items-center space-x-3">
                <button
                  @click="closeModal"
                  class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  {{ t('places.batchImport.cancel') }}
                </button>
                
                <button
                  v-if="currentStep === 1"
                  @click="uploadFile"
                  :disabled="!selectedFile || uploading"
                  class="px-6 py-2 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  <span v-if="uploading">{{ t('places.batchImport.upload.uploading') }}</span>
                  <span v-else>{{ t('places.batchImport.upload.uploadButton') }}</span>
                </button>

                <button
                  v-if="currentStep === 2"
                  @click="goToConfirm"
                  :disabled="!parsedData || validPlacesCount === 0"
                  class="px-6 py-2 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  {{ t('places.batchImport.next') }} →
                </button>

                <button
                  v-if="currentStep === 3"
                  @click="confirmImport"
                  :disabled="importing"
                  class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  <span v-if="importing">{{ t('places.batchImport.confirm.importing') }}</span>
                  <span v-else>{{ t('places.batchImport.confirm.confirmButton') }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from '../utils/axios';
import { useAuthStore } from '../store/auth';

const { t } = useI18n();
const authStore = useAuthStore();

// Props & Emits
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'import-complete']);

// State
const currentStep = ref(1);
const selectedFile = ref(null);
const isDragging = ref(false);
const uploading = ref(false);
const importing = ref(false);
const parsedData = ref(null);
const fileInput = ref(null);
const statusFilter = ref('');
const searchQuery = ref('');
const importProgress = ref({ current: 0, total: 0 });
const selectedRowForEdit = ref(null);
const selectedRowForView = ref(null);
const expandedRows = ref(new Set());
const editingCell = ref({ row: null, field: null, value: null });
const editInput = ref(null);
const importResults = ref({
  success: false,
  total: 0,
  imported: 0,
  failed: 0,
  failedItems: []
});

// Computed
const filteredPlaces = computed(() => {
  if (!parsedData.value) return [];
  
  let places = parsedData.value.places;
  
  // Filter by status
  if (statusFilter.value === 'valid') {
    places = places.filter(p => p.status === 'valid');
  } else if (statusFilter.value === 'issues') {
    places = places.filter(p => p.status === 'warning' || p.status === 'error');
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    places = places.filter(p => 
      p.data.name?.toLowerCase().includes(query) ||
      p.data.address?.toLowerCase().includes(query)
    );
  }
  
  return places;
});

const validPlacesCount = computed(() => {
  if (!parsedData.value) return 0;
  return parsedData.value.places.filter(p => p.status === 'valid' || p.status === 'warning').length;
});

const skippedCount = computed(() => {
  if (!parsedData.value) return 0;
  return parsedData.value.errorRows;
});

const importProgressPercent = computed(() => {
  if (importProgress.value.total === 0) return 0;
  return Math.round((importProgress.value.current / importProgress.value.total) * 100);
});

// Reset state when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetModal();
  }
});

// Helper function to extract account name from social media URL
const extractAccountName = (url) => {
  if (!url) return '';
  
  try {
    // Remove trailing slashes and whitespace
    const cleanUrl = url.trim().replace(/\/+$/, '');
    
    // Extract the last part of the URL (account/username)
    const parts = cleanUrl.split('/');
    const accountPart = parts[parts.length - 1];
    
    // Remove query parameters if any
    const account = accountPart.split('?')[0];
    
    return account ? `@${account}` : '';
  } catch (error) {
    console.error('Error extracting account name:', error);
    return '';
  }
};

// Methods
const resetModal = () => {
  currentStep.value = 1;
  selectedFile.value = null;
  isDragging.value = false;
  uploading.value = false;
  importing.value = false;
  parsedData.value = null;
  statusFilter.value = '';
  searchQuery.value = '';
  importProgress.value = { current: 0, total: 0 };
  expandedRows.value = new Set();
  editingCell.value = { row: null, field: null, value: null };
  importResults.value = {
    success: false,
    total: 0,
    imported: 0,
    failed: 0,
    failedItems: []
  };
};

const closeModal = () => {
  if (!uploading.value && !importing.value) {
    emit('close');
  }
};

const handleBackdropClick = () => {
  if (!uploading.value && !importing.value) {
    closeModal();
  }
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
};

const handleFile = (file) => {
  // Validate file type
  if (!file.name.endsWith('.csv')) {
    alert(t('places.batchImport.messages.invalidFormat'));
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert(t('places.batchImport.messages.fileTooLarge'));
    return;
  }

  selectedFile.value = file;
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const downloadTemplate = () => {
  // Generate CSV template client-side
  const csvContent = [
    'name,description,address,rating,comment,imageUrl,contactInfo,site,socialLinks,serviceTypes',
    '"Sunset Beach Bar","Beautiful beachside bar with ocean views","123 Ocean Drive, Miami, FL",4.5,"Great sunset views","https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800","+1-305-555-0123","https://sunsetbeachbar.com","https://www.instagram.com/sunsetbeachbar,https://www.facebook.com/sunsetbeachbar","Bar, Restaurante, Música ao vivo"',
    '"Mountain Cafe","Cozy mountain retreat","456 Summit Road, Denver, CO",5.0,"Excellent coffee","https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800","+1-970-555-0456","https://mountaincafe.com","https://www.instagram.com/mountaincafe","Cafeteria, Padaria"',
    '"Art Gallery","Contemporary art space","789 Main Street, New York, NY",4.0,"Monthly exhibitions","","+1-212-555-0789","https://artgallery.com","https://www.instagram.com/artgallery,https://www.facebook.com/artgallery","Galeria de Arte"'
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'places_import_template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  uploading.value = true;

  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);

    const response = await axios.post('/api/places/batch/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      parsedData.value = response.data.data;
      currentStep.value = 2;
      
      // Show notification
      console.log('Upload successful:', parsedData.value);
    }
  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle specific error codes
    if (error.response?.data?.error) {
      const { code, message } = error.response.data.error;
      let errorMessage = message;
      
      switch (code) {
        case 'FILE_TOO_LARGE':
          errorMessage = t('places.batchImport.messages.fileTooLarge');
          break;
        case 'INVALID_FILE_FORMAT':
          errorMessage = t('places.batchImport.messages.invalidFormat');
          break;
        case 'TOO_MANY_ROWS':
          errorMessage = t('places.batchImport.messages.tooManyRows');
          break;
        case 'INVALID_CSV_HEADERS':
          errorMessage = t('places.batchImport.messages.invalidHeaders');
          break;
      }
      
      alert(errorMessage);
    } else {
      alert(t('places.batchImport.messages.networkError'));
    }
  } finally {
    uploading.value = false;
  }
};

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const goToConfirm = () => {
  if (validPlacesCount.value > 0) {
    currentStep.value = 3;
  }
};

const truncate = (str, maxLength) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

const removeRow = (rowNumber) => {
  if (!parsedData.value) return;
  
  parsedData.value.places = parsedData.value.places.filter(p => p.rowNumber !== rowNumber);
  
  // Recalculate stats
  recalculateStats();
};

const removeAllInvalid = () => {
  if (!parsedData.value) return;
  
  if (confirm('Remove all rows with errors?')) {
    parsedData.value.places = parsedData.value.places.filter(p => p.status !== 'error');
    recalculateStats();
  }
};

const recalculateStats = () => {
  if (!parsedData.value) return;
  
  parsedData.value.totalRows = parsedData.value.places.length;
  parsedData.value.validRows = parsedData.value.places.filter(p => p.status === 'valid').length;
  parsedData.value.warningRows = parsedData.value.places.filter(p => p.status === 'warning').length;
  parsedData.value.errorRows = parsedData.value.places.filter(p => p.status === 'error').length;
};

const viewRow = (place) => {
  selectedRowForView.value = place;
  // For now, just console log - will add modal later
  console.log('View row:', place);
  alert(`Row ${place.rowNumber}:\n\nName: ${place.data.name}\nAddress: ${place.data.address}\nRating: ${place.data.rating}`);
};

const editRow = (place) => {
  selectedRowForEdit.value = place;
  // For now, just console log - will add modal later
  console.log('Edit row:', place);
  alert('Edit modal will be implemented next');
};

const toggleExpandRow = (rowNumber) => {
  if (expandedRows.value.has(rowNumber)) {
    expandedRows.value.delete(rowNumber);
  } else {
    expandedRows.value.add(rowNumber);
  }
  // Trigger reactivity
  expandedRows.value = new Set(expandedRows.value);
};

const startEditing = (rowNumber, field) => {
  const place = parsedData.value.places.find(p => p.rowNumber === rowNumber);
  if (!place) return;
  
  editingCell.value = {
    row: rowNumber,
    field: field,
    value: place.data[field] || ''
  };
  
  // Focus input in next tick
  nextTick(() => {
    if (editInput.value) {
      if (Array.isArray(editInput.value)) {
        editInput.value[0]?.focus();
      } else {
        editInput.value?.focus();
      }
    }
  });
};

const saveEdit = (place) => {
  if (editingCell.value.row && editingCell.value.field) {
    // Update the place data
    place.data[editingCell.value.field] = editingCell.value.value;
    
    // Clear editing state
    editingCell.value = { row: null, field: null, value: null };
  }
};

const cancelEdit = () => {
  editingCell.value = { row: null, field: null, value: null };
};

const confirmImport = async () => {
  if (!parsedData.value || validPlacesCount.value === 0) return;

  importing.value = true;
  
  // Prepare payload - only valid and warning rows
  const placesToImport = parsedData.value.places
    .filter(p => p.status === 'valid' || p.status === 'warning')
    .map(p => {
      const placeData = { ...p.data };
      
      // Convert socialLinks array back to comma-separated string
      if (Array.isArray(placeData.socialLinks)) {
        placeData.socialLinks = placeData.socialLinks.join(',');
      }
      
      // Convert serviceTypes array back to comma-separated string
      if (Array.isArray(placeData.serviceTypes)) {
        placeData.serviceTypes = placeData.serviceTypes.join(', ');
      }
      
      return placeData;
    });

  importProgress.value = { current: 0, total: placesToImport.length };

  try {
    const response = await axios.post('/api/places/batch/import', {
      places: placesToImport
    });

    if (response.data.success) {
      const { imported, failed, results } = response.data.data;
      
      // Prepare results for step 4
      importResults.value = {
        success: true,
        total: placesToImport.length,
        imported: imported,
        failed: failed || 0,
        failedItems: results?.filter(r => !r.success).map(r => {
          // Find the original place data by rowNumber to get the name
          const originalPlace = parsedData.value.places.find(p => p.rowNumber === r.rowNumber);
          return {
            rowNumber: r.rowNumber,
            name: originalPlace?.data?.name || r.name || 'Unknown',
            error: r.error || r.message || 'Unknown error'
          };
        }) || []
      };
      
      // Go to results step
      currentStep.value = 4;
    }
  } catch (error) {
    console.error('Import error:', error);
    
    // Show error in step 4
    importResults.value = {
      success: false,
      total: placesToImport.length,
      imported: 0,
      failed: placesToImport.length,
      failedItems: [{
        rowNumber: 0,
        name: 'System Error',
        error: error.response?.data?.message || error.message || t('places.batchImport.messages.importError')
      }]
    };
    
    currentStep.value = 4;
  } finally {
    importing.value = false;
    importProgress.value = { current: 0, total: 0 };
  }
};

const resetToStep1 = () => {
  resetModal();
};

const closeAndRefresh = () => {
  emit('import-complete');
  closeModal();
};
</script>
