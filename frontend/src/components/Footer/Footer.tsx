"use client";

import { Mail, Phone, MapPin, Zap, ArrowUp } from "lucide-react";
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
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({
    companyName: "Solar Power House",
    logo: "",
    description:
      "Professional solar energy solutions for residential and commercial properties. Maximizing efficiency and ROI.",
    email: "hello@solarpowerhouse.com",
    phone: "+91 98765 43210",
    address: {
      street: "Solar Innovation Tower",
      city: "Green City",
      state: "Sustainability State",
      zipCode: "560001",
      country: "India",
    },
  });

  useEffect(() => {
    fetchSettings();
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
    <footer className="bg-linear-to-r from-emerald-900 to-teal-900 text-white py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-5">
          {/* Section 1: Logo, Name, and Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-4">
              {settings.logo ? (
                <Image
                  width={128}
                  height={128}
                  src={settings.logo}
                  alt={settings.companyName}
                  priority
                  className="h-32 w-32 rounded-xl object-contain shadow-lg"
                />
              ) : (
                <div className="bg-linear-to-br from-orange-500 to-amber-500 p-4 rounded-xl shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              )}
              <div>
                <span className="text-2xl font-black tracking-tight text-white uppercase block">
                  {settings.companyName}
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">
                  Powering Future
                </span>
              </div>
            </Link>
            <p className="text-emerald-100 leading-relaxed max-w-sm">
              {settings.description}
            </p>
          </div>

          {/* Section 2: Navigation Menu */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <nav className="space-y-4">
              <Link
                href="/"
                className="block text-emerald-100 hover:text-white font-semibold transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/about"
                className="block text-emerald-100 hover:text-white font-semibold transition-colors duration-300 relative group"
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/services"
                className="block text-emerald-100 hover:text-white font-semibold transition-colors duration-300 relative group"
              >
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/contact"
                className="block text-emerald-100 hover:text-white font-semibold transition-colors duration-300 relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>
          </div>

          {/* Section 3: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-200 mt-1 shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Address</p>
                  <p className="text-emerald-100 text-sm leading-relaxed">
                    {settings.address.street}
                    <br />
                    {settings.address.city}, {settings.address.state}
                    <br />
                    {settings.address.zipCode}, {settings.address.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-emerald-200 mt-1 shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Email</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-emerald-100 text-sm hover:text-white transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-emerald-200 mt-1 shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Phone</p>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-emerald-100 text-sm hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-emerald-500/30 text-center">
          <p className="text-emerald-100 text-sm">
            © {new Date().getFullYear()} {settings.companyName}. All Rights
            Reserved.
          </p>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </footer>
  );
}
