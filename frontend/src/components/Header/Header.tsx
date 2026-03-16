'use client';

import Link from 'next/link';
import { Sun, Moon, Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface Settings {
  companyName: string;
  logo: string;
  tagline: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Solar Power House',
    logo: '',
    tagline: 'Powering a Sustainable Future'
  });

  useEffect(() => {
    setMounted(true);
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

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border py-4 shadow-lg shadow-black/5" 
          : "bg-transparent py-6 border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-solar-amber to-solar-orange p-2 rounded-xl shadow-lg shadow-solar-amber/20 group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight font-display leading-none text-foreground uppercase">
              {settings.companyName.split(' ')[0]}
              <span className="text-gradient-solar">
                {settings.companyName.split(' ').slice(1).join('')}
              </span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-solar-teal">Powering Future</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-sm font-bold text-muted-foreground hover:text-solar-amber transition-colors relative group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-solar-amber to-solar-orange transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-solar-amber" /> : <Moon className="h-5 w-5 text-solar-teal" />}
            </Button>
          )}
          <Link href="/contact" className="hidden md:block">
            <Button className="bg-gradient-to-r from-solar-amber to-solar-orange hover:from-solar-orange hover:to-solar-amber text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-solar-orange/20 transition-all hover:scale-105 active:scale-95">
              GET STARTED
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-2xl transition-all duration-500 ease-in-out",
        isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-black text-foreground hover:text-solar-amber transition-all"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-8 border-t border-border mt-auto">
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-solar-amber to-solar-orange text-white font-black py-8 rounded-3xl text-xl shadow-xl shadow-solar-orange/20">
                GET STARTED NOW
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
