-- ============================================================================
-- EduPlatform PostgreSQL Migration: 002_course_extras.sql
-- Peran: Anggota 2 (Katalog, Kursus, Modul, Materi, Kuis)
-- Isi: tabel progres materi, index untuk katalog, dan constraint kuis tambahan.
-- Letakkan di: database/migrations/002_course_extras.sql
-- Jalankan SETELAH 001_initial_schema.sql. Aman dijalankan ulang.
-- ============================================================================

-- 1. MATERIAL_PROGRESS
-- Mencatat materi apa saja yang sudah diselesaikan peserta di sebuah pendaftaran.
-- Dipakai untuk menghitung persentase progres kursus.
CREATE TABLE IF NOT EXISTS material_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, material_id)  -- satu materi hanya bisa ditandai selesai sekali
);

-- 2. INDEX untuk query katalog dan dashboard
-- 001 belum punya index selain PRIMARY KEY dan UNIQUE.
CREATE INDEX IF NOT EXISTS courses_status_category_idx ON courses(status, category_id);
CREATE INDEX IF NOT EXISTS courses_teacher_idx ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS enrollments_course_idx ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS quiz_submissions_user_quiz_idx ON quiz_submissions(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS material_progress_material_idx ON material_progress(material_id);

-- 3. CONSTRAINT KUIS
-- Satu soal hanya boleh punya SATU opsi benar.
CREATE UNIQUE INDEX IF NOT EXISTS options_one_correct_per_question
    ON options(question_id) WHERE is_correct = TRUE;

-- Urutan soal tidak boleh kembar dalam satu kuis.
-- Catatan: endpoint pembuat kuis harus mengisi order_index 1, 2, 3, ... (jangan semuanya 0).
CREATE UNIQUE INDEX IF NOT EXISTS questions_quiz_order_uq
    ON questions(quiz_id, order_index);

-- Urutan soal tidak boleh negatif (konsisten dengan modules dan materials di 001).
DO $$ BEGIN
    ALTER TABLE questions
        ADD CONSTRAINT questions_order_nonneg CHECK (order_index >= 0);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Teks opsi tidak boleh kosong.
DO $$ BEGIN
    ALTER TABLE options
        ADD CONSTRAINT options_text_not_blank CHECK (char_length(trim(option_text)) >= 1);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. OPSIONAL: materi wajib punya isi teks ATAU file.
-- Aktifkan hanya setelah dicek bahwa tidak ada materi yang kosong keduanya.
-- DO $$ BEGIN
--     ALTER TABLE materials
--         ADD CONSTRAINT materials_has_content CHECK (content IS NOT NULL OR file_url IS NOT NULL);
-- EXCEPTION
--     WHEN duplicate_object THEN null;
-- END $$;
