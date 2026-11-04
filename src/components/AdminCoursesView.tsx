import React, { useState } from 'react';
import { Course, CourseStatus } from '../lib/types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export const AdminCoursesView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c1',
      title: 'Analisis dan Perancangan Sistem Informasi',
      slug: 'analisis-sistem-informasi',
      categoryId: '1',
      categoryName: 'Analisis Sistem',
      teacherId: '2',
      teacherName: 'Dr. Ir. Budi Santoso',
      description: 'Pemodelan proses bisnis, DFD, UML, dan requirement engineering.',
      level: 'INTERMEDIATE',
      status: 'PUBLISHED',
      createdAt: '2026-03-01',
      updatedAt: '2026-03-01',
    },
    {
      id: 'c2',
      title: 'Keamanan Sistem Informasi dan Tata Kelola TI',
      slug: 'keamanan-tata-kelola',
      categoryId: '5',
      categoryName: 'Keamanan & Tata Kelola',
      teacherId: '2',
      teacherName: 'Dr. Ir. Budi Santoso',
      description: 'Framework COBIT 2019, ISO 27001, audit sistem, dan CIA Triad.',
      level: 'ADVANCED',
      status: 'UNDER_REVIEW',
      createdAt: '2026-03-01',
      updatedAt: '2026-03-01',
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: CourseStatus) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-white mb-1">Moderasi Publikasi Kursus SI</h2>
      <p className="text-xs text-slate-400 mb-4">Setujui kursus sebelum dapat diakses oleh mahasiswa</p>

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm text-white">{c.title}</div>
              <div className="text-xs text-slate-400">Pengajar: {c.teacherName} • Kategori: {c.categoryName}</div>
              <div className="mt-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  c.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  c.status === 'UNDER_REVIEW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {c.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {c.status !== 'PUBLISHED' && (
                <button
                  onClick={() => handleUpdateStatus(c.id, 'PUBLISHED')}
                  className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Publikasikan
                </button>
              )}
              {c.status === 'PUBLISHED' && (
                <button
                  onClick={() => handleUpdateStatus(c.id, 'DRAFT')}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  <XCircle className="w-3.5 h-3.5" /> Tarik ke Draft
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};