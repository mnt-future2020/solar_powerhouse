"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  image?: string;
  bannerImage?: string;
  detailTitle?: string;
  detailDescription?: string;
  detailFeatures?: string[];
  workProcess?: string;
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

interface ServiceDetailProps {
  service: ServiceType;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <section className="relative py-10 lg:py-16 min-h-[80vh] flex items-center overflow-hidden bg-linear-to-br from-[#002654] to-[#000c15]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-amber-400/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full space-y-12">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUpVariant}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden p-6 lg:p-10 shadow-2xl"
        >
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 uppercase tracking-tight">{service.detailTitle || service.title}</h1>
          
          <div className="relative w-full h-[250px] lg:h-[400px] rounded-4xl overflow-hidden mb-8 border border-white/10">
            <Image 
              src={service.bannerImage || service.image || '/assets/image/placeholder.svg'} 
              fill 
              className="object-cover transition-transform duration-700 hover:scale-105" 
              alt={service.detailTitle || service.title} 
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#000c15]/80 via-transparent to-transparent" />
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-amber-400">System Architecture</h3>
            <p className="text-sm lg:text-base text-white/80 leading-relaxed border-l-2 border-emerald-400 pl-4 whitespace-pre-wrap">
              {service.detailDescription || service.description}
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-teal-400">Core Features & Specifications</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {((service.detailFeatures && service.detailFeatures.length > 0) ? service.detailFeatures : service.features).map((f, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-white/90">{f}</span>
                </div>
              ))}
            </div>
          </div>
          
          {service.workProcess && (
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-emerald-400">What We Do in This Work</h3>
              <p className="text-sm lg:text-base text-white/80 leading-relaxed border-l-2 border-amber-400 pl-4 whitespace-pre-wrap">
                {service.workProcess}
              </p>
            </div>
          )}
          
          <Link href="/contact" className="block w-full mt-10">
            <button className="w-full h-14 bg-linear-to-r from-orange-500 to-amber-500 rounded-xl font-bold tracking-wide uppercase text-[#000c15] text-sm hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-3">
              Request System Design Quote
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
