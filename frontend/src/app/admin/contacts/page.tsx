'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Eye, Mail, Phone, Calendar, X, Save, Search, Loader2,
  MessageSquare, Trash2, ChevronLeft, ChevronRight, AlertTriangle, Sun
} from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  new:     { label: 'New',     cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  read:    { label: 'Read',    cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  replied: { label: 'Replied', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.new;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border', cfg.cls)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Mail className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Message Details</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">#{contact._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{contact.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</p>
                <a href={`mailto:${contact.email}`} className="text-sm text-slate-700 hover:text-amber-600 flex items-center gap-1.5 mt-0.5 transition-colors">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />{contact.email}
                </a>
              </div>
              {contact.phone && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-sm text-slate-700 hover:text-amber-600 flex items-center gap-1.5 mt-0.5 transition-colors">
                    <Phone className="h-3.5 w-3.5 text-amber-500" />{contact.phone}
                  </a>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{contact.subject}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Source</p>
                <p className="text-sm text-gray-600 mt-0.5">{contact.source}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</p>
                <p className="text-sm text-slate-700 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  {new Date(contact.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Message</p>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-slate-700 whitespace-pre-wrap">{contact.message}</div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Status</p>
            <select value={status} onChange={e => setStatus(e.target.value as Contact['status'])}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all">
              <option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option>
            </select>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Notes</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
              placeholder="Add your notes here..." />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={onClose} disabled={saving} className="flex-1 border-gray-200 text-gray-600 rounded-xl">Cancel</Button>
            <Button onClick={handleSave} disabled={saving}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel, deleting }: { name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={deleting ? undefined : onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Message?</h3>
          <p className="text-sm text-gray-500 mb-6">Message from <span className="font-semibold text-slate-700">&ldquo;{name}&rdquo;</span> will be permanently removed.</p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button onClick={onConfirm} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </motion.div>
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-xs text-gray-400">Showing <span className="font-semibold text-slate-600">{from}–{to}</span> of <span className="font-semibold text-slate-600">{total}</span></p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="h-4 w-4" /></button>
        {pages.map((p, i) => p === 'dots'
          ? <span key={`d${i}`} className="w-8 h-8 flex items-center justify-center text-gray-300 text-xs">...</span>
          : <button key={p} onClick={() => onPageChange(p)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors', p === page ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' : 'text-gray-500 hover:bg-gray-200')}>{p}</button>
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
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 8;

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
    if (!deleteTarget || deleting) return;
    const target = deleteTarget;
    try {
      setDeleting(true);
      setContacts(prev => prev.filter(c => c._id !== target._id));
      setDeleteTarget(null);
      await axios.delete(`/contacts/${target._id}`);
      toast({ title: 'Deleted', description: 'Message removed.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
      fetchContacts();
    } finally { setDeleting(false); }
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Sun className="h-5 w-5 animate-spin text-amber-400" />
        <span className="text-sm text-gray-400">Loading enquiries...</span>
      </div>
    );
  }

  const newCount = contacts.filter(c => c.status === 'new').length;

  return (
    <>
      {selected && <DetailModal contact={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
      {deleteTarget && <DeleteModal name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => { if (!deleting) setDeleteTarget(null); }} deleting={deleting} />}

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Enquiries</h1>
              <p className="text-xs text-gray-400 mt-0.5">{total} total enquiries {newCount > 0 && <span className="text-amber-500 font-semibold">({newCount} new)</span>}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm w-full sm:w-72 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, email..." className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400" />
            {searchInput && <button onClick={() => { setSearchInput(''); setSearch(''); }} className="text-gray-400 hover:text-gray-600"><X className="h-3.5 w-3.5" /></button>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'new', label: 'New', color: 'bg-blue-500' },
            { key: 'read', label: 'Read', color: 'bg-amber-500' },
            { key: 'replied', label: 'Replied', color: 'bg-emerald-500' },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setStatusFilter(tab.key); setPage(1); }}
              className={cn('flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all',
                statusFilter === tab.key ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300')}>
              {tab.color && <span className={cn('w-1.5 h-1.5 rounded-full', statusFilter === tab.key ? 'bg-white' : tab.color)} />}
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['Contact', 'Subject', 'Source', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <MessageSquare className="h-6 w-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-400">{search || statusFilter !== 'all' ? 'No results match your filters' : 'No messages yet'}</p>
                      </td>
                    </tr>
                  ) : contacts.map((item) => (
                    <tr key={item._id} className="hover:bg-amber-50/30 transition-colors cursor-pointer" onClick={() => setSelected(item)}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.email}</p>
                        {item.phone && <p className="text-xs text-gray-400">{item.phone}</p>}
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-sm font-semibold text-slate-700">{item.subject}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{item.message}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{item.source}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); setSelected(item); }}
                            className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </>
  );
}