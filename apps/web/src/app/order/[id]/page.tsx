import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { fetchApi } from '../../../../lib/api';
import { WhatsAppIcon } from '../../../../components/WhatsAppIcon';

interface OrderDetailProps {
  params: { id: string };
}

async function getOrder(id: string) {
  try {
    const res = await fetchApi<{ success: boolean; data: any }>(`orders/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export default async function OrderSuccessPage({ params }: OrderDetailProps) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
  const waText = `Halo Atelier du Café, saya baru saja membuat pesanan resmi *${order.orderNumber}* senilai ${formatRupiah(order.totalAmount)} atas nama ${order.customer?.name || 'Customer'}. Mohon instruksi pembayaran dan jadwal pengiriman.`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 bg-[#FAF7F2] border border-[#EAE6DF] p-10">
        <CheckCircle2 className="w-16 h-16 text-[#B58A63] mx-auto stroke-[1.5]" />
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold block">
          Pemesanan Berhasil Terdaftar
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Terima Kasih atas Kepercayaan Anda
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl mx-auto">
          Nomor Pesanan Anda: <span className="font-mono font-bold text-stone-900">{order.orderNumber}</span>. Proforma Invoice resmi telah dibuat dan tim concierge kami siap membantu proses pengiriman.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#25D366] hover:bg-emerald-600 text-white text-xs uppercase tracking-widest font-bold flex items-center space-x-2.5 transition-all shadow-md group"
          >
            <div className="w-5 h-5 group-hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-5 h-5" color="#ffffff" />
            </div>
            <span>Konfirmasi ke VIP Concierge WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Order Details & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        {/* Left: Customer & Delivery Info */}
        <div className="border border-stone-200 p-6 space-y-4 bg-white">
          <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
            Informasi Penerima & Pengiriman
          </h3>
          <div className="space-y-2 text-stone-700">
            <p><strong className="text-stone-900">Nama:</strong> {order.customer?.name}</p>
            <p><strong className="text-stone-900">Email:</strong> {order.customer?.email}</p>
            <p><strong className="text-stone-900">WhatsApp/HP:</strong> {order.customer?.phone}</p>
            {order.shippingAddress && (
              <p><strong className="text-stone-900">Alamat:</strong> {order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.province}</p>
            )}
          </div>
        </div>

        {/* Right: Payment Instructions */}
        <div className="border border-stone-200 p-6 space-y-4 bg-white">
          <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
            Instruksi Transfer Bank Rekening Resmi
          </h3>
          <div className="space-y-3 text-stone-700">
            <div className="p-3 bg-[#FAF7F2] border border-stone-200 space-y-1">
              <p className="font-bold text-stone-900">Bank Central Asia (BCA)</p>
              <p className="font-mono text-sm text-stone-900">882-019-8822</p>
              <p className="text-[11px] text-stone-500">a/n PT ATELIER DU CAFE INDONESIA</p>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Mohon sertakan berita transfer: <span className="font-mono font-bold text-stone-800">{order.orderNumber}</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="border border-stone-200 bg-white p-6 space-y-4">
        <h3 className="font-serif text-sm uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
          Rincian Peralatan Kopi yang Dipesan
        </h3>
        <div className="divide-y divide-stone-200">
          {order.items?.map((item: any) => (
            <div key={item.id} className="py-4 flex justify-between items-center text-xs">
              <div>
                <p className="font-serif font-medium text-stone-900 text-sm">{item.product?.name || item.name}</p>
                <p className="text-stone-500 font-light">Qty: <span className="font-price font-medium text-stone-700">{item.quantity}</span> @ <span className="font-price font-medium text-stone-700">{formatRupiah(item.unitPrice)}</span></p>
              </div>
              <div className="font-price font-bold text-stone-900 text-sm tracking-tight">
                {formatRupiah(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-stone-300 flex justify-between items-baseline">
          <span className="font-serif text-base font-bold text-stone-900 uppercase">Total Pesanan</span>
          <span className="font-price text-2xl font-bold text-stone-900 tracking-tight">{formatRupiah(order.totalAmount)}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="text-center pt-6">
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-stone-800 hover:text-[#B58A63] font-medium"
        >
          <span>Kembali ke Beranda Koleksi</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}