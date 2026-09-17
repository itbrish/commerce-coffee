"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Upload,
  Layers,
  FolderOpen
} from 'lucide-react';
import { getApiUrl } from '../../lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    brandId: '',
    categoryId: '',
    price: '',
    stock: 5,
    shortDescription: '',
    description: '',
    boilerType: 'Dual Boiler',
    pumpType: 'Rotary Vane',
    powerWatts: 1600,
    voltage: '220-240V',
    featured: false,
    bestseller: false,
    newArrival: false,
  });

  // Images in modal
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = typeof window !== 'undefined' ? getApiUrl() : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetch(`${API_URL}/products?limit=100&search=${encodeURIComponent(search)}`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/brands`),
      ]);

      const prodJson = await prodRes.json();
      const catJson = await catRes.json();
      const brandJson = await brandRes.json();

      if (prodJson?.data) {
        setProducts(Array.isArray(prodJson.data) ? prodJson.data : (prodJson.data.items || []));
      }
      if (catJson?.data) {
        setCategories(Array.isArray(catJson.data) ? catJson.data : []);
      }
      if (brandJson?.data) {
        setBrands(Array.isArray(brandJson.data) ? brandJson.data : []);
      }
    } catch (err) {
      console.error('Error fetching catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const formatIDR = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : Number(val);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: '',
      brandId: brands[0]?.id || '',
      categoryId: categories[0]?.id || '',
      price: '',
      stock: 5,
      shortDescription: '',
      description: '',
      boilerType: 'Dual Boiler',
      pumpType: 'Rotary Vane',
      powerWatts: 1600,
      voltage: '220-240V',
      featured: false,
      bestseller: false,
      newArrival: true,
    });
    setImageUrls(['https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80']);
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      brandId: product.brandId || product.brand?.id || '',
      categoryId: product.categoryId || product.category?.id || '',
      price: String(product.price || ''),
      stock: Number(product.stock) || 0,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      boilerType: product.boilerType || '',
      pumpType: product.pumpType || '',
      powerWatts: product.powerWatts || 1600,
      voltage: product.voltage || '220-240V',
      featured: product.featured || false,
      bestseller: product.bestseller || false,
      newArrival: product.newArrival || false,
    });

    const existingImages = product.images?.map((img: any) => img.url) || [];
    setImageUrls(existingImages.length > 0 ? existingImages : ['https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80']);
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  // Upload file from computer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const reader = new FileReader();

      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64,
          }),
        });

        const json = await res.json();
        if (json.success && json.data?.url) {
          setImageUrls((prev) => [json.data.url, ...prev]);
          showToast(`File ${file.name} berhasil di-upload dan dijadikan Cover!`);
        } else {
          alert('Gagal mengupload file gambar.');
        }
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat upload.');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, idx) => idx !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const target = imageUrls[index];
    const remaining = imageUrls.filter((_, idx) => idx !== index);
    setImageUrls([target, ...remaining]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      powerWatts: Number(formData.powerWatts) || 0,
      stock: Number(formData.stock) || 0,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      images: imageUrls.map((url, idx) => ({
        url,
        isPrimary: idx === 0,
        order: idx,
        altText: `${formData.name} photo ${idx + 1}`,
      })),
    };

    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingProduct ? 'Produk & foto berhasil diperbarui di katalog!' : 'Produk baru berhasil ditambahkan!');
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Gagal menyimpan produk.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}" dari katalog?`)) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Produk "${name}" telah dihapus.`);
        fetchData();
      }
    } catch (err) {
      alert('Gagal menghapus produk.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-600 text-emerald-300 px-4 py-3 rounded-lg shadow-xl flex items-center space-x-3 text-xs animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Product Catalog & Gallery Orchestration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola katalog mesin espresso mewah, upload foto langsung dari komputer, atur spesifikasi teknis dan harga.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tambah Mesin / Produk Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center justify-between">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Cari berdasarkan SKU, Model Mesin, atau Brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
        </div>

        <button
          onClick={fetchData}
          className="p-2 text-slate-400 hover:text-white transition"
          title="Refresh table"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Foto Utama & SKU</th>
                <th className="p-4">Nama Model Mesin</th>
                <th className="p-4">Brand Manufaktur</th>
                <th className="p-4">Sistem Boiler & Pompa</th>
                <th className="p-4">Harga Retail (IDR)</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Galeri</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=200&q=80';
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 flex items-center space-x-3">
                        <div className="relative w-12 h-12 bg-white rounded border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                          <img
                            src={primaryImg}
                            alt={p.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <span className="font-mono font-bold text-amber-400">{p.sku}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.category?.name}</div>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{p.brand?.name || '—'}</td>
                      <td className="p-4 text-slate-400">
                        <div>{p.boilerType || 'Dual Boiler'}</div>
                        <div className="text-[10px] text-slate-500">{p.pumpType || 'Rotary Vane'}</div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-emerald-400">
                        {formatIDR(p.price)}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-200">
                        {p.stock} <span className="text-[10px] font-normal text-slate-500">unit</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {p.images?.length || 0} Foto
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded font-medium text-[11px] inline-flex items-center space-x-1"
                          title="Edit Produk & Foto"
                        >
                          <Edit2 size={12} />
                          <span>Edit & Foto</span>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded"
                          title="Hapus Produk"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE / EDIT PRODUCT & PHOTO GALLERY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  {editingProduct ? '✎' : '+'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {editingProduct ? `Edit Katalog: ${editingProduct.name}` : 'Tambah Mesin Espresso Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">Atur informasi produk, upload foto langsung dari komputer, dan atur sampul utama</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs overflow-y-auto flex-1">
              {/* SECTION 1: PHOTO GALLERY MANAGEMENT WITH DIRECT FILE UPLOAD */}
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-2">
                    <ImageIcon size={14} className="text-amber-400" />
                    <span>Galeri Foto Produk ({imageUrls.length} Foto)</span>
                  </h4>

                  {/* Hidden Real File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shadow"
                  >
                    <Upload size={14} />
                    <span>{isUploading ? 'Mengupload...' : '📁 Upload Foto dari Komputer'}</span>
                  </button>
                </div>

                {/* Photo Grid Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative group bg-white rounded-lg border overflow-hidden p-2 flex flex-col items-center justify-center ${
                        idx === 0 ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-slate-700'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Photo ${idx + 1}`}
                        className="h-24 w-full object-contain"
                      />

                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          COVER UTAMA
                        </span>
                      )}

                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 p-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px] w-full"
                          >
                            Jadikan Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[10px] w-full"
                        >
                          Hapus Foto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Add Existing Local File Option */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Atau masukkan path/URL (contoh: /uploads/Altea-Anniversario-Wood_LD.jpg)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg whitespace-nowrap transition"
                    >
                      + Tambah URL
                    </button>
                  </div>

                  {/* Suggestion for uploaded Altea photo */}
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <FolderOpen size={13} className="text-amber-400" />
                    <span>File di folder lokal: </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrls(['/uploads/Altea-Anniversario-Wood_LD.jpg', ...imageUrls]);
                        showToast('Foto Altea Anniversario Wood ditambahkan sebagai Cover!');
                      }}
                      className="text-amber-400 underline hover:text-amber-300 font-mono"
                    >
                      /uploads/Altea-Anniversario-Wood_LD.jpg
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BASIC INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Nama Model Mesin *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Kode SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white font-mono rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Brand / Manufaktur *</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name} ({b.country || 'Italy'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Kategori *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Harga Retail Resmi (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-emerald-400 font-mono text-base font-bold rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Stok Awal di Warehouse *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-base rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* SECTION 3: TECHNICAL SPECS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Tipe Boiler</label>
                  <input
                    type="text"
                    value={formData.boilerType}
                    onChange={(e) => setFormData({ ...formData, boilerType: e.target.value })}
                    placeholder="Dual Boiler / Heat Exchanger / Multi-Boiler"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Tipe Pompa</label>
                  <input
                    type="text"
                    value={formData.pumpType}
                    onChange={(e) => setFormData({ ...formData, pumpType: e.target.value })}
                    placeholder="Rotary Vane Pump / Vibratory"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* SECTION 4: DESCRIPTIONS */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Deskripsi Singkat (Tagline)</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">Deskripsi Lengkap Mesin</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : editingProduct ? 'Perbarui Produk & Foto' : 'Terbitkan Produk Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}