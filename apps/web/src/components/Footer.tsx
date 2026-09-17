import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1C1A19] text-stone-400 font-sans border-t border-stone-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1 space-y-4">
          <span className="font-serif text-2xl text-cream-50 tracking-wider uppercase block">
            Atelier du Café
          </span>
          <p className="text-xs leading-relaxed text-stone-400 font-light">
            Kurasi mesin espresso dan peralatan kopi artisanal terbaik dari Italia dan seluruh dunia untuk kafe komersial dan penikmat kopi rumahan.
          </p>
          <div className="pt-2 text-xs text-[#B58A63] font-serif italic">
            Excellence in every extraction.
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-cream-100 font-medium mb-5">Koleksi</h4>
          <ul className="space-y-3 text-xs font-light">
            <li><Link href="/shop?category=espresso-commercial" className="hover:text-cream-50 transition-colors">Commercial Multi-Group</Link></li>
            <li><Link href="/shop?category=espresso-home" className="hover:text-cream-50 transition-colors">Home Luxury Espresso</Link></li>
            <li><Link href="/shop?category=grinders" className="hover:text-cream-50 transition-colors">Precision Grinders</Link></li>
            <li><Link href="/shop?category=manual-brew" className="hover:text-cream-50 transition-colors">Filter & Manual Brew</Link></li>
            <li><Link href="/shop?category=accessories" className="hover:text-cream-50 transition-colors">Barista Tools & Parts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-cream-100 font-medium mb-5">Layanan Eksklusif</h4>
          <ul className="space-y-3 text-xs font-light">
            <li><Link href="/" className="hover:text-cream-50 transition-colors">Private Showroom Testing</Link></li>
            <li><Link href="/" className="hover:text-cream-50 transition-colors">Instalasi & Kalibrasi Barista</Link></li>
            <li><Link href="/" className="hover:text-cream-50 transition-colors">Garansi Resmi & Maintenance</Link></li>
            <li><Link href="/" className="hover:text-cream-50 transition-colors">B2B Wholesale Procurement</Link></li>
            <li><Link href="/" className="hover:text-cream-50 transition-colors">Water Treatment Consultation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-cream-100 font-medium mb-5">Experience Center</h4>
          <p className="text-xs font-light leading-relaxed mb-4">
            Jl. Senopati No. 88, Kebayoran Baru<br />
            Jakarta Selatan, 12190<br />
            Indonesia
          </p>
          <div className="text-xs space-y-1 font-light">
            <p>Senin – Sabtu: 09:00 – 19:00 WIB</p>
            <p className="text-[#B58A63]">Private Tasting by Appointment</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-stone-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-light text-stone-500">
        <div>
          &copy; {new Date().getFullYear()} Atelier du Café. All rights reserved. Architectural craftsmanship for coffee.
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-stone-400 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-stone-400 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-stone-400 transition-colors">Official Warranty</Link>
        </div>
      </div>
    </footer>
  );
}