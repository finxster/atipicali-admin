<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 class="text-xl font-bold text-gray-900">{{ t('news.viewModal.title') }}</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Article Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6">
        <!-- Header Image -->
        <div v-if="article.imageUrl && article.imageUrl.trim()" class="mb-6 rounded-lg overflow-hidden border border-gray-300">
          <img
            :src="article.imageUrl"
            :alt="article.title"
            class="w-full h-64 object-cover"
            @error="imageLoadError = true"
          />
          <div v-if="imageLoadError" class="mt-2 text-sm text-red-600 flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ t('news.viewModal.imageLoadError') }}</span>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ article.title }}</h1>

        <!-- Meta Information -->
        <div class="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="font-medium">{{ article.author }}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ article.readingTime }}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(article.createdAt) }}</span>
          </div>
        </div>

        <!-- Summary -->
        <div class="mb-6 p-4 bg-blue-50 border-l-4 border-atipical-blue rounded">
          <div class="prose prose-blue max-w-none text-gray-700" v-html="article.summary"></div>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
          <div v-html="article.content"></div>
        </div>

        <!-- Metadata Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="font-medium">{{ t('news.form.id') }}:</span>
                <span class="ml-2 font-mono">{{ article.id }}</span>
              </div>
              <div>
                <span class="font-medium">{{ t('news.form.updatedAt') }}:</span>
                <span class="ml-2">{{ formatDateTime(article.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {{ t('common.close') }}
        </button>
        <button
          @click="$emit('edit', article)"
          class="px-4 py-2 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {{ t('common.edit') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
defineProps({
  article: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['close', 'edit'])

// State
const imageLoadError = ref(false)

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* Custom prose styles for better HTML rendering */
.prose {
  color: #374151;
}

.prose :deep(h1) {
  font-size: 2em;
  font-weight: 700;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.prose :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}

.prose :deep(p) {
  margin-top: 1em;
  margin-bottom: 1em;
  line-height: 1.75;
}

.prose :deep(ul), .prose :deep(ol) {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.prose :deep(li) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.prose :deep(a:hover) {
  color: #1d4ed8;
}

.prose :deep(strong) {
  font-weight: 600;
}

.prose :deep(em) {
  font-style: italic;
}

.prose :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  font-style: italic;
  color: #6b7280;
  margin: 1.5em 0;
}

.prose :deep(code) {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: monospace;
}

.prose :deep(pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5em 0;
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}

.prose :deep(th), .prose :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5em 1em;
  text-align: left;
}

.prose :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>
