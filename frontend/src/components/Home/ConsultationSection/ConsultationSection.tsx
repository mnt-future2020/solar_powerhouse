'use client';
import { useState } from 'react';
import ConsultationModal from '@/components/ui/ConsultationModal';
import { Button } from '@/components/ui/button';
import { Sparkles, PhoneCall, ArrowRight, Zap } from 'lucide-react';

export default function ConsultationSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-40 overflow-hidden bg-solar-dark">
        {/* Visual Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <img 
            src="/assets/image/cta_bg.png" 
            className="w-full h-full object-cover"
            alt="Solar Grid"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-solar-dark via-solar-dark/95 to-transparent"></div>
        
        {/* Animated Glow */}
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-solar-amber/10 blur-[150px] rounded-full animate-pulse-glow"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl space-y-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl text-solar-amber text-xs font-black uppercase tracking-[0.2em]">
              <Zap className="h-4 w-4 fill-solar-amber" />
              <span>Investment Recovery in 4-6 Years</span>
            </div>
            
            <h2 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.85] font-display">
              READY TO <br />
              <span className="text-gradient-solar">DECENTRALIZE</span> <br />
              YOUR POWER?
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl">
              Join the elite league of energy-independent homeowners. 
              Our engineers are ready to build your custom ROI roadmap today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-6">
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-solar-amber to-solar-orange hover:from-solar-orange hover:to-solar-amber text-white font-black h-24 px-16 rounded-[2.5rem] text-2xl shadow-2xl shadow-solar-amber/30 transition-all hover:scale-105 active:scale-95 group"
              >
                BOOK FREE SURVEY
                <ArrowRight className="ml-3 h-8 w-8 group-hover:translate-x-2 transition-transform" />
              </Button>
              
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-solar-teal group-hover:text-white transition-all">
                  <PhoneCall className="h-7 w-7 text-solar-teal group-hover:text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Concierge Desk</div>
                  <div className="text-2xl font-black text-white group-hover:text-solar-teal transition-colors">+91 98765 43210</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}