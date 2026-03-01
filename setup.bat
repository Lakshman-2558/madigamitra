@echo off
REM Quick Start Script for Matrimony Catalog (Windows)

echo.
echo 🚀 Starting Matrimony Profile Catalog Setup...
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%

REM Check NPM
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ NPM not found. Please install NPM first.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ NPM found: %NPM_VERSION%
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
echo ✅ Backend dependencies installed

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✅ Frontend dependencies installed

cd ..
echo.
echo ✅ All dependencies installed!
echo.
echo 📝 Next steps:
echo 1. Copy backend\.env.example to backend\.env
echo 2. Update environment variables with your actual values
echo 3. Ensure MongoDB is running
echo.
echo 🎯 Start development:
echo    Backend:  cd backend ^&^& npm run dev
echo    Frontend: cd frontend ^&^& npm run dev
echo.
pause
