'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Zap, 
  TrendingDown, 
  Award, 
  MonitorSmartphone, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: ShieldCheck,
    title: 'Lifetime Integrity',
    description: 'Our Tier-1 equipment is engineered to withstand extreme conditions, ensuring 30+ years of uninterrupted performance.',
    color: 'solar-teal',
    span: 'md:col-span-2 md:row-span-1',
    image: '/assets/image/services/commercial.png'
  },
  {
    icon: TrendingDown,
    title: 'Zero Grid Cost',
    description: 'Reduce dependency and combat rising energy prices with smart self-consumption.',
    color: 'solar-amber',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    icon: MonitorSmartphone,
    title: 'Smart Analytics',
    description: 'Real-time monitoring via our proprietary AI-driven mobile ecosystem.',
    color: 'solar-yellow',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    icon: Award,
    title: 'Gold Standard',
    description: 'Every installation is certified by international safety and efficiency boards.',
    color: 'solar-green',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    icon: Sparkles,
    title: 'Next-Gen Panels',
    description: 'Utilizing bifacial technology for up to 25% higher efficiency in low-light environments.',
    color: 'solar-orange',
    span: 'md:col-span-2 md:row-span-1',
    image: '/assets/image/solar_tech.png'
  }
];

export default function FeaturesSection() {
  const [companyName, setCompanyName] = useState('SolarHouse');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/settings');
        if (response.data.companyName) {
          setCompanyName(response.data.companyName);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section id="features" className="py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 animate-fade-in-up">
          <div className="max-w-2xl">
            <Badge className="bg-solar-teal/10 text-solar-teal hover:bg-solar-teal/20 border-solar-teal/20 px-4 py-1.5 rounded-full mb-6 font-bold uppercase tracking-widest text-[10px]">
              The {companyName} Advantage
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black font-display tracking-tight text-foreground leading-[0.95]">
              ENGINEERED FOR <br />
              <span className="text-gradient-solar">MAXIMUM ROI</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground font-medium max-w-sm mb-2">
            We don't just install panels; we build personal power plants that pay for themselves in record time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={cn(
                  "group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 hover:border-solar-amber/30 transition-all duration-500",
                  feature.span
                )}
              >
                {feature.image && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                    <img src={feature.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-500 group-hover:scale-110",
                      feature.color === 'solar-teal' && "bg-solar-teal/10 border-solar-teal/20 text-solar-teal group-hover:bg-solar-teal/20",
                      feature.color === 'solar-amber' && "bg-solar-amber/10 border-solar-amber/20 text-solar-amber group-hover:bg-solar-amber/20",
                      feature.color === 'solar-yellow' && "bg-solar-yellow/10 border-solar-yellow/20 text-solar-yellow group-hover:bg-solar-yellow/20",
                      feature.color === 'solar-green' && "bg-solar-green/10 border-solar-green/20 text-solar-green group-hover:bg-solar-green/20",
                      feature.color === 'solar-orange' && "bg-solar-orange/10 border-solar-orange/20 text-solar-orange group-hover:bg-solar-orange/20"
                    )}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 text-foreground tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-solar-amber opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Learn Technical Details
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-solar-amber/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
