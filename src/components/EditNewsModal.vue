<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
    <div class="bg-white sm:rounded-xl shadow-2xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900">{{ t('news.editModal.title') }}</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto">
        <div class="px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('news.form.title') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent"
              :placeholder="t('news.form.titlePlaceholder')"
            />
          </div>

          <!-- Author -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('news.form.author') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.author"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent"
              :placeholder="t('news.form.authorPlaceholder')"
            />
          </div>

          <!-- Reading Time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('news.form.readingTime') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.readingTime"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent"
              :placeholder="t('news.form.readingTimePlaceholder')"
            />
            <p class="mt-1 text-xs text-gray-500">{{ t('news.form.readingTimeHint') }}</p>
          </div>

          <!-- Summary (HTML) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('news.form.summary') }} <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.summary"
              required
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent font-mono text-sm"
              :placeholder="t('news.form.summaryPlaceholder')"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">{{ t('news.form.htmlHint') }}</p>
          </div>

          <!-- Content (HTML) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('news.form.content') }} <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.content"
              required
              rows="12"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent font-mono text-sm"
              :placeholder="t('news.form.contentPlaceholder')"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">{{ t('news.form.htmlHint') }}</p>
          </div>

          <!-- Image URL -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ t('news.form.imageUrl') }}
              <span class="text-gray-400 text-xs font-normal ml-1">{{ t('news.form.optional') }}</span>
            </label>
            <input
              v-model="form.imageUrl"
              type="url"
              :placeholder="t('news.form.imageUrlPlaceholder')"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.imageUrl }"
              @input="handleImageUrlInput"
            />
            <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">{{ errors.imageUrl }}</p>
            
            <!-- Image Preview -->
            <div v-if="imagePreview" class="mt-3 rounded-lg overflow-hidden border border-gray-300">
              <img
                :src="imagePreview"
                :alt="t('news.form.imagePreview')"
                class="w-full h-48 object-cover"
                @error="handleImageError"
              />
            </div>
          </div>

          <!-- Preview Section -->
          <div class="border-t pt-4">
            <button
              type="button"
              @click="showPreview = !showPreview"
              class="flex items-center gap-2 text-sm font-medium text-atipical-blue hover:text-blue-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ showPreview ? t('news.form.hidePreview') : t('news.form.showPreview') }}
            </button>
            
            <div v-if="showPreview" class="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 class="text-lg font-bold mb-2">{{ form.title }}</h3>
              <div class="text-sm text-gray-600 mb-2">
                {{ form.author }} • {{ form.readingTime }}
              </div>
              <div class="prose prose-sm max-w-none mb-4">
                <div v-html="form.summary"></div>
              </div>
              <div class="prose max-w-none">
                <div v-html="form.content"></div>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <span class="font-medium">{{ t('news.form.createdAt') }}:</span>
                {{ formatDate(article.createdAt) }}
              </div>
              <div>
                <span class="font-medium">{{ t('news.form.updatedAt') }}:</span>
                {{ formatDate(article.updatedAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? t('common.saving') : t('common.saveChanges') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/utils/axios'

const { t } = useI18n()

// Props
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'news-updated', 'error'])

// State
const loading = ref(false)
const showPreview = ref(false)
const imagePreview = ref('')
const errors = ref({})
const form = ref({
  title: '',
  summary: '',
  content: '',
  readingTime: '',
  author: '',
  imageUrl: ''
})

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSubmit = async () => {
  try {
    loading.value = true
    await api.put(`/api/news/${props.article.id}`, form.value)
    emit('news-updated')
  } catch (error) {
    console.error('Error updating news:', error)
    emit('error', t('news.errors.updateFailed'))
  } finally {
    loading.value = false
  }
}

const handleImageUrlInput = () => {
  if (errors.value.imageUrl) {
    delete errors.value.imageUrl
  }
}

const handleImageError = () => {
  errors.value.imageUrl = t('news.form.imageLoadError')
}

// Watchers
watch(() => form.value.imageUrl, (newUrl) => {
  if (newUrl && newUrl.trim()) {
    imagePreview.value = newUrl
  } else {
    imagePreview.value = ''
  }
})

// Lifecycle
onMounted(() => {
  form.value = {
    title: props.article.title || '',
    summary: props.article.summary || '',
    content: props.article.content || '',
    readingTime: props.article.readingTime || '',
    author: props.article.author || '',
    imageUrl: props.article.imageUrl || ''
  }
  
  if (props.article.imageUrl && props.article.imageUrl.trim()) {
    imagePreview.value = props.article.imageUrl
  }
})
</script>

<style scoped>
.prose {
  max-width: 100%;
}
</style>
