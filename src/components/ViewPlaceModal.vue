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
        class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black bg-opacity-50"
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
            class="bg-white sm:rounded-xl shadow-2xl w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 class="text-lg sm:text-2xl font-bold text-gray-900">{{ t('places.viewPlace.title') }}</h2>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ t('places.viewPlace.subtitle') }}</p>
              </div>
              <button
                @click="closeModal"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6">
              <div class="space-y-4 sm:space-y-6">
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

                <!-- Contact & Links Section -->
                <div v-if="hasContactInfo || (place.socialLinks && place.socialLinks.length > 0)" class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 space-y-4">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div class="flex-1">
                      <h3 class="text-sm font-semibold text-gray-900">{{ t('places.viewPlace.contactInfo') }}</h3>
                    </div>
                  </div>

                  <!-- Contact Info Items -->
                  <div v-if="place.contactInfo && place.contactInfo.length > 0" class="space-y-3">
                    <div 
                      v-for="(contact, index) in place.contactInfo"
                      :key="contact.id || index"
                      class="flex items-start space-x-2"
                    >
                      <div class="flex-1">
                        <label class="block text-xs font-semibold text-gray-600 mb-1 flex items-center space-x-1">
                          <!-- Icon based on type -->
                          <svg v-if="contact.type === 'PHONE'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <svg v-else-if="contact.type === 'EMAIL'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <svg v-else-if="contact.type === 'WHATSAPP'" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <svg v-else-if="contact.type === 'SITE'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <span>{{ t(`places.contactType.${contact.type}`) }}</span>
                          <span v-if="contact.isPrimary" class="ml-1 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {{ t('places.viewPlace.primary') }}
                          </span>
                        </label>
                        <a 
                          :href="getContactUrl(contact)"
                          :target="contact.type === 'SITE' ? '_blank' : undefined"
                          :rel="contact.type === 'SITE' ? 'noopener noreferrer' : undefined"
                          class="text-sm text-gray-700 hover:text-atipical-blue transition-colors font-medium inline-flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-atipical-blue break-all"
                        >
                          <span>{{ contact.contactValue }}</span>
                          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <!-- Social Media -->
                  <div v-if="place.socialLinks && place.socialLinks.length > 0">
                    <label class="block text-xs font-semibold text-gray-600 mb-2">
                      {{ t('places.viewPlace.socialMedia') }}
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <a
                        v-for="(link, index) in place.socialLinks"
                        :key="index"
                        :href="getSocialMediaUrl(link)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-atipical-blue transition-all hover:shadow-md group"
                      >
                        <!-- Instagram Icon -->
                        <svg v-if="link.platform === 'INSTAGRAM'" class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <!-- Facebook Icon -->
                        <svg v-if="link.platform === 'FACEBOOK'" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span class="text-sm font-medium text-gray-700 group-hover:text-atipical-blue">@{{ link.account }}</span>
                        <svg class="w-3.5 h-3.5 text-gray-400 group-hover:text-atipical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Service Types -->
                <div v-if="place.serviceTypes && place.serviceTypes.length > 0">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.serviceTypes') }}
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(serviceType, index) in place.serviceTypes"
                      :key="index"
                      class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-atipical-blue to-blue-500 text-white rounded-full text-sm font-medium shadow-sm"
                    >
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ getServiceTypeLabel(serviceType) }}
                    </span>
                  </div>
                </div>

                <!-- Image -->
                <div v-if="place.imageUrl && place.imageUrl.trim()">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.viewPlace.image') }}
                  </label>
                  <div v-if="!imageLoadError" class="rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
                    <img
                      :src="place.imageUrl"
                      :alt="place.name"
                      class="w-full h-64 object-cover"
                      @error="handleImageError"
                      loading="lazy"
                    />
                  </div>
                  <div v-if="imageLoadError" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                    <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-red-800">{{ t('places.viewPlace.imageLoadError') }}</p>
                      <p class="text-xs text-red-600 mt-1">The image URL is invalid or inaccessible.</p>
                    </div>
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

const { t, locale } = useI18n()

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

// Service types configuration (not needed for display but kept for consistency)
const serviceTypesConfig = [
  { id: '1', labelEn: 'Multidisciplinary Clinic', labelPt: 'Clínica Multidisciplinar' },
  { id: '2', labelEn: 'ABA', labelPt: 'ABA' },
  { id: '3', labelEn: 'Speech Therapy', labelPt: 'Fonoaudiologia' },
  { id: '4', labelEn: 'Occupational Therapy', labelPt: 'Terapia Ocupacional' },
  { id: '5', labelEn: 'Psychology', labelPt: 'Psicologia' }
]

// Get service type label for display from serviceType object
const getServiceTypeLabel = (serviceType) => {
  // If serviceType is an object with namePt and nameEn (from GET response)
  if (serviceType && typeof serviceType === 'object') {
    const isEnglish = locale.value === 'en'
    return isEnglish ? serviceType.nameEn : serviceType.namePt
  }
  // Fallback: if it's just an ID string, try to find it in config
  const config = serviceTypesConfig.find(st => st.id === serviceType)
  if (!config) return serviceType
  const isEnglish = locale.value === 'en'
  return isEnglish ? config.labelEn : config.labelPt
}

// Get social media URL
const getSocialMediaUrl = (link) => {
  if (link.platform === 'INSTAGRAM') {
    return `https://instagram.com/${link.account}`
  } else if (link.platform === 'FACEBOOK') {
    return `https://facebook.com/${link.account}`
  }
  return '#'
}

// Get contact URL based on type
const getContactUrl = (contact) => {
  switch (contact.type) {
    case 'PHONE':
      return `tel:${contact.contactValue}`
    case 'EMAIL':
      return `mailto:${contact.contactValue}`
    case 'WHATSAPP':
      // Remove any non-numeric characters for WhatsApp
      const phoneNumber = contact.contactValue.replace(/\D/g, '')
      return `https://wa.me/${phoneNumber}`
    case 'SITE':
      return contact.contactValue
    default:
      return '#'
  }
}

// Check if place has contact info
const hasContactInfo = computed(() => {
  return props.place && props.place.contactInfo && props.place.contactInfo.length > 0
})

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

// Handle image load error
const handleImageError = () => {
  try {
    imageLoadError.value = true
  } catch (error) {
    console.error('Error handling image load error:', error)
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
