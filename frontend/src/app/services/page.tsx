'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ConsultationModal from '@/components/ui/ConsultationModal';
import axios from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  ArrowRight, 
  Home, 
  Building, 
  Settings, 
  CheckCircle2,
  TrendingUp,
  BatteryCharging
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  image?: string;
}

const serviceImages: Record<number, string> = {
  0: '/assets/image/services/residential.png',
  1: '/assets/image/services/commercial.png',
  2: '/assets/image/services/maintenance.png',
};

const serviceIcons = [Home, Building, Settings];
const serviceColors = ['solar-amber', 'solar-teal', 'solar-green'];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-solar-amber/30">
      <Header />
      
      <main className="flex-1 pt-40 pb-20 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-solar-teal/10 blur-[120px] rounded-full opacity-30 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          
          {/* Header Section */}
          <div className="max-w-4xl mb-24 animate-fade-in-up">
            <Badge className="bg-solar-teal/10 text-solar-teal hover:bg-solar-teal/20 border-solar-teal/20 px-6 py-2 rounded-full mb-8 font-black uppercase tracking-[0.2em] text-[10px]">
              Engineered Solutions
            </Badge>
            <h1 className="text-7xl md:text-9xl font-black font-display tracking-tight text-foreground leading-[0.85] mb-8">
              ENERGY <br />
              <span className="text-gradient-solar">ARCHITECTURES</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              We specialize in modular, high-performance solar ecosystems. 
              Each installation is a custom energy plant designed for <span className="text-foreground font-bold italic">maximum self-consumption</span> and grid independence.
            </p>
          </div>

          {/* Statistics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32 child:glass-card child:p-8 child:rounded-3xl animate-fade-in-up">
            <div className="group">
              <TrendingUp className="h-6 w-6 text-solar-amber mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-black">₹32M+</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Client Savings</div>
            </div>
            <div className="group">
              <BatteryCharging className="h-6 w-6 text-solar-teal mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-black">98.5%</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Grid Efficiency</div>
            </div>
            <div className="group">
              <Zap className="h-6 w-6 text-solar-orange mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-black">15GW+</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Clean Power Gen</div>
            </div>
            <div className="group">
              <CheckCircle2 className="h-6 w-6 text-solar-green mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-black">Tier-1</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Hardware Grade</div>
            </div>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="text-center py-40">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-solar-amber"></div>
              <p className="mt-6 text-xl font-bold text-muted-foreground animate-pulse">Synchronizing Data Nodes...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-10">
              {services.map((service, index) => {
                const Icon = serviceIcons[index % 3];
                const color = serviceColors[index % 3];
                return (
                  <div
                    key={service._id}
                    className="group relative overflow-hidden rounded-[3.5rem] border border-border bg-card transition-all duration-700 hover:shadow-2xl hover:border-solar-amber/20 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Visual Asset */}
                    <div className="h-80 overflow-hidden relative">
                      <div className="absolute inset-0 bg-linear-to-t from-card via-card/10 to-transparent z-10"></div>
                      <img 
                        src={serviceImages[index % 3] || '/assets/image/hero_solar.png'} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className={cn(
                        "absolute top-8 left-8 z-20 w-16 h-16 rounded-[1.25rem] flex items-center justify-center border backdrop-blur-md transition-all duration-500 group-hover:rotate-6 shadow-xl",
                        color === 'solar-amber' && "bg-solar-amber/20 border-solar-amber/30 text-solar-amber",
                        color === 'solar-teal' && "bg-solar-teal/20 border-solar-teal/30 text-solar-teal",
                        color === 'solar-green' && "bg-solar-green/20 border-solar-green/30 text-solar-green"
                      )}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="absolute bottom-10 left-10 z-20">
                        <span className="text-3xl font-black text-white">₹{service.price.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mt-1">Architectural Base</span>
                      </div>
                    </div>

                    {/* Content Matrix */}
                    <div className="p-12 space-y-10 relative z-20 -mt-10">
                      <div className="space-y-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-background/50 rounded-full">
                          Deployment Package
                        </Badge>
                        <h3 className="text-4xl font-black text-foreground tracking-tight leading-none">{service.title}</h3>
                      </div>
                      
                      <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-5 pt-8 border-t border-border">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <CheckCircle2 className={cn(
                              "h-5 w-5",
                              color === 'solar-amber' && "text-solar-amber",
                              color === 'solar-teal' && "text-solar-teal",
                              color === 'solar-green' && "text-solar-green"
                            )} />
                            <span className="text-[15px] font-bold text-foreground/80 tracking-tight">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link href={`/services/${service._id}`} className="block pt-4">
                        <Button className="w-full h-20 rounded-3xl bg-secondary/50 hover:bg-solar-amber hover:text-white text-foreground font-black text-lg transition-all group-hover:scale-[1.02] active:scale-95 shadow-lg group-hover:shadow-solar-amber/20">
                          EXPLORE DEPLOYMENT
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-40 glass-card p-20 rounded-[4rem]">
              <p className="text-gray-500 text-2xl font-black tracking-tight">System Offline: No Service Nodes Detected.</p>
            </div>
          )}
        </div>
      </main>

      {/* Global CTA */}
      <section className="bg-foreground text-background py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-solar-amber/10 blur-[150px] rounded-full -mr-64 -mt-64"></div>
        <div className="container mx-auto px-4 text-center relative z-10 space-y-12">
          <h2 className="text-6xl md:text-8xl font-black font-display tracking-tight text-white leading-none">
            READY TO <span className="text-solar-amber">TRANSCEND</span> <br />
            THE GRID?
          </h2>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Connect with our system architects for a high-fidelity survey and ROI roadmap.
          </p>
          <div className="flex justify-center pt-8">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-solar-amber hover:bg-solar-orange text-white font-black h-24 px-16 rounded-[2.5rem] text-2xl transition-all hover:scale-105 shadow-2xl shadow-solar-amber/30 group"
            >
              INITIALIZE CONSULTATION
              <ArrowRight className="ml-4 h-8 w-8 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
