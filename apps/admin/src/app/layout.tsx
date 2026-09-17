import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import { AdminShell } from '../components/AdminShell';

export const metadata: Metadata = {
  title: 'ATELIER DU CAFÉ | Executive Operations Portal',
  description: 'Enterprise inventory, order management, WhatsApp leads, and catalog orchestration.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
        <AuthProvider>
          <AdminShell>
            {children}
          </AdminShell>
        </AuthProvider>
      </body>
    </html>
  );
}