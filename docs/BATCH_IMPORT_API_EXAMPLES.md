# Batch Import API - Complete Examples

This document provides complete, copy-paste ready examples for both frontend and backend implementation.

---

## 📤 API 1: Upload & Validate CSV

### Endpoint Details
```
POST /api/places/batch/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

---

### Frontend Implementation Example (Vue 3)

```javascript
// In BatchImportModal.vue

async function uploadCSV(file) {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    // Make API call
    const response = await axios.post('/api/places/batch/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    // Handle success
    if (response.data.success) {
      parsedData.value = response.data.data;
      currentStep.value = 2; // Move to review step
      
      // Show summary notification
      const { totalRows, validRows, errorRows, warningRows } = response.data.data;
      showNotification(
        `Uploaded ${totalRows} places: ${validRows} valid, ${warningRows} warnings, ${errorRows} errors`
      );
    }
  } catch (error) {
    // Handle errors
    if (error.response?.data?.error) {
      const { message, code } = error.response.data.error;
      
      if (code === 'FILE_TOO_LARGE') {
        showError('File exceeds 5MB limit. Please use a smaller file.');
      } else if (code === 'INVALID_FILE_FORMAT') {
        showError('Only CSV files are accepted.');
      } else if (code === 'TOO_MANY_ROWS') {
        showError('CSV has too many rows. Maximum is 1000 rows.');
      } else if (code === 'INVALID_CSV_HEADERS') {
        showError('CSV headers are incorrect. Please download the template.');
      } else {
        showError(message || 'Upload failed. Please try again.');
      }
    } else {
      showError('Network error. Please check your connection.');
    }
  }
}
```

---

### Backend Implementation Example (Node.js/Express)

```javascript
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');

// Configure multer for file upload
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
      return cb(new Error('INVALID_FILE_FORMAT'));
    }
    cb(null, true);
  }
});

