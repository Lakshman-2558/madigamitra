# System Architecture - Matrimony Catalog

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)               │
│                  Port: 5173 (Development)               │
├─────────────────────────────────────────────────────────┤
│  Pages: Home, AdminLogin, AdminDashboard, Upload, etc   │
│  Components: ProfileCard, Forms, Grids                  │
│  API: Axios client, environment-based URL              │
└──────────────────────────┬──────────────────────────────┘
                           │
                    HTTP/REST API
                    (JSON payload)
                           │
┌──────────────────────────┴──────────────────────────────┐
│              BACKEND (Node.js + Express)                │
│                   Port: 5000                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Routes Layer:                                           │
│  ├─ /api/admin/* (Protected with JWT)                   │
│  └─ /api/search (Public)                                │
│                                                          │
│  Controllers Layer:                                      │
│  ├─ uploadProfile()         → OCR + Cloudinary          │
│  ├─ getAllProfiles()        → MongoDB query             │
│  ├─ deleteProfile()         → Soft delete + Cloudinary  │
│  └─ searchProfiles()        → Public search             │
│                                                          │
│  Middleware:                                             │
│  ├─ auth.js (JWT verification)                          │
│  └─ Multer (file upload handling)                       │
│                                                          │
│  Utils:                                                  │
│  ├─ ocrService.js           → Tesseract.js             │
│  ├─ cloudinaryConfig.js     → Image hosting            │
│  ├─ imageProcessor.js       → Sharp (resize/compress)   │
│  └─ auth.js                 → JWT generation            │
│                                                          │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────────┐ ┌──────────────┐ ┌──────────────┐
   │  MongoDB    │ │  Cloudinary  │ │ Tesseract.js │
   │  (Database) │ │  (Images)    │ │   (OCR)      │
   └─────────────┘ └──────────────┘ └──────────────┘
```

## 📡 Data Flow Diagrams

### Upload Flow

```
User uploads image
        ↓
multer: Save to temp file
        ↓
imageProcessor: Validate + Resize
        ↓
ocrService: Extract code (Tesseract.js)
        ↓
ocrService: Parse code (XXYYZZ format)
        ↓
cloudinaryConfig: Upload to Cloudinary
        ↓
MongoDB: Insert profile document
        ↓
imageProcessor: Delete temp files
        ↓
Response: Profile object + URL
```

### Search Flow

```
User enters query (2 or 5 digits)
        ↓
Validate: Is exactly 2 or 5 digits?
        ↓
If 2 digits:
  → Query: find(year: X)
If 5 digits:
  → Query: find(profileCode: X)
        ↓
MongoDB: Return active profiles only
        ↓
Sort: Bride first, then Groom
        ↓
Response: Organized by category
```

### Delete Flow

```
Admin clicks Delete
        ↓
Confirm dialog
        ↓
Auth: Verify JWT token
        ↓
MongoDB: Find profile by ID
        ↓
Cloudinary: Delete image (publicId)
        ↓
MongoDB: Set status = 'inactive'
        ↓
Response: Success message
```

## 🔐 Authentication Flow

```
Admin Login Page
        ↓
Enter username/password
        ↓
POST /api/admin/login
        ↓
Backend: Validate credentials
        ↓
JWT: Generate token (24h expiry)
        ↓
Frontend: Save token in localStorage
        ↓
All admin requests:
  Authorization: Bearer {token}
        ↓
Middleware: Verify token
        ↓
If valid → Allow request
If invalid → Return 401/403
```

## 📊 Database Schema

### Collections

#### 1. Profiles Collection

```javascript
db.profiles.insertOne({
  // Unique 5-digit code
  profileCode: String, // Index

  // Code components
  sequenceNumber: Number, // 0-99
  month: Number, // 1-12 (validated)
  year: Number, // 0-99, Index

  // Classification
  category: String, // "Bride" | "Groom", Index

  // Images
  imageUrl: String, // Cloudinary URL
  publicId: String, // Cloudinary ID (for deletion)

  // Status
  status: String, // "active" | "inactive"

  // Timestamps
  createdAt: Date, // Auto
  updatedAt: Date, // Auto
});
```

**Indexes:**

```javascript
db.profiles.createIndex({ year: 1, category: 1 });
db.profiles.createIndex({ profileCode: 1, status: 1 });
db.profiles.createIndex({ status: 1 });
```

**Constraints:**

```javascript
profileCode: unique
month: min 1, max 12
year: min 0, max 99
status: enum ['active', 'inactive']
```

### Query Examples

```javascript
// Search by year
db.profiles.find({ year: 91, status: 'active' })

// Search by code
db.profiles.find({ profileCode: '90791', status: 'active' })

// Get all active
db.profiles.find({ status: 'active' })

// Soft delete
db.profiles.updateOne(
  { _id: ObjectId(...) },
  { $set: { status: 'inactive' } }
)

// Sort by category (Bride first)
db.profiles.find({ status: 'active' })
  .sort({ category: 1 })
```

## 🔄 Request/Response Patterns

### Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {
    /* actual data */
  }
}
```

### Standard Error Response

```json
{
  "success": false,
  "message": "Human-readable error"
}
```

## 🛡️ Security Layers

```
1. HTTPS/TLS
   ↓
