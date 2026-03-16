'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Mail, LogOut, Settings, ChevronDown, ChevronRight, Globe, Building, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect } from 'react';

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
  { title: 'Services', icon: Package, href: '/admin/services' },
  { title: 'Contacts', icon: Mail, href: '/admin/contacts' },
  { title: 'Consultations', icon: MessageSquare, href: '/admin/consultations' },
  {
    title: 'Settings',
    icon: Settings,
    subItems: [
      { title: 'General Information', href: '/admin/settings/general' },
      { title: 'SEO Settings', href: '/admin/settings/seo' }
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isMainItemActive = useCallback((href: string) => {
    if (href === '/admin/dashboard') return pathname === href;
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
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          
          // Single menu item
          if (item.href) {
            const isActive = isMainItemActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          }

          // Expandable menu item
          const isExpanded = expandedItems.includes(item.title);
          const parentHasActiveChild = item.subItems ? hasAnyActiveChild(item.subItems) : false;

          return (
            <div key={item.title} className="space-y-1">
              <button
                onClick={() => toggleExpanded(item.title)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  parentHasActiveChild
                    ? 'bg-blue-600/20 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center">
                  {parentHasActiveChild && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                  )}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>

              {isExpanded && item.subItems && (
                <div className="ml-6 space-y-1 border-l-2 border-gray-700 pl-4">
                  {item.subItems.map((subItem) => {
                    const subItemIsActive = isSubItemActive(subItem.href);
                    
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors relative ${
                          subItemIsActive
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {subItemIsActive && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full -ml-4" />
                        )}
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

      <Button 
        onClick={handleLogout}
        variant="ghost"
        className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </Button>
    </div>
  );
}
