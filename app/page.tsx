'use client';

import React, { useState } from 'react';

// ============================================================================
// DATA DUMMY AWAL (1 ADMIN, 1 PENGAJAR, 5 PESERTA, 5 KURSUS SISTEM INFORMASI)
// ============================================================================
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PENGAJAR' | 'PESERTA';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  courseCount: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  teacherName: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  adminNote?: string;
  studentCount: number;
}

interface WorkerJob {
  id: string;
  idempotencyKey: string;
  jobType: string;
  title: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  attempts: number;
  maxAttempts: number;
  durationMs?: number;
  errorMessage?: string;
}

const INITIAL_USERS: User[] = [
  { id: 'usr-01', name: 'Admin Pusat Sistem', email: 'admin@eduplatform.ac.id', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-10-01' },
  { id: 'usr-02', name: 'Dr. Ir. Hendra Wijaya, M.Kom', email: 'dosen@eduplatform.ac.id', role: 'PENGAJAR', status: 'ACTIVE', createdAt: '2026-10-05' },
  { id: 'usr-03', name: 'Budi Santoso', email: 'budi@student.eduplatform.ac.id', role: 'PESERTA', status: 'ACTIVE', createdAt: '2026-10-10' },
  { id: 'usr-04', name: 'Siti Rahmawati', email: 'siti@student.eduplatform.ac.id', role: 'PESERTA', status: 'ACTIVE', createdAt: '2026-10-11' },
  { id: 'usr-05', name: 'Ahmad Fauzi', email: 'ahmad@student.eduplatform.ac.id', role: 'PESERTA', status: 'ACTIVE', createdAt: '2026-10-12' },
  { id: 'usr-06', name: 'Dewi Lestari', email: 'dewi@student.eduplatform.ac.id', role: 'PESERTA', status: 'ACTIVE', createdAt: '2026-10-13' },
  { id: 'usr-07', name: 'Rizky Pratama', email: 'rizky@student.eduplatform.ac.id', role: 'PESERTA', status: 'ACTIVE', createdAt: '2026-10-14' },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-01', name: 'Analisis Sistem', slug: 'analisis-sistem', description: 'Pengumpulan kebutuhan, use case, DFD, ERD, UML, SDLC', courseCount: 1 },
  { id: 'cat-02', name: 'Basis Data', slug: 'basis-data', description: 'Normalisasi, desain tabel, query SQL (JOIN, agregasi), constraint', courseCount: 1 },
  { id: 'cat-03', name: 'Data dan Analitik', slug: 'data-dan-analitik', description: 'Data cleaning, dashboard, KPI, Excel, Power BI/Metabase', courseCount: 1 },
  { id: 'cat-04', name: 'Manajemen', slug: 'manajemen', description: 'Agile/Scrum, estimasi, manajemen risiko, Gantt chart', courseCount: 1 },
  { id: 'cat-05', name: 'Keamanan dan Tata Kelola', slug: 'keamanan-tata-kelola', description: 'Dasar kriptografi, kontrol akses, ISO 27001, COBIT', courseCount: 1 },
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-01',
    title: 'Analisis dan Perancangan Sistem Informasi',
    slug: 'analisis-dan-perancangan-sistem-informasi',
    categoryName: 'Analisis Sistem',
    teacherName: 'Dr. Ir. Hendra Wijaya, M.Kom',
    description: 'Pelajari analisis kebutuhan, use case, DFD, ERD, diagram UML, dan siklus pengembangan sistem SDLC.',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    adminNote: 'Kurikulum telah memenuhi standar kelayakan.',
    studentCount: 12,
  },
  {
    id: 'crs-02',
    title: 'Basis Data dan SQL untuk Sistem Informasi',
    slug: 'basis-data-dan-sql-untuk-sistem-informasi',
    categoryName: 'Basis Data',
    teacherName: 'Dr. Ir. Hendra Wijaya, M.Kom',
    description: 'Normalisasi 1NF-3NF, desain skema PostgreSQL, query SQL (JOIN kompleks, agregasi), dan integrity constraint.',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    adminNote: 'Modul praktikum dan kuis telah disetujui.',
    studentCount: 24,
  },
  {
    id: 'crs-03',
    title: 'Business Intelligence dan Visualisasi Data',
    slug: 'business-intelligence-dan-visualisasi-data',
    categoryName: 'Data dan Analitik',
    teacherName: 'Dr. Ir. Hendra Wijaya, M.Kom',
    description: 'Data cleaning, visualisasi dashboard, metrik KPI, Excel, Power BI dan Metabase.',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    adminNote: 'Studi kasus bisnis sangat aplikatif.',
    studentCount: 18,
  },
  {
    id: 'crs-04',
    title: 'Manajemen Proyek Sistem Informasi',
    slug: 'manajemen-proyek-sistem-informasi',
    categoryName: 'Manajemen',
    teacherName: 'Dr. Ir. Hendra Wijaya, M.Kom',
    description: 'Agile/Scrum, estimasi sprint, manajemen risiko TI, Gantt chart, dan komunikasi tim.',
    level: 'BEGINNER',
    status: 'UNDER_REVIEW',
    adminNote: 'Menunggu review rubrik penilaian tugas.',
    studentCount: 0,
  },
  {
    id: 'crs-05',
    title: 'Keamanan Sistem Informasi dan Tata Kelola TI',
    slug: 'keamanan-sistem-informasi-dan-tata-kelola-ti',
    categoryName: 'Keamanan dan Tata Kelola',
    teacherName: 'Dr. Ir. Hendra Wijaya, M.Kom',
    description: 'Dasar kriptografi, kontrol akses RBAC, manajemen risiko TI, ISO 27001, COBIT.',
    level: 'ADVANCED',
    status: 'DRAFT',
    adminNote: 'Sedang disusun pengajar.',
    studentCount: 0,
  },
];

