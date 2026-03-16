'use client';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Settings {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>({
    email: 'hello@solarpowerhouse.com',
    phone: '+91 99448 88170',
    address: {
      street: 'Solar Power House 34/1, Idhyarajapuram 2nd Street, Sellur',
      city: 'Madurai',
      state: 'Tamil Nadu',
      zipCode: '625002',
      country: 'India'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/settings');
      if (response.data) {
        setSettings({
          ...settings,
          ...response.data
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const contactOptions = [
    {
      icon: Mail,
      title: 'Email Ecosystem',
      value: settings.email,
      description: 'Expect a response within 24 hours from our technical team.',
      color: 'solar-yellow',
      gradient: 'from-solar-yellow to-solar-orange'
    },
    {
      icon: Phone,
      title: 'Direct Concierge',
      value: settings.phone,
      description: 'Mon-Sat, 9AM to 7PM. Immediate assistance for urgent surveys.',
      color: 'solar-teal',
      gradient: 'from-solar-teal to-solar-green'
    },
    {
      icon: MapPin,
      title: 'Innovation Hub',
      value: `${settings.address.street}, ${settings.address.city}, ${settings.address.state}`,
      description: 'Visit our experience center to see next-gen panels in action.',
      color: 'solar-orange',
      gradient: 'from-solar-orange to-solar-amber'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-solar-amber/30">
      <Header />
      
      <main className="flex-1 pt-40 pb-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-solar-amber/20 blur-[150px] rounded-full opacity-30 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="max-w-4xl mb-24 animate-fade-in-up">
            <Badge className="bg-solar-amber/10 text-solar-amber hover:bg-solar-amber/20 border-solar-amber/20 px-6 py-2 rounded-full mb-8 font-black uppercase tracking-[0.2em] text-[10px]">
              Global Communications
            </Badge>
            <h1 className="text-7xl md:text-9xl font-black font-display tracking-tighter text-foreground mb-8 leading-[0.85]">
              GET IN <br />
              <span className="text-gradient-solar">TOUCH</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Whether you're looking for a residential quote or industrial scaling, our solar architects are ready to design your <span className="text-foreground font-bold">energy future.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Cards */}
            <div className="lg:col-span-5 space-y-6">
              {contactOptions.map((opt, i) => (
                <Card 
                  key={i} 
                  className="glass-card group overflow-hidden animate-fade-in-up relative" 
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <CardHeader className="p-8 pb-4">
                    <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                      <div>
                        <Badge variant="outline" className="mb-4 text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10">
                          {opt.title.split(' ')[0]} Node
                        </Badge>
                        <CardTitle className="text-3xl font-black tracking-tight">{opt.title}</CardTitle>
                      </div>
                      <div className={cn(
                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl shadow-black/20",
                        opt.color === 'solar-yellow' && "bg-solar-yellow/10 border-solar-yellow/20 text-solar-yellow",
                        opt.color === 'solar-teal' && "bg-solar-teal/10 border-solar-teal/20 text-solar-teal",
                        opt.color === 'solar-orange' && "bg-solar-orange/10 border-solar-orange/20 text-solar-orange"
                      )}>
                        <opt.icon className="h-8 w-8" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4">
                    <p className="text-xl font-bold text-foreground transition-all group-hover:text-solar-amber group-hover:translate-x-1 duration-300 break-all">{opt.value}</p>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[85%]">{opt.description}</p>
                  </CardContent>
                  <div className={cn("absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500 w-0 group-hover:w-full", opt.gradient)}></div>
                </Card>
              ))}

              {/* Business Hours Card */}
              <div className="p-8 rounded-[2.5rem] bg-foreground text-background relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-solar-amber/30 blur-[60px] rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                    <Clock className="h-7 w-7 text-solar-amber animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest text-solar-amber/80">Active Frequency</h4>
                    <p className="text-2xl font-black">Mon-Sat | 09:00 - 19:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <Card className="glass-card h-full p-2 animate-fade-in-up overflow-hidden relative group" style={{ animationDelay: '0.3s' }}>
                {/* Visual Background Asset for Form */}
                <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none">
                  <img src="/assets/image/hero_solar.png" alt="" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[20s] linear shadow-inner" />
                </div>
                
                <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-[2.5rem] p-10 lg:p-14 h-full border border-zinc-200 dark:border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-2xl relative z-10 transition-colors duration-300">
                  <h3 className="text-5xl font-black tracking-tighter mb-10 text-zinc-900 dark:text-white">
                    SEND A <br />
                    <span className="text-gradient-solar">MESSAGE</span>
                  </h3>
                  <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Full Identity</label>
                        <Input placeholder="Engineering Lead" className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-2xl h-16 pl-6 text-zinc-900 dark:text-white focus:border-solar-amber transition-all shadow-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-bold" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Email Node</label>
                        <Input placeholder="arch@domain.com" className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-2xl h-16 pl-6 text-zinc-900 dark:text-white focus:border-solar-amber transition-all shadow-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-bold" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Subject of Inquiry</label>
                      <Input placeholder="MW Solar Scaling Survey" className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-2xl h-16 pl-6 text-zinc-900 dark:text-white focus:border-solar-amber transition-all shadow-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 ml-1">Detailed Transcript</label>
                      <textarea 
                        placeholder="Define your energy metrics and consumption blueprints..." 
                        className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 min-h-[180px] text-zinc-900 dark:text-white focus:outline-none focus:border-solar-amber transition-all resize-none shadow-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium"
                      ></textarea>
                    </div>
                    
                    <Button className="w-full h-24 bg-gradient-to-r from-solar-amber to-solar-orange hover:from-solar-orange hover:to-solar-amber text-white font-black text-2xl rounded-[2rem] shadow-2xl shadow-solar-amber/20 transition-all hover:scale-[1.02] active:scale-95 group border-none">
                      INITIATE TRANSMISSION
                      <Send className="ml-4 h-8 w-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
