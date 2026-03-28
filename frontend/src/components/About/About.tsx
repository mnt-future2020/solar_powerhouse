"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Target, Eye, Award, Globe, Zap, ArrowRight, CheckCircle2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

interface Settings {
  email: string;
  phone: string;
}

const values = [
  {
    icon: ShieldCheck,
    title: "Uncompromising Quality",
    description: "Every hardware component is tested to endure extreme weather, ensuring uninterrupted power generation.",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Tier-1 Equipment"
  },
  {
    icon: Award,
    title: "Client-Centric Execution",
    description: "From structural analysis to final grid synchronization, your financial goals dictate our engineering.",
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Dedicated Support"
  },
  {
    icon: Globe,
    title: "Rapid Deployment",
    description: "Our streamlined assembly framework guarantees your property goes solar with zero structural disruption.",
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
    tag: "Swift Installation"
  },
  {
    icon: Zap,
    title: "Continuous Innovation",
    description: "Deploying next-generation bifacial panels and smart micro-inverters for ultimate yield optimization.",
    accent: "text-orange-400",
    bg: "bg-orange-500/10",
    tag: "Maximized Yield"
  }
];

const stats = [
  { value: "1,200+", label: "Systems Deployed", color: "text-amber-400" },
  { value: "99.9%", label: "Grid Reliability", color: "text-emerald-400" },
  { value: "50 MW+", label: "Capacity Installed", color: "text-sky-400" },
  { value: "10+", label: "Years Excellence", color: "text-orange-400" },
];

export default function About() {
  const [settings, setSettings] = useState<Settings>({
    email: "info@solarpowerhouse.com",
    phone: "+91 98765 43210"
  });

  useEffect(() => {
    axios.get("/settings").then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#001a2e] to-[#000c15]">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">

        {/* ═══ Hero ═══ */}
        <div className="py-16 lg:py-24 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:w-1/2 space-y-5"
          >
            <p className="text-amber-400/70 text-xs font-semibold tracking-[0.15em] uppercase">
              Empowering Communities
            </p>

            <h1
              className="text-3xl lg:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Engineering a<br />
              <span className="text-amber-400">Brighter Tomorrow.</span>
            </h1>

            <p className="text-sm lg:text-base text-white/55 leading-relaxed max-w-lg">
              Solar Power House is your dedicated partner in the sustainable energy transition.
              We build intelligent, high-yield solar infrastructures designed to{" "}
              <strong className="text-white/80">outlast and outperform</strong> traditional grid dependence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:w-1/2 w-full"
          >
            <div className="relative w-full aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden border border-white/8 group">
              <Image
                src="/assets/image/hero_solar.png"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                alt="Solar Innovation"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#000c15]/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <h3 className="text-base font-bold text-white mb-0.5">Innovating Clean Energy</h3>
                <p className="text-xs text-white/50">Delivering autonomous power scaled for your needs.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══ Stats strip — horizontal, not card grid ═══ */}
        <div className="border-t border-b border-white/8 py-10 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-1`}
                     style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ Our Story ═══ */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:w-1/2 space-y-5"
          >
            <p className="text-orange-400/70 text-xs font-semibold tracking-[0.15em] uppercase">
              Our Story
            </p>
            <h2
              className="text-2xl lg:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Founded on the principle of<br />
              <span className="text-amber-400">democratizing clean energy.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:w-1/2 space-y-4"
          >
            <p className="text-sm text-white/50 leading-relaxed">
              <strong className="text-white/70">Solar Power House</strong> has rapidly evolved into a premier
              renewable technology firm. We fuse cutting-edge hardware with meticulous engineering to
              completely eliminate your energy liabilities.
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              From residential rooftops to sprawling commercial arrays, we handle end-to-end deployment
              including seamless grid synchronization and comprehensive government subsidy securement.
            </p>
            <ul className="grid grid-cols-2 gap-3 pt-3">
              {['End-to-End Engineering', 'Smart Grid Integration', 'Zero-Hassle Approvals', 'Lifetime Maintenance'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="text-sm text-white/70 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ═══ Mission & Vision — side by side, no glass ═══ */}
        <div className="grid md:grid-cols-2 gap-4 mb-24">
          {[
            {
              icon: Target,
              accent: "text-emerald-400",
              bg: "bg-emerald-500/10",
              title: "Our Mission",
              text: "To provide high-quality solar installations and energy solutions that eliminate electricity costs, promote environmental sustainability, and deliver long-lasting value to our client ecosystem."
            },
            {
              icon: Eye,
              accent: "text-amber-400",
              bg: "bg-amber-500/10",
              title: "Our Vision",
              text: "To remain the trusted regional leader in solar solutions, architecting reliable, zero-emission infrastructure that permanently modernizes how communities power their future."
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white/3 border border-white/8 p-6 lg:p-8 rounded-2xl hover:border-white/15 transition-colors duration-300"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-5`}>
                <card.icon className={`h-5 w-5 ${card.accent}`} />
              </div>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {card.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>

        {/* ═══ Why Choose Us — values list, not identical cards ═══ */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-xl mb-10"
          >
            <p className="text-orange-400/70 text-xs font-semibold tracking-[0.15em] uppercase mb-3">
              Why Choose Us
            </p>
            <h2
              className="text-2xl lg:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Built on precision,<br />delivered with care.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group p-5 rounded-2xl bg-white/3 border border-white/8 hover:border-white/15 transition-colors duration-300"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${v.bg}`}>
                  <v.icon className={`h-4 w-4 ${v.accent}`} />
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider text-white/40 bg-white/5 mb-3">
                  {v.tag}
                </span>
                <h4 className="text-base font-bold text-white mb-2">{v.title}</h4>
                <p className="text-xs text-white/45 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ CTA — clean, no glass ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/3 border border-white/8 rounded-2xl p-6 lg:p-10 mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h3
                className="text-2xl lg:text-4xl font-bold text-white leading-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Ready for<br />
                <span className="text-amber-400">True Independence?</span>
              </h3>
              <p className="text-sm text-white/45 leading-relaxed max-w-md">
                Take control of your rising electricity costs today.
                Request a precise, engineered cost-benefit analysis tailored to your roof metrics.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/35">Direct Line</div>
                    <div className="text-sm text-white font-semibold">{settings.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/35">Email</div>
                    <div className="text-sm text-white font-semibold">{settings.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/3 p-6 rounded-xl border border-white/6 text-center space-y-5">
              <div className="space-y-1">
                <h4
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Generate Your Savings Report
                </h4>
                <p className="text-xs text-white/40">Comprehensive technical reports delivered in 24 hours.</p>
              </div>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-amber-500 text-solar-warm hover:bg-amber-400 transition-colors duration-200 group"
              >
                <span className="flex items-center gap-2 text-sm tracking-wide">
                  GET FREE FEASIBILITY STUDY
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>

              <div className="grid grid-cols-2 gap-2 text-xs text-white/50 text-left pt-2">
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
