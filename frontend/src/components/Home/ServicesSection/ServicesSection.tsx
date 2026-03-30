"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import axios from "@/lib/axios";

interface Service {
  _id: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    axios.get("/services").then(r => setServices(r.data)).catch(() => {});
  }, []);

  return (
    <section id="services" className="py-16 sm:py-24 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12 max-w-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-amber-500" />
            <p className="text-amber-600 text-xs font-semibold tracking-[0.15em] uppercase">
              Our Services
            </p>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] leading-tight"
          >
            Solar Solutions For Every Need
          </h2>
          <p className="text-[#6b6b6b] text-sm mt-3 max-w-md leading-relaxed">
            From residential rooftops to commercial installations, we deliver systems engineered for maximum efficiency.
          </p>
        </motion.div>

        {/* Cards */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => {
              const isFeatured = index === 0 && services.length > 2;

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.45,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: index * 0.07
                  }}
                  className={isFeatured ? "sm:col-span-2 lg:col-span-2" : ""}
                >
                  <Link href={`/services/${service._id}`} className="group block h-full">
                    <div className={`relative w-full overflow-hidden ${isFeatured ? 'aspect-2.5/1' : 'aspect-4/3'}`}>
                      {service.image ? (
                        <Image
                          src={service.image}
                          fill
                          sizes={isFeatured
                            ? "(max-width: 640px) 100vw, 66vw"
                            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          }
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                          alt={service.title}
                          priority={index < 3}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e8e6e3] flex items-center justify-center">
                          <span className="text-[#999] text-sm">No image</span>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a]/75 via-[#0a0a0a]/15 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                        <div>
                          {isFeatured && service.description && (
                            <p className="text-white/50 text-xs mb-1.5 max-w-md hidden sm:block">
                              {service.description.slice(0, 100)}{service.description.length > 100 ? '...' : ''}
                            </p>
                          )}
                          <h3
                            className={`text-white font-bold leading-snug ${isFeatured ? 'text-lg sm:text-2xl' : 'text-base sm:text-lg'}`}
                          >
                            {service.title}
                          </h3>
                        </div>
                        <div className="shrink-0 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowUpRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-2 lg:col-span-2 aspect-2.5/1 bg-[#e8e6e3] animate-pulse" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="aspect-4/3 bg-[#e8e6e3] animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
