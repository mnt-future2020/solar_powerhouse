"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  image?: string;
}

const LIMIT = 6;

export default function Service() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get("/services")
      .then(r => setServices(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(services.length / LIMIT);
  const paginated = services.slice((page - 1) * LIMIT, page * LIMIT);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-14 sm:py-20 lg:py-24 min-h-screen overflow-hidden bg-linear-to-b from-[#001a2e] to-[#000c15]">
      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-2xl mb-12 lg:mb-16"
        >
          <p className="text-amber-400/70 text-xs font-semibold tracking-[0.15em] uppercase mb-3">
            Our Solar Solutions
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Comprehensive Services
          </h1>
          <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-lg">
            Discover our range of solar solutions designed to guarantee your energy independence —
            from residential grids to large-scale industrial ecosystems.
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/4 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-white/6" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/6 rounded w-3/4" />
                  <div className="h-3 bg-white/4 rounded w-full" />
                  <div className="h-3 bg-white/4 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {paginated.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.07,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <Link href={`/services/${service._id}`} className="group block h-full">
                    <div className="h-full flex flex-col bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-colors duration-300">
                      {/* Image */}
                      <div className="relative w-full h-48 sm:h-52 overflow-hidden">
                        {service.image ? (
                          <Image
                            src={service.image}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                            alt={service.title}
                            priority={index < 3}
                          />
                        ) : (
                          <div className="w-full h-full bg-white/6 flex items-center justify-center">
                            <span className="text-white/25 text-sm">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a]/50 via-transparent to-transparent" />

                        {/* Hover arrow */}
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowUpRight className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5">
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-4">
                          {service.description}
                        </p>

                        {/* Features */}
                        {service.features.length > 0 && (
                          <div className="space-y-1.5 mt-auto pt-4 border-t border-white/6">
                            {service.features.slice(0, 3).map((feature, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="text-xs text-white/50 font-medium leading-snug">{feature}</span>
                              </div>
                            ))}
                            {service.features.length > 3 && (
                              <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider pt-1">
                                + {service.features.length - 3} more specs
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors',
                      p === page
                        ? 'bg-amber-500 text-[#0a0a0a]'
                        : 'border border-white/10 text-white/40 hover:text-white hover:border-white/25'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white/3 rounded-2xl border border-white/8">
            <p className="text-white/40 text-sm font-medium">No services available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
