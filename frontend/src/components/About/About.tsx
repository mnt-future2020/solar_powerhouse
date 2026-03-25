"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ShieldCheck, Target, Eye, Award, Globe, Zap, ArrowRight, CheckCircle2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

interface Settings {
  email: string;
  phone: string;
}

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const values = [
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    description: "Every hardware component is tested to endure extreme weather, ensuring uninterrupted power generation.",
    color: "from-teal-400 to-emerald-400",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    stats: "Tier-1 Equipment"
  },
  {
    icon: Award,
    title: "Client-Centric Execution",
    description: "From structural analysis to final grid synchronization, your financial goals dictate our engineering.",
    color: "from-amber-400 to-orange-400",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/20",
    stats: "Dedicated Support"
  },
  {
    icon: Globe,
    title: "Rapid Deployment",
    description: "Our streamlined assembly framework guarantees your property goes solar with zero structural disruption.",
    color: "from-sky-400 to-blue-400",
    iconColor: "text-sky-400",
    bgColor: "bg-sky-500/20",
    stats: "Swift Installation"
  },
  {
    icon: Zap,
    title: "Continuous Innovation",
    description: "Deploying next-generation bifacial panels and smart micro-inverters for ultimate yield optimization.",
    color: "from-orange-400 to-red-400",
    iconColor: "text-orange-400",
    bgColor: "bg-orange-500/20",
    stats: "Maximized Yield"
  }
];

