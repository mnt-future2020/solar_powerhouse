'use client';
import { useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ConsultationModal from '@/components/ui/ConsultationModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Target, Eye, Award, Globe, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const values = [
  {
    icon: ShieldCheck,
    title: 'Precision Integrity',
    description: 'Every architecture we deploy is engineered for 30+ years of structural and energy excellence.',
    color: 'solar-teal'
  },
  {
    icon: Award,
    title: 'Certified Mastery',
    description: 'Official Tier-1 certification across all inverter and panel technologies we integrate.',
    color: 'solar-amber'
  },
  {
    icon: Globe,
    title: 'Sustainable Growth',
    description: 'We prioritize ecological ROI as much as financial, ensuring zero-emission energy transition.',
    color: 'solar-green'
  }
];

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-solar-amber/30">
      <Header />
      
      <main className="flex-1 pt-40 pb-32 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-10 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-16 mb-40 animate-fade-in-up">
            <div className="lg:w-1/2 space-y-10">
              <Badge className="bg-solar-amber/10 text-solar-amber hover:bg-solar-amber/20 border-solar-amber/20 px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
                Corporate identity
              </Badge>
              <h1 className="text-7xl md:text-9xl font-black font-display tracking-tighter text-foreground leading-[0.85]">
                PIONEERING <br />
                <span className="text-gradient-solar">RENEWABLE</span> <br />
                MASTERY.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                Solar Power House isn't just an installer—we are energy architects. 
                We specialize in high-performance solar ecosystems that deliver <span className="text-foreground font-bold">maximum resilience</span> for residential and industrial complexes.
              </p>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-solar-amber/5 blur-[100px] rounded-full"></div>
              <div className="relative h-full min-h-[400px] glass-card rounded-[3.5rem] border border-white/10 p-2 overflow-hidden group">
                <img 
                  src="/assets/image/hero_solar.png" 
                  className="w-full h-full object-cover rounded-[3rem] brightness-75 group-hover:scale-110 transition-transform duration-1000"
                  alt="Solar Innovation"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-solar-dark/80 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
                  <h3 className="text-3xl font-black">Building Global Sustainability</h3>
                  <p className="font-medium text-gray-300">Empowering 10,000+ homes with next-gen energy autonomy.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who We Are Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-40 animate-fade-in-up">
            <div className="lg:w-1/2">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-black/20 group">
                <img 
                  src="/assets/image/solar_tech.png" 
                  alt="Who We Are" 
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-solar-amber/20 to-transparent"></div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-5xl md:text-6xl font-black font-display tracking-tight text-foreground">
                WHO <span className="text-gradient-solar">WE ARE</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
                <p>
                  <span className="text-foreground font-bold">Solar Power House</span> specializes in designing, installing, and maintaining solar power systems for homes and businesses. Our goal is to help customers reduce electricity costs while promoting sustainable energy and a greener future.
                </p>
                <p>
                  Our services include rooftop solar installation, on-grid solar systems, net metering support, and subsidy assistance under the <span className="text-solar-amber font-bold">PM Surya Ghar Muft Bijli Yojana</span>, where homeowners can receive subsidies up to <span className="text-foreground font-bold">₹78,000</span>.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {['Rooftop Installation', 'On-Grid Systems', 'Net Metering', 'Subsidy Support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-solar-teal" />
                      <span className="text-foreground font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-40">
            <div className="glass-card p-12 lg:p-16 rounded-[3.5rem] border border-white/10 hover:border-solar-teal/30 group transition-all animate-fade-in-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-solar-teal/5 blur-3xl rounded-full"></div>
              <div className="w-16 h-16 rounded-2xl bg-solar-teal/10 border border-solar-teal/20 flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform">
                <Target className="h-8 w-8 text-solar-teal" />
              </div>
              <h3 className="text-4xl font-black mb-6">Our Mission</h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                To provide <span className="text-foreground font-bold">high-quality solar installations</span> and energy solutions that reduce electricity costs, promote environmental sustainability, and deliver long-term value to our customers through innovation, reliability, and excellent service.
              </p>
            </div>
            <div className="glass-card p-12 lg:p-16 rounded-[3.5rem] border border-white/10 hover:border-solar-amber/30 group transition-all animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-solar-amber/5 blur-3xl rounded-full"></div>
              <div className="w-16 h-16 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center mb-10 group-hover:-rotate-6 transition-transform">
                <Eye className="h-8 w-8 text-solar-amber" />
              </div>
              <h3 className="text-4xl font-black mb-6">Our Vision</h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                To become a <span className="text-foreground font-bold">trusted leader</span> in solar energy solutions, empowering homes and businesses with clean, reliable, and affordable renewable power for a sustainable future.
              </p>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="space-y-24 mb-40">
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-7xl font-black font-display tracking-tight">
                THE CORE <span className="text-gradient-power">FOUNDATION</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                Our operations are guided by a relentless focus on engineering precision and customer ROI.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((v, i) => (
                <div 
                  key={i} 
                  className="p-10 rounded-[2.5rem] border border-border bg-card/30 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-2 transition-all group"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-500 group-hover:scale-110 shadow-lg shadow-black/5",
                    v.color === 'solar-teal' && "bg-solar-teal/10 border-solar-teal/20 text-solar-teal",
                    v.color === 'solar-amber' && "bg-solar-amber/10 border-solar-amber/20 text-solar-amber",
                    v.color === 'solar-green' && "bg-solar-green/10 border-solar-green/20 text-solar-green"
                  )}>
                    <v.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-2xl font-black mb-4 tracking-tight">{v.title}</h4>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-40 rounded-[4rem] bg-zinc-900 dark:bg-white p-12 lg:p-24 text-white dark:text-zinc-900 relative overflow-hidden group border border-zinc-800 dark:border-zinc-200 shadow-2xl">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-solar-amber/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
              <div className="space-y-6 max-w-2xl">
                <h3 className="text-4xl md:text-6xl font-black font-display tracking-tight text-white dark:text-zinc-900 leading-tight">
                  READY TO BUILD YOUR <br />
                  <span className="text-solar-amber">ENERGY FUTURE?</span>
                </h3>
                <p className="text-xl text-zinc-400 dark:text-zinc-600 font-medium">
                  Connect with our lead architects and start your transition to high-performance energy independence today.
                </p>
              </div>
              <div className="w-full lg:w-auto">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full lg:w-auto bg-solar-amber hover:bg-solar-orange text-white font-black h-24 px-16 rounded-[2.5rem] text-2xl transition-all hover:scale-105 shadow-2xl shadow-solar-amber/30 border-none"
                >
                  CONSULT NOW
                  <ArrowRight className="ml-3 h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
