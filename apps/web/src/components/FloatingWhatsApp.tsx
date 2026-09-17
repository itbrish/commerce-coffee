'use client';

import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';

export function FloatingWhatsApp() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
  const text = 'Halo Atelier du Café, saya ingin konsultasi pemilihan mesin kopi premium.';

  return (
    <aside aria-label="WhatsApp Concierge" className="fixed bottom-7 right-7 z-40 flex items-center group">
      {/* Tooltip Label */}
      <span className="hidden sm:inline-block mr-3 bg-stone-900 text-cream-50 text-[11px] font-sans tracking-wider py-1.5 px-3 rounded shadow-lg border border-stone-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat VIP Concierge
      </span>

      {/* Floating Button with Official WhatsApp Icon */}
      <a
        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 ring-4 ring-white/80"
        aria-label="Chat WhatsApp VIP Concierge"
      >
        <WhatsAppIcon className="w-8 h-8 text-white" color="#ffffff" />
      </a>
    </aside>
  );
}