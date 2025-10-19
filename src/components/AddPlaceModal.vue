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
            v-if="isOpen"
            class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('places.addPlace.title') }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ t('places.addPlace.subtitle') }}</p>
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

            <!-- Form Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.name') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    :placeholder="t('places.addPlace.namePlaceholder')"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.name }"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.description') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="formData.description"
                    required
                    rows="3"
                    :placeholder="t('places.addPlace.descriptionPlaceholder')"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all resize-none"
                    :class="{ 'border-red-500': errors.description }"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                </div>

                <!-- Address & Location Section -->
                <div class="bg-blue-50 rounded-lg p-4 space-y-4">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="flex-1">
                      <h3 class="text-sm font-semibold text-gray-900">{{ t('places.addPlace.locationInfo') }}</h3>
                      <p class="text-xs text-gray-600 mt-1">{{ t('places.addPlace.locationHelp') }}</p>
                    </div>
                  </div>

                  <!-- Address -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      {{ t('places.addPlace.address') }}
                      <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        ref="addressInput"
                        v-model="formData.address"
                        type="text"
                        required
                        :placeholder="t('places.addPlace.addressPlaceholder')"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                        :class="{ 'border-red-500': errors.address }"
                        @input="handleAddressInput"
                        @focus="showAddressSuggestions = true"
                        @blur="handleAddressBlur"
                        @keydown.down.prevent="navigateSuggestions(1)"
                        @keydown.up.prevent="navigateSuggestions(-1)"
                        @keydown.enter.prevent="selectSuggestion(selectedSuggestionIndex)"
                        @keydown.escape="showAddressSuggestions = false"
                        autocomplete="off"
                      />
                      
                      <!-- Autocomplete Dropdown -->
                      <div
                        v-if="showAddressSuggestions && addressSuggestions.length > 0"
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        <button
                          v-for="(suggestion, index) in addressSuggestions"
                          :key="suggestion.place_id"
                          type="button"
                          @mousedown.prevent="selectSuggestion(index)"
                          class="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start space-x-2"
                          :class="{ 'bg-blue-50': index === selectedSuggestionIndex }"
                        >
                          <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">{{ suggestion.structured_formatting?.main_text || suggestion.description }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ suggestion.structured_formatting?.secondary_text || '' }}</p>
                          </div>
                        </button>
                      </div>
                      
                      <!-- Loading indicator -->
                      <div
                        v-if="isLoadingAddressSuggestions"
                        class="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <svg class="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </div>
                    <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
                  </div>

                  <!-- Map Preview -->
                  <div v-if="hasValidCoordinates" class="rounded-lg overflow-hidden border border-gray-300">
                    <div class="relative bg-gray-100 h-48">
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
                        <span>{{ t('places.addPlace.openMap') }}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Comment (Optional) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.comment') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.addPlace.optional') }}</span>
                  </label>
                  <textarea
                    v-model="formData.comment"
                    rows="2"
                    :placeholder="t('places.addPlace.commentPlaceholder')"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>

                <!-- Image URL -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.imageUrl') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.addPlace.optional') }}</span>
                  </label>
                  <input
                    v-model="formData.imageUrl"
                    type="url"
                    :placeholder="t('places.addPlace.imageUrlPlaceholder')"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.imageUrl }"
                    @input="handleImageUrlInput"
                  />
                  <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">{{ errors.imageUrl }}</p>
                  
                  <!-- Image Preview -->
                  <div v-if="imagePreview" class="mt-3 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      :src="imagePreview"
                      :alt="t('places.addPlace.imagePreview')"
                      class="w-full h-48 object-cover"
                      @error="handleImageError"
                    />
                  </div>
                </div>

                <!-- Rating -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.rating') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="flex items-center space-x-2">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      @click="formData.rating = star"
                      class="focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg
                        class="w-8 h-8"
                        :class="star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                    <span class="text-lg font-semibold text-gray-700 ml-2">{{ formData.rating }}/5</span>
                  </div>
                </div>

                <!-- Contact Info (Phone) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.contactInfo') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.addPlace.optional') }}</span>
                  </label>
                  <input
                    v-model="formData.contactInfo"
                    type="tel"
                    :placeholder="t('places.addPlace.contactInfoPlaceholder')"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                  />
                  <p class="mt-1 text-xs text-gray-500">{{ t('places.addPlace.contactInfoHint') }}</p>
                </div>

                <!-- Website -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.site') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.addPlace.optional') }}</span>
                  </label>
                  <input
                    v-model="formData.site"
                    type="url"
                    :placeholder="t('places.addPlace.sitePlaceholder')"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.site }"
                  />
                  <p v-if="errors.site" class="mt-1 text-sm text-red-600">{{ errors.site }}</p>
                </div>

                <!-- Social Links -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.socialLinks') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.addPlace.optional') }}</span>
                  </label>
                  <div class="space-y-3">
                    <div 
                      v-for="(link, index) in formData.socialLinks" 
                      :key="index"
                      class="flex items-start space-x-2"
                    >
                      <select
                        v-model="link.platform"
                        class="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                      >
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="FACEBOOK">Facebook</option>
                      </select>
                      <div class="flex-1 relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                        <input
                          v-model="link.account"
                          type="text"
                          :placeholder="t('places.addPlace.socialAccountPlaceholder')"
                          class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        @click="removeSocialLink(index)"
                        class="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        :title="t('places.addPlace.removeSocialLink')"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addSocialLink"
                      class="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-atipical-blue hover:text-atipical-blue transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>{{ t('places.addPlace.addSocialLink') }}</span>
                    </button>
                  </div>
                </div>

                <!-- Service Types -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.addPlace.serviceTypes') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.addPlace.optional') }}</span>
                  </label>
                  
                  <!-- Selected Service Types (Tags) -->
                  <div v-if="formData.serviceTypes.length > 0" class="flex flex-wrap gap-2 mb-3">
                    <span
                      v-for="(serviceType, index) in formData.serviceTypes"
                      :key="index"
                      class="inline-flex items-center px-3 py-1.5 bg-atipical-blue text-white rounded-full text-sm font-medium"
                    >
                      <span>{{ getServiceTypeLabel(serviceType) }}</span>
                      <button
                        type="button"
                        @click="removeServiceType(index)"
                        class="ml-2 hover:bg-blue-600 rounded-full p-0.5 transition-colors"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  </div>
                  
                  <!-- Service Type Selector -->
                  <div class="relative">
                    <select
                      v-model="selectedServiceType"
                      @change="addServiceType"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                    >
                      <option value="">{{ t('places.addPlace.selectServiceType') }}</option>
                      <option
                        v-for="option in availableServiceTypes"
                        :key="option.value"
                        :value="option.value"
                        :disabled="formData.serviceTypes.includes(option.value)"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">{{ t('places.addPlace.serviceTypesHint') }}</p>
                </div>
              </form>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 flex-shrink-0">
              <button
                type="button"
                @click="closeModal"
                :disabled="isSubmitting"
                class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('places.addPlace.cancel') }}
              </button>
              <button
                type="submit"
                @click="handleSubmit"
                :disabled="isSubmitting || !isFormValid"
                class="px-5 py-2.5 bg-atipical-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? t('places.addPlace.submitting') : t('places.addPlace.submit') }}</span>
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
import apiClient from '@/utils/axios'

