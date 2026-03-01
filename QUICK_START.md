# Quick Start Guide - Matrimony Profile Catalog

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 16+** (download from nodejs.org)
- **MongoDB** (local or MongoDB Atlas account)
- **Cloudinary account** (free tier at cloudinary.com)

## ⚡ Quick Start (5 minutes)

### Step 1: Clone/Extract Project

```bash
cd matrimony
```

### Step 2: Run Setup Script

**Windows:**

```bash
setup.bat
```

**Mac/Linux:**

```bash
chmod +x setup.sh
./setup.sh
```

**Or manually:**

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 3: Configure Environment

#### Backend Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Update with your credentials:

```bash
cd backend
cp .env.example .env
# Edit .env with your editor
```

Required values:

- `MONGODB_URI` - Local or Atlas connection
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `JWT_SECRET` - Keep secure

#### Frontend Setup (Optional)

```bash
cd frontend
cp .env.example .env.local
```

### Step 4: Start Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Output: `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Output: `Local: http://localhost:5173`

### Step 5: Access Application

- **Home Page:** http://localhost:5173
- **Admin Login:** http://localhost:5173/admin/login
  - Username: `admin`
  - Password: `admin123`

## 🧪 Test the Application

### 1. Upload a Profile (Admin)

1. Login at `/admin/login`
2. Click "Upload Profile"
3. Upload image with visible 5-digit code (e.g., "90791")
4. Select category (Bride/Groom)
5. Click Upload

### 2. Search Profiles (Public)

1. Go to Home page `/`
2. Enter year (2 digits): `91`
3. Click Search
4. View results

Or search by full code:

1. Go to Home page `/`
2. Enter code (5 digits): `90791`
3. Click Search

## 📁 Project Structure Quick Reference

```
matrimony/
├── backend/          # Node.js + Express server
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── controllers/  # Business logic
│   ├── utils/        # Helpers (OCR, Cloudinary, etc)
│   └── server.js     # Main server file
│
└── frontend/         # React + Vite application
    ├── src/pages/    # Page components
    ├── src/api/      # API calls
    ├── src/styles/   # CSS files
    └── index.html    # Entry HTML
```

## 🔑 Default Admin Credentials

**Login Page:** `http://localhost:5173/admin/login`

```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT:** Change these in production!

## 🛠️ Common Commands

### Backend

```bash
npm install          # Install dependencies
npm run dev         # Start in development mode
npm start           # Start in production
```

### Frontend

```bash
npm install         # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🐛 Troubleshooting

### "MongoDB connection failed"

- Ensure MongoDB is running locally
- Or use MongoDB Atlas connection string
- Check MONGODB_URI in `.env`

### "Cloudinary upload failed"

- Verify credentials in `.env`
- Check image is valid JPG/PNG
- Ensure under 2MB size

### "Port 5000 already in use"

- Change PORT in `backend/.env`
- Or kill app using port: `lsof -ti:5000 | xargs kill -9`

### "OCR not detecting code"

- Image must show clear 5 digits
- Try well-lit, high-contrast image
- Code must be consecutive digits (e.g., 90791)

### "Frontend not connecting to backend"

- Check backend is running on port 5000
- Verify VITE_API_URL in frontend `.env.local`
- Check CORS settings in backend

## 📖 Full Documentation

- **README.md** - Complete feature documentation
- **ENV_SETUP.md** - Environment variables guide
- **DEPLOYMENT.md** - Production deployment guide

## 🚀 Next Steps

1. **Customize Admin Password**
   - Edit backend `.env` credentials
   - Implement proper admin registration

2. **Add More Features**
   - Email notifications
   - Advanced search filters
   - Admin analytics dashboard

3. **Deploy to Production**
   - Follow DEPLOYMENT.md
   - Set up SSL/HTTPS
   - Configure monitoring

## 📞 Support

For detailed information:

1. Check README.md for features
2. Review code comments
3. Check error messages
4. Verify .env configuration

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Backend .env configured
- [ ] Cloudinary credentials added
- [ ] Backend server runs (`npm run dev`)
- [ ] Frontend runs (`npm run dev`)
- [ ] Can login with admin/admin123
- [ ] Can upload image with code
- [ ] Can search and see results

Once all checkboxes are done, you're ready to use the application! 🎉

---

**Having issues?** Check the troubleshooting section above or review the main README.md file.
