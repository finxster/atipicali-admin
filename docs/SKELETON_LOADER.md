# SkeletonLoader Component

A reusable skeleton loader component that provides a loading state UI similar to Facebook, Instagram, and other modern applications.

## Location
`src/components/SkeletonLoader.vue`

## Purpose
Provides visual feedback to users while data is being loaded, improving perceived performance and user experience.

## Usage

### Basic Example
```vue
<template>
  <div>
    <SkeletonLoader v-if="loading" width="200px" height="20px" />
    <p v-else>{{ actualContent }}</p>
  </div>
</template>

<script setup>
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { ref } from 'vue'

const loading = ref(true)
const actualContent = ref('')
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | String | `'100%'` | Width of the skeleton. Can be px, rem, %, or 'full' |
| `height` | String | `'1rem'` | Height of the skeleton. Can be px, rem, or any CSS unit |
| `customClass` | String | `''` | Additional Tailwind classes to apply |
| `circle` | Boolean | `false` | Makes the skeleton circular (useful for avatars) |

## Examples

### Text Loading
```vue
<!-- Single line text -->
<SkeletonLoader width="150px" height="16px" />

<!-- Paragraph with multiple lines -->
<div class="space-y-2">
  <SkeletonLoader width="full" height="14px" />
  <SkeletonLoader width="90%" height="14px" />
  <SkeletonLoader width="80%" height="14px" />
</div>
```

### Statistics Card
```vue
<div class="card">
  <h3>Total Users</h3>
  <SkeletonLoader v-if="loading" width="80px" height="2rem" />
  <p v-else class="text-2xl">{{ totalUsers }}</p>
</div>
```

### Avatar/Image
```vue
<!-- Square image -->
<SkeletonLoader width="48px" height="48px" />

<!-- Circular avatar -->
<SkeletonLoader width="48px" height="48px" :circle="true" />
```

### Table Row
```vue
<tr v-if="loading">
  <td><SkeletonLoader width="120px" height="16px" /></td>
  <td><SkeletonLoader width="full" height="14px" /></td>
  <td><SkeletonLoader width="70px" height="20px" /></td>
  <td>
    <div class="flex space-x-2">
      <SkeletonLoader width="32px" height="32px" />
      <SkeletonLoader width="32px" height="32px" />
    </div>
  </td>
</tr>
```

### Button
```vue
<SkeletonLoader width="100px" height="36px" custom-class="rounded-lg" />
```

### Badge/Tag
```vue
<SkeletonLoader width="70px" height="20px" custom-class="rounded-full" />
```

## Implementation in Views

### DashboardView
- Statistics cards (Total Users, Total Places)
- Shows skeleton while fetching dashboard data

### PlacesView
- Table rows with skeleton loaders for all columns
- Displays 5 skeleton rows while loading places
- Includes skeleton for: name, address, status badge, rating, image, and action buttons

## Best Practices

1. **Match Content Size**: Make skeleton dimensions similar to actual content
2. **Use Appropriate Count**: Show 3-5 skeleton items for lists/tables
3. **Maintain Layout**: Skeleton should preserve the layout structure
4. **Animation**: Built-in `animate-pulse` provides smooth loading effect
5. **Conditional Rendering**: Always use `v-if/v-else` pattern

## Styling

The component uses:
- `animate-pulse` - Tailwind's pulse animation
- `bg-gray-200` - Light gray background
- `rounded` - Rounded corners (can be overridden with customClass)

## Future Enhancements

- [ ] Add different animation types (shimmer, wave)
- [ ] Add dark mode support
- [ ] Add preset shapes (card, button, avatar, etc.)
- [ ] Add timing configuration

## Related Components

- All views with loading states should use this component
- Consider using for forms, cards, modals during async operations
