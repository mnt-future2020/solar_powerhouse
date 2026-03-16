'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building, 
  Settings, 
  CheckCircle2, 
  ArrowRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
}

const serviceImages: Record<number, string> = {
  0: '/assets/image/services/residential.png',
  1: '/assets/image/services/commercial.png',
  2: '/assets/image/services/maintenance.png',
};

const serviceIcons = [Home, Building, Settings];
const serviceColors = ['solar-amber', 'solar-teal', 'solar-green'];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data.slice(0, 3)); 
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <section id="services" className="py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-24 animate-fade-in-up">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-solar-amber/10 text-solar-amber hover:bg-solar-amber/20 border-solar-amber/20 px-4 py-1 font-bold uppercase tracking-widest text-[10px]">
              Our Specializations
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-none">
              TAILORED <span className="text-gradient-solar">ENERGY</span> <br />
              ARCHITECTURES
            </h2>
          </div>
          <p className="text-xl text-muted-foreground font-medium max-w-sm">
            From single-family homes to massive industrial complexes, we design systems that <span className="text-foreground font-bold italic">defy energy inflation</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = serviceIcons[index % 3];
            const color = serviceColors[index % 3];
            return (
              <div
                key={service._id}
                className="group relative overflow-hidden rounded-[3rem] border border-border bg-card transition-all duration-700 hover:shadow-2xl hover:border-solar-amber/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Visual Header */}
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent z-10"></div>
                  <img 
                    src={serviceImages[index % 3]} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className={cn(
                    "absolute top-6 left-6 z-20 w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-md transition-all duration-500 group-hover:rotate-6",
                    color === 'solar-amber' && "bg-solar-amber/20 border-solar-amber/30 text-solar-amber",
                    color === 'solar-teal' && "bg-solar-teal/20 border-solar-teal/30 text-solar-teal",
                    color === 'solar-green' && "bg-solar-green/20 border-solar-green/30 text-solar-green"
                  )}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="absolute bottom-6 left-6 z-20">
                    <span className="text-2xl font-black text-white">₹{service.price.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest block">Investment Base</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-10 space-y-8 relative z-20 -mt-10">
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-background/50">
                      Service Package
                    </Badge>
                    <h3 className="text-3xl font-black text-foreground tracking-tight">{service.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-4 pt-6 border-t border-border">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className={cn(
                          "h-5 w-5",
                          color === 'solar-amber' && "text-solar-amber",
                          color === 'solar-teal' && "text-solar-teal",
                          color === 'solar-green' && "text-solar-green"
                        )} />
                        <span className="text-sm font-bold text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/services/${service._id}`} className="block pt-4">
                    <Button className="w-full h-14 rounded-2xl bg-secondary/50 hover:bg-solar-amber hover:text-white text-foreground font-bold transition-all group-hover:scale-[1.02]">
                      EXPLORE SOLUTION
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
           <Link href="/services">
              <Button variant="ghost" className="font-black gap-2 hover:bg-transparent hover:text-solar-amber transition-colors group">
                VIEW ALL PACKAGES
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
           </Link>
        </div>
      </div>
    </section>
  );
}
