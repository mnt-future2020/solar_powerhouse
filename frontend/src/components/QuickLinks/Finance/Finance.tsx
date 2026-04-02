"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  Percent,
  DollarSign,
  Shield,
  Clock,
  FileText,
  Phone,
  Mail,
  ImageOff
} from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

interface BankPartner {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
}

interface Settings {
  email: string;
  phone: string;
}

const INTEREST_RATE = 0.06; // 6.00% annual rate
const MAX_TENURE = 10; // years — matches loan terms table

function BankLogo({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className="w-20 h-16 mx-auto flex flex-col items-center justify-center gap-1 text-white/50 bg-white/5 rounded-lg">
        <ImageOff className="h-5 w-5" />
        <span className="text-[8px] font-medium leading-tight text-center px-1">{alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="w-20 h-16 mx-auto object-contain group-hover:scale-105 transition-transform duration-300"
    />
  );
}

export default function Finance() {
  const [loanAmount, setLoanAmount] = useState<number>(150000);
  const [loanTerm, setLoanTerm] = useState<number>(7);
  const [bankPartners, setBankPartners] = useState<BankPartner[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    email: "solarpowerhouse2020@gmail.com",
    phone: "+91 9944888170"
  });

  useEffect(() => {
    setIsClient(true);
    fetchBankPartners();
    fetchSettings();
  }, []);

  const fetchBankPartners = async () => {
    try {
      const response = await axios.get("/bank-partners");
      setBankPartners(response.data);
    } catch (error) {
      console.error("Failed to load bank partners:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/settings");
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    if (!isClient) return amount.toString();
    return amount.toLocaleString('en-IN');
  };

  const calculateEMI = () => {
    const monthlyRate = INTEREST_RATE / 12;
    const months = loanTerm * 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const benefits = [
    {
      icon: Shield,
      title: "Government Subsidies",
      description: "Up to 40% subsidy on solar installations under PM Surya Ghar scheme",
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Percent,
      title: "Tax Benefits",
      description: "Accelerated depreciation and income tax benefits available",
      accent: "text-amber-400",
      bg: "bg-amber-500/10"
    },
    {
      icon: Clock,
      title: "Quick Processing",
      description: "Fast approval and documentation process within 7-10 days",
      accent: "text-sky-400",
      bg: "bg-sky-500/10"
    },
    {
      icon: DollarSign,
      title: "Flexible Terms",
      description: `Customizable repayment terms from 1 to ${MAX_TENURE} years`,
      accent: "text-orange-400",
      bg: "bg-orange-500/10"
    }
  ];

  if (!isClient) {
    return (
      <section className="relative py-10 lg:py-16 overflow-hidden bg-linear-to-br from-[#002654] to-[#002d47]">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-10 lg:py-16 overflow-hidden bg-linear-to-br from-[#002654] to-[#002d47]">
      {/* Subtle grid texture — no glowing orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full space-y-12 sm:space-y-20 lg:space-y-28">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-4xl mx-auto space-y-5"
        >
          <p className="text-amber-400/70 text-xs font-semibold tracking-[0.15em] uppercase">
            Solar Financing Solutions
          </p>
          <h1
            className="text-3xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            Pradhan Mantri{" "}
            <span className="text-amber-400">Surya Ghar</span>{" "}
            Muft Bijli Yojana
          </h1>
          <p className="text-sm lg:text-base text-white/60 leading-relaxed max-w-2xl mx-auto">
            Make solar energy affordable with government-backed financing solutions.
            Get subsidies and flexible payment options for your solar installation.
          </p>
        </motion.div>

        {/* Bank Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/4 border border-white/8 rounded-2xl p-6 lg:p-8"
        >
          <div className="text-center mb-8">
            <h2
              className="text-2xl lg:text-3xl font-bold text-white mb-2"
            >
              Financing For Systems{" "}
              <span className="text-amber-400">&lt;= 3 KW</span>
            </h2>
          </div>

          {/* Bank Partners */}
          {bankPartners.length > 0 ? (
            <div className="mb-10">
              <h3 className="text-sm font-semibold text-white/50 mb-6 text-center uppercase tracking-wide">Partner Banks</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-center justify-items-center">
                {bankPartners.map((bank, index) => (
                  <motion.div
                    key={bank._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="group bg-white/4 border border-white/8 rounded-xl p-4 hover:bg-white/8 hover:border-white/15 transition-all duration-300 w-full"
                  >
                    <BankLogo src={bank.image} alt={bank.name} />
                    <p className="text-center text-xs text-white/70 font-medium mt-2 truncate">{bank.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-10 text-center text-white/30 py-8 text-sm">
              No partner banks added yet.
            </div>
          )}

          {/* Loan Details Table */}
          <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-5 bg-white/6 text-white font-semibold text-xs sm:text-sm">
                <div className="p-3 sm:p-4 border-r border-white/8">Loan Amt (Rs. Lakhs)</div>
                <div className="p-3 sm:p-4 border-r border-white/8">Down Payment</div>
                <div className="p-3 sm:p-4 border-r border-white/8">Interest p.a</div>
                <div className="p-3 sm:p-4 border-r border-white/8">Tenure (yrs)</div>
                <div className="p-3 sm:p-4">Geographies</div>
              </div>
              <div className="grid grid-cols-5 text-white/70 text-xs sm:text-sm">
                <div className="p-3 sm:p-4 border-r border-white/8">&lt;= 2</div>
                <div className="p-3 sm:p-4 border-r border-white/8">5-10%</div>
                <div className="p-3 sm:p-4 border-r border-white/8">6.00%</div>
                <div className="p-3 sm:p-4 border-r border-white/8">Up to {MAX_TENURE}</div>
                <div className="p-3 sm:p-4">Pan India</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* EMI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/4 border border-white/8 rounded-2xl p-6 lg:p-8"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2
                className="text-2xl lg:text-3xl font-bold text-white mb-8 flex items-center gap-3"
              >
                <Calculator className="h-7 w-7 text-amber-400" />
                EMI Calculator
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-white font-semibold mb-4 text-base">
                    Loan Amount: <span className="text-amber-400">₹{formatCurrency(loanAmount)}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="100000"
                      max="2000000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      aria-label="Loan amount slider"
                      aria-valuemin={100000}
                      aria-valuemax={2000000}
                      aria-valuenow={loanAmount}
                      aria-valuetext={`${formatCurrency(loanAmount)} rupees`}
                      className="w-full h-3 bg-white/15 rounded-lg appearance-none cursor-pointer emi-slider"
                    />
                    <div className="flex justify-between text-white/50 text-xs mt-3">
                      <span>₹1,00,000</span>
                      <span>₹20,00,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-4 text-base">
                    Loan Term: <span className="text-amber-400">{loanTerm} years</span>
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max={MAX_TENURE}
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      aria-label="Loan term slider"
                      aria-valuemin={1}
                      aria-valuemax={MAX_TENURE}
                      aria-valuenow={loanTerm}
                      aria-valuetext={`${loanTerm} years`}
                      className="w-full h-3 bg-white/15 rounded-lg appearance-none cursor-pointer emi-slider"
                    />
                    <div className="flex justify-between text-white/50 text-xs mt-3">
                      <span>1 year</span>
                      <span>{MAX_TENURE} years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/4 border border-amber-500/20 rounded-2xl p-8">
              <h3 className="text-sm font-bold text-white/60 mb-2 uppercase tracking-wide">Monthly EMI</h3>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 mb-4">
                ₹{formatCurrency(calculateEMI())}
              </div>
              <p className="text-white/50 text-sm mb-6">
                Interest Rate: {(INTEREST_RATE * 100).toFixed(2)}% per annum
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/8">
                <div>
                  <div className="text-white/40 mb-1 text-xs uppercase tracking-wide">Total Amount</div>
                  <div className="text-white font-bold font-display text-lg">₹{formatCurrency(calculateEMI() * loanTerm * 12)}</div>
                </div>
                <div>
                  <div className="text-white/40 mb-1 text-xs uppercase tracking-wide">Total Interest</div>
                  <div className="text-white font-bold font-display text-lg">₹{formatCurrency((calculateEMI() * loanTerm * 12) - loanAmount)}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <h2
              className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight"
            >
              Why Choose <span className="text-amber-400">Us</span>
            </h2>
            <p className="text-sm text-white/50">
              Our commitment to government-backed financing and seamless approval process separates us.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group p-5 rounded-xl bg-white/3 border border-white/8 hover:bg-white/6 hover:border-white/15 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${benefit.bg} group-hover:scale-110 transition-transform`}>
                  <benefit.icon className={`h-5 w-5 ${benefit.accent}`} />
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white/3 border border-white/8 p-6 lg:p-10 rounded-2xl"
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
               <h3
                 className="text-2xl lg:text-4xl font-bold text-white leading-tight"
               >
                  Ready For{" "}
                  <span className="text-amber-400">Solar Financing?</span>
               </h3>
               <p className="text-sm text-white/50 leading-relaxed max-w-md">
                  Get government-backed financing with subsidies and flexible payment options.
                  Apply now for pre-approval and start your solar journey today.
               </p>

               <div className="flex flex-col sm:flex-row gap-6 pt-2">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-emerald-400" />
                     </div>
                     <div>
                        <div className="text-[10px] uppercase tracking-wider text-white/40">Direct Line</div>
                        <div className="text-sm text-white font-bold">{settings.phone}</div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-amber-400" />
                     </div>
                     <div>
                        <div className="text-[10px] uppercase tracking-wider text-white/40">Email Support</div>
                        <div className="text-sm text-white font-bold">{settings.email}</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white/3 p-6 rounded-xl border border-white/8 text-center space-y-5">
               <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">Apply for Solar Financing</h4>
                  <p className="text-xs text-white/40">Get pre-approved in minutes with government subsidies.</p>
               </div>

               <Link
                  href="/contact#contact-form"
                  className="w-full relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold overflow-hidden transition-all bg-amber-500 text-[#000c15] hover:bg-amber-400 group"
               >
                  <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide">
                     <FileText className="h-4 w-4" />
                     APPLY NOW
                     <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
               </Link>

               <div className="grid grid-cols-2 gap-3 text-xs text-white/50 text-left pt-3">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Government Subsidies</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Quick Approval</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Flexible Terms</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Expert Support</div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
