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
                <h2 class="text-2xl font-bold text-gray-900">{{ t('places.editPlace.title') }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ t('places.editPlace.subtitle') }}</p>
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
                <!-- ID (Read-only) -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {{ t('places.editPlace.id') }}
                  </label>
                  <p class="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    {{ formData.id }}
                  </p>
                </div>

                <!-- Name -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.editPlace.name') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    :placeholder="t('places.editPlace.namePlaceholder')"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.name }"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.editPlace.description') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="formData.description"
                    required
                    rows="3"
                    :placeholder="t('places.editPlace.descriptionPlaceholder')"
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
                      <h3 class="text-sm font-semibold text-gray-900">{{ t('places.editPlace.locationInfo') }}</h3>
                      <p class="text-xs text-gray-600 mt-1">{{ t('places.editPlace.locationHelp') }}</p>
                    </div>
                  </div>

                  <!-- Address -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      {{ t('places.editPlace.address') }}
                      <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        ref="addressInput"
                        v-model="formData.address"
                        type="text"
                        required
                        :placeholder="t('places.editPlace.addressPlaceholder')"
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
                        <span>{{ t('places.editPlace.openMap') }}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Image URL -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.editPlace.imageUrl') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.editPlace.optional') }}</span>
                  </label>
                  <input
                    v-model="formData.imageUrl"
                    type="url"
                    :placeholder="t('places.editPlace.imageUrlPlaceholder')"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.imageUrl }"
                    @input="handleImageUrlInput"
                  />
                  <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">{{ errors.imageUrl }}</p>
                  
                  <!-- Image Preview -->
                  <div v-if="imagePreview" class="mt-3 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      :src="imagePreview"
                      :alt="t('places.editPlace.imagePreview')"
                      class="w-full h-48 object-cover"
                      @error="handleImageError"
                    />
                  </div>
                </div>

                <!-- Contact Info -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.editPlace.contactInfo') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.editPlace.optional') }}</span>
                  </label>
                  <div class="space-y-3">
                    <div 
                      v-for="(contact, index) in formData.contactInfo" 
                      :key="index"
                      class="flex items-start space-x-2"
                    >
                      <select
                        v-model="contact.type"
                        class="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                      >
                        <option value="PHONE">{{ t('places.contactType.PHONE') }}</option>
                        <option value="EMAIL">{{ t('places.contactType.EMAIL') }}</option>
                        <option value="WHATSAPP">{{ t('places.contactType.WHATSAPP') }}</option>
                        <option value="SITE">{{ t('places.contactType.SITE') }}</option>
                      </select>
                      <input
                        v-model="contact.contactValue"
                        :type="contact.type === 'EMAIL' ? 'email' : contact.type === 'SITE' ? 'url' : 'text'"
                        :placeholder="getContactPlaceholder(contact.type)"
                        class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                      />
                      <label class="flex items-center space-x-1 px-3 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          v-model="contact.isPrimary"
                          @change="handlePrimaryChange(index)"
                          class="w-4 h-4 text-atipical-blue rounded focus:ring-atipical-blue"
                        />
                        <span class="text-sm text-gray-700">{{ t('places.editPlace.primary') }}</span>
                      </label>
                      <button
                        type="button"
                        @click="removeContactInfo(index)"
                        class="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        :title="t('places.editPlace.removeContact')"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addContactInfo"
                      class="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-atipical-blue hover:text-atipical-blue transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>{{ t('places.editPlace.addContact') }}</span>
                    </button>
                  </div>
                </div>

                <!-- Social Links -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.editPlace.socialLinks') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.editPlace.optional') }}</span>
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
                          :placeholder="t('places.editPlace.socialAccountPlaceholder')"
                          class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atipical-blue focus:border-transparent transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        @click="removeSocialLink(index)"
                        class="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        :title="t('places.editPlace.removeSocialLink')"
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
                      <span>{{ t('places.editPlace.addSocialLink') }}</span>
                    </button>
                  </div>
                </div>

                <!-- Service Types -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t('places.editPlace.serviceTypes') }}
                    <span class="text-gray-400 text-xs font-normal ml-1">{{ t('places.editPlace.optional') }}</span>
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
                      <option value="">{{ t('places.editPlace.selectServiceType') }}</option>
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
                  <p class="mt-1 text-xs text-gray-500">{{ t('places.editPlace.serviceTypesHint') }}</p>
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
                {{ t('places.editPlace.cancel') }}
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
                <span>{{ isSubmitting ? t('places.editPlace.submitting') : t('places.editPlace.submit') }}</span>
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
  },
  place: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const formData = ref({
  id: '',
  name: '',
  description: '',
  address: '',
  latitude: 0,
  longitude: 0,
  imageUrl: '',
  status: 'PENDING',
  contactInfo: [],
  socialLinks: [],
  serviceTypes: []
})

const errors = ref({})
const isSubmitting = ref(false)
const imagePreview = ref(null)
const imageLoadError = ref(false)
const selectedServiceType = ref('')

// Service types - fetched from API
const serviceTypes = ref([])
const loadingServiceTypes = ref(false)

// Fetch service types from API
const fetchServiceTypes = async () => {
  loadingServiceTypes.value = true
  try {
    const response = await apiClient.get('/api/admin/service-types')
    serviceTypes.value = response.data
  } catch (err) {
    console.error('Error fetching service types:', err)
    // Fallback to empty array if fetch fails
    serviceTypes.value = []
  } finally {
    loadingServiceTypes.value = false
  }
}

// Computed property for available service types based on current locale
const availableServiceTypes = computed(() => {
  const isEnglish = locale.value === 'en'
  return serviceTypes.value.map(st => ({
    value: isEnglish ? st.nameEn : st.namePt,
    label: isEnglish ? st.nameEn : st.namePt,
    id: st.id
  }))
})

