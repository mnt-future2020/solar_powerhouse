"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
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

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function BankLogo({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className="w-20 h-16 mx-auto flex flex-col items-center justify-center gap-1 text-white/20">
        <ImageOff className="h-6 w-6" />
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
  const [loanTerm, setLoanTerm] = useState<number>(12);
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
    const monthlyRate = 0.0699 / 12; // 6.99% annual rate
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
      color: "from-teal-400 to-emerald-400",
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/20"
    },
    {
      icon: Percent,
      title: "Tax Benefits",
      description: "Accelerated depreciation and income tax benefits available",
      color: "from-amber-400 to-orange-400",
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/20"
    },
    {
      icon: Clock,
      title: "Quick Processing",
      description: "Fast approval and documentation process within 7-10 days",
      color: "from-sky-400 to-blue-400",
      iconColor: "text-sky-400",
      bgColor: "bg-sky-500/20"
    },
    {
      icon: DollarSign,
      title: "Flexible Terms",
      description: "Customizable repayment terms from 5 to 20 years",
      color: "from-orange-400 to-red-400",
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/20"
    }
  ];

  // Prevent hydration mismatch by not rendering until client-side
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
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mx-auto">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-white/90 uppercase">
              Solar Financing Solutions
            </span>
          </motion.div>
          <motion.h1 variants={fadeUpVariant} className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Pradhan Mantri <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-300">Surya Ghar</span> Muft Bijli Yojana
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-sm lg:text-base text-white/80 leading-relaxed">
            Make solar energy affordable with government-backed financing solutions. 
            Get subsidies and flexible payment options for your solar installation.
          </motion.p>
        </motion.div>

        {/* Bank Partners Section */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-4">
              FINANCING FOR SYSTEMS <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">&lt;= 3 KW</span>
            </h2>
          </div>
          
          {/* Bank Partners */}
          {bankPartners.length > 0 ? (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-white/90 mb-6 text-center">Partner Banks:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-center justify-items-center">
                {bankPartners.map((bank) => (
                  <motion.div 
                    key={bank._id}
                    variants={fadeUpVariant}
                    className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg w-full"
                  >
                    <BankLogo src={bank.image} alt={bank.name} />
                    <p className="text-center text-[10px] text-white/60 font-semibold mt-2 truncate">{bank.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-10 text-center text-white/40 py-8 text-sm">
              No partner banks added yet.
            </div>
          )}

          {/* Loan Details Table */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-5 bg-white/10 text-white font-semibold text-sm">
              <div className="p-4 border-r border-white/10">Loan Amt (Rs. Lakhs)</div>
              <div className="p-4 border-r border-white/10">Down Payment</div>
              <div className="p-4 border-r border-white/10">Interest p.a</div>
              <div className="p-4 border-r border-white/10">Tenure (yrs)</div>
              <div className="p-4">Geographies</div>
            </div>
            <div className="grid grid-cols-5 text-white/80 text-sm">
              <div className="p-4 border-r border-white/10">&lt;= 2</div>
              <div className="p-4 border-r border-white/10">5-10%</div>
              <div className="p-4 border-r border-white/10">6.00%</div>
              <div className="p-4 border-r border-white/10">Up to 10</div>
              <div className="p-4">Pan India</div>
            </div>
          </div>
        </motion.div>

        {/* EMI Calculator */}
        <motion.div 
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-2xl"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Calculator className="h-8 w-8 text-orange-400" />
                EMI Calculator
              </h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-white font-semibold mb-4 text-lg">
                    Loan Amount: {formatCurrency(loanAmount)}
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="100000"
                      max="2000000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer emi-slider"
                    />
                    <div className="flex justify-between text-white/70 text-sm mt-3">
                      <span>100,000</span>
                      <span>2,000,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-4 text-lg">
                    Loan Term: {loanTerm} years
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer emi-slider"
                    />
                    <div className="flex justify-between text-white/70 text-sm mt-3">
                      <span>5 years</span>
                      <span>20 years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Monthly EMI</h3>
              <div className="text-5xl font-black text-amber-400 mb-4">
                {formatCurrency(calculateEMI())}
              </div>
              <p className="text-white/80 text-base mb-6">
                Interest Rate: 6.99% per annum
              </p>
              <div className="grid grid-cols-2 gap-6 text-base">
                <div>
                  <div className="text-white/70 mb-1">Total Amount</div>
                  <div className="text-white font-bold text-lg">{formatCurrency(calculateEMI() * loanTerm * 12)}</div>
                </div>
                <div>
                  <div className="text-white/70 mb-1">Total Interest</div>
                  <div className="text-white font-bold text-lg">{formatCurrency((calculateEMI() * loanTerm * 12) - loanAmount)}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <div className="space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              WHY CHOOSE <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">US</span>
            </h2>
            <p className="text-sm text-white/70 font-medium">
              Our commitment to government-backed financing and seamless approval process separates us.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${benefit.bgColor} group-hover:scale-110 transition-transform`}>
                  <benefit.icon className={`h-5 w-5 ${benefit.iconColor}`} />
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {benefit.description}
                </p>
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl bg-linear-to-r ${benefit.color}`} />
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
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">SOLAR FINANCING?</span>
               </h3>
               <p className="text-sm text-white/70 leading-relaxed max-w-md">
                  Get government-backed financing with subsidies and flexible payment options. 
                  Apply now for pre-approval and start your solar journey today.
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
                  <h4 className="text-xl font-bold text-white">Apply for Solar Financing</h4>
                  <p className="text-xs text-white/60">Get pre-approved in minutes with government subsidies.</p>
               </div>
               
               <Link 
                  href="/contact"
                  className="w-full relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold overflow-hidden transition-all bg-linear-to-r from-orange-500 to-amber-500 text-[#000c15] hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20 group"
               >
                  <span className="relative z-10 flex items-center gap-2 text-sm tracking-wide">
                     <FileText className="h-4 w-4" />
                     APPLY NOW
                     <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
               </Link>

               <div className="grid grid-cols-2 gap-3 text-xs text-white/70 text-left pt-3">
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