2. CORS Validation
   ↓
3. Input Validation
   ├─ File type check
   ├─ File size limit
   ├─ String length limits
   └─ Regex validation
   ↓
4. Authentication
   └─ JWT token verification
   ↓
5. Authorization
   └─ Admin role check
   ↓
6. Data Sanitization
   ├─ OCR output regex
   └─ MongoDB escaping
   ↓
7. Rate Limiting (Recommended)
   └─ Prevent abuse
```

## 🚀 Deployment Architecture

### Development

```
Local Machine
├─ Backend: npm run dev (port 5000)
├─ Frontend: npm run dev (port 5173)
├─ MongoDB: localhost:27017
└─ Cloudinary: API calls
```

### Production

```
┌─────────────────────────────────────────┐
│         Frontend (Vercel/Netlify)       │
│  Static assets served via CDN           │
│  Redirects /api/* to backend            │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│    Backend (Railway/Heroku/AWS EC2)     │
│  Node.js + Express application          │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┬────────────┐
       │                │            │
  ┌────▼────┐    ┌─────▼──┐  ┌────▼────┐
  │MongoDB  │    │Cloudinary  │Tesseract│
  │Cloud    │    │(Images)    │(Server) │
  └─────────┘    └────────────┘ └────────┘
```

## 📈 Scalability Considerations

### Current Limitations

1. **Single Server**
   - One backend instance
   - No load balancing

2. **No Caching**
   - Every search hits database
   - ~50-100ms per search

3. **Tesseract.js on Server**
   - Blocks upload processing
   - Consider serverless (AWS Lambda)

### Scaling Options

#### Option 1: Horizontal Scaling

```
Load Balancer
├─ Backend Instance 1
├─ Backend Instance 2
├─ Backend Instance 3
└─ Shared MongoDB Cluster
```

#### Option 2: Serverless (AWS Lambda)

```
API Gateway
├─ /search → Lambda (public)
└─ /admin/* → Lambda (protected)
   │
   └─ Shared RDS/MongoDB Atlas
```

#### Option 3: Microservices

```
Gateway
├─ Upload Service (OCR + Cloudinary)
├─ Profile Service (CRUD)
├─ Search Service (Read-only)
└─ Auth Service (JWT validation)
```

## 📊 Expected Performance

### Single Node Environment

| Operation        | Time       | Notes            |
| ---------------- | ---------- | ---------------- |
| Search by year   | 20-50ms    | Indexed query    |
| Search by code   | 10-30ms    | Indexed query    |
| Image upload     | 2-5s       | OCR + Cloudinary |
| Profile deletion | 500-1000ms | Cloudinary API   |
| Database insert  | 50-100ms   | MongoDB write    |

### Concurrent Users

- **10 users**: No issues
- **100 users**: Monitor resource usage
- **1000+ users**: Switch to serverless/scaling

## 🔧 Configuration Management

### Environment Variables

**Backend:** `backend/.env`

```env
DATABASE_URL
JWT_SECRET
CLOUDINARY_*
ADMIN_USERNAME
ADMIN_PASSWORD
```

**Frontend:** `frontend/.env.local`

```env
VITE_API_URL
```

### Feature Flags (Future)

```javascript
const features = {
  ENABLE_BARCODE_SCANNING: false,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_ANALYTICS: false,
  ENABLE_RATE_LIMITING: true,
};
```

## 📱 Responsive Design Strategy

### Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
  .profiles-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .profiles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 769px) {
  .profiles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🧪 Testing Strategy

### Unit Tests

- OCR parsing logic
- Code validation algorithms
- Database queries

### Integration Tests

- Full upload flow
- Full search flow
- Authentication flow

### E2E Tests

- Admin login → Upload → View in Dashboard
- Public search → View results
- Mobile responsiveness

## 📝 Logging & Monitoring

### Error Logging

```javascript
catch (error) {
  console.error('Upload Error:', error);
  logger.error({
    timestamp: new Date(),
    operation: 'uploadProfile',
    error: error.message,
    userId: req.adminId
  });
}
```

### Performance Metrics

```javascript
// Measure upload time
const startTime = Date.now();
// ... upload process
const duration = Date.now() - startTime;
console.log(`Upload took ${duration}ms`);
```

## 🔄 CI/CD Pipeline

```
GitHub Push
   ↓
GitHub Actions
   ├─ Run tests
   ├─ Build frontend
   └─ Build backend
   ↓
If successful:
   ├─ Deploy backend (Railway/Heroku)
   └─ Deploy frontend (Vercel/Netlify)
   ↓
Health check
```

## 🆘 Error Handling Strategy

```
User Action
   ↓
Try-Catch Block
   ↓
Error → Log + Show User Message
   ↓
Response with status code
```

**Status Codes:**

- 200: OK
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

## 🔐 CORS Configuration

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

---

**Version:** 1.0  
**Last Updated:** 2024
