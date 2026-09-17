"use client";

import React, { useEffect, useState } from 'react';
import {
  PackageCheck,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Search,
  AlertTriangle,
  Boxes,
  DollarSign,
  Layers,
  X,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { getApiUrl } from '../../lib/api';

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Adjustment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [adjustmentAction, setAdjustmentAction] = useState<'ADD' | 'SUBTRACT'>('ADD');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const API_URL = typeof window !== 'undefined' ? getApiUrl() : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, movRes] = await Promise.all([
        fetch(`${API_URL}/products?limit=100`),
        fetch(`${API_URL}/inventory/movements`),
      ]);

      const prodData = await prodRes.json();
      const movData = await movRes.json();

      if (prodData?.data) {
        setProducts(Array.isArray(prodData.data) ? prodData.data : (prodData.data.items || []));
      }
      if (movData?.data) {
        setMovements(Array.isArray(movData.data) ? movData.data : []);
      }
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAdjustment = (productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    } else if (products.length > 0) {
      setSelectedProductId(products[0].id);
    }
    setQuantity(1);
    setAdjustmentAction('ADD');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;

    try {
      setIsSubmitting(true);
      const deltaQty = adjustmentAction === 'ADD' ? Number(quantity) : -Number(quantity);

      const res = await fetch(`${API_URL}/inventory/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          adjustmentQty: deltaQty,
          notes: notes || `Manual adjustment (${adjustmentAction === 'ADD' ? 'Restock' : 'Reduction'})`,
        }),
      });

      if (res.ok) {
        showToast('Penyesuaian stok berhasil disimpan ke buku besar (audit trail).');
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Gagal melakukan penyesuaian stok.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat penyesuaian stok.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatIDR = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : Number(val);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  // Metrics
  const totalUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const totalValuation = products.reduce((sum, p) => sum + (Number(p.price) * (Number(p.stock) || 0)), 0);
  const lowStockCount = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5).length;
  const outOfStockCount = products.filter((p) => Number(p.stock) <= 0).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term) ||
      p.brand?.name?.toLowerCase().includes(term)
    );
  });

  // Filtered Movements
  const filteredMovements = movements.filter((m) => {
    const matchesType = typeFilter === 'ALL' || m.type === typeFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      m.product?.name?.toLowerCase().includes(term) ||
      m.product?.sku?.toLowerCase().includes(term) ||
      m.notes?.toLowerCase().includes(term);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-600 text-emerald-300 px-4 py-3 rounded-lg shadow-xl flex items-center space-x-3 text-xs animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Warehouse Inventory & Stock Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit trail pergerakan stok mesin espresso, level ketersediaan warehouse, dan rekonsiliasi manual.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition"
            title="Refresh Data"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => handleOpenAdjustment()}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition"
          >
            <Plus size={16} />
            <span>Manual Stock Adjustment</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Units in Stock</span>
            <Boxes size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalUnits} <span className="text-xs font-normal text-slate-400">Unit</span></div>
          <div className="text-[11px] text-slate-500">Tersedia di warehouse utama</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active SKUs</span>
            <Layers size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{products.length} <span className="text-xs font-normal text-slate-400">Model</span></div>
          <div className="text-[11px] text-slate-500">Mesin & precision equipment</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Low Stock Alert</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            {lowStockCount + outOfStockCount} <span className="text-xs font-normal text-slate-400">SKU</span>
          </div>
          <div className="text-[11px] text-rose-400/80">
            {outOfStockCount > 0 ? `${outOfStockCount} Habis, ${lowStockCount} Menipis (<5)` : `${lowStockCount} unit menipis`}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Inventory Value</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono truncate">{formatIDR(totalValuation)}</div>
          <div className="text-[11px] text-slate-500">Estimasi nilai retail gudang</div>
        </div>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Toggle */}
        <div className="flex space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === 'stock'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Level Stok per Mesin ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === 'movements'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buku Besar Mutasi / Audit Trail ({movements.length})
          </button>
        </div>

        {/* Search & Movement Filters */}
        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Cari SKU atau nama mesin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          </div>

          {activeTab === 'movements' && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              <option value="ALL">Semua Jenis Mutasi</option>
              <option value="PURCHASE">PURCHASE (Masuk)</option>
              <option value="SALE">SALE (Keluar)</option>
              <option value="RESERVATION">RESERVATION (Pesanan)</option>
              <option value="ADJUSTMENT">ADJUSTMENT (Manual)</option>
            </select>
          )}
        </div>
      </div>

      {/* TAB 1: STOCK BY PRODUCT */}
      {activeTab === 'stock' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">SKU & Model Mesin</th>
                  <th className="p-4">Brand / Manufaktur</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga Retail (IDR)</th>
                  <th className="p-4">Stok Saat Ini</th>
                  <th className="p-4">Status Ketersediaan</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Tidak ada data mesin kopi yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const stockNum = Number(p.stock) || 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <span className="font-mono font-bold text-amber-400">{p.sku}</span>
                          <div className="font-semibold text-white mt-0.5">{p.name}</div>
                        </td>
                        <td className="p-4 text-slate-300">{p.brand?.name || '—'}</td>
                        <td className="p-4 text-slate-400">{p.category?.name || 'Espresso Machine'}</td>
                        <td className="p-4 font-mono text-slate-300">{formatIDR(p.price)}</td>
                        <td className="p-4 font-mono font-bold text-base text-white">
                          {stockNum} <span className="text-xs text-slate-400 font-normal">unit</span>
                        </td>
                        <td className="p-4">
                          {stockNum === 0 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              OUT OF STOCK
                            </span>
                          ) : stockNum <= 5 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                              LOW STOCK ({stockNum})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              READY STOCK
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenAdjustment(p.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-medium rounded text-[11px] transition"
                          >
                            Sesuaikan Stok
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
      )}

      {/* TAB 2: AUDIT TRAIL / MOVEMENTS LEDGER */}
      {activeTab === 'movements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Waktu (WIB)</th>
                  <th className="p-4">SKU & Mesin</th>
                  <th className="p-4">Jenis Mutasi</th>
                  <th className="p-4">Perubahan Qty</th>
                  <th className="p-4">Saldo Akhir</th>
                  <th className="p-4">Catatan / Referensi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Belum ada riwayat mutasi stok tercatat.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 text-slate-400 font-mono">
                        {new Date(m.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-white">{m.product?.sku || 'SKU-001'}</span>
                        <div className="text-[11px] text-slate-400">{m.product?.name}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            m.type === 'PURCHASE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : m.type === 'RESERVATION'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : m.type === 'SALE'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-purple-950 text-purple-300 border border-purple-800'
                          }`}
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold">
                        <span className={m.quantity >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {m.quantity >= 0 ? `+${m.quantity}` : m.quantity}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">{m.balanceAfter} unit</td>
                      <td className="p-4 text-slate-400">{m.notes || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL STOCK ADJUSTMENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  ±
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Penyesuaian Stok Warehouse</h3>
                  <p className="text-xs text-slate-400">Pembaruan saldo stok dan pencatatan audit trail</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitAdjustment} className="p-6 space-y-5 text-xs">
              {/* Product Selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Pilih Mesin / Produk *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.sku}] {p.name} — Stok Saat Ini: {p.stock} Unit
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Type */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Tipe Penyesuaian *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustmentAction('ADD')}
                    className={`py-3 px-4 rounded-lg border font-bold flex items-center justify-center space-x-2 transition ${
                      adjustmentAction === 'ADD'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ArrowUpRight size={16} className="text-emerald-400" />
                    <span>Tambah Stok (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentAction('SUBTRACT')}
                    className={`py-3 px-4 rounded-lg border font-bold flex items-center justify-center space-x-2 transition ${
                      adjustmentAction === 'SUBTRACT'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ArrowDownRight size={16} className="text-rose-400" />
                    <span>Kurangi Stok (-)</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Jumlah Unit (Qty) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-base rounded-lg p-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Reason / Reference */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Alasan / Referensi Dokumen *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Penerimaan kontainer pabrik Italia / Unit demo showroom / Stock opname Q1"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400 placeholder-slate-600"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Penyesuaian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}