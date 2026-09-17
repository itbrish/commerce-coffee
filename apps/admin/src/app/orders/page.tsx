"use client";

import React, { useEffect, useState } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  RefreshCw,
  Eye,
  X,
  Package,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import { getApiUrl } from '../../lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const API_URL = typeof window !== 'undefined' ? getApiUrl() : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`);
      const json = await res.json();
      if (json?.data) {
        setOrders(Array.isArray(json.data) ? json.data : (json.data.items || []));
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatIDR = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : Number(val);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      } else {
        alert('Gagal memperbarui status pesanan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      o.orderNumber?.toLowerCase().includes(term) ||
      o.customer?.name?.toLowerCase().includes(term) ||
      o.customer?.email?.toLowerCase().includes(term) ||
      o.shippingAddress?.city?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Orders & White-Glove Dispatch</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen siklus transaksi pesanan mesin kopi, status pembayaran, dan jadwal instalasi teknisi barista.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition self-start sm:self-auto"
          title="Refresh Data"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          {['ALL', 'PENDING', 'WAITING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Cari No Order, Customer, Kota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">No. Order</th>
                <th className="p-4">Customer & Kontak</th>
                <th className="p-4">Kota Pengiriman</th>
                <th className="p-4">Item & Unit</th>
                <th className="p-4">Total Nilai (IDR)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tanggal Masuk</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ada data pesanan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-amber-400">
                      {o.orderNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{o.customer?.name || 'Customer'}</div>
                      <div className="text-[11px] text-slate-400">{o.customer?.phone || o.customer?.email}</div>
                    </td>
                    <td className="p-4 text-slate-300">
                      {o.shippingAddress?.city || 'Jakarta'}
                    </td>
                    <td className="p-4 text-slate-300">
                      {o.items?.length || 1} Mesin
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      {formatIDR(o.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          o.status === 'COMPLETED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : o.status === 'SHIPPED'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : o.status === 'PROCESSING' || o.status === 'PAID'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded transition"
                        title="Lihat Rincian Pesanan"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-amber-400 text-lg">{selectedOrder.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Tanggal: {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs overflow-y-auto max-h-[70vh]">
              {/* Customer & Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <Building size={12} className="text-amber-400" />
                    <span>Informasi Pelanggan</span>
                  </h4>
                  <p className="text-white font-medium">{selectedOrder.customer?.name}</p>
                  <p className="text-slate-400 flex items-center space-x-1"><Mail size={12} /> <span>{selectedOrder.customer?.email}</span></p>
                  <p className="text-slate-400 flex items-center space-x-1"><Phone size={12} /> <span>{selectedOrder.customer?.phone}</span></p>
                </div>

                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <MapPin size={12} className="text-amber-400" />
                    <span>Alamat Pengiriman White-Glove</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedOrder.shippingAddress?.streetAddress || '—'}
                  </p>
                  <p className="text-slate-400">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province} {selectedOrder.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">
                  Peralatan Kopi yang Dipesan
                </h4>
                <div className="border border-slate-800 rounded-lg divide-y divide-slate-800 bg-slate-950">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{item.product?.name || item.name}</p>
                        <p className="text-slate-400 text-[11px]">Qty: {item.quantity} x {formatIDR(item.unitPrice)}</p>
                      </div>
                      <div className="font-mono font-bold text-emerald-400">
                        {formatIDR(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-baseline">
                <span className="font-bold text-white uppercase tracking-wider">Total Pembayaran</span>
                <span className="font-mono font-bold text-xl text-emerald-400">{formatIDR(selectedOrder.totalAmount)}</span>
              </div>

              {/* Status Workflow Action Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Ubah Status Alur Kerja (Workflow Transition):
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'PAID')}
                    className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800 rounded font-medium"
                  >
                    Tandai Lunas (PAID)
                  </button>
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'PROCESSING')}
                    className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 rounded font-medium"
                  >
                    Proses Unit & Kalibrasi (PROCESSING)
                  </button>
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'SHIPPED')}
                    className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded font-medium"
                  >
                    Kirim Kurir Khusus (SHIPPED)
                  </button>
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'COMPLETED')}
                    className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded font-medium"
                  >
                    Selesai & Terpasang (COMPLETED)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}