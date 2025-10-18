# Dashboard API Contract

## Endpoint: GET /api/dashboard

This endpoint provides statistics for the admin dashboard.

### Request

**Method:** `GET`  
**URL:** `/api/dashboard`  
**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Response

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "totalUsers": 1234,
  "totalPlaces": 567
}
```

### Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `totalUsers` | `number` | Yes | Total number of registered users in the system |
| `totalPlaces` | `number` | Yes | Total number of places in the system |

### Example Response

```json
{
  "totalUsers": 1234,
  "totalPlaces": 567
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "status": 401,
  "message": "Invalid or missing authentication token",
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

#### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "An unexpected error occurred: [error details]",
  "timestamp": "2025-10-18T10:30:45.123Z"
}
```

### Error Response Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `number` | Yes | HTTP status code |
| `message` | `string` | Yes | Human-readable error message |
| `timestamp` | `string` | Yes | ISO 8601 timestamp when the error occurred |


### Implementation Notes

1. The endpoint should return the **total count** of users and places in the database
2. Authentication is required - verify the JWT token before returning data
3. Consider caching this data if the counts are expensive to compute
4. The frontend will call this endpoint when the dashboard loads (on component mount)
5. The frontend will also refresh this data after a new place is added

### Backend Implementation Example (Pseudo-code)

```javascript
// GET /api/dashboard
async function getDashboardStats(req, res) {
  try {
    // Verify authentication
    const user = await authenticateToken(req);
    
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid or missing authentication token",
        timestamp: new Date().toISOString()
      });
    }
    
    // Get statistics
    const totalUsers = await db.users.count();
    const totalPlaces = await db.places.count();
    
    // Return response
    return res.json({
      totalUsers,
      totalPlaces
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      status: 500,
      message: `An unexpected error occurred: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
}
```

### Frontend Integration

The frontend makes the request on:
- Dashboard component mount
- After a new place is successfully added

The data is displayed in statistics cards with the following format:
- **Total Users**: Blue card with users icon
- **Total Places**: Green card with map pin icon
- **Pending Approvals**: Yellow card (currently shows "-")
- **Critical Alerts**: Red card (currently shows "-")
