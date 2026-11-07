# API Contract: Platform Online Course / MOOC (EduPlatform)
**Versi:** 1.1.0  
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

### Endpoint Tambahan Bagian 4 (Anggota 2)

Melengkapi lima endpoint di atas. Memakai format response dan kode error di Bagian 1.
Semua `id` bertipe UUID. Semua endpoint `/teacher/...` khusus role `PENGAJAR`, dan pengajar hanya boleh mengubah data **miliknya sendiri** (`course.teacherId === user.id`), jika bukan miliknya `403`.
Nomor urut (`orderIndex`) dimulai dari **1**.

---

#### Katalog Publik

##### `GET /api/v1/courses/:slug`
Detail satu kursus beserta modul dan materinya, untuk halaman detail sebelum peserta mendaftar.
- **Akses:** Publik
- **Aturan:** hanya kursus `PUBLISHED`; selain itu `404`.
- **Tidak dikirim:** isi materi (`content`), `fileUrl`, dan kunci jawaban. Isi materi dibuka lewat endpoint ruang belajar (Anggota 3) setelah peserta terdaftar.
- **Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "a2222222-0000-0000-0000-000000000002",
    "title": "Basis Data dan SQL untuk Sistem Informasi",
    "slug": "basis-data-dan-sql-untuk-sistem-informasi",
    "description": "Normalisasi, desain tabel, query SQL (JOIN, agregasi), constraint",
    "level": "INTERMEDIATE",
    "thumbnailUrl": null,
    "category": { "id": "c2222222-2222-2222-2222-222222222222", "name": "Basis Data", "slug": "basis-data" },
    "teacher": { "id": "22222222-2222-2222-2222-222222222222", "name": "Dr. Ir. Hendra Wijaya, M.Kom" },
    "totalDurationMinutes": 70,
    "modules": [
      {
        "id": "b2222222-0000-0000-0000-000000000021",
        "title": "Desain Basis Data",
        "orderIndex": 1,
        "materials": [
          { "id": "d2222222-0000-0000-0000-000000000021", "title": "Normalisasi", "orderIndex": 1, "durationMinutes": 15, "hasQuiz": false }
        ]
      }
    ]
  }
}
```
- **Error:** `404` slug tidak ada atau kursus belum `PUBLISHED`.

---

#### Kursus Milik Pengajar

##### `GET /api/v1/teacher/courses`
Daftar kursus milik pengajar yang login, dari semua status.
- **Query Params (opsional):** `status` (`DRAFT`, `UNDER_REVIEW`, `PUBLISHED`, `ARCHIVED`), `search`, `page`, `limit` (maksimal 50).
- **Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "a4444444-0000-0000-0000-000000000004",
      "title": "Manajemen Proyek Sistem Informasi",
      "slug": "manajemen-proyek-sistem-informasi",
      "status": "UNDER_REVIEW",
      "level": "BEGINNER",
      "category": { "id": "c4444444-4444-4444-4444-444444444444", "name": "Manajemen", "slug": "manajemen" },
      "moduleCount": 2,
      "materialCount": 5,
      "enrollmentCount": 0,
      "updatedAt": "2026-11-04T08:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

##### `GET /api/v1/teacher/courses/:id`
Detail kursus untuk halaman penyuntingan. Berbeda dari detail publik, di sini **isi materi dan kunci jawaban kuis ikut dikirim** karena pengajar adalah pemiliknya.
- **Response 200:** objek kursus dengan `status`, `adminNote` (catatan admin saat menolak atau meminta revisi), `modules[]` berisi `materials[]` lengkap (`content`, `fileUrl`, `durationMinutes`), dan `quiz` pada materi yang punya kuis (soal dengan `isCorrect`).
- **Error:** `403` bukan miliknya, `404` tidak ditemukan.

##### `PATCH /api/v1/teacher/courses/:id`
Mengubah data kursus. Semua field opsional, minimal satu harus dikirim.
- **Request Body:** `title` (5 sampai 150 karakter), `description` (minimal 20 karakter), `categoryId`, `level`, `thumbnailUrl`.
- **Aturan:** `slug` **tidak berubah** walau judul diubah, supaya tautan lama tetap berlaku. Status tidak bisa diubah lewat endpoint ini.
- **Response 200:** objek kursus setelah diubah.
- **Error:** `400`, `403`, `404`, `409 COURSE_LOCKED`.

##### `PATCH /api/v1/teacher/courses/:id/submit`
Pengajar mengajukan kursus untuk direview admin: `DRAFT` menjadi `UNDER_REVIEW`.
- **Syarat:** status saat ini `DRAFT`, punya minimal 1 modul, dan setiap modul punya minimal 1 materi.
- **Response 200:** `{ "id": "...", "status": "UNDER_REVIEW" }`
- **Error:** `409 COURSE_LOCKED` jika status bukan `DRAFT`; `409 COURSE_NOT_READY` jika syarat belum terpenuhi, dengan rincian di `details`:
```json
{
  "success": false,
  "error": {
    "code": "COURSE_NOT_READY",
    "message": "Kursus belum lengkap untuk diajukan.",
    "details": [{ "field": "modules", "message": "Modul \"Pemodelan Sistem\" belum punya materi." }],
    "timestamp": "2026-11-04T08:00:00.000Z"
  }
}
```
- **Catatan:** moderasi dan perubahan menjadi `PUBLISHED` tetap lewat admin (`PATCH /api/v1/admin/courses/:id/status`, Bagian 3).

##### `DELETE /api/v1/teacher/courses/:id`
Menghapus kursus beserta seluruh modul, materi, dan kuisnya.
- **Syarat:** status `DRAFT` dan **belum punya peserta terdaftar**.
- **Response 200:** `{ "success": true, "data": { "id": "..." } }`
- **Error:** `409 COURSE_LOCKED` jika bukan `DRAFT`; `409 COURSE_HAS_ENROLLMENTS` jika sudah ada peserta (penghapusan akan ikut menghapus data pendaftaran dan nilai peserta).

##### `GET /api/v1/teacher/courses/:id/students`
Memantau peserta di kursus milik pengajar.
- **Query Params (opsional):** `page`, `limit`.
- **Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "33333333-3333-3333-3333-333333333331",
      "name": "Budi Santoso",
      "enrolledAt": "2026-11-02T09:30:00.000Z",
      "lastAccessedAt": "2026-11-04T07:10:00.000Z",
      "completedMaterials": 3,
      "totalMaterials": 5,
      "progressPercent": 60,
      "bestQuizScore": 75.0
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```
- `progressPercent` = materi selesai dibagi total materi, dari tabel `material_progress`. `bestQuizScore` bernilai `null` jika belum mengerjakan kuis.

