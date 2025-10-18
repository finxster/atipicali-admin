# Batch Import - Visual Flow Diagrams

## 🔄 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PLACES VIEW                                  │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  [+ Add New Place]  [📥 Batch Import]  [🔍 Search]            │ │
│  │                            │                                    │ │
│  └────────────────────────────┼────────────────────────────────────┘ │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BATCH IMPORT MODAL - STEP 1                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Step 1: Upload CSV  →  Step 2  →  Step 3                   │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │                                                              │   │
│  │   ┌────────────────────────────────────────────────┐        │   │
│  │   │  📁 Drag & Drop CSV File Here                  │        │   │
│  │   │     or click to browse                         │        │   │
│  │   │                                                 │        │   │
│  │   │  Max 5MB • Max 1000 rows • .csv only           │        │   │
│  │   └────────────────────────────────────────────────┘        │   │
│  │                                                              │   │
│  │   📥 Download CSV Template                                  │   │
│  │                                                              │   │
│  │   Required fields:                                          │   │
│  │   • name, description, address, rating                      │   │
│  │   Optional fields:                                          │   │
│  │   • comment, imageUrl                                       │   │
│  │                                                              │   │
│  │                    [Cancel]  [Upload →]                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Upload file
                                  ▼
                    POST /api/places/batch/upload
                    ┌────────────────────────┐
                    │  Backend validates:    │
                    │  • File type           │
                    │  • File size           │
                    │  • CSV structure       │
                    │  • Each row's data     │
                    └────────────────────────┘
                                  │
                                  │ Returns parsed data
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BATCH IMPORT MODAL - STEP 2                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Step 1  →  Step 2: Review & Edit  →  Step 3              │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │                                                              │   │
│  │  Imported 45 places • 42 ✓ valid • 2 ⚠ warnings • 1 ❌ error│   │
│  │                                                              │   │
│  │  [Show All] [✓ Valid] [⚠ Issues]  🔍 [Search...]           │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ Row │ Status │ Name      │ Address  │ Rating │ ...   │  │   │
│  │  ├─────┼────────┼───────────┼──────────┼────────┼───────┤  │   │
│  │  │  1  │   ✓    │ Beach Bar │ 123 St.. │  4.5   │ 👁✏️🗑│  │   │
│  │  │  2  │   ✓    │ Cafe Lux  │ 456 Ave..│  5.0   │ 👁✏️🗑│  │   │
│  │  │  3  │   ⚠    │ Art Place │ 789 Rd.. │  4.0   │ 👁✏️🗑│  │   │
│  │  │     │        │   ⚠ Missing image URL            │ ...   │  │   │
│  │  │  4  │   ❌   │ (empty)   │ 321 Ln.. │  3.0   │ 👁✏️🗑│  │   │
│  │  │     │        │   ❌ Name is required            │ ...   │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                              │   │
│  │  Selection: 42 valid places will be imported                │   │
│  │                                                              │   │
│  │              [← Back]  [Cancel]  [Import Selected →]       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ User approves
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BATCH IMPORT MODAL - STEP 3                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Step 1  →  Step 2  →  Step 3: Confirm Import             │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │                                                              │   │
│  │  ✓ Ready to Import                                          │   │
│  │                                                              │   │
│  │  You are about to import:                                   │   │
│  │  • 42 new places                                            │   │
│  │  • 3 rows were skipped (errors)                             │   │
│  │                                                              │   │
│  │  ⚠️ This action cannot be undone                            │   │
│  │                                                              │   │
│  │  All places will be created with status: PENDING            │   │
│  │                                                              │   │
│  │  [Processing... 25/42 imported]                             │   │
│  │  ████████████░░░░░░░░ 60%                                  │   │
│  │                                                              │   │
│  │              [← Back]  [Cancel]  [Confirm Import ✓]        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Confirm
                                  ▼
                    POST /api/places/batch/import
                    ┌────────────────────────┐
                    │  Backend inserts:      │
                    │  • Each place to DB    │
                    │  • Returns results     │
                    │  • Partial OK          │
                    └────────────────────────┘
                                  │
                                  │ Returns import results
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SUCCESS NOTIFICATION                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ✅ Import Complete!                                        │   │
│  │                                                              │   │
│  │  Successfully imported 42 places                            │   │
│  │  0 failed                                                   │   │
│  │                                                              │   │
│  │  [View Places]  [Import More]  [Close]                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    Modal closes, Places list refreshes
                    New places appear in table
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   CSV File   │
│  (uploaded)  │
└──────┬───────┘
       │
       │ 1. Upload
       ▼
