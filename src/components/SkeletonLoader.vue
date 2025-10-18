<template>
  <div :class="['animate-pulse', 'bg-gray-200', 'rounded', customClass]" :style="customStyle"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Width of the skeleton (e.g., '100px', '50%', 'full')
  width: {
    type: String,
    default: '100%'
  },
  // Height of the skeleton (e.g., '20px', '4rem')
  height: {
    type: String,
    default: '1rem'
  },
  // Additional custom classes
  customClass: {
    type: String,
    default: ''
  },
  // Circular skeleton for avatars
  circle: {
    type: Boolean,
    default: false
  }
})

const customStyle = computed(() => {
  const style = {}
  
  if (props.width === 'full') {
    style.width = '100%'
  } else if (props.width) {
    style.width = props.width
  }
  
  if (props.height) {
    style.height = props.height
  }
  
  if (props.circle) {
    style.borderRadius = '50%'
  }
  
  return style
})
</script>
