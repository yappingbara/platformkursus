# EduPlatform — Platform Online Course / MOOC
**Role:** Anggota 1 (Backend, Database, Infrastruktur, dan Admin Dashboard)

## 🚀 Petunjuk Cepat Menjalankan di Komputermu:
1. Pastikan PostgreSQL dan Redis sudah berjalan di komputermu (atau via Docker).
2. Salin .env.example menjadi .env.local:
   cp .env.example .env.local
3. Jalankan migrasi dan seed:
   psql -U postgres -d eduplatform_db -f database/migrations/001_initial_schema.sql
   psql -U postgres -d eduplatform_db -f database/seeds/seed.sql
4. Install package dan jalankan server:
   npm install
   npm run dev
5. Buka terminal baru dan jalankan worker:
   npm run worker
