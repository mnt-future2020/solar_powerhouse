'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Mail, TrendingUp, Users, Calendar, ArrowUpRight, MessageSquare, LayoutGrid, Zap } from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    contacts: 0,
    consultations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, contactsRes] = await Promise.all([
        axios.get('/services'),
        axios.get('/contacts'),
      ]);

      setStats({
        services: servicesRes.data.length,
        contacts: contactsRes.data.length,
        consultations: Math.floor(contactsRes.data.length * 0.4), // Mocked for design
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { 
      title: 'Total Services', 
      value: stats.services, 
      icon: LayoutGrid, 
      color: 'solar-orange',
      trend: '+12%',
      bg: 'from-solar-orange/10 to-transparent'
    },
    { 
      title: 'Active Messages', 
      value: stats.contacts, 
      icon: Mail, 
      color: 'solar-amber',
      trend: '+5.2%',
      bg: 'from-solar-amber/10 to-transparent'
    },
    { 
      title: 'Consultations', 
      value: stats.consultations, 
      icon: MessageSquare, 
      color: 'solar-teal',
      trend: '+18%',
      bg: 'from-solar-teal/10 to-transparent'
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-amber/10 border border-solar-amber/20 text-solar-amber text-[10px] font-black uppercase tracking-widest">
            <TrendingUp className="h-3 w-3" />
            Platform Performance: Optimized
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground uppercase leading-none">
            DASHBOARD<br />
            <span className="text-gradient-solar">OVERVIEW</span>
          </h1>
          <p className="text-muted-foreground font-medium">Monitoring your sustainable energy infrastructure.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md border border-border p-4 rounded-2xl shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Date</p>
            <p className="text-sm font-bold text-foreground">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <Calendar className="h-6 w-6 text-solar-orange" />
        </div>
      </div>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="group relative overflow-hidden border-none bg-card hover:bg-card/80 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.bg)} />
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className={cn("p-4 rounded-2xl border border-white/10 shadow-lg transition-transform duration-500 group-hover:scale-110", `bg-${stat.color}/10`)}>
                    <Icon className={cn("h-6 w-6", `text-${stat.color}`)} />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-wider border border-emerald-500/20">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.title}</p>
                  <div className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity / Placeholder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2rem] border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
          <div className="p-8 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-black uppercase tracking-widest text-xs text-foreground">Recent Activity</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-solar-orange hover:underline">View All</button>
          </div>
          <div className="p-8 space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-solar-amber/10 transition-colors">
                  <Users className="h-5 w-5 text-muted-foreground group-hover:text-solar-amber" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">New contact inquiry received</p>
                  <p className="text-xs text-muted-foreground">2 hours ago • Marketing Inquiry</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] border-border/50 bg-gradient-to-br from-solar-amber/5 to-solar-orange/5 backdrop-blur-sm p-8 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="h-48 w-48 text-solar-orange" />
          </div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-xl font-black tracking-tight text-foreground uppercase">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-muted-foreground">Grid Stability</span>
                <span className="font-black text-emerald-500 uppercase tracking-widest text-[10px]">99.9%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-[99.9%] h-full bg-emerald-500 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All solar arrays are performing within optimal parameters. System synchronization is complete.
              </p>
            </div>
            <Button className="w-fit bg-foreground text-background font-black rounded-xl hover:bg-foreground/90 transition-all">
              SYSTEM LOGS
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

