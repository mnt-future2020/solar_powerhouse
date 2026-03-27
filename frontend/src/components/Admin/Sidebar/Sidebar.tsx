'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Zap, 
  MessageSquare,
  ShieldCheck,
  LayoutGrid,
  Bell,
  SearchCheck,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SubMenuItem {
  title: string;
  href: string;
}

export interface NavigationItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  subItems?: SubMenuItem[];
}

const navigation: NavigationItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { title: 'Services', icon: LayoutGrid, href: '/admin/services' },
  { title: 'Bank Partners', icon: ShieldCheck, href: '/admin/bank-partners' },
  { title: 'Consultations', icon: MessageSquare, href: '/admin/consultations' },
  { title: 'Settings', icon: Settings, href: '/admin/settings/general' },
  { title: 'SEO Config', icon: SearchCheck, href: '/admin/settings/seo' },
  { title: 'Social Links', icon: Share2, href: '/admin/settings/social' },
];

export default function Sidebar() {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <aside className="w-72 bg-slate-950 border-r border-white/5 min-h-screen flex flex-col relative z-50">
      {/* Branding Header */}
      <div className="p-8 border-b border-white/5">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="bg-linear-to-br from-solar-amber to-solar-orange p-2 rounded-xl shadow-lg shadow-solar-amber/20 group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white uppercase leading-none">
              SOLAR<span className="text-gradient-solar">POWER</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-solar-teal mt-1">Admin Portal</span>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Main Navigation</h3>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              if (item.href) {
                const isActive = isMainItemActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                      isActive 
                        ? "bg-white text-slate-950 shadow-xl shadow-white/5" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-solar-orange" : "text-slate-500 group-hover:text-solar-amber"
                    )} />
                    <span className="font-bold text-sm tracking-tight">{item.title}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-solar-orange animate-pulse" />
                    )}
                  </Link>
                );
              }

              const isExpanded = expandedItems.includes(item.title);
              const parentHasActiveChild = item.subItems ? hasAnyActiveChild(item.subItems) : false;

              return (
                <div key={item.title} className="space-y-1">
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                      parentHasActiveChild
                        ? "bg-white/5 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                        parentHasActiveChild ? "text-solar-amber" : "text-slate-500 group-hover:text-solar-amber"
                      )} />
                      <span className="font-bold text-sm tracking-tight">{item.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    )}
                  </button>

                  {isExpanded && item.subItems && (
                    <div className="mt-1 ml-4 pl-4 border-l border-white/5 space-y-1">
                      {item.subItems.map((subItem) => {
                        const subItemIsActive = isSubItemActive(subItem.href);
                        
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center px-4 py-2.5 text-xs rounded-xl transition-all duration-300",
                              subItemIsActive
                                ? "text-solar-amber font-black bg-solar-amber/5"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
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

        {/* Security / System Stats */}
        <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-solar-teal/10 p-2 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-solar-teal" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">System Secure</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Your session is protected by end-to-end encryption.</p>
        </div>
      </div>

      {/* Footer / Account */}
      <div className="p-6 border-t border-white/5">
        <Button 
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 group h-12 rounded-2xl border border-transparent transition-all"
        >
          <LogOut className="h-5 w-5 mr-3 text-slate-500 group-hover:text-red-500 transition-colors" />
          <span className="font-bold text-sm">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}

