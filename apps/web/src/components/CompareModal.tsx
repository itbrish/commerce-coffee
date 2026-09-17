'use client';

import React from 'react';
import Image from 'next/image';
import { X, Scale, Trash2 } from 'lucide-react';
import { useCompareStore } from '../lib/compare-store';

export function CompareModal() {
  const { items, isOpen, closeCompare, removeProduct, clearCompare } = useCompareStore();

  if (!isOpen || items.length === 0) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const specKeys = Array.from(
    new Set(
      items.flatMap((p) => Object.keys(p.specifications || {}))
    )
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fadeIn">
      <div className="bg-[#FDFBF7] w-full max-w-5xl rounded-none shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#FAF6ED]">
          <div className="flex items-center space-x-3">
            <Scale className="w-5 h-5 text-[#B58A63]" />
            <div>
              <h2 className="font-serif text-lg tracking-wider uppercase text-stone-900">
                Komparasi Mesin Espresso
              </h2>
              <p className="text-[11px] text-stone-500 font-light">
                Bandingkan spesifikasi teknis dan fitur antar produk secara detail
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={clearCompare}
              className="text-xs text-stone-400 hover:text-red-700 uppercase tracking-wider flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
            <button
              onClick={closeCompare}
              className="text-stone-500 hover:text-stone-900 p-1"
              aria-label="Close Compare"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-4 gap-6 min-w-[600px]">
            <div className="font-serif text-sm font-medium text-stone-500 pt-32">
              Spesifikasi Teknis
            </div>

            {items.map((prod) => (
              <div key={prod.id} className="space-y-4 relative border-b border-stone-200 pb-6">
                <button
                  onClick={() => removeProduct(prod.id)}
                  className="absolute top-0 right-0 p-1 text-stone-400 hover:text-red-600"
                  title="Hapus dari komparasi"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-full h-32 bg-stone-100 relative border border-stone-200 overflow-hidden">
                  {prod.imageUrl ? (
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">No Img</div>
                  )}
                </div>

                <div>
                  {prod.brandName && (
                    <span className="text-[10px] uppercase tracking-widest text-[#8C827A]">{prod.brandName}</span>
                  )}
                  <h3 className="font-serif text-sm text-stone-900 font-semibold line-clamp-2 mt-1">{prod.name}</h3>
                  <p className="font-price text-xs font-bold text-[#B58A63] mt-1 tracking-tight">{formatRupiah(prod.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {specKeys.map((key) => (
              <div
                key={key}
                className="grid grid-cols-4 gap-6 py-3 border-b border-stone-200 text-xs items-center"
              >
                <div className="font-medium text-stone-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                {items.map((prod) => (
                  <div key={prod.id} className="text-stone-900 font-light">
                    {prod.specifications?.[key] !== undefined ? String(prod.specifications[key]) : '—'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}