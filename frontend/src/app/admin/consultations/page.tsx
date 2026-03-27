'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Mail, Phone, Calendar, X, Save, Search, Loader2, MessageSquare } from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  services?: string[];
  source: string;
  status: 'new' | 'read' | 'replied';
  notes: string;
  createdAt: string;
}

interface ContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Contact>) => void;
  getServiceTitle: (serviceId: string) => string;
}

const statusConfig = {
  new:     { label: 'New',     cls: 'bg-red-100 text-red-700 border-red-200' },
  read:    { label: 'Read',    cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  replied: { label: 'Replied', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.new;
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', cfg.cls)}>
      {cfg.label}
    </span>
  );
}

function ContactModal({ contact, isOpen, onClose, onUpdate, getServiceTitle }: ContactModalProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'new' | 'read' | 'replied'>('new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) { setNotes(contact.notes || ''); setStatus(contact.status); }
  }, [contact]);

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      await axios.patch(`/contacts/${contact._id}`, { notes, status });
      onUpdate(contact._id, { notes, status });
      toast({ title: 'Updated', description: 'Consultation updated successfully.' });
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
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
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{contact.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-sm text-gray-800">{contact.email}</p>
                </div>
              </div>
              {contact.phone && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Phone className="h-3.5 w-3.5 text-amber-500" />
                    <p className="text-sm text-gray-800">{contact.phone}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</p>
                <p className="text-sm text-gray-800 mt-0.5">{contact.subject}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Source</p>
                <p className="text-sm text-gray-800 mt-0.5">{contact.source}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-sm text-gray-800">
                    {new Date(contact.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Message</p>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-800 whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>

          {/* Services */}
          {contact.services && contact.services.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Services Interested In</p>
              <div className="flex flex-wrap gap-2">
                {contact.services.map((id, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-full">
                    {getServiceTitle(id)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Status</p>
            <select value={status} onChange={e => setStatus(e.target.value as Contact['status'])}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all">
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
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

export default function ConsultationsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchContacts(); fetchServices(); }, []);

  const fetchServices = async () => {
    try { const r = await axios.get('/services'); setServices(r.data); } catch {}
  };

  const getServiceTitle = (id: string) =>
    services.find(s => s._id === id)?.title ?? 'Unknown Service';

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const r = await axios.get('/contacts');
      setContacts(r.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load consultations', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = (id: string, updates: Partial<Contact>) =>
    setContacts(prev => prev.map(c => c._id === id ? { ...c, ...updates } : c));

  // Search filter — name, email, subject, source
  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.source.toLowerCase().includes(q)
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Consultation Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and respond to customer consultation requests</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm w-full sm:w-72 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-950">
                {['Contact', 'Subject', 'Source', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-black text-white uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-400">
                      {search ? 'No results match your search' : 'No consultation requests yet'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((contact, i) => (
                  <tr key={contact._id}
                    className={cn('hover:bg-amber-50/40 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{contact.email}</p>
                      {contact.phone && <p className="text-xs text-gray-400">{contact.phone}</p>}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm font-semibold text-gray-800">{contact.subject}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{contact.message}</p>
                      {contact.services && contact.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {contact.services.slice(0, 2).map((id, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full">
                              {getServiceTitle(id)}
                            </span>
                          ))}
                          {contact.services.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">
                              +{contact.services.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        {contact.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                      {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button size="sm" onClick={() => { setSelectedContact(contact); setIsModalOpen(true); }}
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

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 font-medium">
            Showing {filtered.length} of {contacts.length} requests
            {search && <span className="ml-1">for "<span className="text-amber-600">{search}</span>"</span>}
          </div>
        )}
      </Card>

      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateContact}
        getServiceTitle={getServiceTitle}
      />
    </div>
  );
}
