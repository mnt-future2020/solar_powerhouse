'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Eye, Mail, Phone, Calendar, X, Save, Search, Loader2,
  MessageSquare, MapPin, Home, Zap
} from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Consultation {
  _id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  propertyType: string;
  monthlyBill: string;
  service: string;
  status: 'new' | 'contacted' | 'closed';
  notes: string;
  createdAt: string;
}

const statusConfig = {
  new:       { label: 'New',       cls: 'bg-red-100 text-red-700 border-red-200' },
  contacted: { label: 'Contacted', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  closed:    { label: 'Closed',    cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.new;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', cfg.cls)}>
      {cfg.label}
    </span>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({
  consultation, onClose, onUpdate
}: {
  consultation: Consultation;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Consultation>) => void;
}) {
  const { toast } = useToast();
  const [notes, setNotes] = useState(consultation.notes || '');
  const [status, setStatus] = useState<Consultation['status']>(consultation.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(`/consultations/${consultation._id}`, { notes, status });
      onUpdate(consultation._id, { notes, status });
      toast({ title: 'Updated', description: 'Consultation updated successfully.' });
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              <MessageSquare className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Consultation Details</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{consultation.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />
                  <a href={`mailto:${consultation.email}`} className="text-sm text-gray-800 hover:text-amber-600">{consultation.email}</a>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-amber-500" />
                  <a href={`tel:${consultation.phone}`} className="text-sm text-gray-800 hover:text-amber-600">{consultation.phone}</a>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">City</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-sm text-gray-800">{consultation.city || '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Property Type</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Home className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-sm text-gray-800">{consultation.propertyType || '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Bill</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-sm text-gray-800">{consultation.monthlyBill || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {consultation.service && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Service Interested In</p>
                <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-full">
                  {consultation.service}
                </span>
              </div>
            )}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                <p className="text-sm text-gray-800">
                  {new Date(consultation.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Status</p>
            <select value={status} onChange={e => setStatus(e.target.value as Consultation['status'])}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Notes</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              placeholder="Add your notes here..." />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={onClose} disabled={saving} className="flex-1 border-gray-200 text-gray-600">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}
              className="flex-1 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ConsultationsPage() {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Consultation | null>(null);

  useEffect(() => { fetchConsultations(); }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const r = await axios.get('/consultations');
      setConsultations(r.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load consultations', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id: string, updates: Partial<Consultation>) =>
    setConsultations(prev => prev.map(c => c._id === id ? { ...c, ...updates } : c));

  const filtered = consultations.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      (c.propertyType || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <>
      {selected && (
        <DetailModal
          consultation={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Consultations</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {consultations.filter(c => c.status === 'new').length} new requests pending
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm w-full sm:w-72 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, city..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-950">
                  {['Contact', 'Property', 'City', 'Monthly Bill', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-black text-white uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-400">
                        {search ? 'No results match your search' : 'No consultation requests yet'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr key={item._id}
                      className={cn('hover:bg-amber-50/40 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.email}</p>
                        <p className="text-xs text-gray-400">{item.phone}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-800">{item.propertyType || '—'}</p>
                        {item.service && (
                          <span className="text-[10px] text-amber-600 font-semibold">{item.service}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.city || '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                        {item.monthlyBill || '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Button size="sm" onClick={() => setSelected(item)}
                          className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold gap-1.5 shadow-sm">
                          <Eye className="h-3.5 w-3.5" />View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 font-medium">
              Showing {filtered.length} of {consultations.length} consultations
              {search && <span className="ml-1">for &ldquo;<span className="text-amber-600">{search}</span>&rdquo;</span>}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
