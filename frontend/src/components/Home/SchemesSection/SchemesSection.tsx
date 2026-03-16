'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Landmark, Gift, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SchemesSection() {
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

  const schemes = [
    {
      icon: Landmark,
      title: `${companyName} Grant`,
      type: 'Corporate Initiative',
      description: `Exclusive grant for early adopters of ${companyName} technology.`,
      benefits: ['Zero down payment option', 'Up to 20% system discount', 'Priority installation'],
      color: 'solar-amber',
      iconColor: 'text-solar-amber',
    },
    {
      icon: Building2,
      title: 'State Solar Subsidy',
      type: 'Government Scheme',
      description: 'Official state-level incentives for residential rooftop installations.',
      benefits: ['Direct bank transfers', 'Tax credit validation', 'Property tax rebates'],
      color: 'solar-teal',
      iconColor: 'text-solar-teal',
    },
    {
      icon: Gift,
      title: 'Tax Leverage',
      type: 'Financial Benefit',
      description: 'Optimize your ROI through accelerated depreciation and GST benefits.',
      benefits: ['40% accelerated depreciation', 'GST input credit', 'Income tax deductions'],
      color: 'solar-orange',
      iconColor: 'text-solar-orange',
    },
    {
      icon: TrendingUp,
      title: 'Virtual Netting',
      type: 'Active Income',
      description: 'Earn credits for every watt generated beyond your consumption.',
      benefits: ['Bi-directional settlement', 'Energy wallet integration', 'Rollover credits'],
      color: 'solar-green',
      iconColor: 'text-solar-green',
    },
  ];

  return (
    <section id="schemes" className="py-32 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-solar-amber/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24 animate-fade-in-up">
          <Badge className="bg-solar-amber/10 text-solar-amber hover:bg-solar-amber/20 border-solar-amber/20 px-6 py-2 rounded-full mb-8 font-black uppercase tracking-[0.2em] text-[10px]">
            Financial Acceleration
          </Badge>
          <h2 className="text-6xl md:text-8xl font-black font-display tracking-tight text-foreground mb-8">
            SUBSIDIES & <br />
            <span className="text-gradient-power">OWNERSHIP</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            We navigate the complex landscape of government incentives to ensure you get the <span className="text-gradient-solar font-bold">absolute lowest entry cost</span> for your solar transition.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {schemes.map((scheme, index) => {
            const Icon = scheme.icon;
            return (
              <Card
                key={index}
                className={cn(
                  "group relative overflow-hidden transition-all duration-500 border border-border bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:border-solar-teal/30 hover:-translate-y-1",
                  "animate-fade-in-up"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn(
                  "absolute top-0 right-0 w-48 h-48 opacity-[0.03] -mr-12 -mt-12 rounded-full transition-transform duration-700 group-hover:scale-150",
                  scheme.color === 'solar-amber' && "bg-solar-amber",
                  scheme.color === 'solar-teal' && "bg-solar-teal",
                  scheme.color === 'solar-orange' && "bg-solar-orange",
                  scheme.color === 'solar-green' && "bg-solar-green"
                )}></div>
                
                <CardHeader className="p-10 pb-6 relative">
                  <div className="flex items-start justify-between mb-8">
                    <div className={cn(
                      "p-5 rounded-3xl border transition-all duration-500 group-hover:rotate-6 shadow-xl shadow-black/5",
                      scheme.color === 'solar-amber' && "bg-solar-amber/10 border-solar-amber/20 text-solar-amber",
                      scheme.color === 'solar-teal' && "bg-solar-teal/10 border-solar-teal/20 text-solar-teal",
                      scheme.color === 'solar-orange' && "bg-solar-orange/10 border-solar-orange/20 text-solar-orange",
                      scheme.color === 'solar-green' && "bg-solar-green/10 border-solar-green/20 text-solar-green"
                    )}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full bg-background/50 border-border">
                      {scheme.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-4xl font-black text-foreground tracking-tight">{scheme.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-10 pt-0 space-y-10 relative">
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed">{scheme.description}</p>
                  
                  <div className="grid grid-cols-1 gap-4 pt-8 border-t border-border">
                    {scheme.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-4 group/item">
                        <div className={cn(
                          "w-2 h-2 rounded-full transition-transform group-hover/item:scale-150",
                          scheme.color === 'solar-amber' && "bg-solar-amber",
                          scheme.color === 'solar-teal' && "bg-solar-teal",
                          scheme.color === 'solar-orange' && "bg-solar-orange",
                          scheme.color === 'solar-green' && "bg-solar-green"
                        )}></div>
                        <span className="text-foreground font-bold tracking-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-20 group">
          <Link href="/contact" className="block">
            <div className="relative overflow-hidden rounded-[3rem] bg-zinc-900 dark:bg-white p-12 lg:p-20 text-white dark:text-zinc-900 text-center border border-zinc-800 dark:border-zinc-200 shadow-2xl">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-solar-amber/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-8">
                <h3 className="text-4xl md:text-6xl font-black font-display tracking-tight text-white dark:text-zinc-900">
                  WANT TO SEE THE <br />
                  <span className="text-solar-amber">SAVINGS</span> FOR YOUR ZIP CODE?
                </h3>
                <p className="text-xl text-zinc-400 dark:text-zinc-600 font-medium max-w-2xl mx-auto">
                   Our smart algorithm calculates local subsidies and solar potential in seconds.
                </p>
                <div className="flex justify-center pt-8">
                  <Button className="bg-solar-amber hover:bg-solar-orange text-white font-black py-8 px-16 rounded-[2rem] text-2xl transition-all hover:scale-105 shadow-[0_20px_50px_-10px_rgba(217,119,6,0.3)] border-none">
                    CALCULATE ELIGIBILITY
                    <ArrowRight className="ml-3 h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
