'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
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
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0c1117]",
        isScrolled ? "py-3" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 overflow-hidden bg-white shrink-0">
              <Image
                src={settings.logo || '/assets/image/logo/logo.jpg'}
                alt={settings.companyName}
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-none text-white uppercase tracking-wide font-display">
                {settings.companyName.split(' ')[0]}
                <span className="text-amber-400 ml-1">
                  {settings.companyName.split(' ').slice(1).join(' ')}
                </span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 mt-0.5">Powering Future</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors relative py-2 font-display",
                  isActive(link.href)
                    ? "text-amber-400"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-0 h-px bg-amber-400 transition-all duration-300",
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
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-15 bg-[#0c1117] transition-all duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-2xl font-bold transition-colors",
                isActive(link.href)
                  ? "text-amber-400"
                  : "text-white/70 hover:text-white"
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
