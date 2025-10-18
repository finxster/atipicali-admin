# Batch Import - Quick Reference Guide

## 🎯 Overview
Upload CSV → Review & Edit → Confirm Import

---

## 📋 API Endpoints Summary

### 1. Upload & Validate CSV
```
POST /api/places/batch/upload
Content-Type: multipart/form-data
```

**Request:** CSV file (max 5MB, max 1000 rows)

**Response:** Parsed and validated data with status indicators
- ✓ Valid rows (ready to import)
- ⚠ Warning rows (can import with warnings)
- ❌ Error rows (cannot import)

---

### 2. Import Places
```
POST /api/places/batch/import
Content-Type: application/json
```

**Request:** Array of validated place objects

**Response:** Import results with success/failure per row

---

### 3. Download Template (Optional)
```
GET /api/places/batch/template
```

**Response:** CSV file with sample data

---

## 📊 CSV Format

### Required Columns
```csv
name,description,address,rating,comment,imageUrl
```

### Example Row
```csv
"Beach Bar","Beautiful bar","123 Ocean Dr, Miami",4.5,"Great views","https://example.com/img.jpg"
```

### Field Rules
| Field | Required | Type | Range/Format |
|-------|----------|------|--------------|
| name | ✅ | string | 1-255 chars |
| description | ✅ | string | 1-2000 chars |
| address | ✅ | string | 1-500 chars |
| rating | ✅ | number | 1.0 - 5.0 |
| comment | ❌ | string | 0-1000 chars |
| imageUrl | ❌ | string | Valid URL or empty |

---

## 🎨 UX Flow

### Step 1: Upload
```
┌─────────────────────────┐
│ Drop CSV file here      │
│ or click to browse      │
│                         │
│ 📥 Download Template    │
└─────────────────────────┘
     [Upload →]
```

### Step 2: Review & Edit
```
┌────────────────────────────────────────┐
│ Imported 45 • 42 ✓ • 2 ⚠ • 1 ❌       │
├────────────────────────────────────────┤
│ Row │ Status │ Name     │ Actions     │
│  1  │   ✓    │ Beach    │ 👁 ✏️ 🗑    │
│  2  │   ⚠    │ Cafe     │ 👁 ✏️ 🗑    │
│  3  │   ❌   │ (empty)  │ 👁 ✏️ 🗑    │
└────────────────────────────────────────┘
     [← Back]  [Import Selected →]
```

### Step 3: Confirm
```
┌─────────────────────────┐
│ Ready to import:        │
│ • 42 valid places       │
│ • 3 skipped (errors)    │
│                         │
│ ⚠️ Cannot be undone     │
│                         │
│ ████░░░░ 50%            │
└─────────────────────────┘
     [← Back]  [Confirm ✓]
```

---

## 🚦 Status Indicators

| Icon | Status | Meaning | Can Import? |
|------|--------|---------|-------------|
| ✓ | Valid | All required fields valid | ✅ Yes |
| ⚠ | Warning | Valid but has minor issues | ✅ Yes |
| ❌ | Error | Missing/invalid required fields | ❌ No |

**Common Warnings:**
- Missing optional fields (comment, imageUrl)
- Duplicate names
- Image URL not accessible

**Common Errors:**
- Missing required fields
- Rating out of range (not 1-5)
- Invalid CSV structure

---

## 🔧 Key Features

### Upload Step
- ✅ Drag & drop support
- ✅ File type validation (.csv only)
- ✅ Size limit (5MB)
- ✅ Row limit (1000 places)
- ✅ Template download

### Review Step
- ✅ Filter by status (all/valid/issues)
- ✅ Search places
- ✅ Edit individual rows
- ✅ Remove invalid rows
- ✅ View row details
- ✅ Validation messages

### Confirm Step
- ✅ Import summary
- ✅ Progress indicator
- ✅ Partial success handling
- ✅ Auto-refresh places list

---

## 🛡️ Validation Rules

### File Level
```javascript
{
  maxFileSize: "5MB",
  maxRows: 1000,
  allowedFormats: [".csv"],
  requiredHeaders: ["name", "description", "address", "rating", "comment", "imageUrl"],
  encoding: "UTF-8"
}
```

