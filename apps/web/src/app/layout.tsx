import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { CompareModal } from '../components/CompareModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'BREWPARTS | Precision Espresso Machines, Grinders & Spare Parts',
  description: 'Distributor resmi mesin espresso komersial, home prosumer, grinder presisi, dan suku cadang original. Workshop & servis terpercaya oleh PT Satu Saudara Sedarah.',
  openGraph: {
    title: 'BREWPARTS - Precision Coffee Machinery & Genuine Parts',
    description: 'Designed for exceptional extraction. La Marzocco, Rocket, Victoria Arduino, Nuova Simonelli, Mazzer & genuine spare parts.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover' as const,
  themeColor: '#1C1A19',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="overflow-x-hidden">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Brewparts',
              legalName: 'PT SATU SAUDARA SEDARAH',
              url: 'https://brewparts.id',
              logo: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=300&q=80',
              address: [
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Gedung Menara 165 Lantai 4 Jalan TB Simatupang Kav. 1, Desa/Kelurahan Cilandak Timur, Kec. Pasar Minggu',
                  addressLocality: 'Jakarta Selatan',
                  addressRegion: 'DKI Jakarta',
                  addressCountry: 'ID',
                  name: 'Head Office',
                },
                {
                  '@type': 'PostalAddress',
                  streetAddress: 'Jl. Mawaddah XI No.14, Klp. Dua, Kecamatan Kelapa Dua',
                  addressLocality: 'Kabupaten Tangerang',
                  addressRegion: 'Banten',
                  postalCode: '15810',
                  addressCountry: 'ID',
                  name: 'Workshop & Service Center',
                },
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+62-812-3456-7890',
                contactType: 'customer service',
                areaServed: 'ID',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1918]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <CompareModal />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}