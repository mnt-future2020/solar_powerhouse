'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Zap, ArrowRight, Star, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import ConsultationModal from '@/components/ui/ConsultationModal';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-mesh opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-background/50 to-background"></div>
      
      {/* Animated Glow Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-solar-amber/20 blur-[120px] rounded-full animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-solar-teal/20 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-5 py-2 glass rounded-2xl border border-white/10 shadow-xl shadow-black/5">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-slate-200 overflow-hidden">
                    <img src={`/assets/image/avatar_${i}.png`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Trusted by <span className="text-foreground">10,000+</span> Customers
              </p>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tight font-display text-foreground">
              PURE <br />
              <span className="text-gradient-solar">SOLAR</span> <br />
              REAL <span className="text-gradient-power">POWER</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium">
               Command the sun with high-performance architectures. 
               Engineered by <span className="text-gradient-solar font-black uppercase">Solar Power House</span> for <span className="text-foreground font-bold italic">maximum ROI</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 sm:flex-none">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-solar-amber to-solar-orange hover:from-solar-orange hover:to-solar-amber text-white font-black text-lg h-20 px-12 rounded-[2rem] shadow-2xl shadow-solar-amber/30 transition-all hover:scale-105 active:scale-95 group"
                >
                  CONSULT EXPERT
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <Link href="/services" className="flex-1 sm:flex-none">
                <Button size="lg" variant="outline" className="w-full sm:w-auto glass text-foreground border-border hover:bg-secondary h-20 px-12 rounded-[2rem] text-lg font-black tracking-wide">
                  VIEW SOLUTIONS
                </Button>
              </Link>
            </div>

            {/* Premium Badges */}
            <div className="flex flex-wrap gap-8 pt-6">
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-solar-teal/10 flex items-center justify-center border border-solar-teal/20 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6 text-solar-teal" />
                </div>
                <div>
                  <div className="text-sm font-black text-foreground">Tier 1 Equipment</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Certified Quality</div>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-solar-amber/10 flex items-center justify-center border border-solar-amber/20 group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-solar-amber" />
                </div>
                <div>
                  <div className="text-sm font-black text-foreground">25 Year Service</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Guaranteed Lifetime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Masterpiece */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square flex items-center justify-center p-12">
              {/* Complex Geometric Background */}
              <div className="absolute inset-0 rounded-[4rem] border-2 border-dashed border-border/50 animate-[spin_60s_linear_infinite]"></div>
              
              <div className="relative w-full h-full glass-card rounded-[3rem] p-1 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-solar-amber/20 to-solar-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img 
                  src="/assets/image/hero_solar.png" 
                  alt="Premium Solar Panel"
                  className="w-full h-full object-cover rounded-[2.8rem] brightness-90 group-hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Float Card Overlay */}
                <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-3xl border border-white/20 animate-float">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-solar-amber p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-black text-white">Grid Independence</span>
                    </div>
                    <span className="text-solar-amber font-black">98.5%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[98.5%] h-full bg-gradient-to-r from-solar-amber to-solar-orange"></div>
                  </div>
                </div>
              </div>

              {/* Orbital Icons */}
              <div className="absolute -top-4 -right-4 w-24 h-24 glass rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl animate-float" style={{ animationDelay: '0.5s' }}>
                <Sun className="h-10 w-10 text-solar-amber" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-20 glass rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl animate-float" style={{ animationDelay: '1.2s' }}>
                <Globe className="h-8 w-8 text-solar-teal mr-2" />
                <span className="font-black text-xs">GLOBAL REACH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
