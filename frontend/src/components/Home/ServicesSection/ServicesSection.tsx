"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import axios from "@/lib/axios";

interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
}

const serviceImages: Record<number, string> = {
  0: "/assets/image/services/residential.png",
  1: "/assets/image/services/commercial.png",
  2: "/assets/image/services/maintenance.png",
  3: "/assets/image/services/residential.png",
  4: "/assets/image/services/commercial.png",
  5: "/assets/image/services/maintenance.png",
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag-to-scroll State
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    fetchServices();
  }, []);

  // Auto-play feature: advances to the next service every 3 seconds
  useEffect(() => {
    if (services.length === 0) return;
    
    const autoplayTimer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 180000);

    // Clears the timer if the user manually clicks an index, resetting the 3s clock
    return () => clearInterval(autoplayTimer);
  }, [services.length, activeIndex]);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    setDragMoved(true);
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walkX = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walkX;

    const y = e.pageY - scrollRef.current.offsetTop;
    const walkY = (y - startY) * 2;
    scrollRef.current.scrollTop = scrollTop - walkY;
  };

  const activeService = services[activeIndex];
  const activeImage = activeService ? (serviceImages[activeIndex % 6] || "/images/placeholder.svg") : "/images/placeholder.svg";

  return (
    <section id="services" className="relative py-10 lg:py-14 flex items-center overflow-hidden bg-[#000c15]">
      {/* Dynamic Background Image that updates sequentially */}
      <AnimatePresence mode="popLayout">
        <motion.div
           key={activeIndex}
           initial={{ opacity: 0, scale: 1.05 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           transition={{ duration: 1.2, ease: "easeInOut" }}
           className="absolute inset-0 z-0"
        >
          <Image src={activeImage} fill className="object-cover" alt="Service Background" priority />
        </motion.div>
      </AnimatePresence>

      {/* Dark Gradient Overlay replacing the basic background out to maintain contrast while preserving image visibility */}
      <div className="absolute inset-0 z-[1] bg-linear-to-r from-[#000c15]/95 via-[#000c15]/60 to-[#000c15]/20 backdrop-blur-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* TOP SECTION 100% WIDTH */}
        <div className="w-full text-center mb-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUpVariant}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mb-3">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">
                Our Services
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              BETTER UNIQUE <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">
                WORK
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
            {/* SECTION 35%: The Interactive Selector Menu */}
            <div className="lg:col-span-4 flex flex-col justify-center h-full pt-4 lg:pt-0">
               {/* Custom scrollbar hiding */}
               <style dangerouslySetInnerHTML={{__html: `
                 .hide-scrollbar::-webkit-scrollbar { display: none; }
               `}} />
               <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-visible w-full pb-4 lg:pb-0 lg:pr-4 snap-x lg:snap-none hide-scrollbar items-stretch" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                 {services.map((service, index) => {
                   const isActive = index === activeIndex;
                   return (
                     <button
                       key={service._id}
                       onClick={() => setActiveIndex(index)}
                       className={`group snap-center shrink-0 w-[85%] sm:w-[320px] lg:w-full text-left p-3 lg:p-4 rounded-xl transition-all duration-500 border focus:outline-none ${
                          isActive 
                          ? 'bg-white/10 backdrop-blur-2xl border-orange-500/50 shadow-[0_0_30px_-5px_rgba(249,115,22,0.2)] lg:translate-x-2'
                          : 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                       }`}
                     >
                       <div className="flex items-center justify-between">
                         <div className="flex-1 pr-3">
                            <h3 className={`text-base lg:text-lg font-bold mb-0.5 transition-colors duration-300 ${isActive ? 'text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300' : 'text-white'}`}>
                              {service.title}
                            </h3>
                            <p className={`text-xs line-clamp-1 transition-colors duration-300 ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                              {service.description}
                            </p>
                         </div>
                         <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-white/30 group-hover:bg-white/10 group-hover:text-white'}`}>
                            <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
                         </div>
                       </div>
                     </button>
                   );
                 })}
               </div>
            </div>

          {/* SECTION 65%: The Massive Detailed Showcase Image Component */}
          <div className="lg:col-span-8 w-full h-full flex items-center mt-4 lg:mt-0">
            <AnimatePresence mode="wait">
              {activeService && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden p-5 lg:p-6"
                >
                  {/* Detailed Large Image */}
                  <div className="relative w-full h-[180px] lg:h-[220px] rounded-2xl overflow-hidden mb-5 shadow-inner border border-white/10">
                     <Image src={activeImage} fill className="object-cover transition-transform duration-700 hover:scale-110" alt={activeService.title} />
                     <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                     <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold text-xs shadow-xl">
                          Featured Service
                        </div>
                     </div>
                  </div>

                  {/* Detailed Description */}
                  <h3 className="text-2xl lg:text-3xl font-black text-white mb-2">{activeService.title}</h3>
                  <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-5">{activeService.description}</p>
                  
                  {/* Features List */}
                  <div className="grid sm:grid-cols-2 gap-2 mb-5">
                     {activeService.features.slice(0, 4).map((f, i) => (
                       <div key={i} className="flex items-start gap-2.5">
                         <div className="bg-emerald-500/20 p-1 rounded-full border border-emerald-500/30 shrink-0 mt-0.5">
                           <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                         </div>
                         <span className="text-sm font-medium text-white/90">{f}</span>
                       </div>
                     ))}
                  </div>

                  {/* Navigation Action */}
                  <Link href={`/services/${activeService._id}`} className="block">
                     <button className="w-full relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold overflow-hidden transition-all bg-linear-to-r from-orange-500 to-amber-500 text-[#000c15] hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20 group">
                        <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide">
                           EXPLORE SOLUTION DETAILS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
