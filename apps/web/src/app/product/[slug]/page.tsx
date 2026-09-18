import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Truck, Wrench, ArrowLeft } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import { ProductActionButtons } from './ProductActionButtons';

async function getProduct(slug: string) {
  try {
    const res = await fetchApi<{ success: boolean; data: any }>(`products/${slug}`);
    return res.data || null;
  } catch (err) {
    console.error(`Error fetching product ${slug}:`, err);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const formatRupiah = (num: any) => {
    const val = typeof num === 'string' ? parseFloat(num) : Number(num);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const images = product.images || [];
  const primaryImg = images.find((img: any) => img.isPrimary)?.url || images[0]?.url || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=1000';

  const specs = product.specifications || {
    boiler_type: product.boilerType || 'Dual Stainless Steel Boiler',
    pump_type: product.pumpType || 'Commercial Rotary Vane Pump',
    power_watts: `${product.powerWatts || 1600} W`,
    voltage: product.voltage || '220-240V / 50Hz',
    group_heads: product.groupHeads || 1,
    water_tank: product.waterTankLitres ? `${product.waterTankLitres} L` : 'Plumbed-in Direct & Reservoir',
    usage_type: product.usageType === 'COMMERCIAL' ? 'High-Volume Commercial Bar' : 'Luxury Home & Prosumer Atelier',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-stone-400 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/shop" className="hover:text-stone-900 flex items-center space-x-1 shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Katalog</span>
        </Link>
        <span>/</span>
        <span className="text-stone-500 shrink-0">{product.category?.name || 'Espresso'}</span>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate">{product.name}</span>
      </div>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery / Image Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="relative h-72 sm:h-96 md:h-[500px] w-full bg-white border border-stone-200 overflow-hidden flex items-center justify-center p-4 sm:p-8">
            <Image
              src={primaryImg}
              alt={product.name}
              fill
              priority
              className="object-contain p-4 sm:p-8"
              unoptimized
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {images.map((img: any, idx: number) => (
                <div
                  key={img.id || idx}
                  className="relative h-20 sm:h-24 bg-white border border-stone-200 p-1.5 overflow-hidden cursor-pointer hover:border-stone-900 transition-colors"
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
        <div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:sticky lg:top-28">
          <div className="space-y-2 sm:space-y-3">
            {product.brand && (
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">
                {product.brand.name} • {product.brand.country || 'Italy'}
              </span>
            )}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 font-normal leading-tight">
              {product.name}
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-stone-400">SKU: {product.sku}</p>
          </div>

          {/* Price Block */}
          <div className="p-4 sm:p-6 bg-[#FAF7F2] border border-[#EAE6DF] space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Harga Resmi Termasuk PPN</span>
            <div className="font-price text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              {formatRupiah(product.price)}
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-800 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>{product.stock > 0 ? `Tersedia (${product.stock} unit ready stock)` : 'Unit Pre-Order Eksklusif'}</span>
            </div>
          </div>

          {/* Tagline / Brief Overview */}
          <p className="text-xs sm:text-sm font-light text-stone-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Interactive Client Action Buttons (Cart + WA + Compare) */}
          <ProductActionButtons product={product} />

          {/* Assurance Badges */}
          <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-4 h-4 text-[#B58A63] shrink-0" />
              <span>Garansi Resmi 3 Tahun Suku Cadang & Jasa Servis</span>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-4 h-4 text-[#B58A63] shrink-0" />
              <span>Pengiriman Peti Kayu & Asuransi All-Risk Seluruh Indonesia</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wrench className="w-4 h-4 text-[#B58A63] shrink-0" />
              <span>Free Setup, Barista Dial-in & Water Softener Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Specifications & Editorial Content */}
      <div className="border-t border-stone-200 pt-10 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Narrative Description */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">Arsitektur & Rekayasa</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">Deskripsi Lengkap</h2>
          </div>
          <div className="text-xs sm:text-sm font-light text-stone-700 leading-relaxed space-y-4">
            <p>{product.description}</p>
          </div>
        </div>

        {/* Right: Technical Specification Grid */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">Technical Data</span>
            <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal">Spesifikasi Teknis</h2>
          </div>

          <div className="border border-stone-200 divide-y divide-stone-200 bg-[#FAF7F2] text-xs">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                <span className="font-medium text-stone-500 uppercase tracking-wider text-[11px]">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="font-semibold text-stone-900 sm:text-right">
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}