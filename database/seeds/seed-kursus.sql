-- ============================================================================
-- seed-kursus.sql
-- Isi 5 kursus di database/seeds/seed.sql: modul, materi, kuis, soal, opsi.
-- Sumber isi: dokumen "Data Dummy 5 Course MOOC (Seed)". Milik Anggota 2.
-- JALANKAN SETELAH seed.sql (butuh courses a1111111-... sampai a5555555-...)
-- dan SETELAH 002_course_extras.sql. Aman dijalankan ulang (ON CONFLICT DO NOTHING).
-- Tiap kursus: 2 modul, 4 materi bacaan, dan 1 materi kuis (modul 2, urutan 3)
-- tempat kuis menempel (di skema, kuis menempel pada materi). Kuis: 4 soal,
-- 4 opsi per soal, tepat 1 jawaban benar, nilai kelulusan 70.
-- ============================================================================

-- Modul
INSERT INTO modules (id, course_id, title, order_index) VALUES
('b1111111-0000-0000-0000-000000000011', 'a1111111-0000-0000-0000-000000000001', 'Pengumpulan Kebutuhan dan SDLC', 1),
('b1111111-0000-0000-0000-000000000012', 'a1111111-0000-0000-0000-000000000001', 'Pemodelan Sistem', 2),
('b2222222-0000-0000-0000-000000000021', 'a2222222-0000-0000-0000-000000000002', 'Desain Basis Data', 1),
('b2222222-0000-0000-0000-000000000022', 'a2222222-0000-0000-0000-000000000002', 'Query SQL', 2),
('b3333333-0000-0000-0000-000000000031', 'a3333333-0000-0000-0000-000000000003', 'Menyiapkan Data', 1),
('b3333333-0000-0000-0000-000000000032', 'a3333333-0000-0000-0000-000000000003', 'Membuat Dashboard', 2),
('b4444444-0000-0000-0000-000000000041', 'a4444444-0000-0000-0000-000000000004', 'Metode Agile', 1),
('b4444444-0000-0000-0000-000000000042', 'a4444444-0000-0000-0000-000000000004', 'Risiko, Jadwal, dan Komunikasi', 2),
('b5555555-0000-0000-0000-000000000051', 'a5555555-0000-0000-0000-000000000005', 'Dasar Keamanan Informasi', 1),
('b5555555-0000-0000-0000-000000000052', 'a5555555-0000-0000-0000-000000000005', 'Tata Kelola TI', 2)
ON CONFLICT (id) DO NOTHING;

