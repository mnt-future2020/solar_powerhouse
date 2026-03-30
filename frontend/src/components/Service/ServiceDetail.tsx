"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Star, Wrench } from "lucide-react";

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
  benefits?: string[];
}

export default function ServiceDetail({ service }: { service: ServiceType }) {
  const features = service.detailFeatures?.length ? service.detailFeatures : service.features;
  const benefits = service.benefits ?? [];

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden bg-linear-to-b from-[#001a2e] to-[#000c15]">
      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-10"
        >
          {/* Banner */}
          {service.bannerImage && (
            <div className="relative w-full h-52 sm:h-72 lg:h-96 rounded-2xl overflow-hidden border border-white/8">
              <Image
                src={service.bannerImage}
                fill
                className="object-cover"
                alt={`${service.title} banner`}
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#000c15]/50 via-transparent to-transparent" />
            </div>
          )}

          {/* Title + Image + Description */}
          <div>
            <p className="text-amber-400/70 text-xs font-semibold tracking-[0.15em] uppercase mb-3">
              Service Detail
            </p>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
            >
              {service.detailTitle || service.title}
            </h1>

            <div className="flex flex-col sm:flex-row gap-6">
              {service.image && (
                <div className="sm:w-1/2 shrink-0">
                  <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/8">
                    <Image
                      src={service.image}
                      fill
                      className="object-cover"
                      alt={service.title}
                    />
                  </div>
                </div>
              )}
              <p className={`text-sm text-white/50 leading-relaxed ${service.image ? 'sm:w-1/2' : ''}`}>
                {service.description}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/8" />

          {/* About This Service */}
          {service.detailDescription && (
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-amber-500 inline-block shrink-0" />
                About This Service
              </h3>
              <p className="text-sm text-white/45 leading-relaxed whitespace-pre-wrap">
                {service.detailDescription}
              </p>
            </div>
          )}

          {/* Features & Specifications */}
          {features.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                Features & Specifications
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-white/3 border border-white/6 rounded-xl p-3.5 hover:border-white/12 transition-colors duration-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/60 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 shrink-0" />
                Benefits
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 hover:border-amber-500/20 transition-colors duration-200">
                    <Star className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/60 font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Process */}
          {service.workProcess && (
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-sky-400 shrink-0" />
                What We Do in This Work
              </h3>
              <div className="bg-sky-500/5 border border-sky-500/10 rounded-xl p-5">
                <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">
                  {service.workProcess}
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <Link href="/contact#contact-form" className="block w-full">
            <button className="w-full py-4 bg-amber-500 hover:bg-amber-400 rounded-xl font-bold uppercase tracking-wide text-solar-warm text-sm transition-colors duration-200 flex items-center justify-center gap-3 group">
              Request a Free Quote
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>

        </motion.div>
      </div>
    </section>
  );
}
