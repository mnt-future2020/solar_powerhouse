'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  LayoutGrid, Mail, MessageSquare, Image, ShieldCheck, Calendar,
  ArrowUpRight, Clock, MapPin, User, ChevronRight, Loader2
} from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Consultation {
  _id: string;
  name: string;
  phone: string;
  city: string;
  propertyType: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

interface PortfolioItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  visible: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

const statusColors = {
  new: 'bg-amber-100 text-amber-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-500',
  read: 'bg-blue-100 text-blue-700',
  replied: 'bg-emerald-100 text-emerald-700',
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<{ length: number }>({ length: 0 });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [bankPartners, setBankPartners] = useState<{ length: number }>({ length: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [svc, bp, port, con, consult] = await Promise.allSettled([
          axios.get('/services'),
          axios.get('/bank-partners'),
          axios.get('/portfolio?all=true'),
          axios.get('/contacts'),
          axios.get('/consultations'),
        ]);

        if (svc.status === 'fulfilled') setServices({ length: svc.value.data.length });
        if (bp.status === 'fulfilled') setBankPartners({ length: bp.value.data.length });
        if (port.status === 'fulfilled') setPortfolio(port.value.data);
        if (con.status === 'fulfilled') setContacts(con.value.data);
        if (consult.status === 'fulfilled') setConsultations(consult.value.data);
      } catch { }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const newConsultations = consultations.filter(c => c.status === 'new').length;
  const newContacts = contacts.filter(c => c.status === 'new').length;
  const visiblePortfolio = portfolio.filter(p => p.visible).length;

  const statCards = [
    { title: 'Services', value: services.length, icon: LayoutGrid, color: 'text-solar-orange', bg: 'bg-solar-orange/10', href: '/admin/services' },
    { title: 'Consultations', value: consultations.length, badge: newConsultations, icon: MessageSquare, color: 'text-solar-teal', bg: 'bg-solar-teal/10', href: '/admin/consultations' },
    { title: 'Messages', value: contacts.length, badge: newContacts, icon: Mail, color: 'text-solar-amber', bg: 'bg-solar-amber/10', href: '/admin/contacts' },
    { title: 'Portfolio', value: portfolio.length, icon: Image, color: 'text-purple-500', bg: 'bg-purple-500/10', href: '/admin/portfolio' },
    { title: 'Bank Partners', value: bankPartners.length, icon: ShieldCheck, color: 'text-sky-500', bg: 'bg-sky-500/10', href: '/admin/bank-partners' },
  ];

  // Merge recent consultations + contacts into one timeline
  const recentActivity = [
    ...consultations.slice(0, 5).map(c => ({
      id: c._id,
      type: 'consultation' as const,
      name: c.name,
      detail: c.city ? `${c.propertyType || 'Property'} • ${c.city}` : c.propertyType || 'Consultation request',
      status: c.status,
      date: c.createdAt,
      href: '/admin/consultations',
    })),
    ...contacts.slice(0, 5).map(c => ({
      id: c._id,
      type: 'contact' as const,
      name: c.name,
      detail: c.message.slice(0, 60) + (c.message.length > 60 ? '...' : ''),
      status: c.status,
      date: c.createdAt,
      href: '/admin/contacts',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-solar-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {(newConsultations > 0 || newContacts > 0) && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">
              {newConsultations + newContacts} pending {newConsultations + newContacts === 1 ? 'request' : 'requests'}
            </span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                      <Icon className={cn('h-5 w-5', stat.color)} />
                    </div>
                    {stat.badge && stat.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                        {stat.badge} new
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.title}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Two columns: Activity + Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity — 2/3 width */}
        <Card className="lg:col-span-2 border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Activity</h3>
            <div className="flex gap-2">
              <Link href="/admin/consultations" className="text-[10px] font-bold uppercase tracking-wider text-solar-orange hover:underline">
                Consultations
              </Link>
              <span className="text-gray-200">|</span>
              <Link href="/admin/contacts" className="text-[10px] font-bold uppercase tracking-wider text-solar-orange hover:underline">
                Messages
              </Link>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-gray-300">No activity yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentActivity.map((item) => (
                <Link key={item.id} href={item.href} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors group">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                    item.type === 'consultation' ? 'bg-solar-teal/10' : 'bg-solar-amber/10'
                  )}>
                    {item.type === 'consultation'
                      ? <MessageSquare className="h-4 w-4 text-solar-teal" />
                      : <Mail className="h-4 w-4 text-solar-amber" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold capitalize', statusColors[item.status as keyof typeof statusColors])}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{item.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-300 font-medium">{timeAgo(item.date)}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-200 group-hover:text-solar-orange transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Portfolio Preview — 1/3 width */}
        <Card className="border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Portfolio</h3>
            <Link href="/admin/portfolio" className="text-[10px] font-bold uppercase tracking-wider text-solar-orange hover:underline">
              Manage
            </Link>
          </div>

          {portfolio.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Image className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 mb-1">No projects yet</p>
              <Link href="/admin/portfolio" className="text-xs text-solar-orange font-semibold hover:underline">
                Add your first project
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {portfolio.slice(0, 4).map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                    <p className="text-[10px] text-gray-400">{item.category}</p>
                  </div>
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    item.visible ? 'bg-emerald-500' : 'bg-gray-300'
                  )} title={item.visible ? 'Visible' : 'Hidden'} />
                </div>
              ))}

              {portfolio.length > 4 && (
                <Link href="/admin/portfolio" className="block text-center text-xs text-gray-400 hover:text-solar-orange font-medium pt-2">
                  +{portfolio.length - 4} more projects
                </Link>
              )}

              {/* Portfolio summary */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">{visiblePortfolio} visible on site</span>
                <span className="text-gray-300">{portfolio.length - visiblePortfolio} hidden</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Add Service', href: '/admin/services', icon: LayoutGrid, color: 'text-solar-orange' },
          { label: 'Add Project', href: '/admin/portfolio', icon: Image, color: 'text-purple-500' },
          { label: 'Add Bank Partner', href: '/admin/bank-partners', icon: ShieldCheck, color: 'text-sky-500' },
          { label: 'Site Settings', href: '/admin/settings/general', icon: Calendar, color: 'text-gray-500' },
        ].map(action => (
          <Link key={action.label} href={action.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all group">
            <action.icon className={cn('h-4 w-4', action.color)} />
            <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{action.label}</span>
            <ArrowUpRight className="h-3 w-3 text-gray-300 ml-auto group-hover:text-solar-orange transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
