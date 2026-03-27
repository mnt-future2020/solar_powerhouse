"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import axios from "@/lib/axios";

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  image?: string;
}

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
    <section className="relative py-12 sm:py-16 lg:py-20 min-h-screen overflow-hidden bg-linear-to-br from-[#002654] to-[#000c15]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-10%] right-[-5%] w-[70%] sm:w-[60%] h-[60%] rounded-full bg-amber-400/10 blur-[100px] sm:blur-[150px]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[60%] sm:w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[100px] sm:blur-[150px]" 
        />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-8 sm:space-y-10 lg:space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mx-auto">
             <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
             <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">
               Our Solar Solutions
             </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight px-4">
            COMPREHENSIVE <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">SERVICES</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed px-4 max-w-2xl mx-auto">
            Discover our comprehensive range of solar solutions designed to guarantee your energy independence. 
            From residential grids to large scale industrial ecosystems.
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-t-2 border-r-2 border-amber-400 animate-spin" />
            <p className="mt-4 text-xs sm:text-sm font-bold text-white/60 animate-pulse">Loading solutions schema...</p>
          </div>
        ) : services.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pt-4"
          >
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                variants={fadeUpVariant}
                className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 shadow-xl"
              >
                {/* Image Section — padded */}
                <div className="p-2 pb-0">
                  <div className="relative w-full h-40 sm:h-44 lg:h-48 overflow-hidden rounded-xl sm:rounded-2xl">
                    {service.image ? (
                      <Image 
                        src={service.image}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={service.title}
                        priority={index < 3}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-4 sm:p-5 lg:p-6">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 leading-tight text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-600">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Features List — hidden on mobile */}
                  <div className="hidden sm:block space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 mt-auto">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 font-medium text-xs sm:text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <div className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wide pt-1">
                        + {service.features.length - 3} Additional Specs
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href={`/services/${service._id}`} className="block mt-auto w-full">
                    <button className="w-full relative inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold overflow-hidden transition-all bg-gray-900 hover:bg-gray-800 text-white hover:shadow-xl">
                      <span className="relative z-10 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wide">
                        Explore System <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
                      </span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-10">
            <p className="text-white/60 text-sm sm:text-base font-medium">No service algorithms currently mapped.</p>
          </div>
        )}
      </div>
    </section>
  );
}
