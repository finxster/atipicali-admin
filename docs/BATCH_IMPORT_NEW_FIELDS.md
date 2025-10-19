# Batch Import Update - New Fields Summary

## Date: October 19, 2025

## Overview
Updated the batch import feature to support the four new fields that were recently added to the Add/Edit Place forms:
1. **contactInfo** (phone number)
2. **site** (website URL)
3. **socialLinks** (Instagram/Facebook URLs)
4. **serviceTypes** (service type names)

---

## CSV Format Specifications

### Field Formats

#### contactInfo
- **Type:** String
- **Format:** Any phone format
- **Example:** `"+55 11 98765-4321"` or `"+1-305-555-0123"`

#### site
- **Type:** String
- **Format:** Full website URL
- **Example:** `"https://sunsetbeachbar.com"`

#### socialLinks
- **Type:** String (parsed to array)
- **Format:** Comma-separated full URLs
- **Example:** `"https://www.instagram.com/little_tea_sp/,https://www.facebook.com/little_tea_sp/"`
- **Backend Processing:**
  - Splits by comma
  - Detects platform from URL (instagram.com → INSTAGRAM)
  - Extracts username from URL path
  - Converts to: `[{platform: "INSTAGRAM", account: "little_tea_sp"}, ...]`

#### serviceTypes
- **Type:** String (parsed to array)
- **Format:** Comma-separated service type names in quotes
- **Example:** `"Clínica multidisciplinar, ABA, Fonoaudiologia, Terapia Ocupacional, Psicologia"`
- **Backend Processing:**
  - Splits by comma
  - Trims whitespace
  - Sends as array of strings based on locale
  - Frontend matches to service type configuration

---

## Complete CSV Example

```csv
name,description,address,rating,comment,imageUrl,contactInfo,site,socialLinks,serviceTypes
"Sunset Beach Bar","Beautiful beachside bar with stunning ocean views","123 Ocean Drive, Miami Beach, FL 33139",4.5,"Great sunset views","https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800","+1-305-555-0123","https://sunsetbeachbar.com","https://www.instagram.com/sunsetbeachbar,https://www.facebook.com/sunsetbeachbar","Bar, Restaurante, Música ao vivo"
"Mountain Peak Cafe","Cozy mountain retreat with fireplace","456 Summit Road, Aspen, CO 81611",5.0,"Excellent coffee","https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800","+1-970-555-0456","https://mountainpeakcafe.com","https://www.instagram.com/mountainpeakcafe","Cafeteria, Padaria"
"Riverside Park","Scenic park along the river","321 River Road, Portland, OR 97201",4.8,"Dog-friendly","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800","+1-503-555-0321","","",""
```

---

## Files Updated

### 1. `/public/places_import_template.csv`
- ✅ Added 4 new columns: `contactInfo`, `site`, `socialLinks`, `serviceTypes`
- ✅ Updated all 10 sample rows with example data
- ✅ Showed various format examples (some with all fields, some with only some fields)

### 2. `/src/components/BatchImportModal.vue`
- ✅ Updated `downloadTemplate()` function to include new columns
- ✅ Updated format requirements section in UI to list new optional fields
- ✅ Added format hints for socialLinks and serviceTypes

### 3. `/docs/BATCH_IMPORT_FEATURE.md`
- ✅ Updated CSV format requirements in Step 1 diagram
- ✅ Added new fields to Request Body Fields table
- ✅ Updated error message for invalid headers
- ✅ Added new section "CSV Field Formats for New Fields" with detailed specifications
- ✅ Included backend processing instructions

---

## Backend Requirements

The backend needs to parse the new CSV fields:

### socialLinks Parsing
```javascript
// Input: "https://www.instagram.com/little_tea_sp/,https://www.facebook.com/little_tea_sp/"
// Output:
[
  { platform: "INSTAGRAM", account: "little_tea_sp" },
  { platform: "FACEBOOK", account: "little_tea_sp" }
]
```

**Logic:**
1. Split by comma: `csvValue.split(',')`
2. For each URL:
   - Detect platform: if url.includes('instagram.com') → "INSTAGRAM"
   - Extract username: get last segment of path
   - Create object: `{platform, account}`

### serviceTypes Parsing
```javascript
// Input: "Clínica multidisciplinar, ABA, Fonoaudiologia"
// Output: ["Clínica multidisciplinar", "ABA", "Fonoaudiologia"]
```

**Logic:**
1. Split by comma: `csvValue.split(',')`
2. Trim each: `names.map(n => n.trim())`
3. Return as array of strings

---

## Testing Checklist

- [ ] Download template from BatchImportModal
- [ ] Verify template has 10 columns (6 old + 4 new)
- [ ] Upload CSV with new fields
- [ ] Verify backend parses socialLinks correctly (extracts platform and account)
- [ ] Verify backend parses serviceTypes correctly (splits by comma)
- [ ] Test import with all fields filled
- [ ] Test import with new fields empty (should still work)
- [ ] Test socialLinks with only Instagram
- [ ] Test socialLinks with both Instagram and Facebook
- [ ] Test serviceTypes with single service
- [ ] Test serviceTypes with multiple comma-separated services

---

## Notes

- All new fields are **optional** - old CSV files without these columns will still work
- The format matches what users requested: full URLs for social links, comma-separated names for services
- Backend will need to implement the parsing logic for socialLinks and serviceTypes
- Frontend already has the UI to display these fields in the review table (backend returns them in the parsed data)
