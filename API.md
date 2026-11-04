# API Contract: Platform Online Course / MOOC (EduPlatform)
**Versi:** 1.0.0  
**Status:** Disepakati untuk Pengembangan Minggu Pertama (Anggota 1, Anggota 2, Anggota 3)  
**Base URL:** `/api/v1`  
**Standard Response:** JSON  

---

## 1. Standar Respons & Format Error Seragam

Semua response dari backend wajib menggunakan format standar berikut:

### Respons Sukses
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Respons Gagal / Error (Standard Error Object)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data input tidak valid.",
    "details": [
      {
        "field": "email",
        "message": "Format email tidak valid."
      }
    ],
    "timestamp": "2026-11-01T12:00:00.000Z"
  }
}
```

### Standar Kode Error HTTP
- `200 OK`: Permintaan berhasil diproses.
- `201 Created`: Sumber daya baru berhasil dibuat.
- `400 Bad Request`: Validasi Zod gagal / format request salah.
- `401 Unauthorized`: Belum login atau token/session tidak valid.
- `403 Forbidden`: Role tidak berhak atau pelanggaran kepemilikan data (RLS check).
- `404 Not Found`: Data tidak ditemukan.
- `409 Conflict`: Pelanggaran constraint database (misal: duplicate email, double enrollment).
- `429 Too Many Requests`: Melebihi batas rate limiter.
- `500 Internal Server Error`: Kesalahan server (dicatat di logger Pino & Sentry).

---

## 2. Modul Autentikasi & Akun (Tanggung Jawab Anggota 1)

### `POST /api/v1/auth/register`
Mendaftarkan akun baru (Role default: `PESERTA`).
- **Akses:** Publik
- **Headers:** `Content-Type: application/json`
- **Request Body (Zod Validated):**
```json
{
  "name": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "password": "Password123!",
  "role": "PESERTA"
}
```

### `POST /api/v1/auth/login`
Autentikasi akun & penerbitan HTTP-Only Cookie / Bearer Token.
- **Akses:** Publik (Rate Limited: max 5 req / menit)
- **Request Body:**
```json
{
  "email": "budi.santoso@example.com",
  "password": "Password123!"
}
```

### `GET /api/v1/auth/me`
Mendapatkan profil pengguna yang sedang login.
- **Akses:** Authenticated (`PESERTA`, `PENGAJAR`, `ADMIN`)

---

## 3. Modul Admin Dashboard (Tanggung Jawab Anggota 1)

### `GET /api/v1/admin/users`
Melihat daftar seluruh pengguna dengan filter role dan status.
- **Akses:** Khusus `ADMIN`

### `POST /api/v1/admin/users`
Admin menambahkan pengguna baru secara langsung.
- **Akses:** Khusus `ADMIN`

### `PATCH /api/v1/admin/users/:id/status`
Mengubah status akun (ACTIVE, SUSPENDED).
- **Akses:** Khusus `ADMIN`

### `GET /api/v1/categories` (Publik) & `POST/PUT/DELETE /api/v1/admin/categories`
CRUD Kategori Kursus.
- **GET /api/v1/categories:** Publik, daftar kategori aktif.
- **POST /api/v1/admin/categories:** Khusus `ADMIN`.
- **PUT /api/v1/admin/categories/:id:** Khusus `ADMIN`.
- **DELETE /api/v1/admin/categories/:id:** Khusus `ADMIN` (Dicek: RESTRICT jika masih dipakai kursus).

### `GET /api/v1/admin/courses` & `PATCH /api/v1/admin/courses/:id/status`
Moderasi dan kelola status publikasi kursus.
- **Akses:** Khusus `ADMIN`
- **Enum Status:** `DRAFT`, `UNDER_REVIEW`, `PUBLISHED`, `ARCHIVED`
*Catatan:* Ketika status berubah menjadi `PUBLISHED`, backend Anggota 1 memicu event antrean BullMQ untuk mengirimkan Web Push Notification ke peserta.

### `GET /api/v1/admin/worker/jobs` & `POST /api/v1/admin/worker/jobs/:id/retry`
Memantau status antrean background worker (BullMQ) dan retry manual job gagal.

---

## 4. Modul Katalog Kursus & Fitur Pengajar (Tanggung Jawab Anggota 2)

### `GET /api/v1/courses`
Katalog kursus untuk umum/peserta (status `PUBLISHED`).
- **Query Params:** `?category=basis-data&search=sql&page=1&limit=10`

### `POST /api/v1/teacher/courses`
Pengajar membuat draft kursus baru.
- **Akses:** Khusus `PENGAJAR`

### `POST /api/v1/teacher/courses/:id/modules`
Menambahkan modul/bab materi. Cek kepemilikan kursus (`course.teacherId === user.id`).

### `POST /api/v1/teacher/modules/:moduleId/materials`
Menambahkan materi (bacaan / video / lampiran berkas).

### `POST /api/v1/teacher/materials/:materialId/quiz`
Pengajar membuat kuis pilihan ganda beserta kunci jawaban.
*Penting:* Kunci jawaban disimpan di database, **tidak pernah dikirim ke peserta**!

---

## 5. Modul Belajar Peserta & Penilaian (Tanggung Jawab Anggota 3)

### `POST /api/v1/student/enroll`
Peserta mendaftar kursus.
- **Akses:** Khusus `PESERTA`
- **Aturan Transaksi:** Constraint `UNIQUE(userId, courseId)` mencegah double enrollment (race condition safe).

### `GET /api/v1/student/courses/:courseId/learn`
Mengakses ruang belajar.
- **Pemeriksaan Server (Wajib):** Server mengecek apakah `userId` memiliki record enrollment aktif di `courseId`. Jika tidak ada -> HTTP 403 Forbidden!

### `GET /api/v1/student/quizzes/:quizId/take`
Mengambil soal kuis untuk dikerjakan. **Kunci jawaban (isCorrect) dibuang di server**.

### `POST /api/v1/student/quizzes/:quizId/submit`
Mengirim jawaban kuis. **Server yang menghitung nilai akhir**, menyimpannya dalam transaksi database, dan memicu notifikasi Web Push: *"Nilai kuis Anda telah keluar"*.
