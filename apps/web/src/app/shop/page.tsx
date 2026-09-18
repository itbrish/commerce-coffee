import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Filter, X } from 'lucide-react';
import { fetchApi } from '../../lib/api';

async function getProducts(searchParams: { category?: string; brand?: string; search?: string }) {
  try {
    const query = new URLSearchParams();
    if (searchParams.category) query.append('category', searchParams.category);
    if (searchParams.brand) query.append('brand', searchParams.brand);
    if (searchParams.search) query.append('search', searchParams.search);
    query.append('limit', '50');

    const res = await fetchApi<{ success: boolean; data: any }>(`products?${query.toString()}`);
    if (Array.isArray(res.data)) {
      return { items: res.data, total: res.data.length };
    }
    if (res.data && Array.isArray(res.data.items)) {
      return { items: res.data.items, total: res.data.total || res.data.items.length };
    }
    return { items: [], total: 0 };
  } catch (err) {
    console.error('Error fetching products:', err);
    return { items: [], total: 0 };
  }
}

async function getFilters() {
  try {
    const [catRes, brandRes] = await Promise.all([
      fetchApi<{ success: boolean; data: any[] }>('categories'),
      fetchApi<{ success: boolean; data: any[] }>('brands'),
    ]);
    return {
      categories: Array.isArray(catRes.data) ? catRes.data : [],
      brands: Array.isArray(brandRes.data) ? brandRes.data : [],
    };
  } catch (err) {
    console.error('Error fetching filters:', err);
    return { categories: [], brands: [] };
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; brand?: string; search?: string };
}) {
  const [data, filters] = await Promise.all([
    getProducts(searchParams),
    getFilters(),
  ]);

  const formatRupiah = (num: any) => {
    const val = typeof num === 'string' ? parseFloat(num) : Number(num);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const activeFiltersCount = [searchParams.category, searchParams.brand, searchParams.search].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6 sm:pb-8 space-y-2 sm:space-y-3">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#8C827A] font-semibold">
          Curated Catalog 2026
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-stone-900 font-normal">
          Koleksi Mesin & Peralatan Kopi
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light max-w-2xl">
          Menampilkan {data.total} instrumen ekstraksi kopi artisanal dari brand legendaris dunia.
        </p>
      </div>

      {/* MOBILE HORIZONTAL FILTER CHIPS (Quick scrollable pill tags for Android & iPhone) */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-[#B58A63]" />
            <span>Filter Cepat Kategori:</span>
          </span>
          {activeFiltersCount > 0 && (
            <Link
              href="/shop"
              className="text-[11px] text-red-700 uppercase tracking-wider underline flex items-center space-x-1 font-medium"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none no-scrollbar">
          <Link
            href="/shop"
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
              !searchParams.category
                ? 'bg-stone-900 text-cream-50 border-stone-900 shadow-sm'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
            }`}
          >
            Semua
          </Link>
          {filters.categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}${searchParams.brand ? `&brand=${searchParams.brand}` : ''}`}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                searchParams.category === c.slug
                  ? 'bg-[#B58A63] text-white border-[#B58A63] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Left Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-8">
          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
              Kategori
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/shop"
                className={`block py-1 transition-colors ${!searchParams.category ? 'font-bold text-[#B58A63]' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Semua Kategori
              </Link>
              {filters.categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}${searchParams.brand ? `&brand=${searchParams.brand}` : ''}`}
                  className={`block py-1 transition-colors ${searchParams.category === c.slug ? 'font-bold text-[#B58A63]' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
              Manufaktur & Brand
            </h3>
            <div className="space-y-2 text-xs">
              {filters.brands.map((b) => (
                <Link
                  key={b.id}
                  href={`/shop?brand=${b.slug}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                  className={`block py-1 transition-colors ${searchParams.brand === b.slug ? 'font-bold text-[#B58A63]' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Active Filter Clear */}
          {activeFiltersCount > 0 && (
            <div className="pt-4">
              <Link
                href="/shop"
                className="text-xs tracking-widest uppercase text-red-700 underline block"
              >
                Reset Semua Filter
              </Link>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {data.items.length === 0 ? (
            <div className="text-center py-20 sm:py-24 space-y-4 border border-stone-200 p-6 sm:p-8 bg-[#FAF6ED]">
              <p className="font-serif text-base sm:text-lg text-stone-700">Tidak ada mesin kopi yang sesuai dengan filter Anda.</p>
              <p className="text-xs text-stone-500 font-light">Coba ubah kata kunci pencarian atau reset filter.</p>
              <Link href="/shop" className="inline-block mt-4 text-xs uppercase tracking-widest underline text-stone-900 font-medium">
                Lihat Seluruh Mesin
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {data.items.map((prod) => {
                const primaryImg = prod.images?.find((img: any) => img.isPrimary)?.url || prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=1000';
                return (
                  <div
                    key={prod.id}
                    className="group bg-[#FAF7F2] border border-[#EAE6DF] hover:border-stone-400 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between"
                  >
                    <div>
                      <Link href={`/product/${prod.slug}`} className="relative h-56 sm:h-60 w-full bg-white flex items-center justify-center overflow-hidden border border-stone-100 block">
                        <Image
                          src={primaryImg}
                          alt={prod.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                        {prod.stock === 0 && (
                          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-white text-xs uppercase tracking-widest font-semibold">
                            Pre-Order Only
                          </div>
                        )}
                      </Link>

                      <div className="mt-4 space-y-1.5 sm:space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#8C827A] font-medium block">
                          {prod.brand?.name || 'Artisanal'}
                        </span>
                        <Link href={`/product/${prod.slug}`}>
                          <h3 className="font-serif text-sm sm:text-base text-stone-900 hover:text-[#B58A63] transition-colors font-medium line-clamp-1">
                            {prod.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed">
                          {prod.shortDescription || prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-stone-200 flex items-baseline justify-between">
                      <div>
                        <span className="font-price text-sm sm:text-base font-bold text-stone-900 tracking-tight">
                          {formatRupiah(prod.price)}
                        </span>
                      </div>
                      <Link
                        href={`/product/${prod.slug}`}
                        className="text-xs uppercase tracking-widest text-stone-800 hover:text-[#B58A63] font-medium flex items-center space-x-1"
                      >
                        <span>Lihat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}