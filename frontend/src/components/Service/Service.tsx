"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Zap, ArrowRight, CheckCircle2, TrendingUp, BatteryCharging } from "lucide-react";
import axios from "@/lib/axios";

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  image?: string;
}

const serviceImages: Record<number, string> = {
  0: "/assets/image/services/residential.png",
  1: "/assets/image/services/commercial.png",
  2: "/assets/image/services/maintenance.png",
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Service() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-10 lg:py-16 min-h-screen overflow-hidden bg-linear-to-br from-[#002654] to-[#000c15]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-amber-400/10 blur-[150px]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[150px]" 
        />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mx-auto">
             <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
             <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">
               Our Solar Solutions
             </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            COMPREHENSIVE <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">SERVICES</span>
          </h1>
          <p className="text-sm lg:text-base text-white/70 leading-relaxed">
            Discover our comprehensive range of solar solutions designed to guarantee your energy independence. 
            From residential grids to large scale industrial ecosystems.
          </p>
        </motion.div>

        {/* Statistics Strip */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { icon: TrendingUp, value: "1,200+", label: "Projects Completed", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
            { icon: BatteryCharging, value: "99.9%", label: "Grid Reliability", color: "text-teal-400", bg: "bg-teal-500/20", border: "border-teal-500/30" },
            { icon: Zap, value: "50 MW+", label: "Capacity Installed", color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30" },
            { icon: CheckCircle2, value: "25+", label: "Years Warranty", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" }
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              variants={fadeUpVariant}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-lg group hover:bg-white/10 transition-colors"
            >
              <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                 <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-[11px] font-bold tracking-wider uppercase text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 rounded-full border-t-2 border-r-2 border-amber-400 animate-spin" />
            <p className="mt-4 text-sm font-bold text-white/60 animate-pulse">Loading solutions schema...</p>
          </div>
        ) : services.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
          >
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                variants={fadeUpVariant}
                className="group relative flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-xl"
              >
                {/* Compact Image Section */}
                <div className="relative w-full h-44 overflow-hidden border-b border-white/10">
                  <Image 
                    src={serviceImages[index % 3] || '/assets/image/placeholder.svg'} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={service.title}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#000c15] via-[#000c15]/50 to-transparent" />
                  
                  {/* Premium Badge */}
                  <div className="absolute bottom-3 left-4">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold text-[10px] uppercase tracking-wide">
                        <Zap className="h-3 w-3 text-amber-400" /> Premium
                     </span>
                  </div>
                </div>

                {/* Compact Content Section */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 mt-auto">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-white/80 font-medium text-xs leading-relaxed">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <div className="text-[10px] text-white/40 font-bold uppercase tracking-wide pt-1">
                        + {service.features.length - 3} Additional Specs
                      </div>
                    )}
                  </div>

                  {/* Lean CTA Button */}
                  <Link href={`/services/${service._id}`} className="block mt-auto w-full">
                    <button className="w-full relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold overflow-hidden transition-all bg-linear-to-r from-white/10 to-white/5 border border-white/20 text-white hover:bg-white/20 hover:border-amber-500/50 group:hover:shadow-xl group:hover:shadow-amber-500/10 group-2">
                      <span className="relative z-10 flex items-center gap-2 text-xs uppercase tracking-wide">
                        Explore System <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
                      </span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-10">
            <p className="text-white/60 text-sm font-medium">No service algorithms currently mapped.</p>
          </div>
        )}
      </div>
    </section>
  );
}
