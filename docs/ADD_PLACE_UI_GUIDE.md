# Add Place Modal - UI/UX Design Guide

## Modal Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Add New Place                                          [X]      │
│  Fill in the details below to create a new place                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Place Name *                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Enter the name of the place                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Description *                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Describe this place...                                   │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║ 📍 Location Information                                   ║ │
│  ║ Start typing to search for an address                     ║ │
│  ║                                                           ║ │
│  ║ Address *                                            [⟳] ║ │
│  ║ ┌─────────────────────────────────────────────────┐      ║ │
│  ║ │ Enter the full address                          │      ║ │
│  ║ └─────────────────────────────────────────────────┘      ║ │
│  ║ ┌─────────────────────────────────────────────────┐      ║ │
│  ║ │ 📍 123 Main St, City, Country                    │      ║ │
│  ║ │ 📍 456 Oak Ave, City, Country                    │      ║ │
│  ║ │ 📍 789 Pine Rd, City, Country                    │      ║ │
│  ║ └─────────────────────────────────────────────────┘      ║ │
│  ║            ↑ Autocomplete dropdown                        ║ │
│  ║                                                           ║ │
│  ║ ┌─────────────────────────────────────────────────────┐ ║ │
│  ║ │              [INTERACTIVE MAP PREVIEW]               │ ║ │
│  ║ │       (Shows selected address with pin marker)       │ ║ │
│  ║ │              [Open in Maps button]                   │ ║ │
│  ║ └─────────────────────────────────────────────────────┘ ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
│                                                                   │
│  Comment (optional)                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Add any additional notes...                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Image URL (optional)                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ https://example.com/image.jpg                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  [IMAGE PREVIEW]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Rating *                                                        │
│  ★ ★ ★ ★ ★  4/5                                                 │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                      [Cancel]  [Create Place]    │
└─────────────────────────────────────────────────────────────────┘
```

## Interactive Elements

### 1. Address Autocomplete
```
Type: "123 Main"
    ↓
┌──────────────────────────────────────┐
│ 📍 123 Main Street, City, Country   │ ← Hover/select with arrow keys
│ 📍 123 Main Ave, City, Country      │
│ 📍 123 Main Boulevard, City, Country│
└──────────────────────────────────────┘
    ↓ (Select with click or Enter key)
Address filled + Coordinates calculated automatically
    ↓
Map preview appears
```

### 2. Star Rating Component
```
Click to rate:
☆ ☆ ☆ ☆ ☆  (Unselected - gray)
↓ (user clicks 4th star)
★ ★ ★ ★ ☆  4/5 (Selected - yellow)
```

### 3. Map Preview (Interactive Iframe)
```
┌────────────────────────┐
│   🗺️ OpenStreetMap     │
│        📍 Pin          │  ← Embedded interactive map
│   [Open Map button]    │  ← Click to open in new tab
└────────────────────────┘
```

### 4. Image Preview (Live)
```
Type URL: https://example.com/photo.jpg
    ↓ (debounced, validates URL)
┌────────────────────────┐
│   [Image appears]      │  ← Live preview
│   [if valid URL]       │
└────────────────────────┘

If invalid:
❌ Failed to load image. Please check the URL.
```

## Color Scheme

- **Primary Blue** (atipical-blue): Action buttons, focus states
- **Green**: Success states, approved status
- **Yellow**: Star ratings, warning states
- **Red**: Errors, delete actions, required field indicators
- **Gray**: Neutral elements, borders, placeholders
- **Blue-50**: Location info box background

## Responsive Behavior

### Desktop (>768px)
- Modal: 900px max-width, centered
- Two-column grid for lat/lng
- Full-size map preview (600x400px)

### Tablet (768px - 1024px)
- Modal: 90% width, centered
- Two-column grid maintained
- Scaled map preview

### Mobile (<768px)
- Modal: Full screen
- Single column layout
- Smaller map preview (100% width, 250px height)
- Touch-optimized star rating

## Animations

1. **Modal Entrance**
   - Backdrop: Fade in (200ms)
   - Modal: Fade + scale up (200ms)

2. **Modal Exit**
   - Backdrop: Fade out (200ms)
   - Modal: Fade + scale down (200ms)

3. **Star Hover**
   - Scale: 1.0 → 1.1 (smooth)
   
4. **Submit Button**
   - Loading: Rotate spinner (infinite)
   - Success: Brief pulse before close

## Validation States

### Valid Field
```
┌─────────────────────────┐
│ Lisboa, Portugal        │  ← Blue border on focus
└─────────────────────────┘
```

### Invalid Field
```
┌─────────────────────────┐
│ [empty]                 │  ← Red border
└─────────────────────────┘
❌ Address is required
```

### Loading State
```
[⟳ Creating...]  ← Button disabled, spinner visible
```

## User Flow

```
1. User clicks "Add New Place" button
   ↓
2. Modal slides in with smooth animation
   ↓
3. User fills basic info (name, description)
   ↓
4. User types in address field (3+ characters)
   ↓
5. Autocomplete suggestions appear from Google Places
   ↓
6. User selects address from dropdown
   → Coordinates automatically calculated
   → Map preview appears/updates
   ↓
7. User adds optional image URL
   → Image preview appears live
   ↓
8. User clicks stars to rate (1-5)
   ↓
9. User reviews form
   → "Create Place" button enabled when valid
   ↓
10. User clicks "Create Place"
    → Loading spinner shows
    ↓
11. Success!
    → Modal closes
    → New place appears at top of list
    → Success notification displays
```

## Accessibility Features

- ✓ Keyboard navigation (Tab, Shift+Tab, Arrow keys in autocomplete)
- ✓ ESC key to close modal or autocomplete
- ✓ Enter key to select from autocomplete
- ✓ Clear focus indicators
- ✓ Screen reader labels
- ✓ ARIA attributes
- ✓ High contrast ratios
- ✓ Error announcements

## Error Handling Examples

### Autocomplete Error
```
(User types but no suggestions appear)
← Fails silently, user can still type full address
```

### Network Error
```
❌ Failed to create place. Please try again.
   [Try Again button]
```

### Invalid/Missing Coordinates
```
Address: [empty or no selection made]
❌ Please select a valid address from the suggestions
```

### Broken Image URL
```
Image URL: https://broken-link.com/img.jpg
❌ Failed to load image. Please check the URL.
```

## Best Practices Implemented

1. ✅ **Progressive Enhancement**
   - Works with keyboard only
   - Works without image preview
   - Graceful API failure handling

2. ✅ **Performance**
   - Debounced autocomplete (300ms)
   - Lazy loading for map iframe
   - Optimized image previews
   - Minimal API calls

3. ✅ **Security**
   - Google API key hidden via proxy
   - URL validation for images
   - XSS prevention
   - CORS-safe API calls

4. ✅ **Usability**
   - Clear labels and instructions
   - Helpful placeholders
   - Real-time feedback
   - Smart defaults (rating = 5)
   - Autocomplete with keyboard navigation

5. ✅ **Internationalization**
   - All text translatable
   - RTL-ready structure
   - Locale-aware formatting
   - Locale-aware formatting
