'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Eye, Mail, Phone, Calendar, X, Save, Search, Loader2,
  MessageSquare, Trash2, ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source: string;
  status: 'new' | 'read' | 'replied';
  notes: string;
  createdAt: string;
}

const statusConfig = {
  new:     { label: 'New',     cls: 'bg-red-100 text-red-700 border-red-200' },
  read:    { label: 'Read',    cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  replied: { label: 'Replied', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.new;
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', cfg.cls)}>{cfg.label}</span>;
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ contact, onClose, onUpdate }: {
  contact: Contact; onClose: () => void; onUpdate: (id: string, updates: Partial<Contact>) => void;
}) {
  const { toast } = useToast();
  const [notes, setNotes] = useState(contact.notes || '');
  const [status, setStatus] = useState<Contact['status']>(contact.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(`/contacts/${contact._id}`, { notes, status });
      onUpdate(contact._id, { notes, status });
      toast({ title: 'Updated', description: 'Contact updated successfully.' });
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10"><Mail className="h-4 w-4 text-amber-400" /></div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Message Details</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{contact.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                <a href={`mailto:${contact.email}`} className="text-sm text-gray-800 hover:text-amber-600 flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />{contact.email}
                </a>
              </div>
              {contact.phone && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-sm text-gray-800 hover:text-amber-600 flex items-center gap-1.5 mt-0.5">
                    <Phone className="h-3.5 w-3.5 text-amber-500" />{contact.phone}
                  </a>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{contact.subject}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Source</p>
                <p className="text-sm text-gray-600 mt-0.5">{contact.source}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date</p>
                <p className="text-sm text-gray-800 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  {new Date(contact.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Message</p>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-800 whitespace-pre-wrap">{contact.message}</div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Status</p>
            <select value={status} onChange={e => setStatus(e.target.value as Contact['status'])}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all">
              <option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option>
            </select>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Notes</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              placeholder="Add your notes here..." />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={onClose} disabled={saving} className="flex-1 border-gray-200 text-gray-600">Cancel</Button>
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

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Message?</h3>
          <p className="text-sm text-gray-500 mb-6">Message from <span className="font-semibold text-gray-700">&ldquo;{name}&rdquo;</span> will be permanently removed.</p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors">Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, total, limit, onPageChange }: {
  page: number; totalPages: number; total: number; limit: number; onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages: (number | 'dots')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== 'dots') pages.push('dots');
  }
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-gray-400">Showing <span className="font-semibold text-gray-600">{from}–{to}</span> of <span className="font-semibold text-gray-600">{total}</span></p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="h-4 w-4" /></button>
        {pages.map((p, i) => p === 'dots'
          ? <span key={`d${i}`} className="w-8 h-8 flex items-center justify-center text-gray-300 text-xs">...</span>
          : <button key={p} onClick={() => onPageChange(p)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors', p === page ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-200')}>{p}</button>
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 15;

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = { page, limit: LIMIT };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const r = await axios.get('/contacts', { params });
      const d = r.data;
      if (Array.isArray(d)) {
        setContacts(d); setTotal(d.length); setTotalPages(1);
      } else {
        setContacts(d.data); setTotal(d.total); setTotalPages(d.totalPages);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load messages', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [page, search, statusFilter, toast]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleUpdate = (id: string, updates: Partial<Contact>) =>
    setContacts(prev => prev.map(c => c._id === id ? { ...c, ...updates } : c));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/contacts/${deleteTarget._id}`);
      toast({ title: 'Deleted', description: 'Message removed.' });
      fetchContacts();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    } finally { setDeleteTarget(null); }
  };

  if (loading && contacts.length === 0) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;
  }

  return (
    <>
      {selected && <DetailModal contact={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
      {deleteTarget && <DeleteModal name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Contact Messages</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} total messages</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm w-full sm:w-72 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, email..." className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400" />
            {searchInput && <button onClick={() => { setSearchInput(''); setSearch(''); }} className="text-gray-400 hover:text-gray-600"><X className="h-3.5 w-3.5" /></button>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[{ key: 'all', label: 'All' }, { key: 'new', label: 'New' }, { key: 'read', label: 'Read' }, { key: 'replied', label: 'Replied' }].map(tab => (
            <button key={tab.key} onClick={() => { setStatusFilter(tab.key); setPage(1); }}
              className={cn('px-4 py-1.5 rounded-full text-xs font-bold transition-colors',
                statusFilter === tab.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-950">
                  {['Contact', 'Subject', 'Source', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-black text-white uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-gray-400">{search || statusFilter !== 'all' ? 'No results match your filters' : 'No messages yet'}</p>
                    </td>
                  </tr>
                ) : contacts.map((item, i) => (
                  <tr key={item._id} className={cn('hover:bg-amber-50/40 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.email}</p>
                      {item.phone && <p className="text-xs text-gray-400">{item.phone}</p>}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-sm font-semibold text-gray-800">{item.subject}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{item.message}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{item.source}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex gap-1.5">
                        <Button size="sm" onClick={() => setSelected(item)} className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold gap-1.5 shadow-sm">
                          <Eye className="h-3.5 w-3.5" />View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteTarget(item)} className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
        </Card>
      </div>
    </>
  );
}
