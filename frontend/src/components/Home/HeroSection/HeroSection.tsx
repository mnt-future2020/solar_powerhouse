'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Zap, ArrowRight, Star, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import ConsultationModal from '@/components/ui/ConsultationModal';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-linear-to-br from-green-800 via-green-700 to-green-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-tl from-emerald-700 via-green-800 to-teal-900"></div>

      {/* Subtle Glow Elements */}

      <div className="max-w-7xl mx-auto px-6 section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-semibold text-white">
              PURE <span className="text-amber-400">ENERGY</span><br /> FOR A
              <span className="bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> SOLAR</span> <br />
              REAL <span className="bg-linear-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">POWER</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-green-100 leading-relaxed max-w-xl font-medium">
               Professional solar energy solutions engineered for maximum efficiency. 
               Trusted by <span className="bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-bold">Solar Power House</span> for <span className="text-white font-semibold">guaranteed ROI</span>.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 py-6">
              <div className="text-center">
                <div className="text-4xl font-black text-green-400">500+</div>
                <div className="text-sm font-semibold text-green-200 uppercase tracking-wide">Installations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-amber-400">80%</div>
                <div className="text-sm font-semibold text-green-200 uppercase tracking-wide">Bill Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-orange-400">10+ yrs</div>
                <div className="text-sm font-semibold text-green-200 uppercase tracking-wide">Solar Experience</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-linear-to-r from-orange-500 to-amber-500 px-12 py-6 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                CONSULT EXPERT
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/services">
                <Button 
                  variant="outline" 
                  className="border border-white text-white hover:bg-yellow-400 font-semibold text-lg px-12 py-6 rounded-md transition-all duration-300"
                >
                  VIEW SOLUTIONS
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Solar Panel Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square flex items-center justify-center p-8">
              {/* Decorative Border */}
              <div className="absolute inset-0 rounded-[3rem] border-2 border-dashed border-green-400/30 animate-[spin_60s_linear_infinite]"></div>
              
              {/* Main Image Container */}
              <div className="relative w-full h-full bg-linear-to-br from-green-600/20 to-amber-600/20 backdrop-blur-sm rounded-[2.5rem] p-1 overflow-hidden group border border-green-400/20">
                <div className="absolute inset-0 bg-linear-to-br from-amber-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="/assets/image/hero_solar.png" 
                  alt="Professional Solar Installation"
                  className="w-full h-full object-cover rounded-[2.3rem] group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                <Sun className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}