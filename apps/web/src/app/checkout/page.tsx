'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, ShieldCheck, CreditCard, Building, MessageSquare } from 'lucide-react';
import { useCartStore } from '../../lib/cart-store';
import { fetchApi } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'MANUAL_BANK_TRANSFER',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const subtotal = getTotalPrice();
  const shippingFee = 0; // Free White-Glove VIP Delivery
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shippingFee + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Keranjang Anda kosong.');
      return;
    }

    if (!formData.firstName || !formData.email || !formData.phone || !formData.address) {
      setErrorMsg('Harap lengkapi semua data kontak dan alamat pengiriman.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
        },
        shippingAddress: {
          recipientName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          streetAddress: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: 'Indonesia',
        },
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const res = await fetchApi<{ success: boolean; data: { orderId: string; orderNumber: string } }>('orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        clearCart();
        router.push(`/order/${res.data.orderId}`);
      } else {
        setErrorMsg('Gagal memproses pesanan. Silakan coba lagi.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-6">
        <h1 className="font-serif text-3xl text-stone-900">Keranjang Belanja Kosong</h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light">
          Anda belum memilih mesin kopi untuk dipesan.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 bg-stone-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-[#B58A63] transition-colors"
        >
          Lihat Katalog Mesin
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-10">
      <div className="flex items-center space-x-3 text-xs uppercase tracking-widest text-stone-500">
        <Link href="/shop" className="hover:text-stone-900 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>

      <div className="border-b border-stone-200 pb-4 sm:pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 font-normal">
          Checkout & Pemesanan Resmi
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
          Lengkapi informasi kontak dan pengiriman untuk penerbitan Invoice & Proforma resmi Atelier du Café.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 sm:p-4 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-stone-900 font-medium border-b border-stone-200 pb-2">
              1. Informasi Pelanggan / Entitas Bisnis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Nama Depan *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Nama Belakang</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Email Resmi *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Nomor WhatsApp / HP *</label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Nama Kafe / Perusahaan (Opsional)</label>
              <input
                type="text"
                placeholder="PT / CV / Brand Kafe"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-stone-900 font-medium border-b border-stone-200 pb-2">
              2. Alamat Instalasi & Pengiriman
            </h3>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Alamat Lengkap *</label>
              <textarea
                required
                rows={3}
                placeholder="Nama jalan, gedung, nomor bar/ruko, kelurahan, kecamatan"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Kota / Kabupaten *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Provinsi *</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">Catatan Khusus Instalasi</label>
              <textarea
                rows={2}
                placeholder="Contoh: Instalasi di lantai 2, butuh teknisi water softener"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-stone-300 p-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-stone-900 font-medium border-b border-stone-200 pb-2">
              3. Metode Pembayaran & Faktur
            </h3>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-4 border border-stone-300 bg-[#FAF7F2] cursor-pointer hover:border-stone-800">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="MANUAL_BANK_TRANSFER"
                  checked={formData.paymentMethod === 'MANUAL_BANK_TRANSFER'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1"
                />
                <div>
                  <span className="font-serif text-sm font-semibold text-stone-900 block">
                    Transfer Bank Manual / Corporate Invoice (BCA / Mandiri)
                  </span>
                  <span className="text-xs text-stone-500 font-light block mt-0.5">
                    Invoice resmi Proforma akan dikirim via email dan WhatsApp untuk proses verifikasi finance.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 border border-stone-300 bg-[#FAF7F2] cursor-pointer hover:border-stone-800">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PAYMENT_GATEWAY_SNAP"
                  checked={formData.paymentMethod === 'PAYMENT_GATEWAY_SNAP'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1"
                />
                <div>
                  <span className="font-serif text-sm font-semibold text-stone-900 block">
                    Online Payment (Credit Card / Cicilan 0% / Virtual Account)
                  </span>
                  <span className="text-xs text-stone-500 font-light block mt-0.5">
                    Pembayaran instan terenkripsi melalui payment gateway resmi Midtrans / Xendit.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF6ED] border border-stone-300 p-6 space-y-6">
            <h3 className="font-serif text-lg text-stone-900 font-medium border-b border-stone-200 pb-3">
              Ringkasan Pesanan ({items.length} Item)
            </h3>

            {/* Item List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between space-x-4 border-b border-stone-200/80 pb-3 text-xs">
                  <div>
                    <p className="font-serif font-medium text-stone-900">{item.name}</p>
                    <p className="text-stone-500 font-light">Qty: <span className="font-price font-medium text-stone-700">{item.quantity}</span> x <span className="font-price font-medium text-stone-700">{formatRupiah(item.price)}</span></p>
                  </div>
                  <div className="font-price font-bold text-stone-900 tracking-tight">
                    {formatRupiah(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-2 border-t border-stone-200 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-price font-bold text-stone-800">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>PPN 11% (Termasuk)</span>
                <span className="font-price font-bold text-stone-800">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-medium">
                <span>Pengiriman & Asuransi Kayu</span>
                <span>GRATIS (VIP Service)</span>
              </div>
              <div className="flex justify-between text-base font-serif font-medium text-stone-900 pt-3 border-t border-stone-300 items-baseline">
                <span>Total Investasi</span>
                <span className="font-price text-xl font-bold text-stone-900 tracking-tight">{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#2C2825] hover:bg-stone-900 text-cream-50 text-xs uppercase tracking-[0.25em] font-medium transition-colors shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan & Terbitkan Proforma'}
            </button>

            <div className="flex items-center space-x-2 text-[11px] text-stone-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-[#B58A63]" />
              <span>Transaksi Terenkripsi & Garansi Resmi Terjamin</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}