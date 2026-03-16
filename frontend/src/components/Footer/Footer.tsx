'use client';

import { Sun, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, Zap, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Settings {
  companyName: string;
  logo: string;
  description: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Solar Power House',
    logo: '',
    description: 'Pioneering energy independence through high-performance solar architectures and smart grid technologies.',
    email: 'hello@solarpowerhouse.com',
    phone: '+91 98765 43210',
    address: {
      street: 'Solar Innovation Tower',
      city: 'Green City',
      state: 'Sustainability State',
      zipCode: '560001',
      country: 'India'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const formatAddress = () => {
    const { street, city, state, zipCode } = settings.address;
    return `${street}, ${city}, ${state} ${zipCode}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-solar-dark text-white pt-32 pb-12 overflow-hidden relative">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-solar-amber/5 blur-[120px] rounded-full -mt-64"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-solar-amber to-solar-orange p-2 rounded-2xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase">
                {settings.companyName.split(' ')[0]}<span className="text-gradient-solar">{settings.companyName.split(' ').slice(1).join('')}</span>
              </span>
            </Link>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              {settings.description}
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-solar-amber hover:text-white transition-all duration-300 border border-white/5 hover:border-solar-amber/30 group">
                  <Icon className="h-5 w-5 opacity-60 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-solar-teal mb-10">Ecosystem</h3>
            <ul className="space-y-6 text-lg font-bold text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Platform</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Residential</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Industrial</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Company</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-solar-amber mb-10">Resources</h3>
            <ul className="space-y-6 text-lg font-bold text-gray-400">
              <li><Link href="/#schemes" className="hover:text-white transition-colors">Incentives</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Technical Support</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Solar Blog</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="lg:col-span-4 space-y-10">
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-6">
              <h3 className="text-xl font-black">Stay Empowered</h3>
              <p className="text-sm text-gray-400 font-medium">Monthly dose of tech updates and green ROI tips.</p>
              <div className="relative">
                <Input 
                  placeholder="name@energy.com" 
                  className="bg-white/5 border-white/10 rounded-2xl h-16 pl-6 pr-16 text-white focus:border-solar-amber transition-all" 
                />
                <button className="absolute right-2 top-2 h-12 w-12 bg-solar-amber rounded-xl flex items-center justify-center text-white hover:bg-solar-orange transition-all shadow-lg shadow-solar-amber/20">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 font-bold text-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p>&copy; {new Date().getFullYear()} {settings.companyName}</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white">Privacy Architecture</Link>
              <Link href="#" className="hover:text-white">Legal Terms</Link>
            </div>
          </div>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 text-solar-teal hover:text-white transition-colors group"
          >
            BACK TO TOP
            <div className="w-10 h-10 rounded-full border border-solar-teal/30 flex items-center justify-center group-hover:bg-solar-teal group-hover:text-white transition-all">
              <ArrowUp className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