┌────────────────────────────────────────────┐
│  POST /api/places/batch/upload             │
│  ─────────────────────────────────────     │
│  • Parse CSV                               │
│  • Validate headers                        │
│  • Check file size/rows                    │
│  • Validate each row:                      │
│    - Required fields present?              │
│    - Rating in range?                      │
│    - Valid URL format?                     │
│  • Assign status: valid/warning/error      │
└────────────┬───────────────────────────────┘
             │
             │ 2. Return parsed data
             ▼
┌────────────────────────────────────────────┐
│  Frontend State                            │
│  ─────────────────────────────────────     │
│  {                                         │
│    totalRows: 45,                          │
│    validRows: 42,                          │
│    errorRows: 1,                           │
│    warningRows: 2,                         │
│    places: [                               │
│      {                                     │
│        rowNumber: 1,                       │
│        status: "valid",                    │
│        data: { name, description... },     │
│        errors: [],                         │
│        warnings: []                        │
│      },                                    │
│      ...                                   │
│    ]                                       │
│  }                                         │
└────────────┬───────────────────────────────┘
             │
             │ 3. User reviews, edits, approves
             ▼
┌────────────────────────────────────────────┐
│  Filtered & Edited Data                    │
│  ─────────────────────────────────────     │
│  • Remove error rows                       │
│  • Edit warnings if needed                 │
│  • Select valid rows to import             │
│  • Final list: 42 places                   │
└────────────┬───────────────────────────────┘
             │
             │ 4. Submit for import
             ▼
┌────────────────────────────────────────────┐
│  POST /api/places/batch/import             │
│  ─────────────────────────────────────     │
│  {                                         │
│    places: [                               │
│      {                                     │
│        name: "Beach Bar",                  │
│        description: "...",                 │
│        address: "...",                     │
│        rating: 4.5,                        │
│        comment: "...",                     │
│        imageUrl: "..."                     │
│      },                                    │
│      ...                                   │
│    ]                                       │
│  }                                         │
│                                            │
│  • Insert each place to database           │
│  • Handle errors gracefully                │
│  • Return results per row                  │
└────────────┬───────────────────────────────┘
             │
             │ 5. Return import results
             ▼
┌────────────────────────────────────────────┐
│  Import Results                            │
│  ─────────────────────────────────────     │
│  {                                         │
│    imported: 42,                           │
│    failed: 0,                              │
│    results: [                              │
│      {                                     │
│        rowNumber: 1,                       │
│        success: true,                      │
│        placeId: "place_123abc",            │
│        message: "Created successfully"     │
│      },                                    │
│      ...                                   │
│    ]                                       │
│  }                                         │
└────────────┬───────────────────────────────┘
             │
             │ 6. Show success message
             │    Refresh places list
             ▼
┌────────────────────────────────────────────┐
│  Updated Places List                       │
│  ─────────────────────────────────────     │
│  • 42 new places appear                    │
│  • All with status: PENDING                │
│  • Ready for admin review/approval         │
└────────────────────────────────────────────┘
```

---

## 🔀 Status State Machine

```
CSV Row Validation States:

┌─────────────┐
│  CSV Row    │
└──────┬──────┘
       │
       ▼
  Validate Required Fields
       │
       ├── Missing required? ──→ ❌ ERROR ──→ Cannot Import
       │
       ├── Invalid rating? ───→ ❌ ERROR ──→ Cannot Import
       │
       └── All required valid
                  │
                  ▼
          Check Optional Fields
                  │
                  ├── Invalid URL? ────→ ⚠ WARNING ──→ Can Import
                  │
                  ├── Duplicate name? ─→ ⚠ WARNING ──→ Can Import
                  │
                  └── All fields valid
                             │
                             ▼
                        ✓ VALID ──→ Ready to Import


Import Process States:

┌────────────┐
│ Valid Row  │
└─────┬──────┘
      │
      ▼