-- Materi (4 bacaan + 1 materi kuis per kursus)
INSERT INTO materials (id, module_id, title, content, order_index, duration_minutes) VALUES
('d1111111-0000-0000-0000-000000000011', 'b1111111-0000-0000-0000-000000000011', 'Apa itu SDLC', 'SDLC (Software Development Life Cycle) adalah tahapan pengembangan sistem: perencanaan, analisis, perancangan, implementasi, pengujian, dan pemeliharaan. Model yang sering dipakai adalah Waterfall (berurutan) dan Agile (berulang dalam siklus pendek).', 1, 15),
('d1111111-0000-0000-0000-000000000012', 'b1111111-0000-0000-0000-000000000011', 'Teknik Mengumpulkan Kebutuhan', 'Kebutuhan dikumpulkan lewat wawancara, kuesioner, observasi, dan studi dokumen. Hasilnya dibagi menjadi kebutuhan fungsional (apa yang dilakukan sistem) dan kebutuhan nonfungsional (kualitas sistem, misalnya kecepatan dan keamanan).', 2, 15),
('d1111111-0000-0000-0000-000000000013', 'b1111111-0000-0000-0000-000000000012', 'Use Case dan Aktor', 'Use case diagram menggambarkan interaksi antara aktor (pengguna atau sistem lain) dan fungsi sistem. Contoh aktor pada platform kursus: Peserta, Pengajar, dan Admin.', 1, 15),
('d1111111-0000-0000-0000-000000000014', 'b1111111-0000-0000-0000-000000000012', 'DFD dan ERD', 'DFD (Data Flow Diagram) menggambarkan aliran data antar proses. ERD (Entity Relationship Diagram) menggambarkan entitas data beserta hubungannya.', 2, 15),
('d1111111-0000-0000-0000-000000000015', 'b1111111-0000-0000-0000-000000000012', 'Kuis: Dasar Analisis dan Perancangan SI', 'Kerjakan kuis berikut untuk menguji pemahaman kamu tentang materi di kursus ini. Nilai kelulusan 70.', 3, 10),
('d2222222-0000-0000-0000-000000000021', 'b2222222-0000-0000-0000-000000000021', 'Normalisasi', 'Normalisasi adalah proses merapikan tabel untuk mengurangi duplikasi data. 1NF: setiap kolom berisi satu nilai. 2NF: tidak ada ketergantungan sebagian pada kunci utama. 3NF: tidak ada ketergantungan antar kolom non-kunci.', 1, 15),
('d2222222-0000-0000-0000-000000000022', 'b2222222-0000-0000-0000-000000000021', 'Constraint', 'Constraint menjaga data tetap valid: PRIMARY KEY (identitas unik baris), FOREIGN KEY (penghubung antar tabel), NOT NULL (wajib diisi), UNIQUE (tidak boleh kembar), dan CHECK (nilai harus memenuhi syarat).', 2, 15),
('d2222222-0000-0000-0000-000000000023', 'b2222222-0000-0000-0000-000000000022', 'SELECT dan JOIN', 'SELECT mengambil data dan WHERE menyaringnya. JOIN menggabungkan data dari beberapa tabel lewat kolom yang berhubungan. Contoh: SELECT c.title, u.name FROM courses c JOIN users u ON u.id = c.teacher_id;', 1, 15),
('d2222222-0000-0000-0000-000000000024', 'b2222222-0000-0000-0000-000000000022', 'Agregasi dan GROUP BY', 'Fungsi agregasi seperti COUNT, SUM, AVG, MIN, dan MAX merangkum banyak baris menjadi satu nilai. Dengan GROUP BY, hasilnya dihitung per kelompok, misalnya jumlah peserta per kursus.', 2, 15),
('d2222222-0000-0000-0000-000000000025', 'b2222222-0000-0000-0000-000000000022', 'Kuis: Dasar Basis Data dan SQL', 'Kerjakan kuis berikut untuk menguji pemahaman kamu tentang materi di kursus ini. Nilai kelulusan 70.', 3, 10),
('d3333333-0000-0000-0000-000000000031', 'b3333333-0000-0000-0000-000000000031', 'Data Cleaning', 'Data cleaning adalah membersihkan data sebelum dianalisis: menghapus duplikat, menangani nilai kosong, dan menyeragamkan format seperti tanggal dan huruf besar-kecil.', 1, 15),
('d3333333-0000-0000-0000-000000000032', 'b3333333-0000-0000-0000-000000000031', 'Menentukan KPI', 'KPI (Key Performance Indicator) adalah ukuran utama keberhasilan yang spesifik dan terukur. Contoh pada platform kursus: tingkat penyelesaian kursus dan rata-rata nilai kuis.', 2, 15),
('d3333333-0000-0000-0000-000000000033', 'b3333333-0000-0000-0000-000000000032', 'Prinsip Dashboard', 'Taruh angka terpenting di bagian atas. Pilih grafik sesuai tujuan: garis untuk tren, batang untuk perbandingan. Hindari terlalu banyak warna dan hiasan.', 1, 15),
('d3333333-0000-0000-0000-000000000034', 'b3333333-0000-0000-0000-000000000032', 'Alat BI', 'Excel (pivot table), Power BI, dan Metabase adalah alat yang umum dipakai. Alurnya: hubungkan data, bersihkan, buat visual, lalu bagikan dashboard.', 2, 15),
('d3333333-0000-0000-0000-000000000035', 'b3333333-0000-0000-0000-000000000032', 'Kuis: Dasar BI dan Visualisasi', 'Kerjakan kuis berikut untuk menguji pemahaman kamu tentang materi di kursus ini. Nilai kelulusan 70.', 3, 10),
('d4444444-0000-0000-0000-000000000041', 'b4444444-0000-0000-0000-000000000041', 'Dasar Scrum', 'Scrum memiliki tiga peran: Product Owner (mengatur prioritas pekerjaan), Scrum Master (menjaga proses berjalan), dan Tim Pengembang. Pekerjaan dibagi dalam sprint, yaitu periode kerja pendek sekitar 1 sampai 4 minggu.', 1, 15),
('d4444444-0000-0000-0000-000000000042', 'b4444444-0000-0000-0000-000000000041', 'Estimasi', 'Estimasi memperkirakan besarnya pekerjaan dengan story point atau jam kerja. Estimasi bukan angka pasti dan sebaiknya diperbarui seiring informasi bertambah.', 2, 15),
('d4444444-0000-0000-0000-000000000043', 'b4444444-0000-0000-0000-000000000042', 'Manajemen Risiko', 'Langkahnya: identifikasi risiko, analisis kemungkinan dan dampaknya, susun rencana respons, lalu pantau secara berkala.', 1, 15),
('d4444444-0000-0000-0000-000000000044', 'b4444444-0000-0000-0000-000000000042', 'Gantt Chart dan Komunikasi Tim', 'Gantt chart menampilkan tugas, durasi, dan ketergantungan antar tugas dalam bentuk batang waktu. Komunikasi rutin seperti daily stand-up membantu tim cepat menemukan hambatan.', 2, 15),
('d4444444-0000-0000-0000-000000000045', 'b4444444-0000-0000-0000-000000000042', 'Kuis: Dasar Manajemen Proyek SI', 'Kerjakan kuis berikut untuk menguji pemahaman kamu tentang materi di kursus ini. Nilai kelulusan 70.', 3, 10),
('d5555555-0000-0000-0000-000000000051', 'b5555555-0000-0000-0000-000000000051', 'Dasar Kriptografi', 'Enkripsi mengubah data menjadi tidak terbaca tanpa kunci. Hash mengubah data menjadi sidik jari satu arah yang tidak bisa dikembalikan, dan dipakai untuk menyimpan password.', 1, 15),
('d5555555-0000-0000-0000-000000000052', 'b5555555-0000-0000-0000-000000000051', 'Kontrol Akses', 'Autentikasi memastikan siapa pengguna, sedangkan otorisasi menentukan apa yang boleh dilakukannya. Prinsip least privilege: beri akses sekecil yang diperlukan untuk bekerja.', 2, 15),
('d5555555-0000-0000-0000-000000000053', 'b5555555-0000-0000-0000-000000000052', 'Manajemen Risiko TI', 'Risiko TI dinilai dari aset yang dilindungi, ancaman, kerentanan, dan dampaknya. Hasil penilaian dipakai untuk menentukan kontrol yang perlu dipasang.', 1, 15),
('d5555555-0000-0000-0000-000000000054', 'b5555555-0000-0000-0000-000000000052', 'ISO 27001 dan COBIT', 'ISO 27001 adalah standar sistem manajemen keamanan informasi yang menjaga kerahasiaan, integritas, dan ketersediaan data. COBIT adalah kerangka tata kelola dan manajemen TI agar selaras dengan tujuan bisnis.', 2, 15),
('d5555555-0000-0000-0000-000000000055', 'b5555555-0000-0000-0000-000000000052', 'Kuis: Dasar Keamanan dan Tata Kelola TI', 'Kerjakan kuis berikut untuk menguji pemahaman kamu tentang materi di kursus ini. Nilai kelulusan 70.', 3, 10)
ON CONFLICT (id) DO NOTHING;

