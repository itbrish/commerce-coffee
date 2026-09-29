@echo off
title Push Project to GitHub - Atelier du Cafe
color 0A
echo ========================================================
echo    ATELIER DU CAFE - GITHUB REPOSITORY UPLOADER
echo ========================================================
echo.
echo Seluruh kode proyek sudah siap di-commit ke Git local.
echo.
set /p REPO_URL="Masukkan Link Repository GitHub Anda (contoh: https://github.com/user/atelier.git): "

if "%REPO_URL%"=="" (
    echo Error: Link repository tidak boleh kosong!
    pause
    exit /b
)

set GIT_EXE="C:\Users\itlif\.gemini\antigravity\scratch\mingit\cmd\git.exe"
cd /d "C:\Users\itlif\.gemini\antigravity\scratch\coffee-commerce"

echo.
echo [1/3] Menyiapkan remote origin...
%GIT_EXE% remote remove origin >nul 2>&1
%GIT_EXE% remote add origin %REPO_URL%

echo [2/3] Memastikan semua file ter-commit...
%GIT_EXE% branch -M main
%GIT_EXE% add .
%GIT_EXE% commit -m "feat: Atelier du Cafe fullstack e-commerce & admin operations portal" >nul 2>&1

echo [3/3] Melakukan push ke GitHub (%REPO_URL%)...
%GIT_EXE% push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo  SUKSES! Kode web berhasil di-upload ke GitHub Anda.
    echo ========================================================
) else (
    echo.
    echo [Gagal Push] Kemungkinan Anda diminta login atau memasukkan GitHub Token.
)

echo.
pause
