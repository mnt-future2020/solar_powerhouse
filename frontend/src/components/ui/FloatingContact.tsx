'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, X, MessageCircle } from 'lucide-react';
import axios from '@/lib/axios';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('+919944888170');
  const [email, setEmail] = useState('solarpowerhouse2020@gmail.com');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mount animation so it slides in after page load
    const t = setTimeout(() => setMounted(true), 1000);
    axios.get('/settings')
      .then(res => {
        if (res.data.phone) setPhone(res.data.phone.replace(/[\s-]/g, ''));
        if (res.data.email) setEmail(res.data.email);
      })
      .catch(() => {});
    return () => clearTimeout(t);
  }, []);

  const whatsappNumber = phone.replace(/\D/g, '');

  const items = [
    {
      label: 'Email Us',
      href: `mailto:${email}`,
      bg: 'bg-amber-500 hover:bg-amber-600',
      shadow: 'shadow-amber-500/30',
      ring: 'ring-amber-400/20',
      icon: <Mail className="h-5 w-5 text-white" />,
      delay: 'delay-[0ms]',
    },
    {
      label: 'Call Us',
      href: `tel:${phone}`,
      bg: 'bg-sky-500 hover:bg-sky-600',
      shadow: 'shadow-sky-500/30',
      ring: 'ring-sky-400/20',
      icon: <Phone className="h-5 w-5 text-white" />,
      delay: 'delay-[75ms]',
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/${whatsappNumber}?text=Hi%2C%20I%27m%20interested%20in%20solar%20panel%20installation.`,
      target: '_blank',
      bg: 'bg-[#25D366] hover:bg-[#1fb855]',
      shadow: 'shadow-[#25D366]/30',
      ring: 'ring-[#25D366]/20',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      delay: 'delay-[150ms]',
    },
  ];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-700 ease-out ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      {/* Expanded buttons */}
      {open && (
        <div className="flex flex-col items-end gap-3">
          {items.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              target={item.target}
              rel={item.target ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3"
              style={{
                animation: `float-item-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms both`,
              }}
            >
              {/* Tooltip */}
              <span
                className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap shadow-lg
                  translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200"
              >
                {item.label}
              </span>

              {/* Icon circle */}
              <div
                className={`w-12 h-12 rounded-full ${item.bg} shadow-lg ${item.shadow} ring-4 ${item.ring}
                  flex items-center justify-center transition-all duration-200
                  hover:scale-110 hover:shadow-xl active:scale-95`}
              >
                {item.icon}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Pulse ring behind toggle */}
      {!open && (
        <span className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-[#25D366]/30 animate-ping-slow pointer-events-none" />
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 ${
          open
            ? 'bg-gray-800 hover:bg-gray-700 shadow-gray-800/30'
            : 'bg-[#25D366] hover:bg-[#1fb855] shadow-[#25D366]/40 animate-bounce-slow'
        }`}
        aria-label={open ? 'Close contact options' : 'Open contact options'}
      >
        <span
          className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
            open ? 'rotate-90 scale-100 opacity-100' : 'rotate-0 scale-0 opacity-0'
          }`}
        >
          <X className="h-6 w-6 text-white" />
        </span>
        <span
          className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
            open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </span>
      </button>
    </div>
  );
}
