"use client";

import React, { useEffect, useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  UserCheck,
  Search,
  Filter,
  Edit2,
  Power,
  KeyRound,
  ShieldAlert,
  UserX
} from 'lucide-react';
import { fetchAdminApi } from '../../lib/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
    isActive: true,
    password: '',
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Delete Confirm Modal State
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminApi<{ success: boolean; data: AdminUser[] }>('auth/users');
      const data = (res as any)?.data || res;
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray((res as any)?.items)) {
        setUsers((res as any).items);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      showToast(err.message || 'Gagal memuat daftar user.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = selectedRole === 'ALL' || u.role === selectedRole;
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, selectedRole]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: users.length,
      superAdmin: users.filter((u) => u.role === 'SUPER_ADMIN').length,
      admin: users.filter((u) => u.role === 'ADMIN').length,
      sales: users.filter((u) => u.role === 'SALES').length,
      active: users.filter((u) => u.isActive !== false).length,
    };
  }, [users]);

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!createFormData.name || !createFormData.email || !createFormData.password) {
      setCreateError('Semua kolom bertanda bintang (*) wajib diisi.');
      return;
    }

    if (createFormData.password.length < 6) {
      setCreateError('Password minimal harus 6 karakter.');
      return;
    }

    setIsSubmittingCreate(true);
    try {
      const res = await fetchAdminApi<{ success: boolean; data?: any; message?: string }>('auth/register', {
        method: 'POST',
        body: JSON.stringify(createFormData),
      });

      showToast(`Akun "${createFormData.name}" (${createFormData.role}) berhasil ditambahkan!`, 'success');
      setIsModalOpen(false);
      setCreateFormData({ name: '', email: '', password: '', role: 'ADMIN' });
      fetchUsers();
    } catch (err: any) {
      setCreateError(err.message || 'Gagal menambahkan user baru.');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive !== false,
      password: '',
    });
    setEditError(null);
  };

  // Handle Update User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError(null);

    setIsSubmittingEdit(true);
    try {
      const payload: any = {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        isActive: editFormData.isActive,
      };

      if (editFormData.password && editFormData.password.trim()) {
        if (editFormData.password.length < 6) {
          setEditError('Password baru minimal 6 karakter.');
          setIsSubmittingEdit(false);
          return;
        }
        payload.password = editFormData.password.trim();
      }

      await fetchAdminApi(`auth/users/${editingUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      showToast(`Data akun "${editFormData.name}" berhasil diperbarui!`, 'success');
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setEditError(err.message || 'Gagal memperbarui user.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (user: AdminUser) => {
    if (user.email === 'admin@ateliercoffee.com') {
      showToast('Akun Primary Super Admin tidak dapat dinonaktifkan.', 'error');
      return;
    }

    const nextStatus = user.isActive === false ? true : false;
    try {
      await fetchAdminApi(`auth/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextStatus }),
      });
      showToast(`Akun "${user.name}" sekarang ${nextStatus ? 'AKTIF' : 'NONAKTIF'}.`, 'success');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status akun.', 'error');
    }
  };

  // Handle Delete User
  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      await fetchAdminApi(`auth/users/${deletingUser.id}`, { method: 'DELETE' });
      showToast(`Akun "${deletingUser.name}" berhasil dihapus.`, 'success');
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus user.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
            SUPER ADMIN
          </span>
        );
      case 'ADMIN':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
            OPERATIONAL ADMIN
          </span>
        );
      case 'SALES':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            SALES & CONCIERGE
          </span>
        );
      case 'WAREHOUSE':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
            WAREHOUSE & LOGISTICS
          </span>
        );
      case 'CUSTOMER_SERVICE':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            CUSTOMER SERVICE
          </span>
        );
      case 'CONTENT_EDITOR':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-orange-950 text-orange-300 border border-orange-800">
            CONTENT & CMS
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-2xl flex items-center space-x-3 text-xs border backdrop-blur-md ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-600 text-emerald-200'
              : 'bg-rose-950/95 border-rose-600 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
          )}
          <span className="font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Shield size={14} />
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Team & Admin User Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola hak akses tim operasional, sales concierge, logistik gudang, dan kredensial administrator Atelier du Café.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchUsers}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition"
            title="Refresh Data"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => {
              setCreateError(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg transition active:scale-95"
          >
            <UserPlus size={16} />
            <span>+ Tambah Admin / Staff Baru</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Total Akun Tim</div>
          <div className="text-2xl font-bold text-white font-mono">{stats.total}</div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
            <span>●</span>
            <span>{stats.active} Akun Aktif</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Super Admin</div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{stats.superAdmin}</div>
          <div className="text-[10px] text-slate-500">Akses level tertinggi</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Operational Admin</div>
          <div className="text-2xl font-bold text-blue-400 font-mono">{stats.admin}</div>
          <div className="text-[10px] text-slate-500">Katalog, Stok, & Orders</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Sales & Staff</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.sales}</div>
          <div className="text-[10px] text-slate-500">CRM & WhatsApp VIP</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-lg flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-400 uppercase tracking-wider hidden sm:inline">Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Role ({users.length})</option>
            <option value="SUPER_ADMIN">SUPER ADMIN</option>
            <option value="ADMIN">OPERATIONAL ADMIN</option>
            <option value="SALES">SALES & CONCIERGE</option>
            <option value="WAREHOUSE">WAREHOUSE & LOGISTICS</option>
            <option value="CUSTOMER_SERVICE">CUSTOMER SERVICE</option>
            <option value="CONTENT_EDITOR">CONTENT EDITOR</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4">Email Login</th>
                <th className="p-4">Role & Hak Akses</th>
                <th className="p-4">Status Akun</th>
                <th className="p-4">Tanggal Dibuat</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Memuat data pengguna...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Tidak ada akun yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPrimary = u.email === 'admin@ateliercoffee.com';
                  const isActive = u.isActive !== false;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                              isPrimary
                                ? 'bg-amber-950 text-amber-400 border-amber-600'
                                : 'bg-slate-800 text-slate-200 border-slate-700'
                            }`}
                          >
                            {u.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center space-x-1.5">
                              <span>{u.name}</span>
                              {isPrimary && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded uppercase font-bold">
                                  Primary
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              ID: {u.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-slate-300">
                        {u.email}
                      </td>

                      <td className="p-4">
                        {roleBadge(u.role)}
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          disabled={isPrimary}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition ${
                            isActive
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                              : 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900'
                          } ${isPrimary ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                          title={isPrimary ? 'Akun Utama selalu aktif' : 'Klik untuk mengubah status aktif/nonaktif'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                          <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>

                      <td className="p-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition"
                            title="Edit User & Role"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Delete Button */}
                          {!isPrimary ? (
                            <button
                              type="button"
                              onClick={() => setDeletingUser(u)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded transition"
                              title="Hapus Akun"
                            >
                              <Trash2 size={13} />
                            </button>
                          ) : (
                            <span className="p-1.5 text-slate-600 cursor-not-allowed" title="Primary account tidak dapat dihapus">
                              <Shield size={13} />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Tambah Akun Admin / Staff Baru</h3>
                  <p className="text-xs text-slate-400">Buat kredensial login resmi untuk tim operasional</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              {createError && (
                <div className="p-3 bg-rose-950/70 border border-rose-600 rounded-lg text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-400" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sarah Jenkins / Budi Santoso"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Email Login Resmi *
                </label>
                <input
                  type="email"
                  required
                  placeholder="staff@ateliercoffee.com"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Password Baru *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Peran & Hak Akses (Role) *
                </label>
                <select
                  value={createFormData.role}
                  onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                >
                  <option value="SUPER_ADMIN">SUPER ADMIN (Akses Penuh Seluruh Modul & Keuangan)</option>
                  <option value="ADMIN">OPERATIONAL ADMIN (Katalog, Stok & Order Dispatch)</option>
                  <option value="SALES">SALES & CONCIERGE (WhatsApp Leads & CRM)</option>
                  <option value="WAREHOUSE">WAREHOUSE & LOGISTICS (Mutasi Stok & Logistik)</option>
                  <option value="CUSTOMER_SERVICE">CUSTOMER SERVICE (Inquiries & Ulasan)</option>
                  <option value="CONTENT_EDITOR">CONTENT EDITOR (Editorial CMS & Promo)</option>
                </select>
              </div>

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
                  disabled={isSubmittingCreate}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isSubmittingCreate && <RefreshCw size={13} className="animate-spin" />}
                  <span>{isSubmittingCreate ? 'Membuat Akun...' : 'Terbitkan Akun Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                  <Edit2 size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Edit Akun Pengguna</h3>
                  <p className="text-xs text-slate-400">ID: {editingUser.id.substring(0, 8)}...</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4 text-xs">
              {editError && (
                <div className="p-3 bg-rose-950/70 border border-rose-600 rounded-lg text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-400" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Email Login Resmi *
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Reset Password Baru (Opsional)
                </label>
                <input
                  type="password"
                  minLength={6}
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Peran & Hak Akses (Role)
                </label>
                <select
                  disabled={editingUser.email === 'admin@ateliercoffee.com'}
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-amber-400 disabled:opacity-60"
                >
                  <option value="SUPER_ADMIN">SUPER ADMIN (Akses Penuh Seluruh Modul & Keuangan)</option>
                  <option value="ADMIN">OPERATIONAL ADMIN (Katalog, Stok & Order Dispatch)</option>
                  <option value="SALES">SALES & CONCIERGE (WhatsApp Leads & CRM)</option>
                  <option value="WAREHOUSE">WAREHOUSE & LOGISTICS (Mutasi Stok & Logistik)</option>
                  <option value="CUSTOMER_SERVICE">CUSTOMER SERVICE (Inquiries & Ulasan)</option>
                  <option value="CONTENT_EDITOR">CONTENT EDITOR (Editorial CMS & Promo)</option>
                </select>
                {editingUser.email === 'admin@ateliercoffee.com' && (
                  <p className="text-[10px] text-amber-500/80 mt-1">Role Akun Utama selalu Super Admin.</p>
                )}
              </div>

              {editingUser.email !== 'admin@ateliercoffee.com' && (
                <div className="pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-950 border-slate-700"
                    />
                    <span className="text-slate-200 font-medium">Akun Aktif (Dapat Login ke Dashboard)</span>
                  </label>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isSubmittingEdit && <RefreshCw size={13} className="animate-spin" />}
                  <span>{isSubmittingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/60 w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Hapus Akun Pengguna?</h3>
              <p className="text-xs text-slate-400">
                Apakah Anda yakin ingin menghapus akses akun <strong className="text-white font-semibold">"{deletingUser.name}"</strong> ({deletingUser.email})?
              </p>
              <p className="text-[11px] text-rose-400 pt-1">
                Tindakan ini tidak dapat dibatalkan. Pengguna tidak akan dapat login lagi.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteUser}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                {isDeleting && <RefreshCw size={13} className="animate-spin" />}
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Akun'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
