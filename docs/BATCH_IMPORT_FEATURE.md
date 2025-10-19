# Batch Import Feature - UX/UI Design & API Contract

## Overview

The **Batch Import** feature allows administrators to upload a CSV file containing multiple places, review and edit the imported data, and then approve it for insertion into the database. This feature significantly reduces the time needed to add multiple places compared to the one-by-one modal approach.

---

## UX/UI Design

### Design Decision: Multi-Step Modal with Table Editor

**Chosen approach: Modal with 3-step wizard**

### Why Modal Instead of New Page?
1. **Consistency** - Matches existing Add/Edit Place modal patterns
2. **Context Preservation** - Users stay on Places list page
3. **Quick Access** - Can be cancelled and returned to easily
4. **Familiar Pattern** - Users already understand modal workflow

### Why Multi-Step Wizard?
1. **Clear Process** - Upload → Review → Confirm flow is intuitive
2. **Prevents Errors** - Review step catches issues before database insertion
3. **User Control** - Can edit/remove items before committing
4. **Better UX** - Doesn't overwhelm with all data at once

---

## User Flow

### Step 1: Upload CSV File
```
┌────────────────────────────────────────┐
│  Batch Import Places                   │
│  ──────────────────────────────────    │
│                                        │
│  [Step 1: Upload] → Step 2 → Step 3   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  📄 Drag & drop CSV file here    │ │
│  │     or click to browse            │ │
│  │                                   │ │
│  │  Supported format: .csv           │ │
│  └──────────────────────────────────┘ │
│                                        │
│  📥 Download CSV Template              │
│                                        │
│  CSV Format Requirements:              │
│  • name (required)                     │
│  • description (required)              │
│  • address (required)                  │
│  • rating (1-5, required)              │
│  • comment (optional)                  │
│  • imageUrl (optional)                 │
│  • contactInfo (optional)              │
│  • site (optional)                     │
│  • socialLinks (optional)              │
│  • serviceTypes (optional)             │
│                                        │
│              [Cancel]  [Upload →]      │
└────────────────────────────────────────┘
```

**Features:**
- Drag & drop file upload zone
- File type validation (only .csv)
- Download template button (generates sample CSV)
- Clear format requirements displayed
- File size limit (e.g., max 5MB or 1000 rows)
- Upload button disabled until file selected

---

### Step 2: Review & Edit Data
```
┌────────────────────────────────────────────────────────────────┐
│  Batch Import Places                                           │
│  ──────────────────────────────────────────────                │
│                                                                │
│  Step 1 → [Step 2: Review & Edit] → Step 3                    │
│                                                                │
│  Imported 45 places • 3 errors • 2 warnings                    │
│                                                                │
│  [Show All] [✓ Valid Only] [⚠ With Issues]  [🔍 Search...]   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Row │ Status │ Name      │ Address    │ Rating │ Actions │ │
│  ├─────┼────────┼───────────┼────────────┼────────┼─────────┤ │
│  │  1  │   ✓    │ Beach Bar │ 123 St...  │  4.5   │ 👁 ✏️ 🗑 │ │
│  │  2  │   ⚠    │ Cafe Lux  │ 456 Ave... │  5.0   │ 👁 ✏️ 🗑 │ │
│  │  3  │   ❌   │ (empty)   │ 789 Rd...  │  3.0   │ 👁 ✏️ 🗑 │ │
│  │ ... │        │           │            │        │         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Selection: 42 valid places will be imported                  │
│                                                                │
│            [← Back]  [Cancel]  [Import Selected →]            │
└────────────────────────────────────────────────────────────────┘
```

**Features:**

**Status Indicators:**
- ✓ **Valid** (green) - All required fields present and valid
- ⚠ **Warning** (yellow) - Valid but has minor issues (e.g., missing optional field, duplicate name)
- ❌ **Error** (red) - Invalid or missing required fields

**Actions per row:**
- 👁 **View** - Opens preview modal with all fields
- ✏️ **Edit** - Opens edit modal (similar to EditPlaceModal)
- 🗑 **Remove** - Removes row from import batch

**Filtering:**
- Show All - Display all imported rows
- Valid Only - Show only rows with ✓ status
- With Issues - Show only rows with ⚠ or ❌ status
- Search box - Filter by name/address

**Validation:**
- Real-time validation after upload
- Shows error count and warning count
- Can proceed only if no ❌ errors exist
- Warnings don't block import