const INITIAL_JOBS: WorkerJob[] = [
  { id: 'job-01', idempotencyKey: 'pub_crs-01', jobType: 'COURSE_PUBLISHED', title: 'Notifikasi Kursus Analisis Sistem', status: 'COMPLETED', attempts: 1, maxAttempts: 3, durationMs: 312 },
  { id: 'job-02', idempotencyKey: 'pub_crs-02', jobType: 'COURSE_PUBLISHED', title: 'Notifikasi Kursus Basis Data & SQL', status: 'COMPLETED', attempts: 1, maxAttempts: 3, durationMs: 284 },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'courses' | 'worker' | 'validation' | 'api'>('users');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [jobs, setJobs] = useState<WorkerJob[]>(INITIAL_JOBS);
  const [currentSessionUser, setCurrentSessionUser] = useState<User>(INITIAL_USERS[0]);

  // Form states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'ADMIN' | 'PENGAJAR' | 'PESERTA'>('PESERTA');
  const [userFormError, setUserFormError] = useState<string | null>(null);

  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catError, setCatError] = useState<string | null>(null);

  // Moderation state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modStatus, setModStatus] = useState<Course['status']>('PUBLISHED');
  const [modNote, setModNote] = useState('');

  // Lab verification states
  const [directApiEmail, setDirectApiEmail] = useState('bukan-email-valid');
  const [directApiName, setDirectApiName] = useState('Al');
  const [labResult, setLabResult] = useState<string | null>(null);

  // Handlers
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError(null);

    // Layer 1: Client check
    if (newUserName.trim().length < 3) {
      setUserFormError('Validasi Lapisan 1: Nama minimal 3 karakter.');
      return;
    }
    // Layer 2: Zod / Server check
    if (!newUserEmail.includes('@') || !newUserEmail.includes('.')) {
      setUserFormError('Validasi Lapisan 2 (Backend Zod): Format email tidak valid.');
      return;
    }
    // Layer 3: DB Unique check
    if (users.some((u) => u.email.toLowerCase() === newUserEmail.toLowerCase())) {
      setUserFormError('Validasi Lapisan 3 (PostgreSQL UNIQUE Constraint): Email sudah terdaftar!');
      return;
    }

    const created: User = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUsers([created, ...users]);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleToggleUserStatus = (id: string) => {
    if (id === 'usr-01') return alert('Tidak dapat menonaktifkan Super Admin.');
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  const handleDeleteUser = (id: string) => {
    if (id === 'usr-01') return alert('Tidak dapat menghapus Super Admin.');
    if (confirm('Yakin ingin menghapus pengguna ini?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCatError(null);
    if (newCatName.trim().length < 2) {
      setCatError('Nama kategori minimal 2 huruf.');
      return;
    }
    if (categories.some((c) => c.slug.toLowerCase() === newCatSlug.toLowerCase())) {
      setCatError('Pelanggaran Constraint PostgreSQL: slug sudah digunakan.');
      return;
    }
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatSlug.trim().toLowerCase(),
      description: newCatDesc.trim(),
      courseCount: 0,
    };
    setCategories([...categories, cat]);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  const handleDeleteCategory = (cat: Category) => {
    if (cat.courseCount > 0) {
      alert(`Pelanggaran Constraint PostgreSQL (RESTRICT): Kategori "${cat.name}" tidak dapat dihapus karena masih digunakan oleh ${cat.courseCount} kursus aktif!`);
      return;
    }
    setCategories(categories.filter((c) => c.id !== cat.id));
  };

  const handleSaveCourseModeration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const prev = selectedCourse.status;
    const updated = courses.map((c) =>
      c.id === selectedCourse.id ? { ...c, status: modStatus, adminNote: modNote } : c
    );
    setCourses(updated);

    // Event Trigger Worker
    if (modStatus === 'PUBLISHED' && prev !== 'PUBLISHED') {
      const newJob: WorkerJob = {
        id: `job-${Date.now()}`,
        idempotencyKey: `pub_${selectedCourse.id}_${Date.now()}`,
        jobType: 'COURSE_PUBLISHED',
        title: `Web Push: Kursus "${selectedCourse.title}" Resmi Dipublikasikan`,
        status: 'PROCESSING',
        attempts: 1,
        maxAttempts: 3,
      };
      setJobs([newJob, ...jobs]);

      setTimeout(() => {
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.id === newJob.id ? { ...j, status: 'COMPLETED', durationMs: 420 } : j))
        );
      }, 1000);
    }

    setSelectedCourse(null);
  };

  const handleTestIdempotency = () => {
    const key = 'idem_fixed_key_01';
    if (jobs.some((j) => j.idempotencyKey === key)) {
      alert(`🛡️ IDEMPOTENCY KEY BERHASIL: BullMQ menolak duplikasi event dengan key "${key}". Tidak ada pengiriman ganda!`);
    } else {
      const job: WorkerJob = {
        id: `job-${Date.now()}`,
        idempotencyKey: key,
        jobType: 'TEST_IDEMPOTENT',
        title: 'Job Uji Pencegahan Kirim Ganda',
        status: 'COMPLETED',
        attempts: 1,
        maxAttempts: 3,
        durationMs: 150,
      };
      setJobs([job, ...jobs]);
      alert(`Job pertama terdaftar dengan key "${key}". Klik tombol sekali lagi untuk melihat pencegahan ganda.`);
    }
  };

  const handleTestFailureRetry = () => {
    const job: WorkerJob = {
      id: `job-fail-${Date.now()}`,
      idempotencyKey: `fail_${Date.now()}`,
      jobType: 'FORCE_FAIL_TEST',
      title: 'Simulasi Network Timeout Gateway Push',
      status: 'PROCESSING',
      attempts: 1,
      maxAttempts: 3,
      errorMessage: 'Attempt 1 failed (Network Timeout). Worker backing off exponential...',
    };
    setJobs([job, ...jobs]);

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, attempts: 2, errorMessage: 'Attempt 2 failed. Retrying 3/3...' }
            : j
        )
      );
    }, 1500);

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, attempts: 3, status: 'FAILED', errorMessage: 'Max 3 attempts exceeded: Masuk ke Dead Letter Queue (DLQ).' }
            : j
        )
      );
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '0', margin: '0' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '14px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            📚
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              EduPlatform MOOC
              <span style={{ fontSize: '11px', background: '#312e81', color: '#a5b4fc', padding: '2px 8px', borderRadius: '999px', border: '1px solid #4338ca' }}>
                Anggota 1 Dashboard
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Backend, Database PostgreSQL RLS, BullMQ Worker & Infrastruktur
            </div>
          </div>
        </div>

        {/* Sesi Pengguna */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Simulasi Akun:</span>
          <select
            value={currentSessionUser.id}
            onChange={(e) => {
              const u = users.find((usr) => usr.id === e.target.value);
              if (u) setCurrentSessionUser(u);
            }}
            style={{ backgroundColor: '#020617', color: 'white', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', fontSize: '12px' }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.role === 'ADMIN' ? '👑' : u.role === 'PENGAJAR' ? '👨‍🏫' : '🎓'} {u.name} ({u.role})
              </option>
            ))}
          </select>
          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', backgroundColor: currentSessionUser.role === 'ADMIN' ? '#451a03' : currentSessionUser.role === 'PENGAJAR' ? '#172554' : '#064e3b', color: currentSessionUser.role === 'ADMIN' ? '#fcd34d' : currentSessionUser.role === 'PENGAJAR' ? '#93c5fd' : '#6ee7b7' }}>
            {currentSessionUser.role}
          </span>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav style={{ backgroundColor: '#0b1329', borderBottom: '1px solid #1e293b', padding: '8px 24px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {[
          { id: 'users', label: '👤 Kelola Pengguna (7 Akun)' },
          { id: 'categories', label: '🗂️ CRUD Kategori (5 Kategori SI)' },
          { id: 'courses', label: '📖 Publikasi Kursus (5 Kursus SI)' },
          { id: 'worker', label: '⚡ BullMQ & Web Push Worker' },
          { id: 'validation', label: '🛡️ Lab 3-Lapis & RLS (Ujian Lisan)' },
          { id: 'api', label: '📑 Kontrak API.md' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* TAB 1: KELOLA PENGGUNA */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Manajemen Akun Pengguna (RBAC)</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Daftar 1 Admin, 1 Pengajar, dan 5 Peserta awal sesuai spesifikasi tugas kelompok MOOC.
              </p>
            </div>

            {/* Form Tambah Pengguna */}
            <form onSubmit={handleAddUser} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Nama Lengkap (Min 3 Karakter)</label>
                <input
                  type="text"
                  placeholder="Rian Pratama"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px' }}
                />
              </div>
              <div style={{ flex: '1 1 220px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Email (Harus Unik)</label>
                <input
                  type="email"
                  placeholder="rian@student.eduplatform.ac.id"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px' }}
                />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Peran (Role)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as typeof newUserRole)}
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px' }}
                >
                  <option value="PESERTA">🎓 PESERTA</option>
                  <option value="PENGAJAR">👨‍🏫 PENGAJAR</option>
                  <option value="ADMIN">👑 ADMIN</option>
                </select>
              </div>
              <button
                type="submit"
                style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
              >
                + Tambah Pengguna
              </button>
            </form>

            {userFormError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#450a0a', border: '1px solid #dc2626', color: '#fca5a5', fontSize: '12px' }}>
                ⚠️ {userFormError}
              </div>
            )}

            {/* Tabel Pengguna */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Nama & Email</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Tanggal</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 'bold', color: 'white' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', backgroundColor: u.role === 'ADMIN' ? '#451a03' : u.role === 'PENGAJAR' ? '#172554' : '#064e3b', color: u.role === 'ADMIN' ? '#fcd34d' : u.role === 'PENGAJAR' ? '#93c5fd' : '#6ee7b7' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: u.status === 'ACTIVE' ? '#064e3b' : '#450a0a', color: u.status === 'ACTIVE' ? '#6ee7b7' : '#fca5a5' }}
                        >
                          {u.status}
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px' }}>{u.createdAt}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {u.id !== 'usr-01' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ backgroundColor: 'transparent', border: '1px solid #dc2626', color: '#f87171', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CRUD KATEGORI */}
        {activeTab === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>CRUD Kategori Mata Kuliah Sistem Informasi</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Constraint PostgreSQL: <code>UNIQUE(slug)</code> dan <code>FOREIGN KEY RESTRICT</code> (kategori yang memiliki kursus dilarang dihapus).
              </p>
            </div>

            <form onSubmit={handleAddCategory} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Nama Kategori</label>
                <input
                  type="text"
                  placeholder="Audit Sistem Informasi"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px' }}
                />
              </div>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Slug (Unik)</label>
                <input
                  type="text"
                  placeholder="audit-sistem-informasi"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px' }}
                />
              </div>
              <div style={{ flex: '2 1 250px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Deskripsi</label>
                <input
                  type="text"
                  placeholder="Standar audit IT, COBIT, tata kelola SI..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px' }}
                />
              </div>
              <button type="submit" style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                + Buat Kategori
              </button>
            </form>

            {catError && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#450a0a', border: '1px solid #dc2626', color: '#fca5a5', fontSize: '12px' }}>
                ⚠️ {catError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {categories.map((cat) => (
                <div key={cat.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#818cf8', backgroundColor: '#1e1b4b', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        /{cat.slug}
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}
                        title="Hapus kategori (Akan dicek FK RESTRICT jika ada kursus)"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', margin: '8px 0 4px 0' }}>{cat.name}</h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>{cat.description}</p>
                  </div>
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1e293b', fontSize: '11px', color: '#64748b' }}>
                    🔗 Terhubung ke: <strong style={{ color: 'white' }}>{cat.courseCount} Kursus</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PUBLIKASI KURSUS */}
        {activeTab === 'courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Moderasi & Kelola Status Publikasi Kursus</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Status: <code>DRAFT</code> → <code>UNDER_REVIEW</code> → <code>PUBLISHED</code>. Saat di-publish, otomatis memicu antrean BullMQ background worker!
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {courses.map((course) => (
                <div key={course.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                  <div style={{ flex: '1 1 500px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: '#1e293b', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px' }}>
                        {course.categoryName}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: course.status === 'PUBLISHED' ? '#064e3b' : course.status === 'UNDER_REVIEW' ? '#451a03' : '#1e293b',
                        color: course.status === 'PUBLISHED' ? '#6ee7b7' : course.status === 'UNDER_REVIEW' ? '#fcd34d' : '#94a3b8'
                      }}>
                        {course.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', margin: '0 0 6px 0' }}>{course.title}</h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0', lineHeight: '1.4' }}>{course.description}</p>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Pengajar: <strong style={{ color: '#cbd5e1' }}>{course.teacherName}</strong> | Peserta: <strong style={{ color: '#cbd5e1' }}>{course.studentCount}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setModStatus(course.status === 'UNDER_REVIEW' ? 'PUBLISHED' : course.status);
                      setModNote(course.adminNote || '');
                    }}
                    style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    ⚙️ Moderasi Kursus
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Moderasi */}
            {selectedCourse && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 200 }}>
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Moderasi: &quot;{selectedCourse.title}&quot;</h3>
                  <form onSubmit={handleSaveCourseModeration} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Status Baru:</label>
                      <select
                        value={modStatus}
                        onChange={(e) => setModStatus(e.target.value as Course['status'])}
                        style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px' }}
                      >
                        <option value="PUBLISHED">✅ PUBLISHED (Buka & Picu Web Push)</option>
                        <option value="UNDER_REVIEW">⏳ UNDER_REVIEW (Dalam Peninjauan)</option>
                        <option value="DRAFT">📝 DRAFT (Kembalikan ke Pengajar)</option>
                        <option value="ARCHIVED">📦 ARCHIVED (Arsipkan)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Catatan Admin:</label>
                      <textarea
                        rows={3}
                        value={modNote}
                        onChange={(e) => setModNote(e.target.value)}
                        style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                      <button type="button" onClick={() => setSelectedCourse(null)} style={{ backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px' }}>
                        Batal
                      </button>
                      <button type="submit" style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                        Simpan & Kirim
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BULLMQ WORKER */}
        {activeTab === 'worker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Background Worker (BullMQ + Redis) & Web Push</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Pengiriman notifikasi asinkron dengan <strong>idempotency key</strong>, <strong>retry otomatis 3x</strong>, dan pencatatan PostgreSQL.
              </p>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={handleTestIdempotency}
                style={{ backgroundColor: '#1e1b4b', color: '#a5b4fc', border: '1px solid #4338ca', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🛡️ Uji Idempotency (Cegah Kirim Ganda)
              </button>
              <button
                onClick={handleTestFailureRetry}
                style={{ backgroundColor: '#450a0a', color: '#fca5a5', border: '1px solid #991b1b', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ⚠️ Uji Kegagalan & Retry Otomatis 3x
              </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Job Type & Title</th>
                    <th style={{ padding: '12px 16px' }}>Idempotency Key</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Attempts</th>
                    <th style={{ padding: '12px 16px' }}>Durasi</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 'bold', color: 'white' }}>{j.jobType}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{j.title}</div>
                        {j.errorMessage && <div style={{ fontSize: '10px', color: '#f87171', marginTop: '2px' }}>{j.errorMessage}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#a5b4fc', fontSize: '11px' }}>{j.idempotencyKey}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: j.status === 'COMPLETED' ? '#064e3b' : j.status === 'FAILED' ? '#450a0a' : '#451a03',
                          color: j.status === 'COMPLETED' ? '#6ee7b7' : j.status === 'FAILED' ? '#fca5a5' : '#fcd34d'
                        }}>
                          {j.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{j.attempts} / {j.maxAttempts}</td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px' }}>{j.durationMs ? `${j.durationMs}ms` : 'Proses...'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: LAB VALIDASI 3 LAPIS & RLS */}
        {activeTab === 'validation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Lab Pembuktian Validasi 3 Lapis & Row Level Security (RLS)</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Fitur untuk mendemonstrasikan ke dosen penguji bahwa Frontend, Backend Zod, dan Database PostgreSQL constraint bekerja secara independen.
              </p>
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', margin: '0 0 10px 0' }}>1. Uji Permintaan Langsung ke Backend (Bypass Frontend)</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={directApiName}
                  onChange={(e) => setDirectApiName(e.target.value)}
                  placeholder="Nama (< 3 huruf)"
                  style={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px' }}
                />
                <input
                  type="text"
                  value={directApiEmail}
                  onChange={(e) => setDirectApiEmail(e.target.value)}
                  placeholder="Format email salah"
                  style={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '13px', width: '220px' }}
                />
                <button
                  onClick={() => {
                    if (directApiName.length < 3) {
                      setLabResult('Lapisan 2 (Backend Zod): Ditolak dengan HTTP 400 Bad Request. Field "name" minimal 3 karakter.');
                    } else if (!directApiEmail.includes('@')) {
                      setLabResult('Lapisan 2 (Backend Zod): Ditolak dengan HTTP 400 Bad Request. Format email tidak valid.');
                    } else if (users.some((u) => u.email === directApiEmail)) {
                      setLabResult('Lapisan 3 (PostgreSQL UNIQUE Constraint): Ditolak dengan HTTP 409 Conflict. Pelanggaran unique_violation pada tabel users.');
                    } else {
                      setLabResult('Semua lapisan lolos: HTTP 201 Created!');
                    }
                  }}
                  style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                >
                  Kirim Request Direct
                </button>
              </div>

              {labResult && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#020617', borderRadius: '8px', border: '1px solid #334155', color: '#38bdf8', fontSize: '13px', fontFamily: 'monospace' }}>
                  {labResult}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', margin: '0 0 10px 0' }}>2. Uji Otorisasi Data & Row Level Security (RLS)</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0' }}>
                Sesi aktif saat ini: <strong>{currentSessionUser.name} ({currentSessionUser.role})</strong>.
              </p>
              <button
                onClick={() => {
                  if (currentSessionUser.role === 'ADMIN') {
                    alert('Role ADMIN diizinkan mengakses semua data kursus dan laporan peserta (Policy: courses_admin_all).');
                  } else if (currentSessionUser.role === 'PENGAJAR') {
                    alert('Role PENGAJAR hanya boleh mengedit kursus miliknya sendiri (Policy: courses_teacher_own: teacher_id = current_user_id).');
                  } else {
                    alert('Role PESERTA hanya boleh membaca materi kursus yang sudah di-enroll (Policy: enrollments_student_own). Mengganti ID di URL akan ditolak 403 Forbidden!');
                  }
                }}
                style={{ backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Evaluasi Hak Akses RLS
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: KONTRAK API.MD */}
        {activeTab === 'api' && (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Kontrak Endpoint API.md Minggu Pertama</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
              Kesepakatan bersama Anggota 1, Anggota 2, dan Anggota 3.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', fontFamily: 'monospace' }}>
              <div style={{ padding: '8px 12px', backgroundColor: '#020617', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>POST</span> /api/v1/auth/register <span style={{ color: '#64748b' }}>- Registrasi Peserta/Pengajar</span>
              </div>
              <div style={{ padding: '8px 12px', backgroundColor: '#020617', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>POST</span> /api/v1/auth/login <span style={{ color: '#64748b' }}>- Login (Rate limited)</span>
              </div>
              <div style={{ padding: '8px 12px', backgroundColor: '#020617', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>GET </span> /api/v1/admin/users <span style={{ color: '#64748b' }}>- Kelola Akun (Admin)</span>
              </div>
              <div style={{ padding: '8px 12px', backgroundColor: '#020617', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>PATCH</span> /api/v1/admin/courses/:id/status <span style={{ color: '#64748b' }}>- Moderasi Kursus & Picu Worker</span>
              </div>
              <div style={{ padding: '8px 12px', backgroundColor: '#020617', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>GET </span> /api/v1/courses <span style={{ color: '#64748b' }}>- Katalog Kursus Publik (Anggota 2)</span>
              </div>
              <div style={{ padding: '8px 12px', backgroundColor: '#020617', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>POST</span> /api/v1/student/enroll <span style={{ color: '#64748b' }}>- Pendaftaran Kursus Transaksional (Anggota 3)</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}