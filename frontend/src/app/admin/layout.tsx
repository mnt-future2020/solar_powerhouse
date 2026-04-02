'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/Admin/Sidebar/Sidebar';
import { LogOut, Loader2, Settings, User, Menu, X, Sun, ChevronRight, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/* ── breadcrumb map ── */
const breadcrumbLabels: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  services: 'Services',
  'bank-partners': 'Bank Partners',
  portfolio: 'Portfolio',
  consultations: 'Consultations',
  contacts: 'Contacts',
  'legal-pages': 'Legal Pages',
  settings: 'Settings',
  general: 'General',
  seo: 'SEO',
  social: 'Social Links',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logo, setLogo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get('/auth/me');
        if (res.data?.user?.role !== 'admin') {
          router.push('/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Fetch settings + badge counts
  useEffect(() => {
    axios.get('/settings').then(r => {
      setLogo(r.data?.logo || '');
      setCompanyName(r.data?.companyName || '');
    }).catch(() => {});

    // Fetch new consultation counts for badges
    const fetchBadges = async () => {
      try {
        const conRes = await axios.get('/consultations', { params: { status: 'new', limit: 1 } });
        const conCount = Array.isArray(conRes.data) ? conRes.data.filter((c: any) => c.status === 'new').length : conRes.data.total || 0;
        setBadges({ consultations: conCount });
      } catch {}
    };
    fetchBadges();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: breadcrumbLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  })).slice(1); // skip 'admin'

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb] gap-3">
        <Sun className="h-6 w-6 animate-spin text-amber-500" />
        <span className="text-sm text-gray-400">Loading admin panel...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen min-h-screen bg-[#f8f9fb] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} badges={badges} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="h-14 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          {/* Left side — hamburger + breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link href="/admin/dashboard" className="text-gray-400 hover:text-amber-600 transition-colors">
                Admin
              </Link>
              {breadcrumbs.map((crumb) => (
                <div key={crumb.href} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-gray-300" />
                  {crumb.isLast ? (
                    <span className="font-semibold text-slate-800">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-gray-400 hover:text-amber-600 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right side — Admin profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 group py-1"
            >
              <div className="hidden sm:flex flex-col items-end shrink-0">
                <span className="text-sm font-bold text-gray-900 leading-none font-display">Admin</span>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">Manager</span>
              </div>
              <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm shadow-amber-500/20">
                {logo ? (
                  <Image src={logo} alt="Admin" fill className="object-cover" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {companyName && (
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-800">{companyName}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Admin Panel</p>
                  </div>
                )}
                <button
                  onClick={() => { setDropdownOpen(false); window.open('/', '_blank'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Globe className="h-4 w-4 text-gray-400" />
                  Website
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); router.push('/admin/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Settings
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); setShowPasswordModal(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Lock className="h-4 w-4 text-gray-400" />
                  Change Password
                </button>
                <div className="border-t border-gray-100" />
                <button
                  onClick={async () => { setDropdownOpen(false); await logout(); router.push('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 bg-[#f8f9fb]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

// ── Change Password Modal ──
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      toast({ title: 'Error', description: 'New password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    try {
      setSaving(true);
      await axios.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast({ title: 'Success', description: 'Password changed successfully' });
      onClose();
    } catch (error: any) {
      toast({ title: 'Failed', description: error.response?.data?.message || 'Could not change password', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 pr-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0a0a0a]/60" />
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <Lock className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
            <p className="text-xs text-gray-400">Update your admin account password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={form.currentPassword}
                onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                className={inputCls} placeholder="Enter current password" required />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={form.newPassword}
                onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                className={inputCls} placeholder="At least 6 characters" required minLength={6} />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className={inputCls} placeholder="Re-enter new password" required />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {saving ? 'Changing...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