**Batch Actions:**
- "Remove All Invalid" button
- "Select All Valid" checkbox
- Individual row selection

---

### Step 3: Confirmation
```
┌────────────────────────────────────────┐
│  Batch Import Places                   │
│  ──────────────────────────────────    │
│                                        │
│  Step 1 → Step 2 → [Step 3: Confirm]  │
│                                        │
│  ✓ Ready to Import                     │
│                                        │
│  You are about to import:              │
│  • 42 new places                       │
│  • 3 rows were skipped (errors)        │
│                                        │
│  ⚠️ This action cannot be undone       │
│                                        │
│  All places will be created with       │
│  status: PENDING                       │
│                                        │
│  [Processing... 25/42 imported]        │
│  ████████░░░░░░░░ 60%                  │
│                                        │
│              [← Back]  [Confirm ✓]     │
└────────────────────────────────────────┘
```

**Features:**
- Summary of import action
- Count of successful vs skipped rows
- Warning about irreversibility
- Progress bar during import
- Success message after completion
- Auto-close and refresh Places list

---

## CSV Format Specification

### CSV Template Structure
```csv
name,description,address,rating,comment,imageUrl
"Beach Bar","Beautiful beachside bar","123 Ocean Drive, Miami, FL",4.5,"Great sunset views","https://example.com/beach-bar.jpg"
"Mountain Cafe","Cozy mountain retreat","456 Summit Road, Denver, CO",5.0,"","https://example.com/cafe.jpg"
"City Restaurant","Downtown fine dining","789 Main Street, New York, NY",4.0,"Reservations recommended",""
```

### Field Specifications

| Field | Type | Required | Max Length | Validation |
|-------|------|----------|------------|------------|
| `name` | string | Yes | 255 | Non-empty, trimmed |
| `description` | string | Yes | 2000 | Non-empty, trimmed |
| `address` | string | Yes | 500 | Non-empty, trimmed |
| `rating` | number | Yes | - | Between 1.0 and 5.0 |
| `comment` | string | No | 1000 | Trimmed, can be empty |
| `imageUrl` | string | No | 500 | Valid URL format or empty |

### Validation Rules

**Row-level validation:**
1. **Missing Required Fields** → Error ❌
2. **Invalid Rating Range** → Error ❌
3. **Invalid URL Format** → Warning ⚠ (can still import)
4. **Duplicate Name** → Warning ⚠ (can still import)
5. **Empty Optional Fields** → Valid ✓

**File-level validation:**
1. **Max File Size** - 5MB
2. **Max Rows** - 1000 places per import
3. **Required Headers** - CSV must have correct column headers
4. **Encoding** - UTF-8 only

---

## API Contract

### 1. Upload & Validate CSV

**Endpoint:** `POST /api/places/batch/upload`

**Purpose:** Upload CSV file, validate data, return parsed results

**Request:**

```http
POST /api/places/batch/upload HTTP/1.1
Authorization: Bearer <token>
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="places.csv"
Content-Type: text/csv

[CSV file content]
------WebKitFormBoundary--
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | CSV file (max 5MB, max 1000 rows) |

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "totalRows": 45,
    "validRows": 42,
    "errorRows": 3,
    "warningRows": 2,
    "places": [
      {
        "rowNumber": 1,
        "status": "valid",
        "data": {
          "name": "Beach Bar",
          "description": "Beautiful beachside bar",
          "address": "123 Ocean Drive, Miami, FL",
          "rating": 4.5,
          "comment": "Great sunset views",
          "imageUrl": "https://example.com/beach-bar.jpg"
        },
        "errors": [],
        "warnings": []
      },
      {
        "rowNumber": 2,
        "status": "warning",
        "data": {
          "name": "Cafe Lux",
          "description": "Modern cafe",
          "address": "456 Avenue, New York",
          "rating": 5.0,
          "comment": "",
          "imageUrl": ""
        },
        "errors": [],
        "warnings": [
          "Image URL is empty - place will have no image"
        ]
      },
      {
        "rowNumber": 3,
        "status": "error",
        "data": {
          "name": "",
          "description": "No name provided",
          "address": "789 Road, Boston",
          "rating": 3.0,
          "comment": "",
          "imageUrl": ""
        },
        "errors": [
          "Name is required and cannot be empty"
        ],
        "warnings": []
      }
    ]
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether upload succeeded |
| `data.totalRows` | number | Total rows in CSV (excluding header) |
| `data.validRows` | number | Count of rows with status "valid" |
| `data.errorRows` | number | Count of rows with status "error" |
| `data.warningRows` | number | Count of rows with status "warning" |
| `data.places[]` | array | Array of parsed place objects |
| `data.places[].rowNumber` | number | Row number in original CSV (1-indexed) |
| `data.places[].status` | string | "valid", "warning", or "error" |
| `data.places[].data` | object | Parsed place data |
| `data.places[].errors[]` | array | Array of error messages (blocking) |
| `data.places[].warnings[]` | array | Array of warning messages (non-blocking) |
| `timestamp` | string | ISO 8601 timestamp |

**Error Responses:**

```json
// 400 Bad Request - Invalid file
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Invalid file format. Only CSV files are accepted.",
    "code": "INVALID_FILE_FORMAT"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}