---

#### Modul

##### `PATCH /api/v1/teacher/modules/:moduleId`
Mengubah judul modul. Body: `title` (3 sampai 120 karakter). Response 200: objek modul.

##### `PUT /api/v1/teacher/courses/:id/modules/order`
Mengurutkan ulang seluruh modul sekaligus.
- **Request Body:** `{ "moduleIds": ["<id modul 1>", "<id modul 2>"] }`. Daftar harus memuat **semua** modul kursus itu, masing-masing tepat satu kali. Urutan array menjadi `orderIndex` 1, 2, 3, dan seterusnya.
- **Response 200:** daftar modul dengan `orderIndex` terbaru.
- **Error:** `400` jika daftar tidak lengkap atau ada id kembar, `409 COURSE_LOCKED`.
- **Catatan implementasi:** dijalankan dalam satu transaksi karena ada constraint `UNIQUE(course_id, order_index)`.

##### `DELETE /api/v1/teacher/modules/:moduleId`
Menghapus modul beserta seluruh materi dan kuis di dalamnya.
- **Response 200:** `{ "success": true, "data": { "id": "..." } }`
- **Error:** `409 COURSE_LOCKED`; `409 QUIZ_HAS_SUBMISSIONS` jika ada kuis di modul itu yang sudah dikerjakan peserta.

---

#### Materi

##### `PATCH /api/v1/teacher/materials/:materialId`
Mengubah materi. Semua field opsional: `title` (3 sampai 150 karakter), `content`, `fileUrl`, `durationMinutes` (bilangan bulat 0 atau lebih). Setelah diubah, salah satu dari `content` atau `fileUrl` tetap harus terisi.
- **Response 200:** objek materi setelah diubah.

##### `PUT /api/v1/teacher/modules/:moduleId/materials/order`
Mengurutkan ulang materi dalam satu modul. Aturannya sama dengan pengurutan modul, dengan body `{ "materialIds": ["...", "..."] }`.

