import React from 'react';
import Link from 'next/link';
import { MapPin, Building2, Wrench, Clock, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1C1A19] text-stone-400 font-sans border-t border-stone-800 pt-16 sm:pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
        {/* Col 1: Brand Info (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-1">
            <span className="font-serif text-2xl sm:text-3xl text-cream-50 tracking-wider uppercase block font-normal">
              Brewparts
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#B58A63] block font-medium">
              Precision Espresso Machinery & Parts
            </span>
          </div>
          <p className="text-xs leading-relaxed text-stone-400 font-light max-w-sm">
            Penyedia resmi mesin espresso kelas dunia, precision grinder, suku cadang original, dan layanan teknisi bersertifikasi untuk kafe komersial dan penikmat kopi profesional.
          </p>
          <div className="pt-2 text-xs text-[#B58A63] font-serif italic">
            Engineered for perfection, built for extraction.
          </div>
        </div>

        {/* Col 2: Navigation & Koleksi (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs uppercase tracking-[0.25em] text-cream-100 font-medium border-b border-stone-800 pb-2">
            Koleksi
          </h4>
          <ul className="space-y-2.5 text-xs font-light">
            <li><Link href="/shop?category=espresso-commercial" className="hover:text-cream-50 transition-colors">Commercial Machines</Link></li>
            <li><Link href="/shop?category=espresso-home" className="hover:text-cream-50 transition-colors">Home Espresso Atelier</Link></li>
            <li><Link href="/shop?category=grinders" className="hover:text-cream-50 transition-colors">Precision Grinders</Link></li>
            <li><Link href="/shop?category=accessories" className="hover:text-cream-50 transition-colors">Spare Parts & Tools</Link></li>
            <li><Link href="/shop" className="hover:text-cream-50 transition-colors">Semua Produk</Link></li>
          </ul>
        </div>

        {/* Col 3: Alamat Office (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
            <Building2 className="w-3.5 h-3.5 text-[#B58A63]" />
            <h4 className="text-xs uppercase tracking-[0.2em] text-cream-100 font-medium">
              Head Office
            </h4>
          </div>
          <div className="text-xs font-light leading-relaxed space-y-1.5 text-stone-300">
            <p className="font-semibold text-white tracking-wide">
              PT SATU SAUDARA SEDARAH
            </p>
            <p className="text-stone-400">
              Gedung Menara 165 Lantai 4<br />
              Jl. TB Simatupang Kav. 1<br />
              Kel. Cilandak Timur, Kec. Pasar Minggu<br />
              Kota Adm. Jakarta Selatan
            </p>
            <div className="pt-1 text-[11px] text-stone-400 flex items-center space-x-1.5">
              <Clock className="w-3 h-3 text-[#B58A63] shrink-0" />
              <span>Senin – Jumat: 09:00 – 17:00 WIB</span>
            </div>
          </div>
        </div>

        {/* Col 4: Alamat Workshop (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
            <Wrench className="w-3.5 h-3.5 text-[#B58A63]" />
            <h4 className="text-xs uppercase tracking-[0.2em] text-cream-100 font-medium">
              Workshop & Service Center
            </h4>
          </div>
          <div className="text-xs font-light leading-relaxed space-y-1.5 text-stone-300">
            <p className="font-semibold text-[#E8D8C8] tracking-wide">
              Brewparts Technical Hub
            </p>
            <p className="text-stone-400">
              Jl. Mawaddah XI No.14, Klp. Dua<br />
              Kecamatan Kelapa Dua<br />
              Kabupaten Tangerang, Banten 15810
            </p>
            <div className="pt-1 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3 h-3 text-[#B58A63] shrink-0" />
                <span>Kalibrasi, Servis & Penggantian Sparepart</span>
              </div>
              <p className="text-[#B58A63] italic">Kunjungan Workshop by Appointment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-stone-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-light text-stone-500 gap-4">
        <div>
          &copy; {new Date().getFullYear()} <span className="text-stone-300 font-medium">Brewparts</span>. All rights reserved. PT Satu Saudara Sedarah.
        </div>
        <div className="flex space-x-6 text-[11px]">
          <Link href="/shop" className="hover:text-stone-400 transition-colors">Katalog Mesin</Link>
          <Link href="/checkout" className="hover:text-stone-400 transition-colors">Pemesanan</Link>
          <span className="text-stone-600">•</span>
          <span className="text-stone-400">Garansi Resmi & Teknisi Tersertifikasi</span>
        </div>
      </div>
    </footer>
  );
}