### Row Level
```javascript
{
  name: { required: true, maxLength: 255 },
  description: { required: true, maxLength: 2000 },
  address: { required: true, maxLength: 500 },
  rating: { required: true, min: 1.0, max: 5.0 },
  comment: { required: false, maxLength: 1000 },
  imageUrl: { required: false, format: "url" }
}
```

---

## 💾 Response Examples

### Upload Success
```json
{
  "success": true,
  "data": {
    "totalRows": 45,
    "validRows": 42,
    "errorRows": 1,
    "warningRows": 2,
    "places": [...]
  }
}
```

### Import Success
```json
{
  "success": true,
  "data": {
    "imported": 42,
    "failed": 0,
    "results": [...]
  }
}
```

### Import Partial
```json
{
  "success": true,
  "data": {
    "imported": 40,
    "failed": 2,
    "results": [...]
  }
}
```

---

## 🔐 Security

1. **Authentication** - Bearer token required
2. **File Validation** - Type, size, structure checks
3. **Input Sanitization** - Prevent SQL injection
4. **Rate Limiting** - Prevent abuse
5. **Virus Scanning** - (Optional) Scan uploaded files

---

## 📦 Component Structure

```
PlacesView.vue
  └─ BatchImportModal.vue (NEW)
      ├─ FileUploadStep.vue
      ├─ DataReviewStep.vue
      │   ├─ EditImportedPlaceModal.vue
      │   └─ ViewImportedPlaceModal.vue
      └─ ConfirmationStep.vue
```

---

## 🎯 Implementation Priority

### Phase 1 (MVP)
1. ✅ Upload CSV endpoint
2. ✅ Basic validation
3. ✅ Import endpoint
4. ✅ 3-step modal UI
5. ✅ Status indicators
6. ✅ Template download (client-side)

### Phase 2 (Enhancements)
- 🔄 Background processing for large files
- 🔄 Import history/audit log
- 🔄 Duplicate detection
- 🔄 Export existing places to CSV
- 🔄 Backend geocoding (add coordinates)

### Phase 3 (Advanced)
- 🚀 Excel support (.xlsx)
- 🚀 Google Sheets import
- 🚀 Custom column mapping
- 🚀 Rollback/undo imports

---

## 📱 Responsive Design Notes

- **Desktop:** Full table view with all columns
- **Tablet:** Scrollable table, condensed columns
- **Mobile:** Card view instead of table, one place per card

---

## 🌍 i18n Keys Needed

Add to `en.json` and `pt.json`:

```json
"places.batchImport": {
  "title": "Batch Import Places",
  "step1": "Upload CSV",
  "step2": "Review & Edit", 
  "step3": "Confirm",
  "uploadSuccess": "Uploaded {count} places",
  "importSuccess": "Imported {count} places",
  // ... more keys
}
```

---

## 🧪 Testing Checklist

### Upload Endpoint
- [ ] Valid CSV uploads successfully
- [ ] Invalid file type rejected
- [ ] File too large rejected
- [ ] Too many rows rejected
- [ ] Missing headers rejected
- [ ] Validation errors detected
- [ ] Warnings generated correctly

### Import Endpoint
- [ ] Valid places imported
- [ ] Invalid data rejected
- [ ] Partial success handled
- [ ] Transactions work correctly
- [ ] Database constraints enforced

### UI/UX
- [ ] File drag & drop works
- [ ] Template download works
- [ ] Filtering works (all/valid/issues)
- [ ] Row edit modal works
- [ ] Row delete works
- [ ] Progress bar updates
- [ ] Success/error messages display
- [ ] List refreshes after import

---

## 🚀 Launch Criteria

Before releasing to production:

1. ✅ All API endpoints tested
2. ✅ File size/row limits enforced
3. ✅ Validation working correctly
4. ✅ Error handling comprehensive
5. ✅ UI responsive on all devices
6. ✅ i18n complete (en/pt)
7. ✅ Security review passed
8. ✅ Performance tested (large files)
9. ✅ Documentation complete
10. ✅ User acceptance testing done

---

## 📞 Need Help?

Refer to full documentation:
- [BATCH_IMPORT_FEATURE.md](./BATCH_IMPORT_FEATURE.md) - Complete specs
- [ADD_PLACE_FEATURE.md](./ADD_PLACE_FEATURE.md) - Single place patterns
- [DASHBOARD_API_CONTRACT.md](./DASHBOARD_API_CONTRACT.md) - API patterns
