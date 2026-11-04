import React from 'react';

export const metadata = {
  title: 'EduPlatform - Online Course MOOC',
  description: 'Platform Kursus Online MOOC Sistem Informasi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#020617', color: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}