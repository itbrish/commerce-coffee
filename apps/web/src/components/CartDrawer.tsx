'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../lib/cart-store';
import { WhatsAppIcon } from './WhatsAppIcon';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const [isSubmittingWA, setIsSubmittingWA] = useState(false);

  if (!isOpen) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handleWhatsAppCheckout = () => {
    setIsSubmittingWA(true);
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    let text = 'Halo Atelier du Café, saya ingin memesan produk berikut melalui WhatsApp:\n\n';
    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* (SKU: ${item.sku})\n   Qty: ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}\n`;
    });
    text += `\n*Total Estimasi: ${formatRupiah(getTotalPrice())}*\n\nMohon info ketersediaan unit, invoice penawaran resmi, dan jadwal pengiriman. Terima kasih.`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setIsSubmittingWA(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-full sm:max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col justify-between border-l border-stone-300 h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="font-serif text-base sm:text-lg tracking-wider uppercase text-stone-900">
                Keranjang ({getTotalItems()})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="text-stone-500 hover:text-stone-900 p-2 -mr-2 rounded-full active:bg-stone-200"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4 text-stone-500">
                <p className="font-serif text-lg italic text-stone-400">Keranjang belanja Anda kosong</p>
                <p className="text-xs font-light text-stone-400 max-w-xs mx-auto">
                  Eksplorasi koleksi mesin espresso premium dan precision grinder kami.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-block mt-4 text-xs tracking-widest uppercase underline text-stone-800 hover:text-[#B58A63]"
                >
                  Lihat Katalog
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex space-x-3 sm:space-x-4 border-b border-stone-200 pb-4 sm:pb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 relative flex-shrink-0 border border-stone-200 overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {item.brandName && (
                        <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[#8C827A]">{item.brandName}</p>
                      )}
                      <h3 className="font-serif text-xs sm:text-sm text-stone-900 line-clamp-1">{item.name}</h3>
                      <p className="font-price text-xs font-bold text-[#B58A63] mt-0.5 tracking-tight">{formatRupiah(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <div className="flex items-center border border-stone-300">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 px-2 text-stone-600 active:bg-stone-200"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-stone-800 font-price">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 px-2 text-stone-600 active:bg-stone-200"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-[11px] text-stone-400 hover:text-red-700 uppercase tracking-wider underline p-1"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky Bottom Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#FAF6ED] border-t border-stone-200 space-y-3 sm:space-y-4 pb-safe">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-widest text-stone-600 font-medium">Subtotal</span>
                <span className="font-price text-lg sm:text-xl font-bold text-stone-900 tracking-tight">{formatRupiah(getTotalPrice())}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 font-light">
                Pajak dan ongkos kirim dihitung saat checkout. Asuransi pengiriman peti kayu tersedia.
              </p>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center space-x-2 bg-[#2C2825] hover:bg-stone-900 active:bg-stone-950 text-cream-50 py-3.5 text-xs tracking-widest uppercase font-medium transition-colors"
                >
                  <span>Lanjut ke Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  disabled={isSubmittingWA}
                  className="w-full flex items-center justify-center space-x-2.5 border border-[#25D366] text-stone-900 bg-emerald-50/70 hover:bg-emerald-100 py-3 text-xs tracking-widest uppercase font-bold transition-colors group shadow-sm"
                >
                  <div className="w-4 h-4 group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="w-4 h-4" color="#25D366" />
                  </div>
                  <span>Pesan via WhatsApp VIP</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}