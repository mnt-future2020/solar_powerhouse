'use client';
import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Layers, Headphones, TrendingDown, Sun, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

const links = [
  { label: 'Solar calculator',          href: '/solar-calculator' },
  { label: 'Financing options',         href: '/services' },
  { label: 'Energy solutions',          href: '/services' },
  { label: 'Dealer locator',            href: '/contact' },
  { label: 'Solar residential leaflet', href: '/services' },
  { label: 'Talk to us',                href: '/contact' },
];

const advantages = [
  { icon: Layers,       title: 'Customized rooftop solutions for your needs' },
  { icon: Headphones,   title: 'Superior customer service for a seamless transition' },
  { icon: TrendingDown, title: 'Maximized savings on electricity bills' },
  { icon: Sun,          title: 'High-efficiency panels with proven performance' },
  { icon: ShieldCheck,  title: '25-year warranty with certified installation' },
  { icon: Zap,          title: 'Fast installation with minimal disruption' },
];

const VISIBLE = 3;

export default function QuickLinks() {
  const [start, setStart] = useState(0);

  const prev = () => setStart(s => Math.max(0, s - 1));
  const next = () => setStart(s => Math.min(advantages.length - VISIBLE, s + 1));

  const visible = advantages.slice(start, start + VISIBLE);

  return (
    <section className="bg-[#0a0f1e] text-white py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">

        {/* LEFT — Quick Links */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-amber-400 transition-colors duration-200 group"
              >
                <ArrowRight className="h-4 w-4 text-amber-500 group-hover:translate-x-1 transition-transform shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT — Advantages slider */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Solar Power House advantage</h2>
            <div className="flex gap-2">
              <button
                onClick={prev}
                disabled={start === 0}
                className="w-8 h-8 border border-white/30 hover:border-amber-400 flex items-center justify-center text-white hover:text-amber-400 disabled:opacity-30 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                disabled={start >= advantages.length - VISIBLE}
                className="w-8 h-8 border border-white/30 hover:border-amber-400 flex items-center justify-center text-white hover:text-amber-400 disabled:opacity-30 transition-all"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {visible.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="border border-white/10 hover:border-amber-500/50 rounded-sm p-4 space-y-3 transition-all duration-300 hover:bg-white/5"
              >
                <Icon className="h-6 w-6 text-amber-500" />
                <p className="text-sm text-white/80 leading-snug">{title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