##### `DELETE /api/v1/teacher/materials/:materialId`
Menghapus materi. Kuis yang menempel pada materi itu ikut terhapus.
- **Response 200:** `{ "success": true, "data": { "id": "..." } }`
- **Error:** `409 COURSE_LOCKED`; `409 QUIZ_HAS_SUBMISSIONS` jika kuis pada materi itu sudah dikerjakan peserta.

---

#### Kuis

Satu materi hanya boleh memiliki **satu** kuis. Kunci jawaban (`isCorrect`) tidak pernah dikirim ke peserta.

##### `GET /api/v1/teacher/materials/:materialId/quiz`
Melihat kuis pada sebuah materi, lengkap dengan kunci jawaban.
- **Error:** `403`, `404` (materi tidak ada atau belum punya kuis).

##### `PATCH /api/v1/teacher/quizzes/:quizId`
Mengubah judul dan nilai kelulusan saja: `title`, `passingScore` (bilangan bulat 0 sampai 100).

##### `PUT /api/v1/teacher/quizzes/:quizId/questions`
Mengganti **seluruh** soal dan opsi kuis.
- **Request Body:**
```json
{
  "questions": [
    {
      "prompt": "Fungsi untuk menghitung jumlah baris adalah...",
      "options": [
        { "optionText": "SUM", "isCorrect": false },
        { "optionText": "COUNT", "isCorrect": true },
        { "optionText": "MAX", "isCorrect": false },
        { "optionText": "JOIN", "isCorrect": false }
      ]
    }
  ]
}
```
- **Aturan validasi:** minimal 1 soal; `prompt` minimal 5 karakter; tiap soal punya 2 sampai 6 opsi dengan teks tidak kosong dan **tepat satu** `isCorrect: true`. Urutan soal diisi server sesuai urutan array, mulai dari 1.
- **Error:** `400`; `409 QUIZ_HAS_SUBMISSIONS` jika kuis sudah pernah dikerjakan peserta (nilai lama bisa tidak sesuai lagi dengan soal baru).

##### `DELETE /api/v1/teacher/quizzes/:quizId`
Menghapus kuis dari materinya. Materinya tetap ada.
- **Error:** `409 QUIZ_HAS_SUBMISSIONS`.

---

#### Aturan Berdasarkan Status Kursus

| Aksi | DRAFT | PUBLISHED | UNDER_REVIEW | ARCHIVED |
|---|---|---|---|---|
| Ubah teks kursus, modul, materi, kuis (`PATCH`) | Boleh | Boleh | Tidak | Tidak |
| Tambah modul, materi, atau kuis (`POST`) | Boleh | Boleh | Tidak | Tidak |
| Hapus atau urutkan ulang modul dan materi | Boleh | Tidak | Tidak | Tidak |
| Hapus kursus | Boleh (tanpa peserta) | Tidak | Tidak | Tidak |
| Ajukan review (`submit`) | Boleh | Tidak | Tidak | Tidak |

"Tidak" berarti server menjawab `409 COURSE_LOCKED`. Alasannya: pada kursus yang sudah terbit, menghapus atau menggeser materi akan merusak progres dan nilai peserta.

#### Kode Error Tambahan

Semua memakai format error di Bagian 1, dengan status HTTP `409 Conflict`.

| `error.code` | Arti |
|---|---|
| `COURSE_LOCKED` | Aksi tidak diizinkan pada status kursus saat ini |
| `COURSE_NOT_READY` | Kursus belum memenuhi syarat untuk diajukan review |
| `COURSE_HAS_ENROLLMENTS` | Kursus sudah punya peserta sehingga tidak bisa dihapus |
| `QUIZ_ALREADY_EXISTS` | Materi tersebut sudah memiliki kuis |
| `QUIZ_HAS_SUBMISSIONS` | Kuis sudah dikerjakan peserta sehingga tidak bisa diubah atau dihapus |

---

#### Batas Tanggung Jawab

- **Anggota 1:** perubahan status kursus menjadi `PUBLISHED` atau `ARCHIVED` (moderasi admin) dan notifikasi Web Push saat kursus terbit.
- **Anggota 3:** pendaftaran peserta, ruang belajar (membuka isi materi), mengerjakan dan menilai kuis.
- **Anggota 2:** katalog, detail kursus, dan pengelolaan kursus, modul, materi, dan kuis oleh pengajar.

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
