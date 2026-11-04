@echo off
setlocal enabledelayedexpansion
title Brewparts - Local Server Launcher
color 0E

:: Pindah ke folder tempat file bat ini berada (berlaku di laptop manapun)
cd /d "%~dp0"

echo ======================================================================
echo           BREWPARTS - PRECISION ESPRESSO MACHINERY & PARTS
echo ======================================================================
echo.

:: 1. Cek apakah Node.js sudah terinstal
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js TIDAK DITEMUKAN di laptop ini!
    echo.
    echo Silakan download dan install Node.js (LTS) terlebih dahulu:
    echo Website resmi: https://nodejs.org/
    echo.
    echo Setelah menginstall Node.js, tutup dan buka kembali file ini.
    echo ======================================================================
    pause
    exit /b 1
)

:: 2. Cek apakah node_modules sudah ada, jika belum otomatis jalankan npm install
if not exist "node_modules\" (
    echo [INFO] Library (node_modules) belum ada. Menjalankan 'npm install'...
    echo Proses ini membutuhkan koneksi internet dan waktu 1-2 menit.
    echo.
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo.
        echo [ERROR] Gagal melakukan npm install. Pastikan terkoneksi internet.
        pause
        exit /b 1
    )
)

:: 3. Cek apakah Prisma Client & Database lokal sudah dibuat
if not exist "apps\api\prisma\dev.db" (
    echo [INFO] Menyiapkan database lokal (Prisma SQLite)...
    call npm run setup
)

echo.
echo ======================================================================
echo  [OK] Semua persyaratan siap! Memulai server lokal...
echo  - Storefront   : http://localhost:3000
echo  - Admin Portal : http://localhost:3001
echo  - Backend API  : http://localhost:4000/api/docs
echo ======================================================================
echo.

:: 4. Buka browser otomatis
timeout /t 3 /nobreak >nul
start http://localhost:3000
start http://localhost:3001

:: 5. Jalankan server monorepo
call npm run dev

:: 6. Jangan pernah tutup jendela otomatis jika server berhenti
echo.
echo Server telah berhenti.
pause