┌─────────────────┐
│ Submit to API   │
└─────┬───────────┘
      │
      ├── Success ──→ ✅ Imported ──→ Place created in DB
      │                                  │
      │                                  └─→ Status: PENDING
      │
      └── Failure ──→ ❌ Failed ────→ Show error, row skipped
                                         (e.g., duplicate address,
                                          DB constraint violation)
```

---

## 📋 Component Hierarchy

```
PlacesView.vue
│
├─ [+ Add New Place] Button
│   └─→ Opens AddPlaceModal.vue
│
└─ [📥 Batch Import] Button (NEW)
    └─→ Opens BatchImportModal.vue
         │
         ├─ Header
         │   ├─ Title: "Batch Import Places"
         │   ├─ Step Indicator (1/2/3)
         │   └─ Close Button
         │
         ├─ Step 1: FileUploadStep.vue
         │   ├─ Drag & Drop Zone
         │   ├─ File Input
         │   ├─ Template Download Link
         │   ├─ Format Requirements Display
         │   └─ Upload Button
         │
         ├─ Step 2: DataReviewStep.vue
         │   ├─ Summary Stats
         │   │   ├─ Total Rows
         │   │   ├─ Valid Count (✓)
         │   │   ├─ Warning Count (⚠)
         │   │   └─ Error Count (❌)
         │   │
         │   ├─ Filter Bar
         │   │   ├─ [Show All]
         │   │   ├─ [Valid Only]
         │   │   ├─ [With Issues]
         │   │   └─ Search Input
         │   │
         │   ├─ Data Table
         │   │   ├─ Row Number Column
         │   │   ├─ Status Icon Column
         │   │   ├─ Data Columns (name, address, etc.)
         │   │   └─ Actions Column
         │   │       ├─ View Button → ViewImportedPlaceModal.vue
         │   │       ├─ Edit Button → EditImportedPlaceModal.vue
         │   │       └─ Delete Button
         │   │
         │   └─ Actions
         │       ├─ Back Button
         │       ├─ Cancel Button
         │       └─ Import Selected Button
         │
         └─ Step 3: ConfirmationStep.vue
             ├─ Summary Display
             │   ├─ Places to Import Count
             │   ├─ Skipped Rows Count
             │   └─ Warning Message
             │
             ├─ Progress Bar
             │   ├─ Current / Total
             │   └─ Percentage
             │
             └─ Actions
                 ├─ Back Button
                 ├─ Cancel Button
                 └─ Confirm Import Button
```

---

## 🎯 Validation Flow

```
CSV Validation Process:

File Level Checks                Row Level Checks
├─ File exists?                  For each row:
├─ File type = .csv?             ├─ name present?
├─ File size < 5MB?              ├─ name length < 255?
├─ Rows count < 1000?            ├─ description present?
├─ Has header row?               ├─ description length < 2000?
└─ Headers correct?              ├─ address present?
    │                            ├─ address length < 500?
    ├─ PASS                      ├─ rating present?
    │   │                        ├─ rating between 1-5?
    │   └─→ Parse rows           ├─ comment length < 1000? (if present)
    │                            └─ imageUrl valid URL? (if present)
    └─ FAIL                          │
        │                            ├─ All required valid?
        └─→ Return error                 │   │
            Don't parse                  │   ├─ Yes → Check optional
                                         │   │           │
                                         │   │           ├─ All valid → ✓ VALID
                                         │   │           └─ Issues → ⚠ WARNING
                                         │   │
                                         │   └─ No → ❌ ERROR
                                         │
                                         └─→ Assign status
                                              Add to results array
```

---

## 🔄 Error Handling Flow

```
Error Scenarios:

Upload Phase:
├─ Network Error
│   └─→ Show: "Upload failed. Check your connection."
│       Retry button available
│
├─ File Too Large
│   └─→ Show: "File exceeds 5MB limit"
│       [Choose Different File]
│
├─ Invalid Format
│   └─→ Show: "Only CSV files accepted"
│       [Choose Different File]
│
└─ Server Error
    └─→ Show: "Server error. Please try again."
        Retry button available

