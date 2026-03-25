"use client";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  Home,
  Zap,
  Building,
  Info,
  Banknote,
  Percent,
  CheckCircle2,
  Sun,
  TrendingDown,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SchemesSection() {
  const householdSubsidy = [
    { range: "Up to 2 kW", amount: "Rs. 30,000", perKw: true },
    { range: "Additional up to 3 kW", amount: "Rs. 18,000", perKw: true },
    { range: "Larger than 3 kW", amount: "Rs. 78,000", perKw: false, suffix: "Total capped subsidy" },
  ];

  const capacityGuide = [
    { consumption: "0-150 Units", capacity: "1-2 kW", color: "from-emerald-400 to-emerald-200" },
    { consumption: "150-300 Units", capacity: "2-3 kW", color: "from-sky-400 to-sky-200" },
    { consumption: ">300 Units", capacity: "Above 3 kW", color: "from-orange-400 to-amber-200" },
  ];

  return (
    <section id="schemes" className="relative py-16 lg:py-20 overflow-hidden bg-linear-to-br from-[#003f49] to-[#000c15]">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-orange-400/10 blur-[120px]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-sky-400/10 blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex-1 space-y-5"
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">
                Government Flagship Scheme
              </span>
            </motion.div>
            
            <motion.h2 variants={fadeUpVariant} className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              PM Surya Ghar <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">
                Muft Bijli Yojana
              </span>
            </motion.h2>
            
            <motion.p variants={fadeUpVariant} className="text-base text-white/80 max-w-2xl leading-relaxed">
              Transform your rooftop into a power source. Eliminate electricity bills and earn from your solar setup with comprehensive government subsidies and collateral-free financing.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#000c15] rounded-full font-semibold overflow-hidden transition-transform hover:scale-105 shadow-md">
                <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  Apply for Subsidy <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </motion.div>
          
          {/* Hero Image / Graphic */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full max-w-md relative lg:ml-auto"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <div className="absolute inset-0 bg-linear-to-t from-[#000c15]/80 via-transparent to-transparent z-10" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
                className="w-full h-full relative"
              >
                <Image 
                  src="/images/pm-surya-ghar.png" 
                  alt="PM Surya Ghar Muft Bijli Yojana" 
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-xl flex items-center gap-3"
                >
                  <div className="bg-emerald-500 text-white p-2 rounded-full">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">100% Guaranteed</h4>
                    <p className="text-white/80 text-xs">Govt. approved installation</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md p-3 rounded-xl shadow-xl shadow-black/50 border border-white/20"
            >
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-white/70 font-medium">Potential Savings</p>
                  <p className="text-base font-bold text-white">₹25,000/yr</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3 Value Pillars */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 mb-16 relative z-20"
        >
          {[
            {
              icon: Banknote,
              title: "Government Subsidy",
              desc: "Get upfront financial support up to ₹78,000 for your residential rooftop installation.",
              color: "text-amber-400",
              bgColor: "bg-amber-500/20 border border-amber-500/30"
            },
            {
              icon: TrendingDown,
              title: "Massive Savings",
              desc: "Save approximately ₹25,000 annually on electricity bills, paying for itself in years.",
              color: "text-emerald-400",
              bgColor: "bg-emerald-500/20 border border-emerald-500/30"
            },
            {
              icon: Percent,
              title: "Easy Financing",
              desc: "Access collateral-free loans at an attractive 6.75% interest rate with swift processing.",
              color: "text-sky-400",
              bgColor: "bg-sky-500/20 border border-sky-500/30"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeUpVariant}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/15 hover:border-white/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 origin-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Details Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Subsidies */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h3 variants={fadeUpVariant} className="text-2xl font-bold text-white flex items-center gap-3">
              <Home className="h-6 w-6 text-orange-400" />
              Household Benefits
            </motion.h3>
            
            <motion.div variants={fadeUpVariant} className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl overflow-hidden">
              <div className="p-6">
                <p className="text-white/60 mb-4 font-medium tracking-wide uppercase text-xs">Subsidy Structure</p>
                <div className="space-y-3">
                  {householdSubsidy.map((item, idx) => (
                    <div key={idx} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-black/20 border border-white/10 hover:border-orange-500/50 hover:bg-white/5 transition-all">
                      <span className="text-base font-semibold text-white mb-1 sm:mb-0">{item.range}</span>
                      <div className="flex flex-col sm:items-end">
                        <span className="text-xl font-bold text-orange-400">{item.amount}</span>
                        <span className="text-xs text-white/50">{item.perKw ? "per kW" : item.suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-start gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <Info className="h-5 w-5 text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-100 leading-relaxed">
                    <strong className="block text-amber-400 mb-1">Special States Quota:</strong> 
                    An additional 10% Subsidy will be applicable per kW for designated states.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center relative overflow-hidden group hover:bg-white/15 transition-all">
              <div className="absolute inset-0 bg-linear-to-r from-sky-400/0 via-sky-400/10 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0 relative z-10">
                <Building className="h-6 w-6 text-sky-400" />
              </div>
              <div className="relative z-10 w-full flex-1">
                <div className="flex justify-between items-center sm:items-start float-none sm:float-right ml-4 mb-2 sm:mb-0">
                  <div className="inline-block px-3 py-1 rounded-lg bg-black/30 border border-white/10 font-bold text-sky-400 text-sm">
                    Rs. 18,000 / kW
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">GHS / RWA Subsidies</h4>
                <p className="text-white/70 text-xs leading-relaxed max-w-[280px]">
                  For common facilities like EV Charging up to 500 kW capacity.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Capacity Guide */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h3 variants={fadeUpVariant} className="text-2xl font-bold text-white flex items-center gap-3">
              <Zap className="h-6 w-6 text-emerald-400" />
              Capacity Guide
            </motion.h3>

            <motion.div variants={fadeUpVariant} className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl overflow-hidden z-10 relative">
              <div className="p-6">
                <p className="text-white/60 mb-4 font-medium tracking-wide uppercase text-xs">Recommended Specifications</p>
                
                <div className="space-y-3">
                  {capacityGuide.map((row, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4 flex items-center justify-between group hover:border-white/30 transition-all">
                      <div className="relative z-10">
                        <p className="text-xs text-white/50 mb-0.5">Monthly Consumption</p>
                        <p className="text-base font-bold text-white">{row.consumption}</p>
                      </div>
                      <div className="relative z-10 text-right">
                        <p className="text-xs text-white/50 mb-0.5">Recommended</p>
                        <div className={`inline-block text-transparent bg-clip-text bg-linear-to-r ${row.color} text-xl font-black`}>
                          {row.capacity}
                        </div>
                      </div>
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-linear-to-r ${row.color} transition-opacity duration-300`} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                className="absolute top-[-20%] right-[-10%] p-6 opacity-10"
              >
                <Sun className="h-48 w-48 text-amber-300" />
              </motion.div>
              <h4 className="text-xl font-bold text-white mb-5 relative z-10">Why Choose PM Surya Ghar?</h4>
              <ul className="space-y-4 relative z-10">
                {[
                  "Transparent application & swift processing", 
                  "Collateral free loan at 6.75% interest", 
                  "Replace electricity bills with savings", 
                  "Government subsidy up to ₹78,000"
                ].map((benefit, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3 text-white/90"
                  >
                    <div className="rounded-full bg-emerald-500/20 p-1 shrink-0 mt-0.5 border border-emerald-500/30">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="font-medium text-white text-sm">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