// POST /api/places/batch/upload
router.post('/batch/upload', 
  authenticateToken,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            status: 400,
            message: 'No file uploaded',
            code: 'NO_FILE'
          },
          timestamp: new Date().toISOString()
        });
      }

      const results = [];
      let rowNumber = 0;
      const requiredHeaders = ['name', 'description', 'address', 'rating', 'comment', 'imageUrl'];
      let headersValid = false;

      // Parse CSV
      const stream = Readable.from(req.file.buffer.toString('utf-8'));
      
      await new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on('headers', (headers) => {
            // Validate headers
            const hasAllHeaders = requiredHeaders.every(h => headers.includes(h));
            if (!hasAllHeaders) {
              reject(new Error('INVALID_CSV_HEADERS'));
            } else {
              headersValid = true;
            }
          })
          .on('data', (row) => {
            rowNumber++;
            
            // Check row limit
            if (rowNumber > 1000) {
              stream.destroy();
              reject(new Error('TOO_MANY_ROWS'));
              return;
            }

            // Validate row
            const validationResult = validatePlaceRow(row, rowNumber);
            results.push(validationResult);
          })
          .on('end', resolve)
          .on('error', reject);
      });

      // Calculate stats
      const stats = {
        totalRows: results.length,
        validRows: results.filter(r => r.status === 'valid').length,
        errorRows: results.filter(r => r.status === 'error').length,
        warningRows: results.filter(r => r.status === 'warning').length
      };

      res.json({
        success: true,
        data: {
          ...stats,
          places: results
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Upload error:', error);

      if (error.message === 'INVALID_CSV_HEADERS') {
        return res.status(400).json({
          success: false,
          error: {
            status: 400,
            message: 'CSV is missing required headers. Expected: name, description, address, rating, comment, imageUrl',
            code: 'INVALID_CSV_HEADERS'
          },
          timestamp: new Date().toISOString()
        });
      }

      if (error.message === 'TOO_MANY_ROWS') {
        return res.status(400).json({
          success: false,
          error: {
            status: 400,
            message: `CSV contains more than 1000 rows. Maximum allowed is 1000 rows per import.`,
            code: 'TOO_MANY_ROWS'
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(500).json({
        success: false,
        error: {
          status: 500,
          message: 'An unexpected error occurred during upload',
          code: 'INTERNAL_SERVER_ERROR'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
);

// Validation helper function
function validatePlaceRow(row, rowNumber) {
  const errors = [];
  const warnings = [];
  
  // Trim all fields
  const data = {
    name: row.name?.trim() || '',
    description: row.description?.trim() || '',
    address: row.address?.trim() || '',
    rating: parseFloat(row.rating) || 0,
    comment: row.comment?.trim() || '',
    imageUrl: row.imageUrl?.trim() || ''
  };

  // Required field validation
  if (!data.name) {
    errors.push('Name is required and cannot be empty');
  } else if (data.name.length > 255) {
    errors.push('Name must be 255 characters or less');
  }

  if (!data.description) {
    errors.push('Description is required and cannot be empty');
  } else if (data.description.length > 2000) {
    errors.push('Description must be 2000 characters or less');
  }

  if (!data.address) {
    errors.push('Address is required and cannot be empty');
  } else if (data.address.length > 500) {
    errors.push('Address must be 500 characters or less');
  }

  if (!row.rating || isNaN(data.rating)) {
    errors.push('Rating is required and must be a number');
  } else if (data.rating < 1 || data.rating > 5) {
    errors.push('Rating must be between 1.0 and 5.0');
  }

  // Optional field validation
  if (data.comment && data.comment.length > 1000) {
    errors.push('Comment must be 1000 characters or less');
  }

  if (data.imageUrl) {
    // Basic URL validation
    try {
      new URL(data.imageUrl);
    } catch (e) {
      warnings.push('Image URL appears invalid - place will be created but image may not display');
    }
  } else {
    warnings.push('No image URL provided - place will have no image');
  }

  // Determine status
  let status = 'valid';
  if (errors.length > 0) {
    status = 'error';
  } else if (warnings.length > 0) {
    status = 'warning';
  }

  return {
    rowNumber,
    status,
    data,
    errors,
    warnings
  };
}

// Multer error handler
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          status: 400,
          message: 'File size exceeds maximum allowed size of 5MB',
          code: 'FILE_TOO_LARGE'
        },
        timestamp: new Date().toISOString()
      });
    }
  } else if (error.message === 'INVALID_FILE_FORMAT') {
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: 'Invalid file format. Only CSV files are accepted.',
        code: 'INVALID_FILE_FORMAT'
      },
      timestamp: new Date().toISOString()
    });
  }
  next(error);
});
```

---

### Response Examples

#### Success Response

```json
{
  "success": true,
  "data": {
    "totalRows": 5,
    "validRows": 3,
    "errorRows": 1,
    "warningRows": 1,
    "places": [
      {
        "rowNumber": 1,
        "status": "valid",
        "data": {
          "name": "Sunset Beach Bar",
          "description": "Beautiful beachside bar with stunning ocean views",
          "address": "123 Ocean Drive, Miami Beach, FL 33139",
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
          "name": "Mountain Cafe",
          "description": "Cozy mountain retreat",
          "address": "456 Summit Road, Aspen, CO 81611",
          "rating": 5.0,
          "comment": "",
          "imageUrl": ""
        },
        "errors": [],
        "warnings": [
          "No image URL provided - place will have no image"
        ]
      },
      {
        "rowNumber": 3,
        "status": "error",
        "data": {
          "name": "",
          "description": "No name was provided",
          "address": "789 Main Street",
          "rating": 3.0,
          "comment": "",
          "imageUrl": ""
        },
        "errors": [
          "Name is required and cannot be empty"
        ],
        "warnings": []
      },
      {
        "rowNumber": 4,
        "status": "valid",
        "data": {
          "name": "Art Gallery",
          "description": "Contemporary art space",
          "address": "321 Art Lane, New York, NY",
          "rating": 4.0,
          "comment": "Monthly exhibitions",
          "imageUrl": "https://example.com/gallery.jpg"
        },
        "errors": [],
        "warnings": []
      },
      {
        "rowNumber": 5,
        "status": "error",
        "data": {
          "name": "Restaurant",
          "description": "Fine dining",
          "address": "999 Food St",
          "rating": 7.5,
          "comment": "",
          "imageUrl": ""
        },
        "errors": [
          "Rating must be between 1.0 and 5.0"
        ],
        "warnings": []
      }
    ]
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

#### Error Response - File Too Large

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "File size exceeds maximum allowed size of 5MB",
    "code": "FILE_TOO_LARGE"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

#### Error Response - Invalid Headers

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "CSV is missing required headers. Expected: name, description, address, rating, comment, imageUrl",
    "code": "INVALID_CSV_HEADERS"
  },
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

---

## 📥 API 2: Batch Import Places

### Endpoint Details
```
POST /api/places/batch/import
Authorization: Bearer {token}
Content-Type: application/json
```

---

### Frontend Implementation Example (Vue 3)

```javascript
// In BatchImportModal.vue

async function importPlaces() {
  try {
    importing.value = true;
    importProgress.value = { current: 0, total: selectedPlaces.length };

    // Prepare payload - only send valid places
    const payload = {
      places: selectedPlaces.map(place => ({
        name: place.data.name,
        description: place.data.description,
        address: place.data.address,
        rating: place.data.rating,
        comment: place.data.comment || '',
        imageUrl: place.data.imageUrl || ''
      }))
    };

    // Make API call
    const response = await axios.post('/api/places/batch/import', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    importing.value = false;

    if (response.data.success) {
      const { imported, failed, results } = response.data.data;

      // Show success message
      if (failed === 0) {
        showSuccess(`Successfully imported ${imported} places!`);
      } else {
        showWarning(
          `Imported ${imported} places successfully. ${failed} failed.`,
          { details: results.filter(r => !r.success) }
        );
      }

      // Close modal and refresh places list
      closeModal();
      emit('import-complete');
      
      // Optionally show detailed results
      if (failed > 0) {
        showImportResults(results);
      }
    }
  } catch (error) {
    importing.value = false;
    
    if (error.response?.data?.error) {
      const { message } = error.response.data.error;
      showError(message || 'Import failed. Please try again.');
    } else {
      showError('Network error. Please check your connection.');
    }
  }
}
```

---

### Backend Implementation Example (Node.js/Express)

```javascript
// POST /api/places/batch/import
router.post('/batch/import', authenticateToken, async (req, res) => {
  try {
    const { places } = req.body;

    // Validation
    if (!places || !Array.isArray(places)) {
      return res.status(400).json({
        success: false,
        error: {
          status: 400,
          message: "Request body must contain a 'places' array",
          code: 'INVALID_REQUEST_BODY'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (places.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          status: 400,
          message: 'Places array cannot be empty',
          code: 'EMPTY_PLACES_ARRAY'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Import each place
    const results = [];
    let imported = 0;
    let failed = 0;

    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      const rowNumber = i + 1;

      try {
        // Insert into database
        const newPlace = await db.places.create({
          name: place.name,
          description: place.description,
          address: place.address,
          rating: place.rating,
          comment: place.comment || null,
          imageUrl: place.imageUrl || null,
          status: 'PENDING', // Default status for imported places
          latitude: null, // Can be filled later via edit
          longitude: null,
          createdBy: req.user.id,
          createdAt: new Date()
        });

        results.push({
          rowNumber,
          success: true,
          placeId: newPlace.id,
          message: 'Place created successfully'
        });

        imported++;
      } catch (error) {
        console.error(`Failed to import row ${rowNumber}:`, error);

        // Determine error message
        let errorMessage = 'Database error';
        if (error.code === '23505') { // PostgreSQL unique constraint
          errorMessage = 'Duplicate address already exists';
        } else if (error.code === '23502') { // Not null violation
          errorMessage = 'Missing required field';
        }

        results.push({
          rowNumber,
          success: false,
          error: errorMessage,
          message: 'Failed to create place'
        });

        failed++;
      }
    }

    // Return results
    res.json({
      success: true,
      data: {
        imported,
        failed,
        results
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Batch import error:', error);
    
    res.status(500).json({
      success: false,
      error: {
        status: 500,
        message: 'An unexpected error occurred during batch import',
        code: 'INTERNAL_SERVER_ERROR'
      },
      timestamp: new Date().toISOString()
    });
  }
});
```

---

### Request Example

```json
{
  "places": [
    {
      "name": "Sunset Beach Bar",
      "description": "Beautiful beachside bar with stunning ocean views and live music on weekends",
      "address": "123 Ocean Drive, Miami Beach, FL 33139",
      "rating": 4.5,
      "comment": "Great sunset views, reservations recommended",
      "imageUrl": "https://example.com/beach-bar.jpg"
    },
    {
      "name": "Mountain Cafe",
      "description": "Cozy mountain retreat with fireplace",
      "address": "456 Summit Road, Aspen, CO 81611",
      "rating": 5.0,
      "comment": "",
      "imageUrl": ""
    },
    {
      "name": "Art Gallery",
      "description": "Contemporary art space featuring local artists",
      "address": "789 Art Lane, New York, NY 10001",
      "rating": 4.0,
      "comment": "Monthly exhibitions",
      "imageUrl": "https://example.com/gallery.jpg"
    }
  ]
}
```

---

### Response Examples

#### Complete Success

```json
{
  "success": true,
  "data": {
    "imported": 3,
    "failed": 0,
    "results": [
      {
        "rowNumber": 1,
        "success": true,
        "placeId": "place_abc123",
        "message": "Place created successfully"
      },
      {
        "rowNumber": 2,
        "success": true,
        "placeId": "place_def456",
        "message": "Place created successfully"
      },
      {
        "rowNumber": 3,
        "success": true,
        "placeId": "place_ghi789",
        "message": "Place created successfully"
      }
    ]
  },
  "timestamp": "2025-10-18T10:35:12.456Z"
}
```

#### Partial Success

```json
{
  "success": true,
  "data": {
    "imported": 2,
    "failed": 1,
    "results": [
      {
        "rowNumber": 1,
        "success": true,
        "placeId": "place_abc123",
        "message": "Place created successfully"
      },
      {
        "rowNumber": 2,
        "success": false,
        "error": "Duplicate address already exists",
        "message": "Failed to create place"
      },
      {
        "rowNumber": 3,
        "success": true,
        "placeId": "place_ghi789",
        "message": "Place created successfully"
      }
    ]
  },
  "timestamp": "2025-10-18T10:35:12.456Z"
}
```

#### Error - Invalid Request

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Request body must contain a 'places' array",
    "code": "INVALID_REQUEST_BODY"
  },
  "timestamp": "2025-10-18T10:35:12.456Z"
}
```

---

## 📥 API 3: Download Template (Optional)

### Endpoint Details
```
GET /api/places/batch/template
Authorization: Bearer {token}
```

---

### Frontend Implementation (Alternative: Client-side Generation)

```javascript
// Generate CSV template client-side (no backend needed)
function downloadTemplate() {
  const csvContent = [
    // Headers
    'name,description,address,rating,comment,imageUrl',
    // Sample row 1
    '"Sunset Beach Bar","Beautiful beachside bar with ocean views","123 Ocean Drive, Miami, FL",4.5,"Great sunset views","https://example.com/beach-bar.jpg"',
    // Sample row 2
    '"Mountain Cafe","Cozy mountain retreat","456 Summit Road, Denver, CO",5.0,"Excellent coffee","https://example.com/cafe.jpg"',
    // Sample row 3
    '"Art Gallery","Contemporary art space","789 Main Street, New York, NY",4.0,"Monthly exhibitions",""'
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'places_import_template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

---

### Backend Implementation (Optional)

```javascript
// GET /api/places/batch/template
router.get('/batch/template', authenticateToken, (req, res) => {
  const csvContent = [
    'name,description,address,rating,comment,imageUrl',
    '"Sunset Beach Bar","Beautiful beachside bar with ocean views","123 Ocean Drive, Miami, FL",4.5,"Great sunset views","https://example.com/beach-bar.jpg"',
    '"Mountain Cafe","Cozy mountain retreat","456 Summit Road, Denver, CO",5.0,"Excellent coffee","https://example.com/cafe.jpg"',
    '"Art Gallery","Contemporary art space","789 Main Street, New York, NY",4.0,"Monthly exhibitions",""'
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="places_import_template.csv"');
  res.send(csvContent);
});
```

---

## 🧪 Testing Examples

### cURL Examples

#### Upload CSV
```bash
curl -X POST http://localhost:3000/api/places/batch/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@places.csv"
```

#### Import Places
```bash
curl -X POST http://localhost:3000/api/places/batch/import \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "places": [
      {
        "name": "Test Place",
        "description": "Test description",
        "address": "123 Test St",
        "rating": 4.5,
        "comment": "Test comment",
        "imageUrl": "https://example.com/test.jpg"
      }
    ]
  }'
```

#### Download Template
```bash
curl -X GET http://localhost:3000/api/places/batch/template \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o template.csv
```

---

### Postman Collection

```json
{
  "info": {
    "name": "Batch Import APIs",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Upload CSV",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "src": "places.csv"
            }
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/api/places/batch/upload",
          "host": ["{{baseUrl}}"],
          "path": ["api", "places", "batch", "upload"]
        }
      }
    },
    {
      "name": "Import Places",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"places\": [\n    {\n      \"name\": \"Test Place\",\n      \"description\": \"Test description\",\n      \"address\": \"123 Test St\",\n      \"rating\": 4.5,\n      \"comment\": \"Test comment\",\n      \"imageUrl\": \"https://example.com/test.jpg\"\n    }\n  ]\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/places/batch/import",
          "host": ["{{baseUrl}}"],
          "path": ["api", "places", "batch", "import"]
        }
      }
    },
    {
      "name": "Download Template",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/places/batch/template",
          "host": ["{{baseUrl}}"],
          "path": ["api", "places", "batch", "template"]
        }
      }
    }
  ]
}
```

---

## 📋 Database Schema Considerations

### Places Table
```sql
CREATE TABLE places (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  address VARCHAR(500) NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  comment VARCHAR(1000),
  image_url VARCHAR(500),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status VARCHAR(50) DEFAULT 'PENDING',
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Optional: prevent duplicate addresses
  CONSTRAINT unique_address UNIQUE (address)
);

-- Indexes for performance
CREATE INDEX idx_places_status ON places(status);
CREATE INDEX idx_places_created_at ON places(created_at);
CREATE INDEX idx_places_rating ON places(rating);
```

---

## 🔒 Security Checklist

- [ ] JWT authentication required for all endpoints
- [ ] File size limit enforced (5MB)
- [ ] File type validation (CSV only)
- [ ] Row count limit enforced (1000 max)
- [ ] Input sanitization on all fields
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (escape output)
- [ ] CSRF protection (if applicable)
- [ ] Rate limiting on upload endpoint
- [ ] Virus scanning on uploaded files (optional but recommended)
- [ ] Audit logging of all imports
- [ ] User permissions check (admin only)

---

This completes the API implementation examples! Use these as a reference when building both the frontend and backend components.
