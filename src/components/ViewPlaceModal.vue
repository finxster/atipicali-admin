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
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen && place"
            class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('places.viewPlace.title') }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ t('places.viewPlace.subtitle') }}</p>
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

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <div class="space-y-6">
                <!-- ID -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.id') }}
                  </label>
                  <p class="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    {{ place.id }}
                  </p>
                </div>

                <!-- Name -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.name') }}
                  </label>
                  <p class="text-base font-semibold text-gray-900">{{ place.name }}</p>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.status') }}
                  </label>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="getStatusClass(place.status)"
                  >
                    <span
                      class="w-2 h-2 rounded-full mr-2"
                      :class="getStatusDotClass(place.status)"
                    ></span>
                    {{ t(`places.status.${place.status}`) }}
                  </span>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.description') }}
                  </label>
                  <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ place.description }}</p>
                </div>

                <!-- Address & Location Section -->
                <div class="bg-blue-50 rounded-lg p-4 space-y-4">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="flex-1">
                      <h3 class="text-sm font-semibold text-gray-900">{{ t('places.viewPlace.locationInfo') }}</h3>
                    </div>
                  </div>

                  <!-- Address -->
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-2">
                      {{ t('places.viewPlace.address') }}
                    </label>
                    <p class="text-sm text-gray-700">{{ place.address }}</p>
                  </div>

                  <!-- Coordinates -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-2">
                        {{ t('places.viewPlace.latitude') }}
                      </label>
                      <p class="text-sm font-mono text-gray-700">{{ place.latitude }}</p>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-2">
                        {{ t('places.viewPlace.longitude') }}
                      </label>
                      <p class="text-sm font-mono text-gray-700">{{ place.longitude }}</p>
                    </div>
                  </div>

                  <!-- Map Preview -->
                  <div v-if="hasValidCoordinates" class="rounded-lg overflow-hidden border border-gray-300">
                    <div class="relative bg-gray-100 h-64">
                      <iframe
                        :src="mapPreviewUrl"
                        class="w-full h-full border-0"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        title="Map preview"
                      ></iframe>
                      <a
                        :href="mapPreviewLink"
                        target="_blank"
                        class="absolute top-2 right-2 bg-white px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-shadow text-xs font-medium text-gray-700 hover:text-atipical-blue flex items-center space-x-1"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>{{ t('places.viewPlace.openMap') }}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Rating -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.rating') }}
                  </label>
                  <div class="flex items-center space-x-2">
                    <div class="flex items-center space-x-0.5">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        class="w-6 h-6"
                        :class="star <= place.rating ? 'text-yellow-400' : 'text-gray-300'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="text-lg font-semibold text-gray-700">{{ place.rating }}/5</span>
                  </div>
                </div>

                <!-- Comment -->
                <div v-if="place.comment && place.comment.trim()">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.comment') }}
                  </label>
                  <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">{{ place.comment }}</p>
                </div>

                <!-- Image -->
                <div v-if="place.imageUrl && place.imageUrl.trim()">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.image') }}
                  </label>
                  <div class="rounded-lg overflow-hidden border border-gray-300">
                    <img
                      :src="place.imageUrl"
                      :alt="place.name"
                      class="w-full h-64 object-cover"
                      @error="imageLoadError = true"
                    />
                  </div>
                  <div v-if="imageLoadError" class="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ t('places.viewPlace.imageLoadError') }}</span>
                  </div>
                </div>

                <!-- Timestamps (if available) -->
                <div v-if="place.createdAt || place.updatedAt" class="pt-4 border-t border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                    <div v-if="place.createdAt">
                      <span class="font-semibold">{{ t('places.viewPlace.createdAt') }}:</span>
                      {{ formatDate(place.createdAt) }}
                    </div>
                    <div v-if="place.updatedAt">
                      <span class="font-semibold">{{ t('places.viewPlace.updatedAt') }}:</span>
                      {{ formatDate(place.updatedAt) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
              <button
                @click="$emit('edit', place)"
                class="px-5 py-2.5 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>{{ t('places.viewPlace.editButton') }}</span>
              </button>
              <button
                @click="closeModal"
                class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {{ t('places.viewPlace.close') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  place: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'edit'])

const imageLoadError = ref(false)

// Check if coordinates are valid
const hasValidCoordinates = computed(() => {
  if (!props.place) return false
  const lat = props.place.latitude
  const lng = props.place.longitude
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && (lat !== 0 || lng !== 0)
})

// Generate map preview URL
const mapPreviewUrl = computed(() => {
  if (!hasValidCoordinates.value || !props.place) return null
  const { latitude, longitude } = props.place
  return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
})

// Generate map link for opening in browser
const mapPreviewLink = computed(() => {
  if (!hasValidCoordinates.value || !props.place) return '#'
  const { latitude, longitude } = props.place
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`
})

// Get status styling classes
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

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleString()
  } catch (e) {
    return dateString
  }
}

// Close modal
const closeModal = () => {
  imageLoadError.value = false
  emit('close')
}

// Reset image error when place changes
watch(() => props.place, () => {
  imageLoadError.value = false
})

// Close on Escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Add event listener for Escape key
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>
