import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Truck, Wrench, ArrowLeft } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import { ProductActionButtons } from './ProductActionButtons';

interface ProductDetailProps {
  params: { slug: string };
}

async function getProductBySlug(slug: string) {
  try {
    const res = await fetchApi<{ success: boolean; data: any }>(`products/${slug}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const formatRupiah = (num: any) => {
    const val = typeof num === 'string' ? parseFloat(num) : Number(num);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const images = product.images || [];
  const primaryImg = images.find((i: any) => i.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=1000';

  const specsList = Array.isArray(product.specifications) ? product.specifications : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-3 text-xs uppercase tracking-widest text-stone-500">
        <Link href="/shop" className="hover:text-stone-900 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Katalog</span>
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-stone-900">
          {product.category?.name || 'Koleksi Mesin'}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">{product.name}</span>
      </div>

      {/* Main Showcase Section (2-Column Asymmetric) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery / Image Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-[480px] sm:h-[560px] w-full bg-white border border-stone-200 overflow-hidden flex items-center justify-center p-8">
            <Image
              src={primaryImg}
              alt={product.name}
              fill
              priority
              className="object-contain p-8"
              unoptimized
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: any, idx: number) => (
                <div
                  key={img.id || idx}
                  className="relative h-28 bg-white border border-stone-200 p-2 overflow-hidden cursor-pointer hover:border-stone-900 transition-colors"
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.name} gallery image`}
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchase & Details Sticky Column (5 cols) */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
          <div className="space-y-3">
            {product.brand && (
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">
                {product.brand.name} • {product.brand.country || 'Italy'}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal leading-tight">
              {product.name}
            </h1>
            <p className="text-xs uppercase tracking-widest text-stone-400">SKU: {product.sku}</p>
          </div>

          {/* Price Block */}
          <div className="p-6 bg-[#FAF7F2] border border-[#EAE6DF] space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Harga Resmi Termasuk PPN</span>
            <div className="font-price text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {formatRupiah(product.price)}
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-800 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>{product.stock > 0 ? `Tersedia (${product.stock} unit ready stock)` : 'Unit Pre-Order Eksklusif'}</span>
            </div>
          </div>

          {/* Tagline / Brief Overview */}
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Interactive Client Action Buttons (Cart + WA + Compare) */}
          <ProductActionButtons product={product} />

          {/* Assurance Badges */}
          <div className="space-y-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-4 h-4 text-[#B58A63]" />
              <span>Garansi Resmi 3 Tahun Suku Cadang & Jasa Servis</span>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-4 h-4 text-[#B58A63]" />
              <span>Pengiriman Peti Kayu & Asuransi All-Risk Indonesia</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wrench className="w-4 h-4 text-[#B58A63]" />
              <span>Free Setup, Barista Dial-in & Water Softener Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Specifications & Editorial Content */}
      <div className="border-t border-stone-200 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Narrative Description */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">Arsitektur & Rekayasa</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">Deskripsi Lengkap</h2>
          </div>
          <div className="text-sm font-light text-stone-700 leading-relaxed space-y-4">
            <p>{product.description}</p>
          </div>
        </div>

        {/* Right: Technical Specification Grid */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">Technical Data</span>
            <h2 className="font-serif text-2xl text-stone-900 font-normal">Spesifikasi Teknis</h2>
          </div>

          <div className="border border-stone-200 divide-y divide-stone-200 text-xs bg-[#FAF7F2]">
            {product.boilerType && (
              <div className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">Tipe Boiler</span>
                <span className="text-stone-900 font-light">{product.boilerType}</span>
              </div>
            )}
            {product.pumpType && (
              <div className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">Tipe Pompa</span>
                <span className="text-stone-900 font-light">{product.pumpType}</span>
              </div>
            )}
            {product.groupHeads && (
              <div className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">Group Heads</span>
                <span className="text-stone-900 font-light">{product.groupHeads} Group</span>
              </div>
            )}
            {product.powerWatts && (
              <div className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">Konsumsi Daya</span>
                <span className="text-stone-900 font-light">{product.powerWatts} Watt</span>
              </div>
            )}
            {product.voltage && (
              <div className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">Tegangan Listrik</span>
                <span className="text-stone-900 font-light">{product.voltage}</span>
              </div>
            )}
            {product.waterTankLitres && (
              <div className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">Kapasitas Tangki Air</span>
                <span className="text-stone-900 font-light">{product.waterTankLitres} Liter</span>
              </div>
            )}
            {product.dimensions && (
              <div className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">Dimensi (P x L x T)</span>
                <span className="text-stone-900 font-light">{product.dimensions}</span>
              </div>
            )}
            {product.weight && (
              <div className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">Berat Bersih</span>
                <span className="text-stone-900 font-light">{product.weight / 1000} kg</span>
              </div>
            )}
            {specsList.map((spec: any) => (
              <div key={spec.id || spec.name} className="p-3.5 flex justify-between">
                <span className="font-medium text-stone-600">{spec.name}</span>
                <span className="text-stone-900 font-light">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}