-- Kuis
INSERT INTO quizzes (id, material_id, title, passing_score) VALUES
('e1111111-0000-0000-0000-000000000001', 'd1111111-0000-0000-0000-000000000015', 'Dasar Analisis dan Perancangan SI', 70),
('e2222222-0000-0000-0000-000000000002', 'd2222222-0000-0000-0000-000000000025', 'Dasar Basis Data dan SQL', 70),
('e3333333-0000-0000-0000-000000000003', 'd3333333-0000-0000-0000-000000000035', 'Dasar BI dan Visualisasi', 70),
('e4444444-0000-0000-0000-000000000004', 'd4444444-0000-0000-0000-000000000045', 'Dasar Manajemen Proyek SI', 70),
('e5555555-0000-0000-0000-000000000005', 'd5555555-0000-0000-0000-000000000055', 'Dasar Keamanan dan Tata Kelola TI', 70)
ON CONFLICT (id) DO NOTHING;

-- Soal
INSERT INTO questions (id, quiz_id, prompt, order_index) VALUES
('f1111111-0000-0000-0000-000000000011', 'e1111111-0000-0000-0000-000000000001', 'Tahap SDLC yang menentukan apa saja yang harus dilakukan sistem adalah...', 1),
('f1111111-0000-0000-0000-000000000012', 'e1111111-0000-0000-0000-000000000001', 'Contoh kebutuhan nonfungsional adalah...', 2),
('f1111111-0000-0000-0000-000000000013', 'e1111111-0000-0000-0000-000000000001', 'Diagram yang menggambarkan aliran data antar proses adalah...', 3),
('f1111111-0000-0000-0000-000000000014', 'e1111111-0000-0000-0000-000000000001', 'Dalam use case diagram, aktor adalah...', 4),
('f2222222-0000-0000-0000-000000000021', 'e2222222-0000-0000-0000-000000000002', 'Tujuan utama normalisasi adalah...', 1),
('f2222222-0000-0000-0000-000000000022', 'e2222222-0000-0000-0000-000000000002', 'Constraint yang mencegah dua baris memiliki nilai sama pada suatu kolom adalah...', 2),
('f2222222-0000-0000-0000-000000000023', 'e2222222-0000-0000-0000-000000000002', 'Fungsi untuk menghitung jumlah baris adalah...', 3),
('f2222222-0000-0000-0000-000000000024', 'e2222222-0000-0000-0000-000000000002', 'JOIN digunakan untuk...', 4),
('f3333333-0000-0000-0000-000000000031', 'e3333333-0000-0000-0000-000000000003', 'Contoh kegiatan data cleaning adalah...', 1),
('f3333333-0000-0000-0000-000000000032', 'e3333333-0000-0000-0000-000000000003', 'KPI adalah...', 2),
('f3333333-0000-0000-0000-000000000033', 'e3333333-0000-0000-0000-000000000003', 'Grafik yang tepat untuk menunjukkan tren dari waktu ke waktu adalah...', 3),
('f3333333-0000-0000-0000-000000000034', 'e3333333-0000-0000-0000-000000000003', 'Alat berikut yang termasuk alat BI adalah...', 4),
('f4444444-0000-0000-0000-000000000041', 'e4444444-0000-0000-0000-000000000004', 'Peran Scrum yang mengatur prioritas pekerjaan adalah...', 1),
('f4444444-0000-0000-0000-000000000042', 'e4444444-0000-0000-0000-000000000004', 'Sprint adalah...', 2),
('f4444444-0000-0000-0000-000000000043', 'e4444444-0000-0000-0000-000000000004', 'Langkah pertama dalam manajemen risiko adalah...', 3),
('f4444444-0000-0000-0000-000000000044', 'e4444444-0000-0000-0000-000000000004', 'Gantt chart digunakan untuk menampilkan...', 4),
('f5555555-0000-0000-0000-000000000051', 'e5555555-0000-0000-0000-000000000005', 'Cara yang tepat menyimpan password pengguna adalah...', 1),
('f5555555-0000-0000-0000-000000000052', 'e5555555-0000-0000-0000-000000000005', 'Otorisasi adalah...', 2),
('f5555555-0000-0000-0000-000000000053', 'e5555555-0000-0000-0000-000000000005', 'Prinsip least privilege berarti...', 3),
('f5555555-0000-0000-0000-000000000054', 'e5555555-0000-0000-0000-000000000005', 'ISO 27001 berkaitan dengan...', 4)
ON CONFLICT (id) DO NOTHING;