// 400 Bad Request - File too large
{
  "success": false,
  "error": {
    "status": 400,
    "message": "File size exceeds maximum allowed size of 5MB",
    "code": "FILE_TOO_LARGE"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}

// 400 Bad Request - Too many rows
{
  "success": false,
  "error": {
    "status": 400,
    "message": "CSV contains 1500 rows. Maximum allowed is 1000 rows per import.",
    "code": "TOO_MANY_ROWS"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}

// 400 Bad Request - Invalid CSV structure
{
  "success": false,
  "error": {
    "status": 400,
    "message": "CSV is missing required headers. Expected: name, description, address, rating (optional: comment, imageUrl, contactInfo, site, socialLinks, serviceTypes)",
    "code": "INVALID_CSV_HEADERS"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}

// 401 Unauthorized
{
  "success": false,
  "error": {
    "status": 401,
    "message": "Invalid or missing authentication token",
    "code": "UNAUTHORIZED"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

---

### 2. Batch Import Places

**Endpoint:** `POST /api/places/batch/import`

**Purpose:** Insert validated places into database

**Request:**

```json
{
  "places": [
    {
      "name": "Beach Bar",
      "description": "Beautiful beachside bar",
      "address": "123 Ocean Drive, Miami, FL",
      "rating": 4.5,
      "comment": "Great sunset views",
      "imageUrl": "https://example.com/beach-bar.jpg"
    },
    {
      "name": "Mountain Cafe",
      "description": "Cozy mountain retreat",
      "address": "456 Summit Road, Denver, CO",
      "rating": 5.0,
      "comment": "",
      "imageUrl": "https://example.com/cafe.jpg"
    }
  ]
}
```

**Request Body Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `places` | array | Yes | Array of place objects to import |
| `places[].name` | string | Yes | Place name |
| `places[].description` | string | Yes | Place description |
| `places[].address` | string | Yes | Place address |
| `places[].rating` | number | Yes | Rating (1.0-5.0) |
| `places[].comment` | string | No | Additional comments |
| `places[].imageUrl` | string | No | Image URL |
| `places[].contactInfo` | string | No | Phone number |
| `places[].site` | string | No | Website URL |
| `places[].socialLinks` | string | No | Comma-separated social media URLs |
| `places[].serviceTypes` | string | No | Comma-separated service type names |

**Response (Success):**

```json
{
  "success": true,
  "data": {
    "imported": 42,
    "failed": 0,
    "results": [
      {
        "rowNumber": 1,
        "success": true,
        "placeId": "place_123abc",
        "message": "Place created successfully"
      },
      {
        "rowNumber": 2,
        "success": true,
        "placeId": "place_456def",
        "message": "Place created successfully"
      }
    ]
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

**Response (Partial Success):**

```json
{
  "success": true,
  "data": {
    "imported": 40,
    "failed": 2,
    "results": [
      {
        "rowNumber": 1,
        "success": true,
        "placeId": "place_123abc",
        "message": "Place created successfully"
      },
      {
        "rowNumber": 15,
        "success": false,
        "error": "Database constraint violation: duplicate address",
        "message": "Failed to create place"
      },
      {
        "rowNumber": 28,
        "success": false,
        "error": "Invalid coordinates for address",
        "message": "Failed to create place"
      }
    ]
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether batch import completed (even partial) |
| `data.imported` | number | Number of successfully imported places |
| `data.failed` | number | Number of failed imports |
| `data.results[]` | array | Result for each place |
| `data.results[].rowNumber` | number | Original row number from CSV |
| `data.results[].success` | boolean | Whether this specific import succeeded |
| `data.results[].placeId` | string | Created place ID (only if success=true) |
| `data.results[].error` | string | Error message (only if success=false) |
| `data.results[].message` | string | Human-readable status message |
| `timestamp` | string | ISO 8601 timestamp |

**Error Responses:**

```json
// 400 Bad Request - Invalid data
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Request body must contain a 'places' array",
    "code": "INVALID_REQUEST_BODY"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}

// 400 Bad Request - Empty array
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Places array cannot be empty",
    "code": "EMPTY_PLACES_ARRAY"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}

// 401 Unauthorized
{
  "success": false,
  "error": {
    "status": 401,
    "message": "Invalid or missing authentication token",
    "code": "UNAUTHORIZED"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}

// 500 Internal Server Error
{
  "success": false,
  "error": {
    "status": 500,
    "message": "An unexpected error occurred during batch import",
    "code": "INTERNAL_SERVER_ERROR"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

---

### 3. Download CSV Template (Optional)

**Endpoint:** `GET /api/places/batch/template`

**Purpose:** Download a sample CSV template file

**Request:**

```http
GET /api/places/batch/template HTTP/1.1
Authorization: Bearer <token>
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="places_import_template.csv"

name,description,address,rating,comment,imageUrl
"Example Beach Bar","Beautiful beachside bar with ocean views","123 Ocean Drive, Miami, FL",4.5,"Great sunset views","https://example.com/beach-bar.jpg"
"Example Mountain Cafe","Cozy mountain retreat with fireplace","456 Summit Road, Denver, CO",5.0,"Reservations recommended","https://example.com/cafe.jpg"
```

**Alternative:** Frontend can generate this template locally without backend API call.

---

### 4. CSV Field Formats for New Fields

#### contactInfo (Phone Number)
- **Format:** String, any phone format accepted
- **Example:** `"+1-305-555-0123"` or `"(11) 98765-4321"`
- **CSV Column:** `contactInfo`

#### site (Website URL)
- **Format:** String, full URL
- **Example:** `"https://sunsetbeachbar.com"`
- **CSV Column:** `site`

#### socialLinks (Social Media URLs)
- **Format:** Comma-separated full URLs inside quotes
- **Supported Platforms:** Instagram, Facebook (automatically detected from URL)
- **Example:** `"https://www.instagram.com/little_tea_sp/,https://www.facebook.com/little_tea_sp/"`
- **CSV Column:** `socialLinks`
- **Sent to Backend:** As comma-separated string (backend will parse and extract platform/account)

#### serviceTypes (Service Type Names)
- **Format:** Comma-separated service type names in quotes
- **Example:** `"Clínica multidisciplinar, ABA, Fonoaudiologia, Terapia Ocupacional, Psicologia"`
- **CSV Column:** `serviceTypes`
- **Sent to Backend:** As comma-separated string (backend will parse, trim whitespace, and match to database)

**CSV Example with New Fields:**
```csv
name,description,address,rating,comment,imageUrl,contactInfo,site,socialLinks,serviceTypes
"Little Tea SP","Wonderful tea house","Rua Augusta 123, São Paulo",4.8,"Great atmosphere","https://example.com/tea.jpg","+55 11 98765-4321","https://littletea.com","https://www.instagram.com/little_tea_sp/,https://www.facebook.com/little_tea_sp/","Cafeteria, Restaurante, Espaço Kids"
```

---

## Frontend State Management

### Component Structure

```
PlacesView.vue
  ├─ BatchImportModal.vue (new component)
      ├─ Step 1: FileUpload.vue (sub-component)
      ├─ Step 2: DataReview.vue (sub-component)
      │    ├─ EditImportedPlaceModal.vue (edit single row)
      │    └─ ViewImportedPlaceModal.vue (view single row)
      └─ Step 3: ImportConfirmation.vue (sub-component)
```

### State Flow

```javascript
// BatchImportModal.vue state
data() {
  return {
    currentStep: 1, // 1, 2, or 3
    uploadedFile: null,
    parsedData: null, // Response from /batch/upload
    editedData: [], // Local edits made by user
    selectedForImport: [], // Row numbers selected
    importing: false,
    importProgress: { current: 0, total: 0 }
  }
}
```

---

## Additional Features

### 1. Geocoding Addresses
Since your existing Add Place feature uses Google Places Autocomplete for coordinates, you have two options for batch import:

**Option A: Skip Coordinates** (Recommended for MVP)
- Import places without lat/lng
- Add them to database with null coordinates
- Admin can edit individual places later to add coordinates via autocomplete

**Option B: Backend Geocoding**
- Backend calls Google Geocoding API for each address
- Adds coordinates automatically during import
- More complex, requires API key on backend
- Costs money per geocode request

**Recommendation:** Start with Option A, add Option B later if needed.

### 2. Export Current Places to CSV
Add complementary feature to export existing places:

**Endpoint:** `GET /api/places/export?format=csv`

Allows admins to:
- Download current places as CSV
- Edit in spreadsheet
- Re-import with batch import

---

## Implementation Checklist

### Backend Tasks
- [ ] Create `POST /api/places/batch/upload` endpoint
- [ ] Implement CSV parsing library (e.g., `csv-parser`, `papaparse`)
- [ ] Add validation logic for CSV data
- [ ] Create `POST /api/places/batch/import` endpoint
- [ ] Implement transaction handling (all-or-nothing or partial)
- [ ] Add file size and row count limits
- [ ] (Optional) Create `GET /api/places/batch/template` endpoint
- [ ] Add appropriate error handling and logging
- [ ] Write API tests

### Frontend Tasks
- [ ] Create `BatchImportModal.vue` component
- [ ] Implement file upload with drag & drop
- [ ] Create CSV template download (client-side generation)
- [ ] Build data review table with filtering
- [ ] Add edit/view/delete row actions
- [ ] Implement validation status indicators
- [ ] Create progress bar for import
- [ ] Add i18n translations (en/pt)
- [ ] Handle error states and user feedback
- [ ] Add batch import button to PlacesView
- [ ] Write component tests

### Translation Keys Needed
```json
{
  "places.batchImport": {
    "title": "Batch Import Places",
    "subtitle": "Upload and import multiple places at once",
    "step1": "Upload CSV",
    "step2": "Review & Edit",
    "step3": "Confirm",
    "dragDrop": "Drag & drop CSV file here or click to browse",
    "downloadTemplate": "Download CSV Template",
    "formatRequirements": "CSV Format Requirements",
    "uploaded": "Imported {total} places",
    "errors": "{count} errors",
    "warnings": "{count} warnings",
    "validOnly": "Valid Only",
    "withIssues": "With Issues",
    "readyToImport": "Ready to Import",
    "aboutToImport": "You are about to import:",
    "newPlaces": "{count} new places",
    "skipped": "{count} rows were skipped (errors)",
    "cannotUndo": "This action cannot be undone",
    "importing": "Importing...",
    "importSuccess": "Successfully imported {count} places",
    "importPartial": "Imported {success} places, {failed} failed"
  }
}
```

---

## Security Considerations

1. **File Upload Security**
   - Validate file type (only .csv)
   - Limit file size (5MB max)
   - Scan for malicious content
   - Use virus scanning if available

2. **Rate Limiting**
   - Limit batch import requests per user/hour
   - Prevent abuse of geocoding API

3. **Authentication**
   - Require admin authentication for all endpoints
   - Verify JWT token on every request

4. **Data Validation**
   - Sanitize all user input
   - Prevent SQL injection
   - Validate URLs and prevent SSRF attacks

---

## Future Enhancements

1. **Background Processing**
   - For very large imports (>1000 rows)
   - Process in background job
   - Email notification when complete

2. **Import History**
   - Log all batch imports
   - Allow rollback/undo
   - Show import audit trail

3. **Advanced Mapping**
   - Allow custom CSV column mapping
   - Support different CSV formats
   - Import from Google Sheets URL

4. **Duplicate Detection**
   - Check for duplicates against existing places
   - Offer merge or skip options

5. **Excel Support**
   - Accept .xlsx files
   - Automatically convert to CSV

---

## Conclusion

This batch import feature provides:
- ✅ Intuitive multi-step workflow
- ✅ Comprehensive validation and error handling
- ✅ User control over data before insertion
- ✅ Clear API contract for backend implementation
- ✅ Consistent with existing UI patterns
- ✅ Scalable architecture for future enhancements

The 3-step modal approach balances ease of use with data safety, ensuring admins can quickly import places while maintaining data quality.
