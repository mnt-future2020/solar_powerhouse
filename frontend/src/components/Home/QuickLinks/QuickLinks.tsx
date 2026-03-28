'use client';
import { Layers, Headphones, TrendingDown, Sun, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const advantages = [
  { icon: Layers,       title: 'Customized rooftop solutions', accent: 'bg-amber-500/10 text-amber-500' },
  { icon: Headphones,   title: 'Superior customer service', accent: 'bg-teal-500/10 text-teal-600' },
  { icon: TrendingDown, title: 'Maximized bill savings', accent: 'bg-emerald-500/10 text-emerald-600' },
  { icon: Sun,          title: 'High-efficiency panels', accent: 'bg-orange-500/10 text-orange-500' },
  { icon: ShieldCheck,  title: '25-year certified warranty', accent: 'bg-sky-500/10 text-sky-600' },
  { icon: Zap,          title: 'Fast, minimal-disruption install', accent: 'bg-rose-500/10 text-rose-500' },
];

export default function QuickLinks() {
  return (
    <section className="bg-[#0c1117] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Top row — advantages as a horizontal strip, not cards */}
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-6">
            The Solar Power House Advantage
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5">
            {advantages.map(({ icon: Icon, title, accent }) => (
              <div key={title} className="flex items-start gap-3 group">
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${accent} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-white/70 leading-snug font-medium group-hover:text-white/90 transition-colors duration-200">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row — two balanced action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Solar Calculator */}
          <Link href="/solar-calculator" className="group">
            <div className="relative overflow-hidden bg-linear-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 hover:border-amber-500/40 hover:bg-amber-500/15">
              <div className="relative z-10 flex items-end justify-between gap-4 h-full">
                <div className="space-y-2">
                  <p className="text-amber-400/70 text-xs font-semibold tracking-[0.15em] uppercase">Calculate</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                    Solar Savings Calculator
                  </h3>
                  <p className="text-white/50 text-sm max-w-sm">
                    Find out how much you can save based on your rooftop size and energy consumption.
                  </p>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/25 transition-colors">
                  <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </Link>

          {/* Financing */}
          <Link href="/financing" className="group">
            <div className="relative overflow-hidden bg-linear-to-br from-teal-500/15 to-emerald-500/10 border border-teal-500/20 rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 hover:border-teal-500/40 hover:bg-teal-500/15">
              <div className="relative z-10 space-y-3">
                <p className="text-teal-400/70 text-xs font-semibold tracking-[0.15em] uppercase">Explore</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                  Financing Options
                </h3>
                <p className="text-white/50 text-sm">
                  Flexible payment plans with government-backed subsidies.
                </p>
                <div className="flex items-center gap-2 pt-2 text-teal-400 text-sm font-medium group-hover:gap-3 transition-all duration-200">
                  <span>View Plans</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
