'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
}

const serviceImages: Record<number, string> = {
  0: '/assets/image/services/residential.png',
  1: '/assets/image/services/commercial.png',
  2: '/assets/image/services/maintenance.png',
};

const serviceColors = ['orange', 'teal', 'green'];

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
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-professional">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16 animate-fade-in-up">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200 px-4 py-2 font-semibold">
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-gray-900">
              PROFESSIONAL <span className="text-gradient-solar">SOLAR</span> <br />
              SOLUTIONS
            </h2>
          </div>
          <p className="text-lg text-gray-600 font-medium max-w-md">
            From residential homes to commercial complexes, we deliver energy solutions that <span className="text-gray-900 font-semibold">maximize your investment</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const color = serviceColors[index % 3];
            return (
              <div
                key={service._id}
                className="card-professional group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Service Image */}
                <div className="h-64 overflow-hidden relative rounded-xl mb-6">
                  <img 
                    src={serviceImages[index % 3]} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="">
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className={cn(
                          "h-5 w-5",
                          color === 'orange' && "text-orange-500",
                          color === 'teal' && "text-teal-500",
                          color === 'green' && "text-green-500"
                        )} />
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/services/${service._id}`} className="block pt-4">
                    <Button className="w-full btn-secondary group-hover:btn-primary transition-all">
                      EXPLORE SOLUTION
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
           <Link href="/services">
              <Button variant="ghost" className="font-semibold gap-2 hover:text-orange-500 transition-colors group">
                VIEW ALL SERVICES
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
           </Link>
        </div>
      </div>
    </section>
  );
}
