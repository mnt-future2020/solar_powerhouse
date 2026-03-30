'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutGrid, Mail, MessageSquare, Image, ShieldCheck,
  ChevronRight, Loader2, Circle, RefreshCw, Sun,
  TrendingUp, Users, Phone, MapPin, Zap, Clock,
  ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/* ───── types ───── */
interface Consultation {
  _id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  propertyType: string;
  monthlyBill?: string;
  service?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}


interface PortfolioItem {
  _id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  location?: string;
  capacity?: string;
  visible: boolean;
}

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

/* ───── helpers ───── */
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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return d >= weekAgo;
}

function isThisMonth(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

/* ───── mini chart components ───── */
function DonutChart({ segments, size = 120, strokeWidth = 14 }: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <span className="text-xs text-gray-300">No data</span>
    </div>
  );
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {segments.filter(s => s.value > 0).map((seg, i) => {
          const pct = seg.value / total;
          const dashArray = `${pct * circumference} ${circumference}`;
          const dashOffset = -offset * circumference;
          offset += pct;
          return (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={seg.color} strokeWidth={strokeWidth}
              strokeDasharray={dashArray} strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{total}</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
      </div>
    </div>
  );
}

function HorizontalBar({ label, value, max, color }: {
  label: string; value: number; max: number; color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-8 text-right">{value}</span>
    </div>
  );
}

/* ───── main ───── */
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncTime, setSyncTime] = useState<Date>(new Date());
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [bankPartners, setBankPartners] = useState<{ length: number }>({ length: 0 });

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [svc, bp, port, consult] = await Promise.allSettled([
        axios.get('/services'),
        axios.get('/bank-partners'),
        axios.get('/portfolio?all=true'),
        axios.get('/consultations'),
      ]);

      if (svc.status === 'fulfilled') setServices(svc.value.data);
      if (bp.status === 'fulfilled') setBankPartners({ length: bp.value.data.length });
      if (port.status === 'fulfilled') setPortfolio(port.value.data);
      if (consult.status === 'fulfilled') {
        const d = consult.value.data;
        setConsultations(Array.isArray(d) ? d : d.data || []);
      }
      setSyncTime(new Date());
    } catch { }
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── derived stats ── */
  const newConsultations = consultations.filter(c => c.status === 'new').length;
  const contactedConsultations = consultations.filter(c => c.status === 'contacted').length;
  const closedConsultations = consultations.filter(c => c.status === 'closed').length;

  const thisWeekConsultations = consultations.filter(c => isThisWeek(c.createdAt)).length;
  const thisMonthConsultations = consultations.filter(c => isThisMonth(c.createdAt)).length;

  const totalLeads = consultations.length;
  const pendingActions = newConsultations;
  const conversionRate = consultations.length > 0
    ? Math.round((closedConsultations / consultations.length) * 100)
    : 0;

  /* city distribution from consultations */
  const cityDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    consultations.forEach(c => {
      if (c.city) {
        const normalized = c.city.trim().toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase());
        map[normalized] = (map[normalized] || 0) + 1;
      }
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([city, count]) => ({ city, count }));
  }, [consultations]);

  /* property type distribution */
  const propertyDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    consultations.forEach(c => {
      const type = c.propertyType || 'Other';
      map[type] = (map[type] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
  }, [consultations]);

  /* portfolio by category */
  const portfolioCategories = useMemo(() => {
    const map: Record<string, number> = {};
    portfolio.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map).map(([cat, count]) => ({ category: cat, count }));
  }, [portfolio]);

  /* recent activity */
  const activity = useMemo(() =>
    consultations.slice(0, 8).map(c => ({
      id: c._id, type: 'consultation' as const, name: c.name,
      detail: c.city ? `${c.propertyType || 'Property'} · ${c.city}` : c.propertyType || 'Consultation',
      status: c.status, date: c.createdAt, href: '/admin/consultations',
    })),
    [consultations]);

  /* ── animations ── */
  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Sun className="h-5 w-5 animate-spin text-amber-400" />
        <span className="text-sm text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-6 lg:-m-8">
      {/* ── Header ── */}
      <div className="shrink-0 px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {getGreeting()} <span className="text-amber-500">&#9728;</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-gray-200">|</span>
              <Clock className="h-3 w-3" />
              <span>Synced at {syncTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </div>
          {/* <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-600 hover:border-amber-300 hover:text-amber-600 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} />
            Refresh
          </button> */}
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-8 space-y-5">

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Leads', value: totalLeads, sub: `${thisWeekConsultations} this week`,
              icon: Users, color: 'border-l-blue-500', iconBg: 'bg-blue-50', iconColor: 'text-blue-500',
              trend: thisWeekConsultations > 0 ? 'up' : 'neutral',
            },
            {
              label: 'New Enquiries', value: newConsultations, sub: `${thisMonthConsultations} this month`,
              icon: Phone, color: 'border-l-red-400', iconBg: 'bg-red-50', iconColor: 'text-red-500',
              trend: newConsultations > 0 ? 'up' : 'neutral',
            },
            {
              label: 'Pending Actions', value: pendingActions, sub: `${newConsultations} pending`,
              icon: AlertCircle, color: 'border-l-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500',
              trend: pendingActions > 3 ? 'up' : 'neutral',
            },
            {
              label: 'Conversion Rate', value: `${conversionRate}%`, sub: `${closedConsultations} converted`,
              icon: TrendingUp, color: 'border-l-violet-500', iconBg: 'bg-violet-50', iconColor: 'text-violet-500',
              trend: conversionRate > 20 ? 'up' : 'neutral',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.4 }}>
                <div className={cn(
                  'bg-white rounded-xl border border-gray-100 border-l-4 p-4 hover:shadow-md transition-shadow',
                  card.color
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', card.iconBg)}>
                      <Icon className={cn('h-4.5 w-4.5', card.iconColor)} />
                    </div>
                    {card.trend === 'up' && (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-800 tabular-nums">{card.value}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">{card.label}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{card.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Row 2: Pipeline ── */}
        <div className="grid grid-cols-1 gap-4">

          {/* Consultation Pipeline */}
          <motion.div className="bg-white rounded-xl border border-gray-100 p-5" {...fadeUp} transition={{ delay: 0.15 }}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-800">Consultation Pipeline</h2>
              <Link href="/admin/consultations" className="text-[11px] text-amber-600 hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="text-[11px] text-gray-400 mb-5">Lead tracking for {consultations.length} consultation(s)</p>

            {consultations.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-300">No consultations yet</div>
            ) : (
              <>
                {/* Pipeline bars */}
                <div className="space-y-4">
                  {[
                    { label: 'New', value: newConsultations, color: '#3B82F6', bg: 'bg-blue-50' },
                    { label: 'Contacted', value: contactedConsultations, color: '#F59E0B', bg: 'bg-amber-50' },
                    { label: 'Closed / Converted', value: closedConsultations, color: '#10B981', bg: 'bg-emerald-50' },
                  ].map((stage) => {
                    const pct = consultations.length > 0 ? (stage.value / consultations.length) * 100 : 0;
                    return (
                      <div key={stage.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                            <span className="text-xs font-medium text-slate-600">{stage.label}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {stage.value} <span className="text-gray-300">({Math.round(pct)}%)</span>
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Funnel summary */}
                <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-500">{newConsultations}</p>
                    <p className="text-[10px] text-gray-400 uppercase">New</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-500">{contactedConsultations}</p>
                    <p className="text-[10px] text-gray-400 uppercase">In Progress</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-500">{closedConsultations}</p>
                    <p className="text-[10px] text-gray-400 uppercase">Converted</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>

        </div>

        {/* ── Row 3: City Distribution + Property Types + Quick Stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* City Distribution */}
          <motion.div className="bg-white rounded-xl border border-gray-100 p-5" {...fadeUp} transition={{ delay: 0.25 }}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-800">Top Cities</h2>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Enquiry distribution by location</p>

            {cityDistribution.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-300">No city data</div>
            ) : (
              <div className="space-y-3">
                {cityDistribution.map((c, i) => (
                  <HorizontalBar
                    key={c.city}
                    label={c.city}
                    value={c.count}
                    max={cityDistribution[0].count}
                    color={['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#06B6D4'][i % 6]}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Property Type Distribution */}
          <motion.div className="bg-white rounded-xl border border-gray-100 p-5" {...fadeUp} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-800">Property Types</h2>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Solar enquiries by property</p>

            {propertyDistribution.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-300">No data</div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <DonutChart
                    size={100}
                    strokeWidth={12}
                    segments={propertyDistribution.map((p, i) => ({
                      value: p.count,
                      color: ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'][i % 5],
                      label: p.type,
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  {propertyDistribution.map((p, i) => (
                    <div key={p.type} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'][i % 5] }} />
                      <span className="text-gray-500 flex-1">{p.type}</span>
                      <span className="font-semibold text-slate-700">{p.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Quick Overview */}
          <motion.div className="bg-white rounded-xl border border-gray-100 p-5" {...fadeUp} transition={{ delay: 0.35 }}>
            <div className="flex items-center gap-2 mb-1">
              <LayoutGrid className="h-3.5 w-3.5 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-800">Business Overview</h2>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Quick snapshot</p>

            <div className="space-y-3">
              {[
                { label: 'Active Services', value: services.length, href: '/admin/services', icon: LayoutGrid, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Portfolio Projects', value: portfolio.length, href: '/admin/portfolio', icon: Image, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Bank Partners', value: bankPartners.length, href: '/admin/bank-partners', icon: ShieldCheck, color: 'text-violet-500', bg: 'bg-violet-50' },
                { label: 'Visible Projects', value: portfolio.filter(p => p.visible).length, href: '/admin/portfolio', icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-50' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href}>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', item.bg)}>
                        <Icon className={cn('h-4 w-4', item.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                      <span className="text-lg font-bold text-slate-800">{item.value}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-200 group-hover:text-gray-400 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Portfolio categories */}
            {portfolioCategories.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Portfolio Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {portfolioCategories.map(c => (
                    <span key={c.category} className="text-[10px] px-2 py-1 bg-gray-50 rounded-full text-gray-500">
                      {c.category} ({c.count})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Row 4: Recent Activity + Portfolio Gallery ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Activity Feed */}
          <motion.div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden" {...fadeUp} transition={{ delay: 0.4 }}>
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">Recent Activity</span>
                {pendingActions > 0 && (
                  <span className="text-[10px] font-medium text-white bg-amber-500 rounded-full px-2 py-0.5">
                    {pendingActions} new
                  </span>
                )}
              </div>
              <Link href="/admin/consultations" className="text-[11px] text-amber-600 hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {activity.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-300">No activity yet</div>
            ) : (
              <div>
                {activity.map((item, i) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80 transition-colors group',
                      i !== activity.length - 1 && 'border-b border-gray-50'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      item.type === 'consultation' ? 'bg-blue-50' : 'bg-amber-50'
                    )}>
                      {item.type === 'consultation'
                        ? <Phone className="h-3.5 w-3.5 text-blue-500" />
                        : <Mail className="h-3.5 w-3.5 text-amber-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                        <span className={cn(
                          'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                          item.status === 'new' && 'bg-blue-50 text-blue-600',
                          item.status === 'contacted' && 'bg-amber-50 text-amber-600',
                          item.status === 'closed' && 'bg-emerald-50 text-emerald-600',
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.detail}</p>
                    </div>
                    <span className="text-[11px] text-gray-300 shrink-0">{timeAgo(item.date)}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-200 group-hover:text-gray-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Portfolio Preview */}
          <motion.div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 overflow-hidden" {...fadeUp} transition={{ delay: 0.45 }}>
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">Recent Projects</span>
              </div>
              <Link href="/admin/portfolio" className="text-[11px] text-amber-600 hover:underline">Manage</Link>
            </div>

            {portfolio.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-300">No projects added</p>
                <Link href="/admin/portfolio" className="text-xs text-amber-600 hover:underline mt-1 inline-block">Add project</Link>
              </div>
            ) : (
              <div className="p-3">
                {/* Grid gallery */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {portfolio.slice(0, 4).map((item) => (
                    <div key={item._id} className="relative rounded-lg overflow-hidden aspect-[4/3] group">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[10px] font-medium text-white truncate">{item.title}</p>
                        {item.capacity && (
                          <p className="text-[9px] text-white/70">{item.capacity}</p>
                        )}
                      </div>
                      {!item.visible && (
                        <div className="absolute top-1.5 right-1.5 text-[8px] bg-black/50 text-white/80 px-1.5 py-0.5 rounded">
                          Hidden
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {portfolio.length > 4 && (
                  <Link href="/admin/portfolio" className="block text-center text-[11px] text-gray-400 hover:text-amber-600 transition-colors">
                    +{portfolio.length - 4} more projects
                  </Link>
                )}

                <div className="pt-3 mt-2 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
                  <span>{portfolio.filter(p => p.visible).length} visible</span>
                  <span>{portfolio.filter(p => !p.visible).length} hidden</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}