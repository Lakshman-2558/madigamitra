# API Documentation - Matrimony Catalog

## Base URL

- Development: `http://localhost:5000/api`
- Production: `https://yourdomain.com/api`

## Authentication

Admin routes require JWT Bearer token in header:

```
Authorization: Bearer <token>
```

Get token from `/admin/login` endpoint.

---

## Public Endpoints (No Authentication Required)

### 🔍 Search Profiles

**Endpoint:** `GET /search`

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `q` | string | Yes | 2-digit year OR 5-digit code |

**Examples:**

```
GET /api/search?q=91        # Search by year
GET /api/search?q=90791     # Search by full code
```

**Response (Success):**

```json
{
  "success": true,
  "searchType": "year",
  "query": "91",
  "total": 5,
  "brides": {
    "count": 3,
    "profiles": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "profileCode": "90791",
        "sequenceNumber": 90,
        "month": 7,
        "year": 91,
        "category": "Bride",
        "imageUrl": "https://cloudinary.com/...",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "grooms": {
    "count": 2,
    "profiles": [...]
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Enter 2 digits (year) or 5 digits (full code)"
}
```

**Status Codes:**

- `200` - Success
- `400` - Invalid input
- `500` - Server error

---

## Admin Endpoints (Authentication Required)

### 🔐 Admin Login

**Endpoint:** `POST /admin/login`

**Body:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluXzEiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzA1MzI2MzAwLCJleHAiOjE3MDU0MTI3MDB9.xxxxx",
  "username": "admin"
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Status Codes:**

- `200` - Success
- `400` - Missing fields
- `401` - Invalid credentials
- `500` - Server error

**Token Expiry:** 24 hours

---

### 📤 Upload Profile

**Endpoint:** `POST /admin/upload`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | file | Yes | JPG, JPEG, or PNG (max 2MB) |
| `category` | string | Yes | "Bride" or "Groom" |

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/admin/upload \
  -H "Authorization: Bearer <token>" \
  -F "image=@profile_image.jpg" \
  -F "category=Bride"
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Profile uploaded successfully",
  "profile": {
    "_id": "507f1f77bcf86cd799439011",
    "profileCode": "90791",
    "sequenceNumber": 90,
    "month": 7,
    "year": 91,
    "category": "Bride",
    "imageUrl": "https://res.cloudinary.com/...",
    "publicId": "matrimony-profiles/xxx",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Code not detected. Please upload clear image."
}
```

**Validation:**

- File type: Only JPG, JPEG, PNG
- File size: Max 2MB
- Image quality: Must contain clear 5-digit code
- Category: "Bride" or "Groom"

**Status Codes:**

- `201` - Created
- `400` - Invalid input/file
- `401` - Unauthorized
- `403` - Forbidden
- `500` - Server error

---

### 📋 Get All Profiles

**Endpoint:** `GET /admin/profiles`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
| Param | Type | Values | Description |
|-------|------|--------|-------------|
| `status` | string | "active", "inactive" | Filter by status |
| `category` | string | "Bride", "Groom" | Filter by category |

**Examples:**

```
GET /api/admin/profiles
GET /api/admin/profiles?status=active
GET /api/admin/profiles?category=Bride
GET /api/admin/profiles?status=active&category=Groom
```

**Response (Success):**

```json
{
  "success": true,
  "count": 2,
  "profiles": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "profileCode": "90791",
      "sequenceNumber": 90,
      "month": 7,
      "year": 91,
      "category": "Bride",
      "imageUrl": "https://res.cloudinary.com/...",
      "publicId": "matrimony-profiles/xxx",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### 🗑️ Delete Profile

**Endpoint:** `DELETE /admin/profiles/:profileId`

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `profileId` | string | Yes | MongoDB ObjectId |

**Example:**

```
DELETE /api/admin/profiles/507f1f77bcf86cd799439011
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

**Response (Error - Not Found):**

```json
{
  "success": false,
  "message": "Profile not found"
}
```

**Process:**

1. Mark status as "inactive" in MongoDB
2. Delete image from Cloudinary
3. Return success response

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `404` - Profile not found
- `500` - Server error

---

## Health Check

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Messages

| Message                                         | Cause                        | Solution              |
| ----------------------------------------------- | ---------------------------- | --------------------- |
| "No token provided"                             | Missing Authorization header | Add Bearer token      |
| "Invalid or expired token"                      | Token invalid or expired     | Login again           |
| "Code not detected. Please upload clear image." | OCR failed                   | Upload clearer image  |
| "File size exceeds 2MB limit"                   | File too large               | Use smaller image     |
| "Invalid file type"                             | Wrong format                 | Use JPG, JPEG, or PNG |
| "Profile code already exists"                   | Duplicate code               | Unique code required  |
| "Invalid month in profile code"                 | Wrong code format            | Month must be 1-12    |

---

## Request Examples

### Using JavaScript/Fetch

**Search:**

```javascript
const response = await fetch("http://localhost:5000/api/search?q=91");
const data = await response.json();
```

**Login:**

```javascript
const response = await fetch("http://localhost:5000/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "admin123" }),
});
const data = await response.json();
```

**Upload (with axios):**

```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]);
formData.append("category", "Bride");

const response = await axios.post(
  "http://localhost:5000/api/admin/upload",
  formData,
  { headers: { Authorization: `Bearer ${token}` } },
);
```

### Using cURL

**Search:**

```bash
curl "http://localhost:5000/api/search?q=91"
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Upload:**

```bash
curl -X POST http://localhost:5000/api/admin/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@image.jpg" \
  -F "category=Bride"
```

**Delete:**

```bash
curl -X DELETE http://localhost:5000/api/admin/profiles/ID \
  -H "Authorization: Bearer TOKEN"
```

---

## Rate Limiting (Recommended for Production)

Current implementation doesn't have rate limiting. For production, add:

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

---

## CORS Headers

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Database Schema Reference

### Profile Document

```javascript
{
  _id: ObjectId,
  profileCode: String,      // Unique, 5 digits (e.g., "90791")
  sequenceNumber: Number,   // 0-99
  month: Number,            // 1-12
  year: Number,             // 0-99
  category: String,         // "Bride" or "Groom"
  imageUrl: String,         // Cloudinary secure URL
  publicId: String,         // Cloudinary public ID
  status: String,           // "active" or "inactive"
  createdAt: Date,
  updatedAt: Date
}
```

---

## Pagination (Future Enhancement)

Currently not implemented. To add:

```
GET /api/search?q=91&page=1&limit=20
GET /api/admin/profiles?page=1&limit=50
```

---

## Versioning

Current API version: v1
Future: Support `/api/v1/` prefix

---

## Testing Credentials

```
Username: admin
Password: admin123
```

⚠️ Change in production!

---

## Support

For API issues:

1. Check error message
2. Review code examples
3. Verify authentication token
4. Check MongoDB connection
5. Verify Cloudinary setup