// Get service type label for display (it's already the name string)
const getServiceTypeLabel = (name) => {
  return name
}

// Get contact placeholder based on type
const getContactPlaceholder = (type) => {
  const placeholders = {
    'PHONE': t('places.editPlace.contactPlaceholder.phone'),
    'EMAIL': t('places.editPlace.contactPlaceholder.email'),
    'WHATSAPP': t('places.editPlace.contactPlaceholder.whatsapp'),
    'SITE': t('places.editPlace.contactPlaceholder.site')
  }
  return placeholders[type] || ''
}

// Add contact info
const addContactInfo = () => {
  formData.value.contactInfo.push({
    type: 'PHONE',
    contactValue: '',
    isPrimary: formData.value.contactInfo.length === 0
  })
}

// Remove contact info
const removeContactInfo = (index) => {
  const wasPrimary = formData.value.contactInfo[index].isPrimary
  formData.value.contactInfo.splice(index, 1)
  
  // If we removed the primary contact and there are still contacts, make the first one primary
  if (wasPrimary && formData.value.contactInfo.length > 0) {
    formData.value.contactInfo[0].isPrimary = true
  }
}

// Handle primary checkbox change
const handlePrimaryChange = (index) => {
  // If this contact is being set as primary, unset all others
  if (formData.value.contactInfo[index].isPrimary) {
    formData.value.contactInfo.forEach((contact, i) => {
      if (i !== index) {
        contact.isPrimary = false
      }
    })
  }
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

// Watch for place changes to populate form
watch([() => props.place, () => props.isOpen], ([newPlace, isOpen]) => {
  try {
    if (newPlace && isOpen) {
      // Fetch service types when modal opens
      fetchServiceTypes()
      
      // Extract service type names based on current locale from serviceTypes objects
      const isEnglish = locale.value === 'en'
      const serviceTypeNames = newPlace.serviceTypes 
        ? newPlace.serviceTypes.map(st => isEnglish ? st.nameEn : st.namePt)
        : []
      
      formData.value = {
        id: newPlace.id,
        name: newPlace.name || '',
        description: newPlace.description || '',
        address: newPlace.address || '',
        latitude: newPlace.latitude || 0,
        longitude: newPlace.longitude || 0,
        imageUrl: newPlace.imageUrl || '',
        status: newPlace.status || 'PENDING',
        contactInfo: newPlace.contactInfo ? [...newPlace.contactInfo] : [],
        socialLinks: newPlace.socialLinks ? [...newPlace.socialLinks] : [],
        serviceTypes: serviceTypeNames
      }
      
      // Set image preview if URL exists
      if (newPlace.imageUrl && newPlace.imageUrl.trim()) {
        imagePreview.value = newPlace.imageUrl
      } else {
        imagePreview.value = null
      }
      imageLoadError.value = false
      selectedServiceType.value = ''
    }
  } catch (error) {
    console.error('Error loading place data:', error)
  }
}, { immediate: true })

// Check if coordinates are valid
const hasValidCoordinates = computed(() => {
  const lat = formData.value.latitude
  const lng = formData.value.longitude
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && (lat !== 0 || lng !== 0)
})

// Generate map preview URL
const mapPreviewUrl = computed(() => {
  if (!hasValidCoordinates.value) return null
  const { latitude, longitude } = formData.value
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
    hasValidCoordinates.value
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
  if (errors.value.address) {
    delete errors.value.address
  }
  
  if (addressDebounceTimer) {
    clearTimeout(addressDebounceTimer)
  }
  
  const query = formData.value.address.trim()
  
  if (query.length < 3) {
    addressSuggestions.value = []
    showAddressSuggestions.value = false
    return
  }
  
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
  
  showAddressSuggestions.value = false
  addressSuggestions.value = []
  
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
  try {
    imageLoadError.value = true
    imagePreview.value = null
    errors.value.imageUrl = t('places.editPlace.imageLoadError')
  } catch (error) {
    console.error('Error handling image load error:', error)
  }
}

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = t('places.editPlace.errors.nameRequired')
  }
  
  if (!formData.value.description.trim()) {
    errors.value.description = t('places.editPlace.errors.descriptionRequired')
  }
  
  if (!formData.value.address.trim()) {
    errors.value.address = t('places.editPlace.errors.addressRequired')
  }
  
  if (!hasValidCoordinates.value) {
    errors.value.address = t('places.editPlace.errors.invalidCoordinates')
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
      imageUrl: formData.value.imageUrl.trim(),
      contactInfo: formData.value.contactInfo
        .filter(contact => contact.contactValue.trim() !== '')
        .map(contact => ({
          type: contact.type,
          contactValue: contact.contactValue.trim(),
          isPrimary: contact.isPrimary
        })),
      socialLinks: formData.value.socialLinks
        .filter(link => link.account.trim() !== '')
        .map(link => ({
          platform: link.platform,
          account: link.account.trim()
        })),
      serviceTypes: formData.value.serviceTypes
    }
    
    const response = await apiClient.put(`/api/places/${formData.value.id}`, payload)
    
    // Success!
    isSubmitting.value = false
    emit('success', response.data)
    closeModal()
  } catch (error) {
    console.error('Error updating place:', error)
    
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value.general = error.response?.data?.message || t('places.editPlace.errors.general')
    }
    isSubmitting.value = false
  }
}

// Close modal
const closeModal = () => {
  if (!isSubmitting.value) {
    errors.value = {}
    imageLoadError.value = false
    addressSuggestions.value = []
    showAddressSuggestions.value = false
    selectedServiceType.value = ''
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
