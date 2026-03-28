"use client";

import { Mail, Phone, MapPin, ArrowUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Image from "next/image";

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

  return (
    <footer className="bg-[#0c1117] text-white/70 pt-20 pb-10 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative h-10 w-10 overflow-hidden bg-white shrink-0">
                <Image fill src={settings.logo || '/assets/image/logo/logo.jpg'} alt={settings.companyName} priority className="object-contain p-0.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-none text-white uppercase tracking-wide">
                  {settings.companyName.split(' ')[0]}
                  <span className="text-amber-400 ml-1">
                    {settings.companyName.split(' ').slice(1).join(' ')}
                  </span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 mt-0.5">
                  Powering Future
                </span>
              </div>
            </Link>

            <p className="text-white/40 leading-relaxed text-sm max-w-xs">
              {settings.description}
            </p>

            <div className="flex items-center gap-2">
              {[
                { name: 'Facebook', icon: '/assets/svg/facebook.svg', url: settings.socialLinks?.facebook || '#' },
                { name: 'Twitter', icon: '/assets/svg/twitter.svg', url: settings.socialLinks?.twitter || '#' },
                { name: 'Instagram', icon: '/assets/svg/instagram.svg', url: settings.socialLinks?.instagram || '#' },
                { name: 'LinkedIn', icon: '/assets/svg/linkedin.svg', url: settings.socialLinks?.linkedin || '#' }
              ].map((social, i) => (
                <a key={i} href={social.url} className="w-9 h-9 border border-white/8 flex items-center justify-center hover:border-amber-400/30 hover:bg-amber-400/5 transition-all duration-200 group">
                  <Image src={social.icon} alt={social.name} width={14} height={14} className="opacity-40 group-hover:opacity-80 transition-opacity duration-200" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-[0.15em]">Explore</h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Our Services", path: "/services" },
                { name: "Portfolio", path: "/portfolio" },
                { name: "Solar Calculator", path: "/solar-calculator" },
                { name: "Financing Options", path: "/financing" },
                { name: "Contact", path: "/contact" }
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.path}
                  className="group flex items-center text-white/40 hover:text-amber-400 font-medium transition-colors text-sm"
                >
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-[0.15em]">Connect</h3>
            <div className="space-y-4">
              <a href={`mailto:${settings.email}`} className="group flex items-start gap-3 hover:text-amber-400 transition-colors">
                <div className="p-2 bg-white/3 border border-white/6 group-hover:border-amber-400/20 transition-colors shrink-0">
                  <Mail className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-white/50 group-hover:text-amber-400 transition-colors text-sm">{settings.email}</p>
                </div>
              </a>

              <a href={`tel:${settings.phone}`} className="group flex items-start gap-3 hover:text-amber-400 transition-colors">
                <div className="p-2 bg-white/3 border border-white/6 group-hover:border-amber-400/20 transition-colors shrink-0">
                  <Phone className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-0.5">Call Us</p>
                  <p className="text-white/50 group-hover:text-amber-400 transition-colors text-sm">{settings.phone}</p>
                </div>
              </a>

              <a
                href="https://www.google.com/maps/place/SOLAR+POWER+HOUSE/@9.9343002,78.1196993,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-amber-400 transition-colors group"
              >
                <div className="p-2 bg-white/3 border border-white/6 group-hover:border-amber-400/20 transition-colors shrink-0">
                  <MapPin className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-0.5">Visit</p>
                  <p className="text-white/50 group-hover:text-amber-400 transition-colors text-xs leading-relaxed">
                    {settings.address.street}, {settings.address.city}<br />
                    {settings.address.state}, {settings.address.zipCode}<br />
                    {settings.address.country}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} {settings.companyName}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-11 h-11 bg-[#0c1117] border border-white/10 hover:border-amber-400/30 flex items-center justify-center text-white/50 hover:text-amber-400 transition-all duration-200 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </footer>
  );
}
