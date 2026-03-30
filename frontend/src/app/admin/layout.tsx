'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/Admin/Sidebar/Sidebar';
import { LogOut, Loader2, Settings, User, Menu, X, Sun, ChevronRight } from 'lucide-react';
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
                  onClick={() => { setDropdownOpen(false); router.push('/admin/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Settings
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
    </div>
  );
}
