# Matrimony Profile Catalog - Full Stack Application

A complete, production-ready matrimony profile catalog system built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### Admin Features

- **Secure JWT-based Authentication** - Admin login with token-based security
- **Image-based Profile Upload** - Upload images, OCR extracts 5-digit codes automatically
- **Profile Management** - View, filter, and soft-delete profiles
- **Cloudinary Integration** - Cloud storage for profile images

### User Features

- **Search by Year** - Enter 2 digits to search by year (e.g., "91")
- **Search by Full Code** - Enter 5 digits to search by complete code (e.g., "90791")
- **Responsive Grid Layout** - 3 columns on desktop, 1 on mobile
- **Organized Results** - Brides shown first, then Grooms

## 🛠️ Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Tesseract.js** - OCR library (free, runs on server)
- **Cloudinary** - Image hosting
- **JWT** - Authentication
- **Sharp** - Image processing & compression

### Frontend

- **React 18** - UI library
- **Vite** - Build tool (fast development)
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Responsive styling

## 📁 Project Structure

```
matrimony/
├── backend/
│   ├── models/
│   │   ├── Profile.js           # Profile schema
│   │   └── Admin.js             # Admin schema
│   ├── routes/
│   │   ├── adminRoutes.js       # Admin endpoints
│   │   └── userRoutes.js        # Public search endpoints
│   ├── controllers/
│   │   └── profileController.js # Business logic
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── utils/
│   │   ├── ocrService.js        # OCR + code parsing
│   │   ├── cloudinaryConfig.js  # Cloudinary setup
│   │   └── imageProcessor.js    # Image validation & resize
│   ├── server.js                # Express app
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx              # Search page
    │   │   ├── SearchResults.jsx     # Results display
    │   │   ├── AdminLogin.jsx        # Admin login
    │   │   ├── AdminDashboard.jsx    # Profile management
    │   │   └── UploadProfile.jsx     # Upload page
    │   ├── components/
    │   │   └── ProfileCard.jsx       # Profile display card
    │   ├── api/
    │   │   └── api.js               # API calls
    │   ├── styles/
    │   │   ├── App.css
    │   │   ├── Home.css
    │   │   ├── AdminLogin.css
    │   │   ├── AdminDashboard.css
    │   │   ├── UploadProfile.css
    │   │   ├── SearchResults.css
    │   │   └── ProfileCard.css
    │   ├── App.jsx                  # Route setup
    │   └── main.jsx                 # Entry point
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/matrimony
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Prerequisites:**

- MongoDB running locally or connection string to MongoDB Atlas
- Cloudinary account (free tier available)

Start backend:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start development server:

```bash
npm run dev
```

Open `http://localhost:5173`

## 📖 Usage Guide

### For Admin Users

1. **Login** → Visit `/admin/login`
   - Username: `admin`
   - Password: `admin123`

2. **Upload Profile**
   - Navigate to Upload page
   - Select image (JPG, JPEG, PNG)
   - Image must contain clear 5-digit code
   - Select category (Bride/Groom)
   - OCR automatically extracts code
   - Image uploaded to Cloudinary

3. **Manage Profiles** → Dashboard
   - View all profiles
   - Filter by status (active/inactive)
   - Filter by category (Bride/Groom)
   - Delete profiles (soft delete, removes from Cloudinary)

### For Public Users

1. **Search** → Visit `/` (Home page)
   - Enter 2 digits for year search (e.g., `91`)
   - Enter 5 digits for code search (e.g., `90791`)

2. **View Results**
   - Brides displayed first
   - Grooms below
   - Responsive grid layout
   - Click image to see full size

## 📊 Database Schema

### Profile Collection

```javascript
{
  profileCode: "90791",           // 5-digit unique code
  sequenceNumber: 90,             // First 2 digits
  month: 7,                       // Next 2 digits (validation: 1-12)
  year: 91,                       // Last 2 digits
  category: "Bride",              // "Bride" or "Groom"
  imageUrl: "https://...",        // Cloudinary URL
  publicId: "matrimony-profiles/...", // For deletion
  status: "active",               // "active" or "inactive"
  createdAt: "2024-01-15T...",
  updatedAt: "2024-01-15T..."
}
```

## 🔐 Security Features

- ✅ JWT token authentication for admin routes
- ✅ Input validation on all endpoints
- ✅ Image type and size validation
- ✅ OCR output sanitization
- ✅ CORS properly configured
- ✅ Error handling without exposing sensitive info
- ✅ Soft deletes for data integrity

## ⚡ Performance Optimizations

- ✅ OCR runs ONLY during upload (not search)
- ✅ Search uses database queries only
- ✅ Image compression with Sharp (reduce 50-70%)
- ✅ Image size limit: 2MB
- ✅ MongoDB indexes on frequently searched fields:
  - `year` + `category`
  - `profileCode` + `status`

## 🎨 UI/UX Features

- ✅ **Responsive Design** - Desktop, Tablet, Mobile
- ✅ **Modern Styling** - Gradient header, cards with shadows
- ✅ **Loading States** - Feedback during uploads/searches
- ✅ **Error Messages** - Clear, actionable feedback
- ✅ **Accessibility** - Proper labels, semantic HTML
- ✅ **Mobile-First** - Works perfectly on small screens

## 📱 Responsive Breakpoints

- Desktop: 3-column grid (768px+)
- Tablet: 2-column grid (480px-767px)
- Mobile: 1-column grid (<480px)

## 🧪 Testing the Application

### Test Admin Upload Flow

1. Login with demo credentials
2. Upload test image with "90791" text visible
3. Select category
4. Verify OCR extracts code correctly
5. Check Cloudinary upload success
6. View in dashboard

### Test User Search Flow

1. Go to home page
2. Search by year: enter "91"
3. Search by code: enter "90791"
4. Verify results show correct profiles
5. Test mobile responsiveness

## 🆘 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string in `.env`
- Use MongoDB Atlas for cloud database

### Cloudinary Upload Fails

- Verify API credentials in `.env`
- Check image size (max 2MB)
- Ensure valid image format (JPG, PNG)

### OCR Not Detecting Code

- Image must be clear and well-lit
- Code must be visible and readable
- Try rotating image if skewed
- Ensure exactly 5 consecutive digits

### Port Already in Use

- Backend: Change PORT in `.env` (default 5000)
- Frontend: Use `npm run dev -- --port 3000`

## 📦 Deployment

### Backend (Node.js)

```bash
# Build
npm run build

# Deploy to Heroku/Vercel/Railway
```

### Frontend (Vite)

```bash
# Build
npm run build

# Output in dist/ folder
# Deploy to Netlify/Vercel
```

## 📄 API Endpoints

### Admin Routes

- `POST /api/admin/login` - Login
- `POST /api/admin/upload` - Upload profile (requires JWT)
- `GET /api/admin/profiles` - Get all profiles (requires JWT)
- `DELETE /api/admin/profiles/:id` - Delete profile (requires JWT)

### Public Routes

- `GET /api/search?q=91` - Search profiles

## 🔄 Code Parsing Logic

**Format:** XXYYZZ (e.g., 90791)

- XX (first 2 digits) → sequenceNumber: 0-99
- YY (next 2 digits) → month: 1-12
- ZZ (last 2 digits) → year: 0-99

## 📝 License

MIT

## 👨‍💻 Support

For issues or questions, check the documentation or contact development team.

---

**Version:** 1.0.0  
**Last Updated:** 2024
