-- Seed Data: 1 Admin, 1 Pengajar, 5 Peserta, Kategori & 5 Kursus SI
-- Password default: Password123!
INSERT INTO users (id, name, email, password_hash, role, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Pusat Sistem', 'admin@eduplatform.ac.id', '$2b$10$wT8K5P9rB1g3aL8mD9ZzKuQYqfXmB1w4E9R5q2V1w9K4T6Y7Z8AaB', 'ADMIN', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'Dr. Ir. Hendra Wijaya, M.Kom', 'dosen@eduplatform.ac.id', '$2b$10$wT8K5P9rB1g3aL8mD9ZzKuQYqfXmB1w4E9R5q2V1w9K4T6Y7Z8AaB', 'PENGAJAR', 'ACTIVE'),
('33333333-3333-3333-3333-333333333331', 'Budi Santoso', 'budi@student.eduplatform.ac.id', '$2b$10$wT8K5P9rB1g3aL8mD9ZzKuQYqfXmB1w4E9R5q2V1w9K4T6Y7Z8AaB', 'PESERTA', 'ACTIVE'),
('33333333-3333-3333-3333-333333333332', 'Siti Rahmawati', 'siti@student.eduplatform.ac.id', '$2b$10$wT8K5P9rB1g3aL8mD9ZzKuQYqfXmB1w4E9R5q2V1w9K4T6Y7Z8AaB', 'PESERTA', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'Ahmad Fauzi', 'ahmad@student.eduplatform.ac.id', '$2b$10$wT8K5P9rB1g3aL8mD9ZzKuQYqfXmB1w4E9R5q2V1w9K4T6Y7Z8AaB', 'PESERTA', 'ACTIVE'),
('33333333-3333-3333-3333-333333333334', 'Dewi Lestari', 'dewi@student.eduplatform.ac.id', '$2b$10$wT8K5P9rB1g3aL8mD9ZzKuQYqfXmB1w4E9R5q2V1w9K4T6Y7Z8AaB', 'PESERTA', 'ACTIVE'),
('33333333-3333-3333-3333-333333333335', 'Rizky Pratama', 'rizky@student.eduplatform.ac.id', '$2b$10$wT8K5P9rB1g3aL8mD9ZzKuQYqfXmB1w4E9R5q2V1w9K4T6Y7Z8AaB', 'PESERTA', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Kategori:
INSERT INTO categories (id, name, slug, description, icon_name) VALUES
('c1111111-1111-1111-1111-111111111111', 'Analisis Sistem', 'analisis-sistem', 'Pengumpulan kebutuhan, use case, DFD, ERD, UML, SDLC', 'Activity'),
('c2222222-2222-2222-2222-222222222222', 'Basis Data', 'basis-data', 'Normalisasi, desain tabel, query SQL, constraint', 'Database'),
('c3333333-3333-3333-3333-333333333333', 'Data dan Analitik', 'data-dan-analitik', 'Data cleaning, dashboard, KPI, Power BI/Metabase', 'BarChart3'),
('c4444444-4444-4444-4444-444444444444', 'Manajemen', 'manajemen', 'Agile/Scrum, estimasi, manajemen risiko, Gantt chart', 'Briefcase'),
('c5555555-5555-5555-5555-555555555555', 'Keamanan dan Tata Kelola', 'keamanan-tata-kelola', 'Kriptografi, kontrol akses, ISO 27001, COBIT', 'ShieldCheck')
ON CONFLICT (id) DO NOTHING;

-- 5 Kursus Sistem Informasi:
INSERT INTO courses (id, title, slug, category_id, teacher_id, description, level, status) VALUES
('a1111111-0000-0000-0000-000000000001', 'Analisis dan Perancangan Sistem Informasi', 'analisis-dan-perancangan-sistem-informasi', 'c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Pengumpulan kebutuhan, use case, DFD, ERD, UML, SDLC', 'BEGINNER', 'PUBLISHED'),
('a2222222-0000-0000-0000-000000000002', 'Basis Data dan SQL untuk Sistem Informasi', 'basis-data-dan-sql-untuk-sistem-informasi', 'c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Normalisasi, desain tabel, query SQL (JOIN, agregasi), constraint', 'INTERMEDIATE', 'PUBLISHED'),
('a3333333-0000-0000-0000-000000000003', 'Business Intelligence dan Visualisasi Data', 'business-intelligence-dan-visualisasi-data', 'c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Data cleaning, dashboard, KPI, Excel, Power BI/Metabase', 'INTERMEDIATE', 'PUBLISHED'),
('a4444444-0000-0000-0000-000000000004', 'Manajemen Proyek Sistem Informasi', 'manajemen-proyek-sistem-informasi', 'c4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Agile/Scrum, estimasi, manajemen risiko, Gantt chart', 'BEGINNER', 'UNDER_REVIEW'),
('a5555555-0000-0000-0000-000000000005', 'Keamanan Sistem Informasi dan Tata Kelola TI', 'keamanan-sistem-informasi-dan-tata-kelola-ti', 'c5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Dasar kriptografi, kontrol akses, ISO 27001, COBIT', 'ADVANCED', 'DRAFT')
ON CONFLICT (id) DO NOTHING;
