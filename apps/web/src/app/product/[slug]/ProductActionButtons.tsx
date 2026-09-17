'use client';

import React from 'react';
import { ShoppingBag, Scale } from 'lucide-react';
import { useCartStore } from '../../../lib/cart-store';
import { useCompareStore } from '../../../lib/compare-store';
import { WhatsAppIcon } from '../../../components/WhatsAppIcon';

export function ProductActionButtons({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCompare = useCompareStore((state) => state.toggleProduct);
  const compareItems = useCompareStore((state) => state.items);
  const isCompared = compareItems.some((i) => i.id === product.id);

  const formatRupiah = (num: any) => {
    const val = typeof num === 'string' ? parseFloat(num) : Number(num);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const primaryImg = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      quantity: 1,
      imageUrl: primaryImg,
      brandName: product.brand?.name,
    });
  };

  const handleWhatsAppInquiry = () => {
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const text = `Halo Atelier du Café, saya tertarik dengan mesin *${product.name}* (SKU: ${product.sku}) seharga ${formatRupiah(product.price)}.\n\nMohon info mengenai ketersediaan unit, demo langsung di showroom, dan opsi cicilan. Terima kasih.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-3">
      {/* 1. Add to Bag (Direct Purchase) */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full flex items-center justify-center space-x-3 bg-[#2C2825] hover:bg-stone-900 text-cream-50 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all shadow-md"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Tambah ke Keranjang</span>
      </button>

      {/* 2. Official WhatsApp VIP Concierge Button */}
      <button
        type="button"
        onClick={handleWhatsAppInquiry}
        className="w-full flex items-center justify-center space-x-3 border border-[#25D366] text-stone-900 bg-emerald-50/50 hover:bg-emerald-100/70 py-3.5 text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-sm group"
      >
        <div className="w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <WhatsAppIcon className="w-5 h-5" color="#25D366" />
        </div>
        <span>Konsultasi Mesin via WhatsApp</span>
      </button>

      {/* 3. Add to Technical Comparison */}
      <button
        type="button"
        onClick={() =>
          toggleCompare({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            imageUrl: primaryImg,
            brandName: product.brand?.name,
            specifications: product.specifications || {},
          })
        }
        className="w-full flex items-center justify-center space-x-2 text-stone-600 hover:text-stone-950 py-2.5 text-xs tracking-widest uppercase transition-colors"
      >
        <Scale className="w-3.5 h-3.5 text-[#B58A63]" />
        <span>{isCompared ? 'Hapus dari Komparasi' : 'Bandingkan dengan Mesin Lain'}</span>
      </button>
    </div>
  );
}