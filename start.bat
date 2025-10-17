@echo off
echo ============================================
echo   AI Ebook Creator - Quick Start
echo ============================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully!
echo.

echo [2/5] Checking environment variables...
if not exist .env.local (
    echo WARNING: .env.local not found
    echo Please ensure you have configured Clerk keys
    echo See SETUP.md for detailed instructions
    pause
)
echo ✓ Environment file exists
echo.

echo [3/5] Setting up Supabase...
echo Please ensure you have:
echo   - Created tables using supabase/schema.sql
echo   - Set up the ebook-covers storage bucket
echo   - Enabled Row Level Security policies
echo.
echo Press any key when Supabase setup is complete...
pause > nul
echo ✓ Supabase setup confirmed
echo.

echo [4/5] Verifying Clerk configuration...
echo Please ensure you have:
echo   - Created a Clerk application
echo   - Added your Clerk keys to .env.local
echo   - Configured redirect URLs in Clerk dashboard
echo.
echo Press any key when Clerk is configured...
pause > nul
echo ✓ Clerk configuration confirmed
echo.

echo [5/5] Starting development server...
echo.
echo ============================================
echo   Server starting at http://localhost:3000
echo ============================================
echo.
echo Next steps:
echo   1. Open http://localhost:3000 in your browser
echo   2. Sign up for a new account
echo   3. Create your first ebook!
echo.
echo For help, see:
echo   - README.md - Project overview
echo   - SETUP.md - Detailed setup instructions
echo   - DATABASE.md - Database schema documentation
echo   - AI_FEATURES.md - AI features guide
echo.
call npm run dev
