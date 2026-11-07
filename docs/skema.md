# Skema Database EduPlatform

Dokumentasi ini menjelaskan 13 tabel di database `eduplatform_db` (PostgreSQL). Diagram relasinya ada di `docs/ERD.png`, dan sumber diagramnya di `docs/eduplatform.dbml`.

Semua tabel memakai `id` bertipe `uuid` sebagai primary key.

## Gambaran Relasi

- Satu **kategori** punya banyak **kursus**.
- Satu **pengajar** (user) membuat banyak **kursus**.
- Satu **kursus** punya banyak **modul**, satu **modul** punya banyak **materi**.
- Satu **materi** dapat memiliki **kuis**, satu **kuis** punya banyak **soal**, satu **soal** punya banyak **opsi** jawaban.
- Satu **peserta** (user) mendaftar ke banyak kursus lewat tabel **enrollments**.
- Progres belajar dicatat di **material_progress**, nilai kuis di **quiz_submissions**.

## Tabel Pengguna dan Katalog

### users
Menyimpan semua akun (peserta, pengajar, admin).
- `email`: unik, dipakai untuk login.
- `password_hash`: password yang sudah di-hash, bukan teks asli.
- `role`: peran pengguna (`ADMIN`, `PENGAJAR`, `PESERTA`).
- `status`: status akun, misalnya `ACTIVE` atau `SUSPENDED`.

### categories
Kategori kursus (misalnya Basis Data, Manajemen).
- `name` dan `slug`: sama-sama unik. `slug` dipakai untuk filter di URL katalog.
- `icon_name`: nama ikon yang ditampilkan di antarmuka.

### courses
Data kursus.
- `category_id`: kategori kursus (mengacu ke `categories`).
- `teacher_id`: pengajar pemilik kursus (mengacu ke `users`).
- `slug`: unik, untuk alamat halaman detail.
- `level`: tingkat kesulitan (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).
- `status`: status publikasi (`DRAFT`, `UNDER_REVIEW`, `PUBLISHED`, `ARCHIVED`).
- `admin_note`: catatan admin saat moderasi.

## Tabel Isi Kursus

### modules
Bab dalam sebuah kursus.
- `course_id`: kursus induk.
- `order_index`: urutan bab.

### materials
Materi di dalam sebuah modul.
- `module_id`: modul induk.
- `content`: isi bacaan, `file_url`: alamat berkas lampiran (jika ada).
- `order_index`: urutan materi, `duration_minutes`: perkiraan durasi belajar.

### quizzes
Kuis yang menempel pada sebuah materi.
- `material_id`: materi tempat kuis berada.
- `passing_score`: nilai minimal untuk lulus.

### questions
Soal pilihan ganda dalam sebuah kuis.
- `quiz_id`: kuis induk, `prompt`: teks soal, `order_index`: urutan soal.

### options
Pilihan jawaban untuk sebuah soal.
- `question_id`: soal induk, `option_text`: teks pilihan.
- `is_correct`: penanda kunci jawaban. Nilai ini tidak boleh dikirim ke peserta.

## Tabel Aktivitas Peserta

### enrollments
Pendaftaran peserta ke kursus.
- `user_id` dan `course_id`: peserta dan kursus yang diikuti.
- `enrolled_at`, `completed_at`, `last_accessed_at`: waktu daftar, selesai, dan terakhir diakses.

### material_progress
Mencatat materi yang sudah diselesaikan peserta.
- `enrollment_id` dan `material_id`: pendaftaran dan materi yang diselesaikan.
- `completed_at`: waktu materi ditandai selesai.

### quiz_submissions
Hasil pengerjaan kuis oleh peserta.
- `user_id` dan `quiz_id`: peserta dan kuis yang dikerjakan.
- `score`: nilai (dihitung di server), `is_passed`: lulus atau tidak.
- `submitted_at`: waktu pengumpulan.

## Tabel Infrastruktur

### push_subscriptions
Data langganan notifikasi Web Push dari browser pengguna.
- `user_id`: pemilik langganan.
- `endpoint` (unik), `p256dh`, `auth`: data kunci dari browser untuk mengirim notifikasi.
- `user_agent`: informasi browser.

### worker_jobs
Catatan pekerjaan background worker (antrean notifikasi).
- `idempotency_key`: unik, mencegah job yang sama terkirim dua kali.
- `queue_name`, `job_type`, `payload`: antrean, jenis pekerjaan, dan datanya.
- `status`, `attempts`, `max_attempts`: status job dan jumlah percobaan ulang.
- `error_message`, `processed_at`: pesan error dan waktu job diproses.

## Data Dummy

- `database/seeds/seed.sql`: 1 admin, 1 pengajar, 5 peserta, 5 kategori, dan 5 kursus.
- `database/seeds/seed-kursus.sql`: 10 modul, 25 materi (termasuk 5 materi kuis), 5 kuis, 20 soal, dan 80 opsi jawaban.

Urutan menjalankan file SQL: `001_initial_schema.sql`, `seed.sql`, `002_course_extras.sql`, lalu `seed-kursus.sql`.
