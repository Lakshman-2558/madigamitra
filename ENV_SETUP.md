# Matrimony Catalog - Environment Variables Guide

## Backend (.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/matrimony
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/matrimony

# JWT Secret (Change in production!)
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Cloudinary Config
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Config
PORT=5000
NODE_ENV=development
# NODE_ENV=production

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Optional: Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Frontend (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
# For production: VITE_API_URL=https://api.yourdomain.com/api
```

## 🔑 How to Get Cloudinary Credentials

1. Go to https://cloudinary.com
2. Sign up (free tier available)
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret

## 🔐 MongoDB Setup

### Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Windows: Download installer from mongodb.com
# Linux: Follow MongoDB installation guide

# Start MongoDB
mongod
```

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add connection string to MONGODB_URI

## 🔒 JWT Secret

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use in production, not "change_in_production"

## 📝 Environment File Locations

- Backend: `backend/.env`
- Frontend: `frontend/.env.local` (optional, Vite auto-loads)

Never commit .env files to version control!
