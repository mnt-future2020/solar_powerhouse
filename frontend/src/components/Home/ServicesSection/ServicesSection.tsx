"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import axios from "@/lib/axios";

interface Service {
  _id: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 }
  })
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    axios.get("/services").then(r => setServices(r.data)).catch(() => {});
  }, []);

  return (
    <section id="services" className="py-10 sm:py-12 bg-linear-to-br from-[#002d47] via-[#002649] to-[#002654]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header — centered */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          custom={0}
          className="text-center mb-7 sm:mb-9"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-gradient-solar uppercase">Our Services</span>
          </div>
          <h4 className="text-4xl font-extrabold tracking-tight text-teal-100 leading-tight">
            Solar Solutions For{" "}
            <span className="text-gradient-solar">
              Every Need
            </span>
          </h4>
        </motion.div>

        {/* Cards */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUpVariant}
                custom={index + 1}
              >
                <Link href={`/services/${service._id}`} className="group block">
                  <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    {service.image ? (
                      <Image
                        src={service.image}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={service.title}
                        priority={index < 3}
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center">
                        <span className="text-white/40 text-sm">No image</span>
                      </div>
                    )}

                    {/* Bottom gradient for title readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

                    {/* Title — bottom left */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-base sm:text-lg leading-snug drop-shadow-md">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          // Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full aspect-4/3 rounded-2xl bg-white/30 animate-pulse" />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
