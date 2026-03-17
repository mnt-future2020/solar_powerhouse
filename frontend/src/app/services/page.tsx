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
          <div className="max-w-4xl mx-auto mb-20 animate-fade-in-up text-center">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 px-6 py-2 rounded-full mb-6 font-bold uppercase tracking-wider text-xs">
              Our Solar Solutions
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-tight mb-6">
              SOLAR <span className="text-gradient-solar">SERVICES</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of solar solutions designed to meet your energy needs. 
              From residential installations to commercial projects, we have the expertise to power your future.
            </p>
          </div>

          {/* Statistics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in-up">
            {[
              { icon: TrendingUp, value: "500+", label: "Projects Completed", color: "text-amber-600" },
              { icon: BatteryCharging, value: "98%", label: "Customer Satisfaction", color: "text-teal-600" },
              { icon: Zap, value: "₹2Cr+", label: "Savings Generated", color: "text-orange-600" },
              { icon: CheckCircle2, value: "25+", label: "Years Warranty", color: "text-emerald-600" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                <stat.icon className={`h-8 w-8 ${stat.color} mb-4 group-hover:scale-110 transition-transform`} />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="text-center py-40">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-solar-amber"></div>
              <p className="mt-6 text-xl font-bold text-muted-foreground animate-pulse">Loading our solar solutions...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const color = serviceColors[index % 3];
                return (
                  <div
                    key={service._id}
                    className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up border border-gray-100"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image Section */}
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={serviceImages[index % 3] || '/assets/image/hero_solar.png'} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Service Badge */}
                      <div className="absolute top-6 left-6">
                        <Badge className={cn(
                          "px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider border-0",
                          color === 'solar-amber' && "bg-amber-500/90 text-white",
                          color === 'solar-teal' && "bg-teal-600/90 text-white",
                          color === 'solar-green' && "bg-emerald-600/90 text-white"
                        )}>
                          Premium Solution
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-amber-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3">
                        {service.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className={cn(
                              "h-5 w-5 mt-0.5 shrink-0",
                              color === 'solar-amber' && "text-amber-500",
                              color === 'solar-teal' && "text-teal-600",
                              color === 'solar-green' && "text-emerald-600"
                            )} />
                            <span className="text-gray-700 font-medium text-sm leading-relaxed">{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 4 && (
                          <div className="text-sm text-gray-500 font-medium">
                            +{service.features.length - 4} more features
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div className="pt-4">
                        <Link href={`/services/${service._id}`} className="block">
                          <Button className={cn(
                            "w-full h-12 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg hover:shadow-xl",
                            color === 'solar-amber' && "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
                            color === 'solar-teal' && "bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700",
                            color === 'solar-green' && "bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                          )}>
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-40 bg-white rounded-3xl shadow-lg p-20">
              <p className="text-gray-500 text-xl font-medium">No services available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
