'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Scale } from 'lucide-react';
import { useCartStore } from '../lib/cart-store';
import { useCompareStore } from '../lib/compare-store';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const compareCount = useCompareStore((state) => state.items.length);
  const openCompare = useCompareStore((state) => state.openCompare);

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EAE7E1] transition-all">
      {/* Top Banner / Showroom Concierge Note */}
      <div className="bg-[#1C1A19] text-[#E8D8C8] text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase py-1.5 px-4 text-center font-sans flex items-center justify-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse shrink-0" />
        <span className="truncate">Brewparts Official • Precision Espresso Machinery & Parts • Authorized Technical Service</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Mobile Menu Button */}
        <div className="flex items-center xl:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-stone-800 hover:text-stone-950 p-2 -ml-2 rounded-lg active:bg-stone-200"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 1. Left Section: Brand Logo & Main Nav */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="inline-block shrink-0">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-wider text-stone-900 font-semibold block uppercase">
              Brewparts
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] text-[#8C827A] uppercase font-sans block -mt-1 font-medium">
              Precision Machinery & Parts
            </span>
          </Link>

          <nav className="hidden xl:flex items-center space-x-6 text-[12px] tracking-[0.2em] uppercase font-medium text-stone-700">
            <Link href="/shop" className="hover:text-stone-950 transition-colors">Katalog</Link>
            <Link href="/shop?category=espresso-commercial" className="hover:text-stone-950 transition-colors">Commercial</Link>
            <Link href="/shop?category=espresso-home" className="hover:text-stone-950 transition-colors">Home Atelier</Link>
            <Link href="/shop?category=grinders" className="hover:text-stone-950 transition-colors">Grinders</Link>
          </nav>
        </div>

        {/* 2. Center Section: PENCARIAN DI TENGAH (Desktop & Tablet) */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-3 lg:mx-6">
          <form onSubmit={handleSearch} className="w-full relative flex items-center group">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Cari mesin espresso, grinder, sparepart..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] hover:bg-white focus:bg-white border border-[#DDD7CD] hover:border-stone-400 focus:border-[#B58A63] rounded-full pl-10 pr-20 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#B58A63]/20 transition-all shadow-sm"
              />
              <button
                type="submit"
                className="absolute left-3.5 flex items-center justify-center text-stone-400 group-focus-within:text-[#B58A63] hover:text-[#B58A63] transition-colors"
                title="Cari produk"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </button>

              <div className="absolute right-1.5 flex items-center space-x-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-200/60 transition-colors"
                    title="Hapus pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-[#B58A63] text-cream-50 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase transition-all shadow-sm flex items-center space-x-1 active:scale-95"
                  title="Klik untuk mencari"
                >
                  <span>Cari</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 3. Right Section: WhatsApp + Compare + Cart */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-stone-800 shrink-0">
          {/* Compare Trigger */}
          {compareCount > 0 && (
            <button
              type="button"
              onClick={openCompare}
              className="relative p-2 hover:text-stone-950 transition-colors flex items-center space-x-1 text-xs uppercase tracking-widest text-[#B58A63] font-medium"
              title="Bandingkan Mesin"
            >
              <Scale className="w-5 h-5 stroke-[1.5]" />
              <span className="hidden sm:inline text-[11px]">({compareCount})</span>
            </button>
          )}

          {/* OFFICIAL WHATSAPP VIP CONCIERGE BUTTON */}
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Brewparts, saya ingin konsultasi pemilihan mesin kopi & spare parts.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-[#2C2825] hover:bg-stone-950 text-cream-50 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-none border border-stone-800 transition-all duration-300 shadow-md group"
            title="Chat Official WhatsApp VIP Concierge"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" color="#25D366" />
            </div>
            <div className="text-left hidden lg:block">
              <span className="text-[11px] tracking-[0.2em] uppercase font-semibold block text-white leading-none">
                WhatsApp VIP
              </span>
              <span className="text-[9px] tracking-widest text-[#B58A63] uppercase font-light block mt-0.5">
                Live Concierge
              </span>
            </div>
          </a>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 sm:p-2.5 hover:text-stone-950 transition-colors border border-transparent hover:border-stone-300 active:scale-95"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 sm:top-1 sm:right-0 bg-[#B58A63] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Directly below header on small mobile screens) */}
      <div className="md:hidden px-4 pb-2.5 pt-1 border-t border-stone-200/60 bg-[#FAF7F2]">
        <form onSubmit={handleSearch} className="relative flex items-center group">
          <input
            type="text"
            placeholder="Cari mesin, grinder, sparepart..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-300 focus:border-[#B58A63] rounded-full pl-9 pr-16 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#B58A63]/20 transition-all shadow-sm"
          />
          <button
            type="submit"
            className="absolute left-3 flex items-center justify-center text-stone-400 group-focus-within:text-[#B58A63] hover:text-[#B58A63] transition-colors"
            title="Cari produk"
          >
            <Search className="w-3.5 h-3.5 stroke-[2]" />
          </button>
          <div className="absolute right-1.5 flex items-center space-x-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="bg-stone-900 hover:bg-[#B58A63] text-white w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm"
              title="Cari"
            >
              <Search className="w-3 h-3 text-white stroke-[2.2]" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-[#FDFBF7] px-6 py-6 space-y-5 animate-fadeIn shadow-2xl">
          <nav className="flex flex-col space-y-3.5 text-xs tracking-[0.2em] uppercase font-semibold text-stone-800">
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#B58A63]">Semua Koleksi Mesin</Link>
            <Link href="/shop?category=espresso-commercial" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#B58A63]">Commercial Machines</Link>
            <Link href="/shop?category=espresso-home" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#B58A63]">Home Espresso Atelier</Link>
            <Link href="/shop?category=grinders" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#B58A63]">Precision Grinders</Link>
            <Link href="/shop?category=accessories" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#B58A63]">Accessories & Tools</Link>
          </nav>

          <div className="pt-4 border-t border-stone-200">
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Brewparts, saya ingin konsultasi mesin kopi & suku cadang.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2.5 bg-[#25D366] hover:bg-emerald-600 text-white py-3 text-xs tracking-widest uppercase font-bold shadow transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" color="#ffffff" />
              <span>Konsultasi WhatsApp VIP</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}