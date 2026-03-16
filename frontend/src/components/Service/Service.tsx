'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceProps {
  service: {
    _id: string;
    title: string;
    description: string;
    price: number;
    features: string[];
    image?: string;
  };
  variant?: 'card' | 'detailed';
}

export default function Service({ service, variant = 'card' }: ServiceProps) {
  if (variant === 'detailed') {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden border-none shadow-2xl">
          {service.image && (
            <div className="relative h-96 w-full bg-gradient-to-br from-blue-50 to-green-50">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x400?text=Solar+Service';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{service.title}</h1>
                <p className="text-xl text-blue-100">Premium Solar Solution</p>
              </div>
            </div>
          )}

          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Description & Price */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Service</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {service.description}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-2xl">
                  <div className="text-sm text-gray-600 mb-2">Starting from</div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    ₹{service.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    *Price may vary based on requirements
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="flex-1">
                    <Button size="lg" className="w-full group">
                      Get Quote
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/services" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full">
                      View All Services
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column - Features */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Key Features & Benefits</h2>
                <ul className="space-y-4">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <h3 className="font-bold text-lg mb-2">Why Choose This Service?</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Professional installation by certified technicians</li>
                    <li>✓ 25-year performance warranty</li>
                    <li>✓ Government subsidy assistance</li>
                    <li>✓ Free site inspection & consultation</li>
                    <li>✓ Post-installation support & maintenance</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Card variant (for grid display)
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none overflow-hidden h-full flex flex-col">
      {service.image && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Solar+Service';
            }}
          />
          <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
            ₹{(service.price / 1000).toFixed(0)}K+
          </div>
        </div>
      )}

      <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>

      <CardHeader>
        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
          {service.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-gray-600 text-sm line-clamp-3 flex-1">
          {service.description}
        </p>

        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700">Key Features:</div>
          <ul className="space-y-1">
            {service.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 line-clamp-1">{feature}</span>
              </li>
            ))}
            {service.features.length > 3 && (
              <li className="text-xs text-gray-500 pl-6">
                +{service.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500">Starting from</div>
              <div className="text-2xl font-bold text-blue-600">
                ₹{service.price.toLocaleString()}
              </div>
            </div>
          </div>

          <Link href={`/services/${service._id}`} className="block">
            <Button className="w-full group">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
