# Batch Import Feature - New Fields Update Summary

## Date: October 19, 2025

### Overview
Updated the batch import feature to support the four new fields added to the place management system:
- **contactInfo** (phone number)
- **site** (website URL)
- **socialLinks** (Instagram/Facebook URLs)
- **serviceTypes** (comma-separated service names)

---

## Changes Made

### 1. CSV Template Updated ✅
**File:** `public/places_import_template.csv`

**New Columns Added:**
- `contactInfo` - Phone number in any format (e.g., "+1-305-555-0123")
- `site` - Website URL (e.g., "https://sunsetbeachbar.com")
- `socialLinks` - Comma-separated social media URLs (e.g., "https://www.instagram.com/account,https://www.facebook.com/account")
- `serviceTypes` - Comma-separated service type names in quotes (e.g., "ABA, Fonoaudiologia, Psicologia")

**Format Example:**
```csv
name,description,address,rating,comment,imageUrl,contactInfo,site,socialLinks,serviceTypes
"Sunset Beach Bar","Beautiful bar","123 Ocean Dr",4.5,"Great views","https://...jpg","+1-305-555-0123","https://sunsetbeachbar.com","https://www.instagram.com/sunsetbeachbar,https://www.facebook.com/sunsetbeachbar","Bar, Restaurante, Música ao vivo"
```

---

### 2. BatchImportModal Component Updated ✅
**File:** `src/components/BatchImportModal.vue`

**Changes:**
1. **Format Requirements Section** - Added documentation for new optional fields with format hints:
   - socialLinks: Comma-separated URLs (Instagram, Facebook)
   - serviceTypes: Comma-separated service type names in quotes

2. **Download Template Function** - Updated `downloadTemplate()` to generate CSV with all 10 columns including the new fields

**Note:** The actual CSV parsing is handled by the backend (`POST /api/places/batch/upload`), so the frontend doesn't need additional parsing logic.

---

### 3. Documentation Updated ✅
**File:** `docs/BATCH_IMPORT_FEATURE.md`

**Additions:**

#### New Section: "CSV Field Formats for New Fields"
Detailed documentation for each new field:

**contactInfo (Phone Number)**
- Format: String, any phone format accepted
- Example: "+1-305-555-0123" or "(11) 98765-4321"

**site (Website URL)**
- Format: String, full URL
- Example: "https://sunsetbeachbar.com"

**socialLinks (Social Media URLs)**
- Format: Comma-separated full URLs inside quotes
- Supported: Instagram, Facebook (auto-detected from URL)
- Example: "https://www.instagram.com/little_tea_sp/,https://www.facebook.com/little_tea_sp/"
- Sent to Backend: As comma-separated string (backend parses URLs and extracts platform/account)

**serviceTypes (Service Type Names)**
- Format: Comma-separated service type names in quotes
- Example: "Clínica multidisciplinar, ABA, Fonoaudiologia"
- Sent to Backend: As comma-separated string (backend parses, trims, and matches to database)

#### Updated API Contract
- Added 4 new optional fields to request body table
- Updated error message example to include new optional fields
- Added complete CSV example with new fields

---

## Backend Requirements

The backend needs to handle these new fields in two endpoints:

### 1. POST /api/places/batch/upload
**CSV Parsing Requirements:**

The backend should extract these columns from the CSV and return them as-is (strings):
- `contactInfo` - Phone number string
- `site` - Website URL string
- `socialLinks` - Comma-separated URLs string
- `serviceTypes` - Comma-separated service names string

**Example Response:**
```json
{
  "data": {
    "places": [
      {
        "rowNumber": 1,
        "status": "valid",
        "data": {
          "name": "Little Tea SP",
          "contactInfo": "+55 11 98765-4321",
          "site": "https://littletea.com",
          "socialLinks": "https://www.instagram.com/little_tea_sp/,https://www.facebook.com/little_tea_sp/",
          "serviceTypes": "ABA, Fonoaudiologia, Terapia Ocupacional"
        }
      }
    ]
  }
}
```

### 2. POST /api/places/batch/import
**Receives the data directly from the frontend as comma-separated strings:**

```json
{
  "places": [
    {
      "name": "Place Name",
      "description": "Description",
      "address": "Address",
      "rating": 4.5,
      "comment": "Optional comment",
      "imageUrl": "https://...",
      "contactInfo": "+55 11 98765-4321",
      "site": "https://example.com",
      "socialLinks": "https://www.instagram.com/username,https://www.facebook.com/username",
      "serviceTypes": "ABA, Fonoaudiologia, Psicologia"
    }
  ]
}
```

---

## Testing Checklist

### Frontend Testing
- [ ] Download CSV template includes all 10 columns
- [ ] Format requirements section displays new field hints
- [ ] Template examples show proper format for socialLinks and serviceTypes

### Backend Testing (Required)
- [ ] CSV upload correctly parses contactInfo field
- [ ] CSV upload correctly parses site field
- [ ] CSV upload correctly parses socialLinks (comma-separated URLs → array of objects)
- [ ] CSV upload correctly parses serviceTypes (comma-separated names → array of strings)
- [ ] Batch import creates places with all new fields
- [ ] Social links are correctly associated with platform types
- [ ] Service types match existing service type names

### Integration Testing
- [ ] Upload CSV with all fields populated
- [ ] Upload CSV with new fields empty (should still work)
- [ ] Upload CSV with partial new fields (mix of populated/empty)
- [ ] Verify imported places display correctly in View Place modal
- [ ] Verify imported places can be edited with Edit Place modal

---

## Migration Notes

**Backwards Compatibility:** ✅
- Old CSV format (6 columns) still works - new fields are optional
- Backend should handle missing columns gracefully
- Frontend displays proper hints about optional fields

**User Communication:**
- Users can continue using old CSV templates
- New template includes all available fields
- Documentation clearly marks new fields as optional

---

## Files Modified

1. `public/places_import_template.csv` - Added 4 new columns with sample data
2. `src/components/BatchImportModal.vue` - Updated format hints and template download
3. `docs/BATCH_IMPORT_FEATURE.md` - Added comprehensive field format documentation

---

## Next Steps

### For Backend Developer:
1. Update CSV parser to extract new columns (contactInfo, site, socialLinks, serviceTypes)
2. Implement parsing logic for socialLinks (URL → platform + account)
3. Implement parsing logic for serviceTypes (comma-separated → array)
4. Update batch import endpoint to accept new fields
5. Test with provided sample CSV

### For QA:
1. Test CSV upload with new fields
2. Test CSV upload with old format (backwards compatibility)
3. Verify imported data appears correctly in UI
4. Test edge cases (empty fields, malformed URLs, etc.)

---

## Support

If users have questions about the new format:
- Point them to the updated CSV template (has examples)
- Reference `BATCH_IMPORT_FEATURE.md` for detailed format specs
- socialLinks format: Full URLs comma-separated
- serviceTypes format: Service names comma-separated in quotes
