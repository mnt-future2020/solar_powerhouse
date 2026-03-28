'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Admin/Sidebar/Sidebar';
import { User } from 'lucide-react';

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
        <header className="h-16 border-b border-border/50 bg-background/50 backdrop-blur-xl flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex flex-col items-end shrink-0">
              <span className="text-sm font-black text-foreground leading-none">Admin</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Super User</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-solar-amber to-solar-orange flex items-center justify-center shadow-lg shadow-solar-amber/20 group-hover:scale-105 transition-transform duration-300">
              <User className="h-5 w-5 text-white" />
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

