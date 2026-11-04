-- ============================================================================
-- EduPlatform PostgreSQL Migration: 001_initial_schema.sql
-- Proyek: Platform Online Course / MOOC
-- Peran: Anggota 1 (Backend, Database, Infrastruktur, Admin Dashboard)
-- Constraint: TIDAK PAKE SUPABASE (Murni PostgreSQL + RLS + Custom Backend)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'PENGAJAR', 'PESERTA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE course_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL CHECK (char_length(trim(name)) >= 3),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'PESERTA',
    status user_status NOT NULL DEFAULT 'ACTIVE',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL UNIQUE CHECK (char_length(trim(name)) >= 2),
    slug VARCHAR(100) NOT NULL UNIQUE CHECK (slug ~* '^[a-z0-9-]+$'),
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Folder',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURSES
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL CHECK (char_length(trim(title)) >= 5),
    slug VARCHAR(180) NOT NULL UNIQUE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    description TEXT NOT NULL CHECK (char_length(description) >= 20),
    level course_level NOT NULL DEFAULT 'BEGINNER',
    status course_status NOT NULL DEFAULT 'DRAFT',
    admin_note TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. MODULES
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL CHECK (char_length(trim(title)) >= 3),
    order_index INT NOT NULL CHECK (order_index >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, order_index)
);

-- 5. MATERIALS
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL CHECK (char_length(trim(title)) >= 3),
    content TEXT,
    file_url TEXT,
    order_index INT NOT NULL CHECK (order_index >= 0),
    duration_minutes INT DEFAULT 15 CHECK (duration_minutes >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module_id, order_index)
);

-- 6. ENROLLMENTS (RACE CONDITION SHIELD: UNIQUE(user_id, course_id))
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- 7. QUIZZES, QUESTIONS, OPTIONS, SUBMISSIONS
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL UNIQUE REFERENCES materials(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    passing_score INT NOT NULL DEFAULT 70 CHECK (passing_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL CHECK (char_length(trim(prompt)) >= 5),
    order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0.0 AND 100.0),
    is_passed BOOLEAN NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. PUSH SUBSCRIPTIONS & WORKER JOBS
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS worker_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key VARCHAR(120) NOT NULL UNIQUE,
    queue_name VARCHAR(50) NOT NULL DEFAULT 'notifications',
    job_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status job_status NOT NULL DEFAULT 'PENDING',
    attempts INT NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    max_attempts INT NOT NULL DEFAULT 3,
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_admin_all ON users FOR ALL 
    USING (current_setting('app.current_user_role', true) = 'ADMIN');

CREATE POLICY courses_public_published ON courses FOR SELECT 
    USING (status = 'PUBLISHED');

CREATE POLICY courses_teacher_own ON courses FOR ALL 
    USING (
        current_setting('app.current_user_role', true) = 'PENGAJAR'
        AND teacher_id::text = current_setting('app.current_user_id', true)
    );

CREATE POLICY enrollments_student_own ON enrollments FOR ALL 
    USING (
        current_setting('app.current_user_role', true) = 'PESERTA'
        AND user_id::text = current_setting('app.current_user_id', true)
    );
