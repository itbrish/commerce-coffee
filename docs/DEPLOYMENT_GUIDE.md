# Master Production Deployment Guide — ATELIER DU CAFÉ

Panduan langkah demi langkah untuk melakukan deploy platform e-commerce mesin kopi **ATELIER DU CAFÉ** ke production cloud, menghubungkan database PostgreSQL Supabase/AWS RDS, WhatsApp Business Cloud API resmi, dan payment gateway Midtrans / Xendit.

---

## 1. Deploy Frontend ke Vercel (`apps/web` & `apps/admin`)

Vercel adalah platform hosting terbaik untuk Next.js dengan CDN global dan performa optimal.

### A. Deploy Storefront Pelanggan (`apps/web`)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **"Add New..."** ➔ **"Project"** ➔ Pilih repository GitHub `coffee-commerce`.
3. Pada bagian **Root Directory**, klik **Edit** dan pilih folder:
   ```
   apps/web
   ```
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com/api/v1` (URL backend API Anda di Railway/Render)
   - `NEXT_PUBLIC_STORE_URL`: `https://yourdomain.com` (atau domain default Vercel `https://your-store.vercel.app`)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: `6281234567890` (Nomor WhatsApp VIP Concierge Anda)
5. Klik **"Deploy"**.

---

### B. Deploy Admin Portal (`apps/admin`)
1. Di dashboard Vercel, klik **"Add New Project"** lagi dari repository yang sama.
2. Pada bagian **Root Directory**, pilih folder:
   ```
   apps/admin
   ```
3. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com/api/v1`
4. Klik **"Deploy"**.

---

## 2. Deploy Backend API ke Railway / Render & Database Supabase (PostgreSQL)

Backend NestJS membutuhkan Node.js runtime dan database PostgreSQL terkelola.

### A. Setup Database PostgreSQL di Supabase (Gratis & Cepat)
1. Buka [supabase.com](https://supabase.com) dan buat project baru (pilih region terdekat: **Singapore / Jakarta**).
2. Salin **Connection String (URI)** di menu *Project Settings -> Database*:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

---

### B. Deploy Backend ke Railway (1-Click)
1. Buka [railway.app](https://railway.app) ➔ **"New Project"** ➔ **"Deploy from GitHub repo"**.
2. Pilih repository `coffee-commerce`.
3. Di tab **Variables**, tambahkan environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
   - `DATABASE_URL`: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - `JWT_SECRET`: `atelier-du-cafe-production-jwt-key-2026`
   - `NEXT_PUBLIC_STORE_URL`: `https://your-store.vercel.app`
   - `NEXT_PUBLIC_ADMIN_URL`: `https://your-admin.vercel.app`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: `6281234567890`
   - `PAYMENT_PROVIDER`: `midtrans`
4. Di tab **Settings ➔ Networking**, klik **"Generate Domain"** (misal: `api-atelier.up.railway.app`).
5. Jalankan migrasi schema dan seeding database dari CLI Railway atau terminal lokal:
   ```bash
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

---

### C. Deploy Alternatif via Docker Compose (VPS / AWS EC2)
Jika menggunakan server Ubuntu / VPS pribadi:
```bash
# Di server VPS:
cd coffee-commerce/docker
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 3. Konfigurasi Live Meta WhatsApp Business Cloud API

Untuk mengirim notifikasi WhatsApp resmi dengan centang hijau/profil bisnis Meta:

1. Buka [Meta for Developers](https://developers.facebook.com/) dan login.
2. Buat App baru dengan tipe **"Business"** ➔ Tambahkan produk **"WhatsApp"**.
3. Di menu **WhatsApp -> API Setup**, Anda akan mendapatkan:
   - **Phone Number ID** (Salin ke `WHATSAPP_PHONE_NUMBER_ID`)
   - **WhatsApp Business Account ID** (Salin ke `WHATSAPP_BUSINESS_ACCOUNT_ID`)
   - **Permanent Access Token** (Salin ke `WHATSAPP_ACCESS_TOKEN` dari System User Meta Business Manager)
4. Konfigurasi Webhook di Meta Developer Dashboard:
   - **Callback URL**: `https://api.yourdomain.com/api/v1/whatsapp/webhook`
   - **Verify Token**: `atelier-du-cafe-verify-token-2026` (sesuai `WHATSAPP_VERIFY_TOKEN`)
   - Subscribe ke event: `messages`.

---

## 4. Konfigurasi Live Midtrans Snap / Xendit Payment Gateway

Untuk menerima pembayaran otomatis (QRIS, BCA Virtual Account, Mandiri, Kartu Kredit):

### A. Konfigurasi Midtrans Production
1. Login ke [dashboard.midtrans.com](https://dashboard.midtrans.com/) (Ubah mode dari *Sandbox* ke *Production* di pojok kiri atas).
2. Masuk ke menu **Settings ➔ Access Keys**:
   - Salin **Server Key** (Isi ke `MIDTRANS_SERVER_KEY`)
   - Salin **Client Key** (Isi ke `MIDTRANS_CLIENT_KEY`)
3. Masuk ke menu **Settings ➔ Configuration**:
   - **Payment Notification URL (Webhook)**:
     ```
     https://api.yourdomain.com/api/v1/payments/webhook
     ```
   - **Finish Redirect URL**:
     ```
     https://your-store.vercel.app/order
     ```
4. Di environment backend API, ubah:
   ```env
   MIDTRANS_IS_PRODUCTION=true
   ```

---

## 5. Ringkasan Checklist Sebelum Go-Live 🚀

- [ ] Database PostgreSQL Supabase sudah di-push schema (`npx prisma db push`) dan di-seed data mesin (`npx ts-node prisma/seed.ts`).
- [ ] Backend API di Railway/Render berjalan normal dengan status `200 OK` pada `https://api.yourdomain.com/api/v1/products`.
- [ ] Vercel Storefront (`apps/web`) terhubung dengan `NEXT_PUBLIC_API_URL` backend production.
- [ ] Vercel Admin Portal (`apps/admin`) terhubung dan dapat login (`admin@ateliercoffee.com`).
- [ ] Webhook Midtrans dan Webhook WhatsApp Meta sudah diarahkan ke URL API domain live Anda.
- [ ] Uji coba transaksi dummy 1 pesanan mesin kopi hingga status berubah menjadi `PAID`.