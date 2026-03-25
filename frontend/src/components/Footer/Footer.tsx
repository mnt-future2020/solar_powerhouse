"use client";

import { Mail, Phone, MapPin, Zap, ArrowUp, ArrowRight, Sun, Disc } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({
    companyName: "Solar Power House",
    logo: "",
    description:
      "Professional solar energy solutions for residential and commercial properties. Maximizing efficiency and ROI while leading the sustainable revolution.",
    email: "solarpowerhouse2020@gmail.com",
    phone: "+91 9944888170",
    address: {
      street: "Solar Power House 34/1, Idhyarajapuram 2nd Street, Sellur",
      city: "Madurai",
      state: "Tamil Nadu",
      zipCode: "625002",
      country: "India",
    },
  });

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    fetchSettings();
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/settings");
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <footer className="relative bg-[#000c15] text-teal-50/80 pt-24 pb-12 overflow-hidden border-t border-teal-900/30">
      
      {/* Immersive Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Giant Background Typography watermark */}
      <div className="absolute bottom-0 left-[-2%] select-none pointer-events-none overflow-hidden mix-blend-overlay">
        <h1 className="text-[12vw] font-black leading-none text-white/2 whitespace-nowrap tracking-tighter">
          SPH SOLAR.
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Main Footer Content - Four Sections in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          
          {/* Section 1: Brand & Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {settings.logo ? (
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-teal-900/50 shadow-lg group-hover:border-orange-500/50 transition-colors">
                  <Image fill src={settings.logo} alt={settings.companyName} priority className="object-cover" />
                </div>
              ) : (
                <div className="bg-linear-to-br from-orange-500 to-amber-500 p-2 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl font-semibold leading-none text-gradient-solar uppercase">
                  {settings.companyName.split(' ')[0]}
                  <span className="text-teal-100 ml-1">
                    {settings.companyName.split(' ').slice(1).join(' ')}
                  </span>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-50">
                  Powering Future
                </span>
              </div>
            </Link>
            
            <p className="text-teal-50/70 leading-relaxed text-sm">
              {settings.description}
            </p>

            <div className="flex items-center gap-3">
              {[
                { name: 'Facebook', icon: '/assets/svg/facebook.svg', url: settings.socialLinks?.facebook || '#' },
                { name: 'Twitter', icon: '/assets/svg/twitter.svg', url: settings.socialLinks?.twitter || '#' },
                { name: 'Instagram', icon: '/assets/svg/instagram.svg', url: settings.socialLinks?.instagram || '#' },
                { name: 'LinkedIn', icon: '/assets/svg/linkedin.svg', url: settings.socialLinks?.linkedin || '#' }
              ].map((social, i) => (
                <a key={i} href={social.url} className="w-10 h-10 rounded-full border border-teal-900/30 bg-[#001220] flex items-center justify-center hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 group">
                  <Image src={social.icon} alt={social.name} width={16} height={16} className="opacity-60 group-hover:opacity-100 group-hover:brightness-110 transition-all duration-300" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Section 2: Explore/Navigation */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Explore</h3>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Our Services", path: "/services" },
                { name: "Contact", path: "/contact" }
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.path}
                  className="group flex items-center text-teal-50/70 hover:text-orange-500 font-medium transition-colors text-sm"
                >
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Section 3: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Solar Calculator", path: "/solar-calculator" },
                { name: "Financing Options", path: "/services" },
                { name: "Energy Solutions", path: "/services" },
                { name: "Dealer Locator", path: "/contact" },
                { name: "Solar Residential Leaflet", path: "/services" },
                { name: "Talk to Us", path: "/contact" }
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.path}
                  className="group flex items-center text-teal-50/70 hover:text-orange-500 font-medium transition-colors text-sm"
                >
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Section 4: Contact Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Connect</h3>
            <div className="space-y-4">
              <a href={`mailto:${settings.email}`} className="group flex items-start gap-3 hover:text-orange-500 transition-colors">
                <div className="p-2 bg-[#001220] rounded-lg border border-teal-900/30 group-hover:border-orange-500/30 transition-colors shrink-0">
                  <Mail className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-teal-50/50 font-semibold uppercase tracking-wider mb-1">Email</p>
                  <p className="text-teal-50/80 group-hover:text-orange-500 transition-colors text-sm">{settings.email}</p>
                </div>
              </a>

              <a href={`tel:${settings.phone}`} className="group flex items-start gap-3 hover:text-orange-500 transition-colors">
                <div className="p-2 bg-[#001220] rounded-lg border border-teal-900/30 group-hover:border-orange-500/30 transition-colors shrink-0">
                  <Phone className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-teal-50/50 font-semibold uppercase tracking-wider mb-1">Call Us</p>
                  <p className="text-teal-50/80 group-hover:text-orange-500 transition-colors text-sm">{settings.phone}</p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#001220] rounded-lg border border-teal-900/30 shrink-0">
                  <MapPin className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-teal-50/50 font-semibold uppercase tracking-wider mb-1">Visit</p>
                  <p className="text-teal-50/80 text-xs leading-relaxed">
                    {settings.address.street}, {settings.address.city}<br />
                    {settings.address.state}, {settings.address.zipCode}<br />
                    {settings.address.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom / Copyright */}
        <div className="pt-8 border-t border-teal-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-teal-50/60 font-medium text-sm">
            © {new Date().getFullYear()} {settings.companyName}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-teal-50/60">
            <Link href="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Enhanced Back to Top Button */}
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-14 h-14 bg-[#001220]/80 backdrop-blur-md hover:bg-orange-500 border border-teal-900/50 hover:border-orange-400 rounded-2xl flex items-center justify-center text-teal-50/80 hover:text-white shadow-2xl transition-all duration-300 z-50 group hover:-translate-y-1"
              aria-label="Back to top"
            >
              <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
