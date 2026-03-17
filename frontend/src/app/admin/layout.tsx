'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { Bell, Search, User } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-500 overflow-hidden font-sans">
      {/* Subtle Background Mesh for Consistency */}
      <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-solar-orange rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-solar-green rounded-full blur-[120px]" />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden">
        {/* Header Bar */}
        <header className="h-20 border-b border-border/50 bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="max-w-md w-full relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-solar-orange transition-colors" />
              <input 
                type="text" 
                placeholder="Search analytics, messages..." 
                className="w-full bg-muted/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm outline-none ring-1 ring-border group-focus-within:ring-solar-orange/30 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border/50">
              <Bell className="h-4.5 w-4.5" />
            </button>
            <div className="h-8 w-[1px] bg-border/50 mx-2" />
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="flex flex-col items-end shrink-0">
                <span className="text-sm font-black text-foreground leading-none">Admin</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Super User</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-solar-amber to-solar-orange flex items-center justify-center shadow-lg shadow-solar-amber/20 group-hover:scale-105 transition-transform duration-300">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-muted/30 dark:bg-transparent">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

