'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import {
  LayoutDashboard,
  Coffee,
  PackageCheck,
  ShoppingCart,
  MessageSquare,
  LayoutTemplate,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, login, logout } = useAuth();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Email atau password salah.');
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@ateliercoffee.com');
    setPassword('admin12345');
    setErrorMessage(null);
  };

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 p-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono tracking-wider uppercase text-center">
          Memeriksa Sesi Otoritas...
        </p>
      </div>
    );
  }

  // 2. UNATHENTICATED STATE: LUXURY EXECUTIVE LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-60 sm:w-72 h-60 sm:h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-5 sm:space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold text-xl sm:text-2xl shadow-xl shadow-amber-500/20 mb-1 sm:mb-2">
              A
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-widest uppercase text-white">
              ATELIER DU CAFÉ
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-400/90 font-mono uppercase tracking-wider">
              Executive Operations Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-5 sm:space-y-6">
            <div className="border-b border-slate-800 pb-3 sm:pb-4">
              <h2 className="text-sm sm:text-base font-semibold text-white">Autentikasi Akses Internal</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Masukkan kredensial resmi untuk mengelola katalog, order, dan inventaris.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-lg text-rose-300 text-xs flex items-start space-x-2.5 animate-fadeIn">
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Akun Admin
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="nama@ateliercoffee.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white p-1 focus:outline-none"
                    title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Ingat sesi perangkat</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Otoritas...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Masuk ke Control Panel</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Helper */}
            <div className="pt-2 border-t border-slate-800 text-center space-y-2">
              <span className="text-[11px] text-slate-400 block">
                Ingin login cepat dengan akun Super Admin default?
              </span>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-mono border border-slate-700 transition"
              >
                <Sparkles size={13} />
                <span>Isi: admin@ateliercoffee.com</span>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] sm:text-[11px] text-slate-400 space-y-1">
            <p>Atelier du Café Indonesia • Protected Enterprise Infrastructure</p>
            <p className="text-[10px] text-slate-400">
              Akses khusus staff yang memiliki wewenang operasional.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. AUTHENTICATED STATE: FULL OPERATIONS PORTAL
  const navItems = [
    { href: '/', label: 'Executive Overview', icon: LayoutDashboard, color: 'text-amber-400' },
    { href: '/products', label: 'Product Catalog', icon: Coffee, color: 'text-amber-400' },
    { href: '/inventory', label: 'Stock & Movements', icon: PackageCheck, color: 'text-amber-400' },
    { href: '/orders', label: 'Orders & Fulfillment', icon: ShoppingCart, color: 'text-amber-400' },
    { href: '/whatsapp-leads', label: 'WhatsApp Leads', icon: MessageSquare, color: 'text-emerald-400' },
    { href: '/users', label: 'Team & Admins', icon: Users, color: 'text-purple-400' },
    { href: '/cms', label: 'Homepage CMS', icon: LayoutTemplate, color: 'text-blue-400' },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col md:flex-row font-sans w-full overflow-x-hidden">
      {/* Mobile Top Header */}
      <header className="md:hidden h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg active:bg-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
              A
            </div>
            <span className="font-bold text-xs uppercase text-white tracking-wider">Atelier Admin</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-[11px] text-slate-400 hover:text-rose-400 px-2.5 py-1 rounded border border-slate-700 active:bg-slate-800 transition"
        >
          Logout
        </button>
      </header>

      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 animate-fadeIn"
        />
      )}

      {/* Sidebar (Drawer on mobile, Fixed side column on desktop) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out md:transform-none ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-bold text-slate-950">
                A
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wider uppercase text-white">Atelier Admin</h1>
                <p className="text-[10px] text-slate-400">Operations Control</p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg active:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1.5 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded transition ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold border-l-2 border-amber-400'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <Icon size={16} className={item.color} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="font-semibold text-white text-xs truncate">
                {user.name || 'Administrator'}
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase text-amber-400">
                  {user.role || 'ADMIN'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Keluar / Logout"
              className="p-2 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
            >
              <LogOut size={15} />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-400">Storefront:</span>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>Buka Toko</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 px-8 items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span>Server:</span>
            <span className="text-amber-400 font-mono">Ready & Authenticated</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              ● API Live
            </span>
            <div className="text-slate-400 text-xs hidden lg:block">
              Masuk sebagai <strong className="text-white">{user.email}</strong>
            </div>
            <button
              onClick={logout}
              className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1 rounded border border-slate-700 hover:border-rose-800 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