Review Phase:
├─ Row Has Errors
│   └─→ Cannot include in import
│       Options: [Edit] [Remove]
│
├─ Row Has Warnings
│   └─→ Can include but flagged
│       Options: [Edit] [Keep As Is] [Remove]
│
└─ No Valid Rows
    └─→ Show: "No valid rows to import"
        [Go Back to Upload]

Import Phase:
├─ Partial Success (some failed)
│   └─→ Show: "Imported 40/42 places"
│       "2 failed: [details]"
│       [View Failed Rows] [Close]
│
├─ Complete Failure
│   └─→ Show: "Import failed: [error]"
│       [Retry] [Cancel]
│
└─ Network Timeout
    └─→ Show: "Request timed out"
        "Places may still be importing"
        [Check Places List] [Retry]
```

---

## 🎨 UI State Transitions

```
Modal States:

[CLOSED] ──────────────────────────────────┐
   ▲                                       │
   │ Close/Cancel                          │ Open
   │                                       ▼
   │                              ┌───────────────┐
   │                              │ STEP 1: UPLOAD │
   │                              └───────┬───────┘
   │                                      │
   │                                      │ Upload
   │                                      ▼
   │                              ┌───────────────┐
   │                              │ LOADING       │
   │                              │ Validating... │
   │                              └───────┬───────┘
   │                                      │
   │ ┌────────────────────────────────────┼────────┐
   │ │                                    │        │
   │ │ Error                              │ Success
   │ │                                    ▼        │
   │ │                          ┌────────────────┐ │
   │ │                          │ STEP 2: REVIEW │ │
   │ │                          └────────┬───────┘ │
   │ │                                   │         │
   │ │                    ┌──────────────┼─────┐   │
   │ │ ◄──── Back ────────┤              │Next │   │
   │ │                    │              ▼     │   │
   │ │                    │    ┌──────────────┐│   │
   │ │                    │    │STEP 3: CONFIRM   │
   │ │                    │    └──────┬───────┘│   │
   │ │                    │           │        │   │
   │ │ ◄──── Back ────────┘           │Confirm │   │
   │ │                                ▼        │   │
   │ │                      ┌──────────────┐   │   │
   │ │                      │  IMPORTING   │   │   │
   │ │                      │  Progress... │   │   │
   │ └──────────────────────┴──────┬───────┘   │   │
   │                               │           │   │
   │                               │ Complete   │   │
   │                               ▼           │   │
   │                      ┌──────────────┐     │   │
   │                      │   SUCCESS    │     │   │
   │                      │  Notification │    │   │
   │                      └──────┬───────┘     │   │
   │                             │             │   │
   └─────────────────────────────┘             │   │
                                               │   │
   Error at any step ──────────────────────────┘   │
   Close at any step ──────────────────────────────┘
```

---

## 📦 Data Transformation

```
CSV Text → Parsed Objects → Validated Objects → Database Records

Step 1: Parse CSV
─────────────────
Input:
name,description,address,rating,comment,imageUrl
"Beach Bar","Nice bar","123 St",4.5,"Good","http://..."

Output:
[
  {
    name: "Beach Bar",
    description: "Nice bar",
    address: "123 St",
    rating: "4.5",
    comment: "Good",
    imageUrl: "http://..."
  }
]

Step 2: Validate & Transform
─────────────────────────────
[
  {
    rowNumber: 1,
    status: "valid",
    data: {
      name: "Beach Bar",
      description: "Nice bar",
      address: "123 St",
      rating: 4.5,  // ← converted to number
      comment: "Good",
      imageUrl: "http://..."
    },
    errors: [],
    warnings: []
  }
]

Step 3: Filter & Prepare
─────────────────────────
// Only send valid/warning rows
{
  places: [
    {
      name: "Beach Bar",
      description: "Nice bar",
      address: "123 St",
      rating: 4.5,
      comment: "Good",
      imageUrl: "http://..."
    }
  ]
}

Step 4: Database Insert
───────────────────────
INSERT INTO places (
  name, description, address, rating,
  comment, imageUrl, status, createdAt
) VALUES (
  'Beach Bar', 'Nice bar', '123 St', 4.5,
  'Good', 'http://...', 'PENDING', NOW()
)

Returns: { id: "place_123abc", ... }
```

---

This visual documentation provides a comprehensive overview of the batch import feature's flow, states, and data transformations!
