'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader2, ShieldCheck, AlertTriangle, Building2, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/compressImage';

interface BankPartner {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
}

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all';

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel, deleting }: { name: string; onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={deleting ? undefined : onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Partner?</h3>
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-700">"{name}"</span> will be permanently removed.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function PartnerModal({
  editing, onClose, onSaved,
}: {
  editing: BankPartner | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(editing?.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(editing?.image ?? '');
  const [saving, setSaving] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const compressed = await compressImage(file);
    const fd = new FormData();
    fd.append('image', compressed);
    const res = await axios.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
    return res.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      let imageUrl = editing?.image ?? '';
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const payload = { name: name.trim(), image: imageUrl };
      if (editing) {
        await axios.put(`/bank-partners/${editing._id}`, payload);
        toast({ title: 'Updated', description: 'Bank partner updated successfully.' });
      } else {
        await axios.post('/bank-partners', payload);
        toast({ title: 'Added', description: 'Bank partner added successfully.' });
      }
      onSaved();
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to save bank partner.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">
            {editing ? 'Edit Bank Partner' : 'Add Bank Partner'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bank Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className={inputCls} placeholder="e.g. State Bank of India" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bank Logo</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
              <Plus className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {preview && (
              <div className="mt-2 w-full h-24 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={preview} className="max-h-20 max-w-full object-contain p-2" alt="Preview"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <Button type="submit" disabled={saving}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Partner'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BankPartnersAdmin() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<BankPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BankPartner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BankPartner | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    try {
      const res = await axios.get('/bank-partners');
      setPartners(res.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load bank partners.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    const target = deleteTarget;
    try {
      setDeleting(true);
      setPartners(prev => prev.filter(p => p._id !== target._id));
      setDeleteTarget(null);
      await axios.delete(`/bank-partners/${target._id}`);
      toast({ title: 'Deleted', description: 'Bank partner removed.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
      fetchPartners();
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
      </div>
    );
  }

  const totalPages = Math.ceil(partners.length / LIMIT);
  const paginated = partners.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <>
      {deleteTarget && (
        <DeleteModal name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => { if (!deleting) setDeleteTarget(null); }} deleting={deleting} />
      )}
      {showModal && (
        <PartnerModal
          editing={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSaved={fetchPartners}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Bank Partners</h1>
              <p className="text-xs text-gray-400 mt-0.5">{partners.length} partners total</p>
            </div>
          </div>
          <Button onClick={() => { setEditing(null); setShowModal(true); }}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold">
            <Plus className="h-4 w-4 mr-2" />Add Partner
          </Button>
        </div>

        {/* List */}
        {partners.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl py-16 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">No bank partners yet</h3>
            <p className="text-xs text-gray-400 mb-4">Add your first financing partner</p>
            <Button onClick={() => setShowModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm">
              <Plus className="h-4 w-4 mr-2" />Add Partner
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginated.map(partner => (
                <div key={partner._id}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:border-amber-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {partner.image ? (
                        <img src={partner.image} alt={partner.name}
                          className="max-h-12 max-w-full object-contain p-1"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <ImageOff className="h-5 w-5 text-gray-300" />
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 truncate">{partner.name}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Added {new Date(partner.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => { setEditing(partner); setShowModal(true); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(partner)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">
                  {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, partners.length)} of {partners.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => p - 1)} disabled={page <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors',
                        p === page ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' : 'text-gray-500 hover:bg-gray-100')}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
