import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Wrench, Sparkles, Coffee } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

async function getFeaturedProducts() {
  try {
    const res = await fetchApi<{ success: boolean; data: any }>('products?featured=true&limit=6');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.items)) return res.data.items;
    return [];
  } catch (err) {
    console.error('Error fetching featured products:', err);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetchApi<{ success: boolean; data: any[] }>('categories');
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const formatRupiah = (num: any) => {
    const val = typeof num === 'string' ? parseFloat(num) : Number(num);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';

  return (
    <div className="space-y-32 pb-24 overflow-hidden">
      {/* 1. EDITORIAL HERO (Lifetimedesign.co Aesthetic) */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-stone-950 text-cream-50 overflow-hidden">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000&auto=format&fit=crop"
            alt="Atelier du Cafe Luxury Espresso Machinery"
            fill
            priority
            className="object-cover opacity-35 scale-105 transition-transform duration-10000 hover:scale-100"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 animate-fadeIn">
          <div className="inline-flex items-center space-x-3 border border-[#B58A63]/40 px-5 py-2 bg-stone-900/60 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#B58A63] animate-pulse" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-stone-200 font-sans font-medium">
              Italian Architectural Espresso Machines
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] text-[#FDFBF7] font-normal">
            Seni & Presisi <br />
            <span className="italic font-light text-[#E8D8C8]">Ekstraksi Sempurna</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 font-light leading-relaxed tracking-wide">
            Kurasi peralatan espresso kelas dunia dari Florence, Milan, dan Venice. Dirancang untuk kafe terkemuka dan ruang pribadi dengan standar tanpa kompromi.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-10 py-4 bg-[#FDFBF7] text-stone-950 text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#B58A63] hover:text-white transition-all duration-300 shadow-xl"
            >
              Jelajahi Katalog 2026
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Atelier du Café, saya ingin konsultasi private pemilihan mesin espresso.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-[#25D366]/60 hover:border-[#25D366] text-cream-100 hover:text-white text-xs tracking-[0.25em] uppercase font-semibold transition-all backdrop-blur-sm flex items-center justify-center space-x-2.5 bg-stone-900/50 hover:bg-stone-900/80 group"
            >
              <div className="w-4 h-4 group-hover:scale-110 transition-transform">
                <WhatsAppIcon className="w-4 h-4" color="#25D366" />
              </div>
              <span>Private VIP Consultation</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-stone-400 opacity-70">
          <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-stone-400 to-transparent" />
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BAR */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-y border-stone-200">
          <div className="flex items-start space-x-4">
            <ShieldCheck className="w-6 h-6 text-[#B58A63] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-stone-900 uppercase tracking-wider">Garansi Resmi 2-3 Tahun</h4>
              <p className="text-xs text-stone-500 font-light mt-1">Jaminan suku cadang original dan teknisi tersertifikasi pabrikan Italia.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Truck className="w-6 h-6 text-[#B58A63] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-stone-900 uppercase tracking-wider">White-Glove Delivery</h4>
              <p className="text-xs text-stone-500 font-light mt-1">Pengiriman terlindungi asuransi dan instalasi langsung di lokasi Anda.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Wrench className="w-6 h-6 text-[#B58A63] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-stone-900 uppercase tracking-wider">Barista Calibration</h4>
              <p className="text-xs text-stone-500 font-light mt-1">Kalibrasi profil air, suhu boiler, dan rasio ekstraksi gratis.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Sparkles className="w-6 h-6 text-[#B58A63] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-stone-900 uppercase tracking-wider">Bespoke Customization</h4>
              <p className="text-xs text-stone-500 font-light mt-1">Kustomisasi warna bodi, panel kayu walnut, dan chrome finishing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SHOWCASE (Asymmetrical Grid) */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">Kurasi Berdasarkan Kebutuhan</span>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-normal">Kategori Utama</h2>
          </div>
          <Link href="/shop" className="mt-4 md:mt-0 text-xs uppercase tracking-[0.2em] text-stone-800 hover:text-[#B58A63] flex items-center space-x-2 font-medium">
            <span>Semua Kategori</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((cat, idx) => (
            <Link
              key={cat.id || idx}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-[420px] bg-stone-900 overflow-hidden flex flex-col justify-end p-8 text-cream-50"
            >
              <Image
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=1000&auto=format&fit=crop'}
                alt={cat.name}
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B58A63] font-medium">Koleksi Spesialis</span>
                <h3 className="font-serif text-2xl group-hover:translate-x-1 transition-transform">{cat.name}</h3>
                <p className="text-xs text-stone-300 font-light line-clamp-2">{cat.description}</p>
                <div className="pt-2 flex items-center space-x-2 text-xs uppercase tracking-widest text-[#E8D8C8]">
                  <span>Lihat Mesin</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (Editorial Magazine Style) */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">Masterpieces of Engineering</span>
          <h2 className="font-serif text-3xl md:text-5xl text-stone-900 font-normal">Mesin Espresso Unggulan</h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Setiap unit dipilih berdasarkan kestabilan termal, material premium, dan reputasi di panggung kejuaraan barista global.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredProducts.map((prod) => {
            const primaryImg = prod.images?.find((img: any) => img.isPrimary)?.url || prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=1000';
            return (
              <div
                key={prod.id}
                className="group flex flex-col bg-[#FAF7F2] border border-[#EAE6DF] hover:border-stone-400 transition-all duration-300 p-6 space-y-6"
              >
                <Link href={`/product/${prod.slug}`} className="relative h-72 w-full bg-white flex items-center justify-center overflow-hidden border border-stone-100">
                  <Image
                    src={primaryImg}
                    alt={prod.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  {prod.newArrival && (
                    <span className="absolute top-3 left-3 bg-[#B58A63] text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                      New 2026
                    </span>
                  )}
                </Link>

                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C827A] font-medium block">
                      {prod.brand?.name || 'Handcrafted in Italy'}
                    </span>
                    <Link href={`/product/${prod.slug}`}>
                      <h3 className="font-serif text-lg text-stone-900 hover:text-[#B58A63] transition-colors line-clamp-1 mt-1 font-normal">
                        {prod.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-stone-500 font-light line-clamp-2 mt-2 leading-relaxed">
                      {prod.shortDescription || prod.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Harga Investasi</span>
                      <span className="font-price text-base md:text-lg font-bold text-stone-900 tracking-tight">
                        {formatRupiah(prod.price)}
                      </span>
                    </div>

                    <Link
                      href={`/product/${prod.slug}`}
                      className="text-xs uppercase tracking-widest text-stone-800 hover:text-[#B58A63] font-medium flex items-center space-x-1"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <Link
            href="/shop"
            className="inline-block px-12 py-4 border border-stone-900 text-stone-900 text-xs tracking-[0.25em] uppercase font-medium hover:bg-stone-900 hover:text-white transition-colors"
          >
            Lihat Seluruh Koleksi Mesin
          </Link>
        </div>
      </section>

      {/* 5. EDITORIAL STORY SECTION */}
      <section className="bg-[#24211E] text-cream-50 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#B58A63] font-medium">Philosophy of Craft</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight">
              Bukan Sekadar Mesin,<br />
              <span className="italic text-[#E8D8C8]">Sebuah Mahakarya Presisi</span>
            </h2>
            <p className="text-sm font-light text-stone-300 leading-relaxed">
              Di Atelier du Café, kami percaya bahwa setiap cangkir espresso adalah hasil sinergi antara sains termal, tekanan hidrolik yang terkalibrasi, dan sentuhan jiwa sang barista.
            </p>
            <p className="text-sm font-light text-stone-300 leading-relaxed">
              Kami bermitra langsung dengan manufaktur ikonik dunia untuk menghadirkan teknologi dual boiler, digital PID terisolasi, serta rotary pump bertekanan stabil langsung ke bar Anda.
            </p>

            <div className="pt-4">
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Atelier du Café, saya ingin konsultasi pemilihan mesin untuk kafe saya.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-[#25D366] hover:bg-emerald-600 text-white text-xs tracking-widest uppercase font-bold transition-all shadow-lg group"
              >
                <div className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <WhatsAppIcon className="w-5 h-5" color="#ffffff" />
                </div>
                <span>Konsultasi Proyek Kafe via WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="relative h-[480px] bg-stone-900 border border-stone-700 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1000&auto=format&fit=crop"
              alt="Artisanal Espresso Preparation"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>
    </div>
  );
}