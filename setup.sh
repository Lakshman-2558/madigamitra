#!/bin/bash
# Quick Start Script for Matrimony Catalog

echo "🚀 Starting Matrimony Profile Catalog..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check NPM
if ! command -v npm &> /dev/null; then
    echo "❌ NPM not found. Please install NPM first."
    exit 1
fi

echo "✅ NPM found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..
echo ""
echo "✅ All dependencies installed!"
echo ""
echo "📝 Next steps:"
echo "1. Copy backend/.env.example to backend/.env"
echo "2. Copy frontend/.env.example to frontend/.env.local"
echo "3. Update environment variables with your actual values"
echo "4. Ensure MongoDB is running"
echo ""
echo "🎯 Start development:"
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: cd frontend && npm run dev"
echo ""
