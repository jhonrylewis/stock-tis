@echo off
title Jalankan Stock Gudang
echo 🔹 Menjalankan backend + serve frontend...

REM Masuk ke folder backend
cd /d "%~dp0backend"

REM Install dependencies jika belum ada
if not exist node_modules (
    echo 🔹 Installing backend dependencies...
    npm install
)

REM Jalankan server Node.js
echo 🔹 Menjalankan server...
start "" cmd /k "node server.js"

REM Masuk ke folder frontend
cd /d "%~dp0frontend"

REM Build React jika folder build tidak ada
if not exist build (
    echo 🔹 Building React frontend...
    npm install
    npm run build
)

echo ✅ Semua siap. Buka browser ke http://localhost:5000
pause