const { t, locale } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const formData = ref({
  name: '',
  description: '',
  address: '',
  latitude: 0,
  longitude: 0,
  comment: '',
  imageUrl: '',
  rating: 5,
  contactInfo: '',
  site: '',
  socialLinks: [],
  serviceTypes: []
})

const errors = ref({})
const isSubmitting = ref(false)
const imagePreview = ref(null)
const imageLoadError = ref(false)
const selectedServiceType = ref('')

// Service types configuration with both English and Portuguese names
const serviceTypesConfig = [
  { nameEn: 'Multidisciplinary Clinic', namePt: 'Clínica Multidisciplinar' },
  { nameEn: 'ABA', namePt: 'ABA' },
  { nameEn: 'Speech Therapy', namePt: 'Fonoaudiologia' },
  { nameEn: 'Occupational Therapy', namePt: 'Terapia Ocupacional' },
  { nameEn: 'Psychology', namePt: 'Psicologia' }
]

// Computed property for available service types based on current locale
const availableServiceTypes = computed(() => {
  const isEnglish = locale.value === 'en'
  return serviceTypesConfig.map(st => ({
    value: isEnglish ? st.nameEn : st.namePt,
    label: isEnglish ? st.nameEn : st.namePt
  }))
})

// Get service type label for display (it's already the name string)
const getServiceTypeLabel = (name) => {
  return name
}

