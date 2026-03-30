'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap,
  MessageSquare,
  ShieldCheck,
  LayoutGrid,
  Image,
  Mail,
  Sun
} from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export interface SubMenuItem {
  title: string;
  href: string;
}

export interface NavigationItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  subItems?: SubMenuItem[];
  badge?: number;
}

const navigation: NavigationItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { title: 'Services', icon: LayoutGrid, href: '/admin/services' },
  { title: 'Bank Partners', icon: ShieldCheck, href: '/admin/bank-partners' },
  { title: 'Portfolio', icon: Image, href: '/admin/portfolio' },
  { title: 'Consultations', icon: MessageSquare, href: '/admin/consultations' },
  { title: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function Sidebar({
  isOpen,
  onClose,
  badges = {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
  badges?: Record<string, number>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isMainItemActive = useCallback((href: string) => {
    if (href === '/admin/dashboard') return pathname === href;
    if (href === '/admin/settings/general') return pathname === href || pathname.startsWith('/admin/settings/general');
    if (href === '/admin/settings/seo') return pathname === href || pathname.startsWith('/admin/settings/seo');
    return pathname.startsWith(href);
  }, [pathname]);

  const isSubItemActive = useCallback((href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  }, [pathname]);

  const hasAnyActiveChild = useCallback((subItems: SubMenuItem[]) => {
    return subItems.some(sub => isSubItemActive(sub.href));
  }, [isSubItemActive]);

  useEffect(() => {
    const activeParents = navigation
      .filter(item => item.subItems && hasAnyActiveChild(item.subItems))
      .map(item => item.title);

    if (activeParents.length > 0) {
      setExpandedItems(prev => [...new Set([...prev, ...activeParents])]);
    }
  }, [pathname, hasAnyActiveChild]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Badge mapping for nav items
  const getBadge = (title: string) => {
    if (title === 'Consultations') return badges.consultations || 0;
    if (title === 'Enquiries') return badges.contacts || 0;
    return 0;
  };

  const totalPending = (badges.consultations || 0) + (badges.contacts || 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 bg-[#0c1117] border-r border-white/5 h-screen flex flex-col shrink-0 overflow-hidden z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Branding Header */}
        <div className="px-6 py-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white uppercase leading-none font-display">
                SOLAR<span className="text-amber-500">POWER</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/30 mt-0.5">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Quick Stats Bar */}
        {totalPending > 0 && (
          <div className="mx-3 mt-4 px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-amber-400">
                {totalPending} pending action{totalPending > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 px-3 py-5 overflow-y-auto dark-scrollbar">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3">Navigation</p>
          <nav className="space-y-0.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const badge = getBadge(item.title);

              if (item.href) {
                const isActive = isMainItemActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-amber-500/10 text-white"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                      isActive ? "text-amber-500" : "text-white/25 group-hover:text-white/50"
                    )} />
                    <span className="text-[13px] font-semibold flex-1">{item.title}</span>
                    {badge > 0 && (
                      <span className="min-w-[20px] h-5 flex items-center justify-center px-1.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                        {badge}
                      </span>
                    )}
                    {isActive && !badge && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </Link>
                );
              }

              const isExpanded = expandedItems.includes(item.title);
              const parentHasActiveChild = item.subItems ? hasAnyActiveChild(item.subItems) : false;

              return (
                <div key={item.title} className="space-y-0.5">
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      parentHasActiveChild
                        ? "bg-white/5 text-white"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                        parentHasActiveChild ? "text-amber-400" : "text-white/25 group-hover:text-white/50"
                      )} />
                      <span className="text-[13px] font-semibold">{item.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-white/20" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-white/20" />
                    )}
                  </button>

                  {isExpanded && item.subItems && (
                    <div className="ml-5 pl-3 border-l border-white/5 space-y-0.5">
                      {item.subItems.map((subItem) => {
                        const subItemIsActive = isSubItemActive(subItem.href);

                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center px-3 py-2 text-[12px] rounded-lg transition-all duration-200",
                              subItemIsActive
                                ? "text-amber-500 font-bold bg-amber-500/5"
                                : "text-white/30 hover:text-white/60 hover:bg-white/5"
                            )}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer - Logout */}
        <div className="px-3 pb-4 pt-2 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0 group-hover:text-red-400 transition-colors" />
            <span className="text-[13px] font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
