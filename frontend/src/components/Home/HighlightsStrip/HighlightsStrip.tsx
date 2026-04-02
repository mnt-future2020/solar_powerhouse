'use client';
import { Percent, BadgeCheck, Leaf, IndianRupee, ShieldCheck } from 'lucide-react';

const highlights = [
  {
    icon: Percent,
    value: '6%',
    label: 'Interest Rate',
    desc: 'Collateral-free solar loans',
    accent: 'from-sky-500/20 to-sky-500/5',
    border: 'border-sky-500/20 hover:border-sky-500/40',
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-400',
    valueColor: 'text-sky-400',
  },
  {
    icon: BadgeCheck,
    value: '1 Crore',
    label: 'Homes Approved',
    desc: 'PM Surya Ghar Muft Bijli Yojana subsidy scheme',
    accent: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    valueColor: 'text-emerald-400',
  },
  {
    icon: Leaf,
    value: '100%',
    label: 'Clean Energy',
    desc: 'Fully renewable electricity for your home',
    accent: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    valueColor: 'text-amber-400',
  },
  {
    icon: IndianRupee,
    value: '₹78,000',
    label: 'Max Subsidy',
    desc: 'Government subsidy under PM Surya Ghar scheme',
    accent: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    valueColor: 'text-purple-400',
  },
  {
    icon: ShieldCheck,
    value: '25 Yrs',
    label: 'Panel Warranty',
    desc: 'Industry-leading performance guarantee',
    accent: 'from-orange-500/20 to-orange-500/5',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    valueColor: 'text-orange-400',
  },
];

export default function HighlightsStrip() {
  return (
    <section className="bg-[#0c1117] border-t border-white/5 py-8 sm:py-10 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {highlights.map(({ icon: Icon, value, label, desc, accent, border, iconBg, iconColor, valueColor }) => (
            <div
              key={label}
              className={`relative overflow-hidden bg-gradient-to-br ${accent} border ${border} rounded-2xl p-5 sm:p-6 transition-all duration-300 group`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-2xl sm:text-3xl font-black leading-none ${valueColor}`}>
                    {value}
                  </p>
                  <p className="text-white font-semibold text-sm mt-1">{label}</p>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed hidden sm:block">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