// Add social link
const addSocialLink = () => {
  formData.value.socialLinks.push({
    platform: 'INSTAGRAM',
    account: ''
  })
}

// Remove social link
const removeSocialLink = (index) => {
  formData.value.socialLinks.splice(index, 1)
}

// Add service type
const addServiceType = () => {
  if (selectedServiceType.value && !formData.value.serviceTypes.includes(selectedServiceType.value)) {
    formData.value.serviceTypes.push(selectedServiceType.value)
  }
  selectedServiceType.value = ''
}

// Remove service type
const removeServiceType = (index) => {
  formData.value.serviceTypes.splice(index, 1)
}

// Address autocomplete state
const addressInput = ref(null)
const addressSuggestions = ref([])
const showAddressSuggestions = ref(false)
const isLoadingAddressSuggestions = ref(false)
const selectedSuggestionIndex = ref(0)
let addressDebounceTimer = null

// Check if coordinates are valid
const hasValidCoordinates = computed(() => {
  const lat = formData.value.latitude
  const lng = formData.value.longitude
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && (lat !== 0 || lng !== 0)
})

// Generate map preview URL - using OpenStreetMap embed
const mapPreviewUrl = computed(() => {
  if (!hasValidCoordinates.value) return null
  const { latitude, longitude } = formData.value
  // This is used for iframe embedding
  return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
})

// Generate map link for opening in browser
const mapPreviewLink = computed(() => {
  if (!hasValidCoordinates.value) return '#'
  const { latitude, longitude } = formData.value
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`
})

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.name.trim() !== '' &&
    formData.value.description.trim() !== '' &&
    formData.value.address.trim() !== '' &&
    hasValidCoordinates.value &&
    formData.value.rating >= 1 &&
    formData.value.rating <= 5
  )
})

// Watch for image URL changes
watch(() => formData.value.imageUrl, (newUrl) => {
  if (newUrl && !imageLoadError.value) {
    imagePreview.value = newUrl
  } else {
    imagePreview.value = null
  }
  imageLoadError.value = false
})

// Handle address input with autocomplete
const handleAddressInput = () => {
  // Clear address error
  if (errors.value.address) {
    delete errors.value.address
  }
  
  // Clear previous timer
  if (addressDebounceTimer) {
    clearTimeout(addressDebounceTimer)
  }
  
  const query = formData.value.address.trim()
  
  // Don't search if query is too short
  if (query.length < 3) {
    addressSuggestions.value = []
    showAddressSuggestions.value = false
    return
  }
  
  // Debounce the API call
  addressDebounceTimer = setTimeout(async () => {
    await fetchAddressSuggestions(query)
  }, 300)
}

// Fetch address suggestions from Google Places API via proxy
const fetchAddressSuggestions = async (query) => {
  if (!query || query.length < 3) return
  
  isLoadingAddressSuggestions.value = true
  selectedSuggestionIndex.value = 0
  
  try {
    const encodedQuery = encodeURIComponent(query)
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedQuery}&types=address`
    const proxyUrl = `https://atipicali.com/maps-proxy/?url=${encodeURIComponent(googleApiUrl)}`
    
    const response = await fetch(proxyUrl)
    const data = await response.json()
    
    if (data.status === 'OK' && data.predictions) {
      addressSuggestions.value = data.predictions
      showAddressSuggestions.value = true
    } else {
      addressSuggestions.value = []
      showAddressSuggestions.value = false
    }
  } catch (error) {
    console.error('Error fetching address suggestions:', error)
    addressSuggestions.value = []
    showAddressSuggestions.value = false
  } finally {
    isLoadingAddressSuggestions.value = false
  }
}

