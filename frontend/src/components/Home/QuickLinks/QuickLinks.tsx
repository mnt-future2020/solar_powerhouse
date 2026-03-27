'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Layers, Headphones, TrendingDown, Sun, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

const advantages = [
  { icon: Layers,       title: 'Customized rooftop solutions for your needs' },
  { icon: Headphones,   title: 'Superior customer service for a seamless transition' },
  { icon: TrendingDown, title: 'Maximized savings on electricity bills' },
  { icon: Sun,          title: 'High-efficiency panels with proven performance' },
  { icon: ShieldCheck,  title: '25-year warranty with certified installation' },
  { icon: Zap,          title: 'Fast installation with minimal disruption' },
];

// Responsive visible count per breakpoint handled via CSS, slider logic uses 3 for desktop
const VISIBLE = 3;

export default function QuickLinks() {
  const [start, setStart] = useState(0);

  const prev = () => setStart(s => Math.max(0, s - 1));
  const next = () => setStart(s => Math.min(advantages.length - VISIBLE, s + 1));

  const visible = advantages.slice(start, start + VISIBLE);

  return (
    <section className="bg-[#0a0f1e] text-white py-8 sm:py-10 lg:py-14 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">

        {/* LEFT — Advantages slider */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">Solar Power House advantage</h2>
            <div className="flex gap-2">
              <button
                onClick={prev}
                disabled={start === 0}
                className="w-8 h-8 border border-white/30 hover:border-amber-400 flex items-center justify-center text-white hover:text-amber-400 disabled:opacity-30 transition-all rounded-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                disabled={start >= advantages.length - VISIBLE}
                className="w-8 h-8 border border-white/30 hover:border-amber-400 flex items-center justify-center text-white hover:text-amber-400 disabled:opacity-30 transition-all rounded-sm"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile: show all in 2-col grid, Tablet+: slider with 3 visible */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {advantages.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="border border-white/10 hover:border-amber-500/50 rounded-lg p-3 space-y-2 transition-all duration-300 hover:bg-white/5"
              >
                <Icon className="h-5 w-5 text-amber-500" />
                <p className="text-xs text-white/80 leading-snug">{title}</p>
              </div>
            ))}
          </div>

          <div className="hidden sm:grid grid-cols-3 gap-3">
            {visible.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="border border-white/10 hover:border-amber-500/50 rounded-lg p-4 space-y-3 transition-all duration-300 hover:bg-white/5"
              >
                <Icon className="h-6 w-6 text-amber-500" />
                <p className="text-sm text-white/80 leading-snug">{title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Action Buttons */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">Quick Actions</h2>

          {/* Stack on mobile, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

            {/* Solar Calculator */}
            <Link href="/solar-calculator" className="group flex-1">
              <div className="bg-linear-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1">Solar Calculator</h3>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">Calculate your solar savings</p>
                  </div>
                  <Sun className="h-7 w-7 sm:h-8 sm:w-8 text-white ml-3 shrink-0 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Financing Options */}
            <Link href="/financing" className="group flex-1">
              <div className="bg-linear-to-tr from-[#2b1166] to-[#2b2147] hover:from-teal-700 hover:to-cyan-700 rounded-xl p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1">Financing Options</h3>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">Explore payment plans</p>
                  </div>
                  <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white ml-3 shrink-0 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
