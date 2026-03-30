"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Home,
  Zap,
  Building,
  Info,
  Banknote,
  Percent,
  CheckCircle2,
  TrendingDown,
  ShieldCheck
} from "lucide-react";

export default function SchemesSection() {
  const householdSubsidy = [
    { range: "Up to 2 kW", amount: "Rs. 30,000", perKw: true },
    { range: "Additional up to 3 kW", amount: "Rs. 18,000", perKw: true },
    { range: "Larger than 3 kW", amount: "Rs. 78,000", perKw: false, suffix: "Total capped subsidy" },
  ];

  const capacityGuide = [
    { consumption: "0-150 Units", capacity: "1-2 kW", pct: 33, color: "bg-emerald-500" },
    { consumption: "150-300 Units", capacity: "2-3 kW", pct: 66, color: "bg-sky-500" },
    { consumption: ">300 Units", capacity: "Above 3 kW", pct: 100, color: "bg-amber-500" },
  ];

  return (
    <section id="schemes" className="relative py-14 sm:py-20 lg:py-28 overflow-hidden bg-[#0c1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 space-y-4 max-w-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-amber-400" />
              <p className="text-amber-400/70 text-xs font-semibold tracking-[0.15em] uppercase">
                Government Flagship Scheme
              </p>
            </div>

            <h2
              className="text-3xl lg:text-5xl font-bold text-white leading-tight"
            >
              PM Surya Ghar<br />
              <span className="text-amber-400">Muft Bijli Yojana</span>
            </h2>

            <p className="text-sm text-white/45 max-w-xl leading-relaxed">
              Transform your rooftop into a power source. Eliminate electricity bills and earn from
              your solar setup with comprehensive government subsidies and collateral-free financing.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 w-full max-w-sm relative lg:ml-auto"
          >
            <div className="relative aspect-square overflow-hidden border border-white/8">
              <Image
                src="/images/pm-surya-ghar.png"
                alt="PM Surya Ghar Muft Bijli Yojana"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0c1117]/70 via-transparent to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-[#0c1117]/80 border border-white/8 p-3 flex items-center gap-3">
                  <div className="bg-emerald-500 text-white p-1.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">100% Guaranteed</p>
                    <p className="text-white/40 text-xs">Govt. approved installation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating savings badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -top-3 right-0 sm:-right-3 bg-[#0c1117] border border-white/8 p-2 sm:p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500/10 p-1.5">
                  <TrendingDown className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-medium">Potential Savings</p>
                  <p className="text-base font-bold text-white">₹25,000/yr</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/8 mb-10 sm:mb-16">
          {[
            {
              icon: Banknote,
              title: "Government Subsidy",
              desc: "Get upfront financial support up to ₹78,000 for your residential rooftop installation.",
              accent: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              icon: TrendingDown,
              title: "Massive Savings",
              desc: "Save approximately ₹25,000 annually on electricity bills, paying for itself in years.",
              accent: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              icon: Percent,
              title: "Easy Financing",
              desc: "Access collateral-free loans at an attractive 6.75% interest rate with swift processing.",
              accent: "text-sky-400",
              bg: "bg-sky-500/10",
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-6 bg-[#0c1117] hover:bg-white/3 transition-colors duration-300"
            >
              <div className={`w-10 h-10 ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`h-5 w-5 ${feature.accent}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Details: Subsidies + Capacity Guide */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left — Subsidies */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-5"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Home className="h-5 w-5 text-amber-400" />
              Household Benefits
            </h3>

            <div className="border border-white/8 overflow-hidden">
              <div className="p-6">
                <p className="text-white/30 mb-4 font-medium tracking-wide uppercase text-xs">Subsidy Structure</p>
                <div className="space-y-2">
                  {householdSubsidy.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/3 border border-white/5 hover:border-amber-500/20 transition-colors duration-200">
                      <span className="text-sm font-semibold text-white mb-1 sm:mb-0">{item.range}</span>
                      <div className="flex flex-col sm:items-end">
                        <span className="text-lg font-bold text-amber-400">{item.amount}</span>
                        <span className="text-xs text-white/30">{item.perKw ? "per kW" : item.suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/15">
                  <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/60 leading-relaxed">
                    <strong className="text-amber-400">Special States:</strong>{" "}
                    An additional 10% subsidy per kW for designated states.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-white/8 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:border-sky-500/15 transition-colors duration-200">
              <div className="w-10 h-10 bg-sky-500/10 flex items-center justify-center shrink-0">
                <Building className="h-5 w-5 text-sky-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-white mb-0.5">GHS / RWA Subsidies</h4>
                    <p className="text-white/30 text-xs leading-relaxed">
                      For common facilities like EV Charging up to 500 kW.
                    </p>
                  </div>
                  <span className="text-sky-400 font-bold text-sm bg-sky-500/10 px-3 py-1 shrink-0 ml-4">
                    Rs. 18,000/kW
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Capacity Guide */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-5"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Zap className="h-5 w-5 text-emerald-400" />
              Capacity Guide
            </h3>

            <div className="border border-white/8 overflow-hidden">
              <div className="p-6">
                <p className="text-white/30 mb-4 font-medium tracking-wide uppercase text-xs">Recommended Specifications</p>

                <div className="space-y-5">
                  {capacityGuide.map((row, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white/50">{row.consumption}</p>
                        <p className="text-sm font-bold text-white">{row.capacity}</p>
                      </div>
                      <div className="h-1 bg-white/5 overflow-hidden">
                        <div className={`h-full ${row.color} transition-all duration-500`} style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-white/8 p-6">
              <h4 className="text-base font-bold text-white mb-4">Why Choose PM Surya Ghar?</h4>
              <ul className="space-y-3">
                {[
                  "Transparent application & swift processing",
                  "Collateral free loan at 6.75% interest",
                  "Replace electricity bills with savings",
                  "Government subsidy up to ₹78,000"
                ].map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-white/50">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