// Navigate through suggestions with keyboard
const navigateSuggestions = (direction) => {
  if (addressSuggestions.value.length === 0) return
  
  selectedSuggestionIndex.value += direction
  
  if (selectedSuggestionIndex.value < 0) {
    selectedSuggestionIndex.value = addressSuggestions.value.length - 1
  } else if (selectedSuggestionIndex.value >= addressSuggestions.value.length) {
    selectedSuggestionIndex.value = 0
  }
}

// Select a suggestion
const selectSuggestion = async (index) => {
  if (index < 0 || index >= addressSuggestions.value.length) return
  
  const suggestion = addressSuggestions.value[index]
  formData.value.address = suggestion.description
  
  // Hide suggestions
  showAddressSuggestions.value = false
  addressSuggestions.value = []
  
  // Fetch place details to get coordinates
  await fetchPlaceDetails(suggestion.place_id)
}

// Fetch place details to get coordinates
const fetchPlaceDetails = async (placeId) => {
  try {
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry`
    const proxyUrl = `https://atipicali.com/maps-proxy/?url=${encodeURIComponent(googleApiUrl)}`
    
    const response = await fetch(proxyUrl)
    const data = await response.json()
    
    if (data.status === 'OK' && data.result?.geometry?.location) {
      const location = data.result.geometry.location
      formData.value.latitude = parseFloat(location.lat.toFixed(6))
      formData.value.longitude = parseFloat(location.lng.toFixed(6))
    }
  } catch (error) {
    console.error('Error fetching place details:', error)
  }
}

// Handle address blur
const handleAddressBlur = () => {
  // Delay to allow click on suggestion
  setTimeout(() => {
    showAddressSuggestions.value = false
  }, 200)
}


// Handle image URL input
const handleImageUrlInput = () => {
  if (errors.value.imageUrl) {
    delete errors.value.imageUrl
  }
  imageLoadError.value = false
}

// Handle image load error
const handleImageError = () => {
  imageLoadError.value = true
  imagePreview.value = null
  errors.value.imageUrl = t('places.addPlace.imageLoadError')
}

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = t('places.addPlace.errors.nameRequired')
  }
  
  if (!formData.value.description.trim()) {
    errors.value.description = t('places.addPlace.errors.descriptionRequired')
  }
  
  if (!formData.value.address.trim()) {
    errors.value.address = t('places.addPlace.errors.addressRequired')
  }
  
  if (!hasValidCoordinates.value) {
    errors.value.address = t('places.addPlace.errors.invalidCoordinates')
  }
  
  if (formData.value.rating < 1 || formData.value.rating > 5) {
    errors.value.rating = t('places.addPlace.errors.ratingInvalid')
  }
  
  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const payload = {
      name: formData.value.name.trim(),
      description: formData.value.description.trim(),
      address: formData.value.address.trim(),
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      comment: formData.value.comment.trim(),
      imageUrl: formData.value.imageUrl.trim(),
      rating: formData.value.rating,
      contactInfo: formData.value.contactInfo.trim(),
      site: formData.value.site.trim(),
      socialLinks: formData.value.socialLinks
        .filter(link => link.account.trim() !== '')
        .map(link => ({
          platform: link.platform,
          account: link.account.trim()
        })),
      serviceTypes: formData.value.serviceTypes
    }
    
    const response = await apiClient.post('/api/places', payload)
    
    // Success!
    isSubmitting.value = false
    emit('success', response.data)
    closeModal()
  } catch (error) {
    console.error('Error creating place:', error)
    
    // Handle validation errors from backend
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value.general = error.response?.data?.message || t('places.addPlace.errors.general')
    }
    isSubmitting.value = false
  }
}

// Reset form
const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    comment: '',
    imageUrl: '',
    rating: 5,
    contactInfo: '',
    site: '',
    socialLinks: [],
    serviceTypes: []
  }
  errors.value = {}
  imagePreview.value = null
  imageLoadError.value = false
  selectedServiceType.value = ''
}

// Close modal
const closeModal = () => {
  if (!isSubmitting.value) {
    resetForm()
    emit('close')
  }
}

// Close on Escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen && !isSubmitting.value) {
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