-- Opsi jawaban
INSERT INTO options (id, question_id, option_text, is_correct) VALUES
('91111111-0000-0000-0000-000000000111', 'f1111111-0000-0000-0000-000000000011', 'Pemeliharaan', FALSE),
('91111111-0000-0000-0000-000000000112', 'f1111111-0000-0000-0000-000000000011', 'Analisis', TRUE),
('91111111-0000-0000-0000-000000000113', 'f1111111-0000-0000-0000-000000000011', 'Pengujian', FALSE),
('91111111-0000-0000-0000-000000000114', 'f1111111-0000-0000-0000-000000000011', 'Implementasi', FALSE),
('91111111-0000-0000-0000-000000000121', 'f1111111-0000-0000-0000-000000000012', 'Pengguna dapat mendaftar akun', FALSE),
('91111111-0000-0000-0000-000000000122', 'f1111111-0000-0000-0000-000000000012', 'Halaman dapat dibuka dalam waktu kurang dari 3 detik', TRUE),
('91111111-0000-0000-0000-000000000123', 'f1111111-0000-0000-0000-000000000012', 'Admin dapat menghapus akun', FALSE),
('91111111-0000-0000-0000-000000000124', 'f1111111-0000-0000-0000-000000000012', 'Peserta dapat mengerjakan kuis', FALSE),
('91111111-0000-0000-0000-000000000131', 'f1111111-0000-0000-0000-000000000013', 'ERD', FALSE),
('91111111-0000-0000-0000-000000000132', 'f1111111-0000-0000-0000-000000000013', 'DFD', TRUE),
('91111111-0000-0000-0000-000000000133', 'f1111111-0000-0000-0000-000000000013', 'Use case diagram', FALSE),
('91111111-0000-0000-0000-000000000134', 'f1111111-0000-0000-0000-000000000013', 'Class diagram', FALSE),
('91111111-0000-0000-0000-000000000141', 'f1111111-0000-0000-0000-000000000014', 'Tabel di database', FALSE),
('91111111-0000-0000-0000-000000000142', 'f1111111-0000-0000-0000-000000000014', 'Pihak yang berinteraksi dengan sistem', TRUE),
('91111111-0000-0000-0000-000000000143', 'f1111111-0000-0000-0000-000000000014', 'Baris kode program', FALSE),
('91111111-0000-0000-0000-000000000144', 'f1111111-0000-0000-0000-000000000014', 'Server aplikasi', FALSE),
('92222222-0000-0000-0000-000000000211', 'f2222222-0000-0000-0000-000000000021', 'Mempercepat koneksi internet', FALSE),
('92222222-0000-0000-0000-000000000212', 'f2222222-0000-0000-0000-000000000021', 'Mengurangi duplikasi data', TRUE),
('92222222-0000-0000-0000-000000000213', 'f2222222-0000-0000-0000-000000000021', 'Mengenkripsi data', FALSE),
('92222222-0000-0000-0000-000000000214', 'f2222222-0000-0000-0000-000000000021', 'Menambah jumlah kolom', FALSE),
('92222222-0000-0000-0000-000000000221', 'f2222222-0000-0000-0000-000000000022', 'NOT NULL', FALSE),
('92222222-0000-0000-0000-000000000222', 'f2222222-0000-0000-0000-000000000022', 'UNIQUE', TRUE),
('92222222-0000-0000-0000-000000000223', 'f2222222-0000-0000-0000-000000000022', 'CHECK', FALSE),
('92222222-0000-0000-0000-000000000224', 'f2222222-0000-0000-0000-000000000022', 'DEFAULT', FALSE),
('92222222-0000-0000-0000-000000000231', 'f2222222-0000-0000-0000-000000000023', 'SUM', FALSE),
('92222222-0000-0000-0000-000000000232', 'f2222222-0000-0000-0000-000000000023', 'COUNT', TRUE),
('92222222-0000-0000-0000-000000000233', 'f2222222-0000-0000-0000-000000000023', 'MAX', FALSE),
('92222222-0000-0000-0000-000000000234', 'f2222222-0000-0000-0000-000000000023', 'JOIN', FALSE),
('92222222-0000-0000-0000-000000000241', 'f2222222-0000-0000-0000-000000000024', 'Menghapus data', FALSE),
('92222222-0000-0000-0000-000000000242', 'f2222222-0000-0000-0000-000000000024', 'Menggabungkan data dari beberapa tabel', TRUE),
('92222222-0000-0000-0000-000000000243', 'f2222222-0000-0000-0000-000000000024', 'Membuat database baru', FALSE),
('92222222-0000-0000-0000-000000000244', 'f2222222-0000-0000-0000-000000000024', 'Mengurutkan kolom', FALSE),
('93333333-0000-0000-0000-000000000311', 'f3333333-0000-0000-0000-000000000031', 'Membuat grafik batang', FALSE),
('93333333-0000-0000-0000-000000000312', 'f3333333-0000-0000-0000-000000000031', 'Menghapus data duplikat', TRUE),
('93333333-0000-0000-0000-000000000313', 'f3333333-0000-0000-0000-000000000031', 'Mengirim email laporan', FALSE),
('93333333-0000-0000-0000-000000000314', 'f3333333-0000-0000-0000-000000000031', 'Memasang aplikasi baru', FALSE),
('93333333-0000-0000-0000-000000000321', 'f3333333-0000-0000-0000-000000000032', 'Jenis grafik', FALSE),
('93333333-0000-0000-0000-000000000322', 'f3333333-0000-0000-0000-000000000032', 'Ukuran utama keberhasilan', TRUE),
('93333333-0000-0000-0000-000000000323', 'f3333333-0000-0000-0000-000000000032', 'Nama tabel database', FALSE),
('93333333-0000-0000-0000-000000000324', 'f3333333-0000-0000-0000-000000000032', 'Aplikasi spreadsheet', FALSE),
('93333333-0000-0000-0000-000000000331', 'f3333333-0000-0000-0000-000000000033', 'Grafik garis', TRUE),
('93333333-0000-0000-0000-000000000332', 'f3333333-0000-0000-0000-000000000033', 'Pie chart dengan 20 irisan', FALSE),
('93333333-0000-0000-0000-000000000333', 'f3333333-0000-0000-0000-000000000033', 'Tabel tanpa angka', FALSE),
('93333333-0000-0000-0000-000000000334', 'f3333333-0000-0000-0000-000000000033', 'Peta lokasi', FALSE),
('93333333-0000-0000-0000-000000000341', 'f3333333-0000-0000-0000-000000000034', 'Power BI', TRUE),
('93333333-0000-0000-0000-000000000342', 'f3333333-0000-0000-0000-000000000034', 'Git', FALSE),
('93333333-0000-0000-0000-000000000343', 'f3333333-0000-0000-0000-000000000034', 'Docker', FALSE),
('93333333-0000-0000-0000-000000000344', 'f3333333-0000-0000-0000-000000000034', 'Redis', FALSE),
('94444444-0000-0000-0000-000000000411', 'f4444444-0000-0000-0000-000000000041', 'Scrum Master', FALSE),
('94444444-0000-0000-0000-000000000412', 'f4444444-0000-0000-0000-000000000041', 'Product Owner', TRUE),
('94444444-0000-0000-0000-000000000413', 'f4444444-0000-0000-0000-000000000041', 'Tester', FALSE),
('94444444-0000-0000-0000-000000000414', 'f4444444-0000-0000-0000-000000000041', 'Administrator', FALSE),
('94444444-0000-0000-0000-000000000421', 'f4444444-0000-0000-0000-000000000042', 'Jenis kesalahan program', FALSE),
('94444444-0000-0000-0000-000000000422', 'f4444444-0000-0000-0000-000000000042', 'Periode kerja singkat dengan target yang jelas', TRUE),
('94444444-0000-0000-0000-000000000423', 'f4444444-0000-0000-0000-000000000042', 'Nama alat desain', FALSE),
('94444444-0000-0000-0000-000000000424', 'f4444444-0000-0000-0000-000000000042', 'Laporan akhir proyek', FALSE),
('94444444-0000-0000-0000-000000000431', 'f4444444-0000-0000-0000-000000000043', 'Mengabaikan risiko kecil', FALSE),
('94444444-0000-0000-0000-000000000432', 'f4444444-0000-0000-0000-000000000043', 'Mengidentifikasi risiko', TRUE),
('94444444-0000-0000-0000-000000000433', 'f4444444-0000-0000-0000-000000000043', 'Membeli server baru', FALSE),
('94444444-0000-0000-0000-000000000434', 'f4444444-0000-0000-0000-000000000043', 'Menulis laporan akhir', FALSE),
('94444444-0000-0000-0000-000000000441', 'f4444444-0000-0000-0000-000000000044', 'Struktur tabel database', FALSE),
('94444444-0000-0000-0000-000000000442', 'f4444444-0000-0000-0000-000000000044', 'Jadwal tugas dan durasinya', TRUE),
('94444444-0000-0000-0000-000000000443', 'f4444444-0000-0000-0000-000000000044', 'Aliran data antar proses', FALSE),
('94444444-0000-0000-0000-000000000444', 'f4444444-0000-0000-0000-000000000044', 'Daftar pengguna', FALSE),
('95555555-0000-0000-0000-000000000511', 'f5555555-0000-0000-0000-000000000051', 'Disimpan sebagai teks biasa', FALSE),
('95555555-0000-0000-0000-000000000512', 'f5555555-0000-0000-0000-000000000051', 'Disimpan dalam bentuk hash', TRUE),
('95555555-0000-0000-0000-000000000513', 'f5555555-0000-0000-0000-000000000051', 'Dikirim ke email pengguna', FALSE),
('95555555-0000-0000-0000-000000000514', 'f5555555-0000-0000-0000-000000000051', 'Disimpan di kolom yang bisa dilihat semua orang', FALSE),
('95555555-0000-0000-0000-000000000521', 'f5555555-0000-0000-0000-000000000052', 'Memeriksa identitas pengguna', FALSE),
('95555555-0000-0000-0000-000000000522', 'f5555555-0000-0000-0000-000000000052', 'Menentukan hak akses setelah identitas dikenali', TRUE),
('95555555-0000-0000-0000-000000000523', 'f5555555-0000-0000-0000-000000000052', 'Mengenkripsi data', FALSE),
('95555555-0000-0000-0000-000000000524', 'f5555555-0000-0000-0000-000000000052', 'Membuat cadangan data', FALSE),
('95555555-0000-0000-0000-000000000531', 'f5555555-0000-0000-0000-000000000053', 'Semua pengguna menjadi admin', FALSE),
('95555555-0000-0000-0000-000000000532', 'f5555555-0000-0000-0000-000000000053', 'Pengguna hanya diberi akses minimum yang diperlukan', TRUE),
('95555555-0000-0000-0000-000000000533', 'f5555555-0000-0000-0000-000000000053', 'Semua orang boleh mengakses semua data', FALSE),
('95555555-0000-0000-0000-000000000534', 'f5555555-0000-0000-0000-000000000053', 'Sistem tidak memerlukan login', FALSE),
('95555555-0000-0000-0000-000000000541', 'f5555555-0000-0000-0000-000000000054', 'Desain antarmuka pengguna', FALSE),
('95555555-0000-0000-0000-000000000542', 'f5555555-0000-0000-0000-000000000054', 'Manajemen keamanan informasi', TRUE),
('95555555-0000-0000-0000-000000000543', 'f5555555-0000-0000-0000-000000000054', 'Pemrograman web', FALSE),
('95555555-0000-0000-0000-000000000544', 'f5555555-0000-0000-0000-000000000054', 'Instalasi kabel jaringan', FALSE)
ON CONFLICT (id) DO NOTHING;
