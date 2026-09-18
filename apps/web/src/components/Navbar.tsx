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
        <span className="truncate">Official Italian Haute Espresso Equipment • White-Glove Dispatch</span>
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
            <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-wider text-stone-900 font-normal block uppercase">
              Atelier du Café
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] text-[#8C827A] uppercase font-sans block -mt-1">
              Haute Espresso Equipment
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
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <form onSubmit={handleSearch} className="w-full relative flex items-center">
            <input
              type="text"
              placeholder="Cari mesin espresso, grinder, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#DDD7CD] hover:border-stone-400 focus:border-stone-900 rounded-none pl-10 pr-10 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 pointer-events-none stroke-[1.8]" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400 hover:text-stone-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Atelier du Café, saya ingin konsultasi pemilihan mesin kopi premium.')}`}
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
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-stone-200/60 bg-[#FAF7F2]">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="Cari mesin, grinder, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-none pl-9 pr-8 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
          />
          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
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
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Atelier du Café, saya ingin konsultasi mesin kopi.')}`}
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