export default function About() {
  const [settings, setSettings] = useState<Settings>({
    email: "info@solarpowerhouse.com",
    phone: "+91 98765 43210"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/settings");
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative py-10 lg:py-16 overflow-hidden bg-linear-to-br from-[#002654] to-[#002d47]">
      {/* Decorative Background Elements */}
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
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full space-y-20 lg:space-y-32">
        
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="flex flex-col lg:flex-row gap-10 items-center"
        >
          <div className="lg:w-1/2 space-y-5">
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">
                Empowering Communities
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              ENGINEERING A <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-300">
                BRIGHTER TOMORROW.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-sm lg:text-base text-white/80 leading-relaxed max-w-lg">
              Solar Power House is your dedicated partner in the sustainable energy transition. 
              We build intelligent, high-yield solar infrastructures designed to <strong className="text-white">outlast and outperform</strong> traditional grid dependence.
            </motion.p>
          </div>
          
          <motion.div variants={fadeUpVariant} className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-video lg:aspect-[4/3] rounded-[2rem] overflow-hidden p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image 
                  src="/assets/image/hero_solar.png" 
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Solar Innovation"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#000c15]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-lg font-bold text-white mb-0.5">Innovating Clean Energy</h3>
                  <p className="text-xs text-white/70">Delivering autonomous power specifically scaled for your needs.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Who We Are & Stats grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="flex flex-col-reverse lg:flex-row gap-10 items-center"
        >
          <motion.div variants={fadeUpVariant} className="lg:w-1/2 w-full">
             <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-4">
                   <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center justify-center text-center shadow-lg aspect-square">
                     <div className="text-3xl lg:text-4xl font-black text-amber-400 mb-1">1,200+</div>
                     <div className="text-xs text-white/60 font-medium">Systems Deployed</div>
                   </div>
                   <div className="bg-emerald-500/10 backdrop-blur-md p-6 rounded-3xl border border-emerald-500/20 flex flex-col items-center justify-center text-center shadow-lg aspect-square">
                     <div className="text-3xl lg:text-4xl font-black text-emerald-400 mb-1">99.9%</div>
                     <div className="text-xs text-emerald-100/60 font-medium">Grid Reliability</div>
                   </div>
                </div>
                <div className="space-y-4 pt-8">
                   <div className="bg-sky-500/10 backdrop-blur-md p-6 rounded-3xl border border-sky-500/20 flex flex-col items-center justify-center text-center shadow-lg aspect-square">
                     <div className="text-3xl lg:text-4xl font-black text-sky-400 mb-1">50 MW+</div>
                     <div className="text-xs text-sky-100/60 font-medium">Capacity Installed</div>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center justify-center text-center shadow-lg aspect-square">
                     <div className="text-3xl lg:text-4xl font-black text-orange-400 mb-1">10+</div>
                     <div className="text-xs text-white/60 font-medium">Years Excellence</div>
                   </div>
                </div>
             </div>
          </motion.div>
          
          <motion.div variants={staggerContainer} className="lg:w-1/2 space-y-5">
            <motion.h2 variants={fadeUpVariant} className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              OUR <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">STORY</span>
            </motion.h2>
            <motion.div variants={fadeUpVariant} className="space-y-4 text-sm text-white/80 leading-relaxed">
              <p>
                Founded on the fundamental principle of democratizing clean energy, <strong className="text-white">Solar Power House</strong> has rapidly evolved into a premier renewable technology firm. We fuse cutting-edge hardware with meticulous engineering to completely eliminate your energy liabilities.
              </p>
              <p>
                From residential rooftops to sprawling commercial arrays, we handle end-to-end deployment including seamless grid synchronization and comprehensive government subsidy securement.
              </p>
              <ul className="grid grid-cols-2 gap-3 pt-4">
                {['End-to-End Engineering', 'Smart Grid Integration', 'Zero-Hassle Approvals', 'Lifetime Maintenance'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-white font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 lg:p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-[50px] rounded-full" />
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              To provide <strong className="text-white">high-quality solar installations</strong> and energy solutions that eliminate electricity costs, promote environmental sustainability, and deliver long-lasting value to our client ecosystem.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 lg:p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-[50px] rounded-full" />
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Eye className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              To remain the <strong className="text-white">trusted regional leader</strong> in solar solutions, architecting reliable, zero-emission infrastructure that permanently modernizes how communities power their future.
            </p>
          </motion.div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              WHY CHOOSE <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">US</span>
            </h2>
            <p className="text-sm text-white/70 font-medium">
              Our commitment to hyper-efficiency, architectural beauty, and lifetime customer satisfaction separates us.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {values.map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${v.bgColor} group-hover:scale-110 transition-transform`}>
                  <v.icon className={`h-5 w-5 ${v.iconColor}`} />
                </div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-black/20 text-white/80 text-[10px] font-bold mb-3 uppercase tracking-wider">
                  {v.stats}
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  {v.title}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {v.description}
                </p>
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl bg-linear-to-r ${v.color}`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-6 lg:p-10 rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
               <h3 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight">
                  READY FOR <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">TRUE INDEPENDENCE?</span>
               </h3>
               <p className="text-sm text-white/70 leading-relaxed max-w-md">
                  Take absolute control of your rising electricity costs today. 
                  Request a precise, engineered cost-benefit analysis tailored specifically to your roof metrics.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-6 pt-2">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Phone className="h-4 w-4 text-emerald-400" />
                     </div>
                     <div>
                        <div className="text-[10px] uppercase tracking-wider text-white/50">Direct Line</div>
                        <div className="text-sm text-white font-bold">{settings.phone}</div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                        <Mail className="h-4 w-4 text-amber-400" />
                     </div>
                     <div>
                        <div className="text-[10px] uppercase tracking-wider text-white/50">Email Support</div>
                        <div className="text-sm text-white font-bold">{settings.email}</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-black/20 p-6 rounded-2xl border border-white/5 shadow-inner text-center space-y-5">
               <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">Generate Your Savings Report</h4>
                  <p className="text-xs text-white/60">Comprehensive technical reports delivered in 24 hours.</p>
               </div>
               
               <Link 
                  href="/contact"
                  className="w-full relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold overflow-hidden transition-all bg-linear-to-r from-orange-500 to-amber-500 text-[#000c15] hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20 group"
               >
                  <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide">
                     GET FREE FEASIBILITY STUDY <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
               </Link>

               <div className="grid grid-cols-2 gap-3 text-xs text-white/70 text-left pt-3">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Custom ROI Blueprint</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Shadow Analysis</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Financial Structuring</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Worry-Free Setup</div>
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
