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
    <section className="relative py-10 lg:py-16 overflow-hidden bg-linear-to-br from-[#002654] to-[#000c15]">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-amber-400/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* 1 — Banner image (padded) */}
          {service.bannerImage && (
            <div className="p-2 pb-0">
              <div className="relative w-full h-52 sm:h-72 lg:h-96 rounded-xl overflow-hidden">
                <Image
                  src={service.bannerImage}
                  fill
                  className="object-cover"
                  alt={`${service.title} banner`}
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          )}

          <div className="p-5 sm:p-7 space-y-7">

            {/* 2 — Title + thumbnail + short description */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient-solar mb-4">
                {service.detailTitle || service.title}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                {service.image && (
                  <div className="sm:w-1/2 shrink-0">
                    <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden bg-gray-100 p-1.5 border border-gray-100">
                      <Image
                        src={service.image}
                        fill
                        className="object-cover rounded-lg"
                        alt={service.title}
                      />
                    </div>
                  </div>
                )}
                <p className="sm:w-1/2 text-sm sm:text-base text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* 3 — Full description */}
            {service.detailDescription && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-linear-to-b from-orange-400 to-amber-400 inline-block shrink-0" />
                  About This Service
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                  {service.detailDescription}
                </p>
              </div>
            )}

            {/* 4 — Features */}
            {features.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Features & Specifications
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5 — Benefits */}
            {benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500 shrink-0" />
                  Benefits
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-100">
                      <Star className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6 — What We Do */}
            {service.workProcess && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-500 shrink-0" />
                  What We Do in This Work
                </h3>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {service.workProcess}
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <Link href="/contact" className="block w-full">
              <button className="w-full py-4 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl font-bold uppercase tracking-wide text-white text-sm hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-3">
                Request a Free Quote
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
