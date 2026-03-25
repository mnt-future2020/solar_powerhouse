'use client';

import Link from 'next/link';
import { Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Settings {
  companyName: string;
  logo: string;
  tagline: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Solar Power House',
    logo: '',
    tagline: 'Powering a Sustainable Future'
  });

  useEffect(() => {
    fetchSettings();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#000c15] border-b border-gray-200 shadow-lg",
        isScrolled ? "py-4" : "py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-linear-to-br from-orange-500 to-amber-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold leading-none text-gradient-solar uppercase">
                {settings.companyName.split(' ')[0]}
                <span className="text-teal-100 ml-1">
                  {settings.companyName.split(' ').slice(1).join(' ')}
                </span>
              </span>
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-teal-50">Powering Future</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-base font-bold text-white hover:text-orange-500 transition-colors relative group py-2"
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-300",
                  isActive(link.href) 
                    ? "w-full" 
                    : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-gray-700 hover:text-orange-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-[72px] bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-2xl font-bold transition-colors",
                isActive(link.href) 
                  ? "text-orange-500" 
                  : "text-gray-900 hover:text-orange-500"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
