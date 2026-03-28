'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader2, ShieldCheck, AlertTriangle, Building2, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface BankPartner {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
}

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all';

// ── Logo with fallback ───────────────────────────────────────────────────────
function LogoImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
        <ImageOff className="h-8 w-8" />
        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
      </div>
    );
  }
  return (
    <img src={src} alt={alt} onError={() => setErrored(true)}
      className="max-h-24 max-w-full object-contain p-4" />
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
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
            <button onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors">
              Yes, Delete
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
    const fd = new FormData();
    fd.append('image', file);
    const res = await axios.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              <Building2 className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {editing ? 'Edit Bank Partner' : 'Add Bank Partner'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className={inputCls} placeholder="e.g. State Bank of India" required />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Bank Logo</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
              <Plus className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {preview && (
              <div className="relative w-full h-28 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img src={preview} className="max-h-24 max-w-full object-contain p-3" alt="Preview"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}
              className="flex-1 border-gray-200 text-gray-600">
              Cancel
            </Button>
            <Button type="submit" disabled={saving}
              className="flex-1 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20">
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
    if (!deleteTarget) return;
    try {
      await axios.delete(`/bank-partners/${deleteTarget._id}`);
      toast({ title: 'Deleted', description: 'Bank partner removed.' });
      fetchPartners();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <>
      {deleteTarget && (
        <DeleteModal name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
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
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Bank Partners</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage financing bank partners</p>
          </div>
          <Button onClick={() => { setEditing(null); setShowModal(true); }}
            className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20">
            <Plus className="h-4 w-4 mr-2" />Add Bank Partner
          </Button>
        </div>

        {/* Grid */}
        {partners.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400 mb-1">No bank partners yet</p>
              <p className="text-xs text-gray-300 mb-5">Add your first financing partner</p>
              <Button onClick={() => setShowModal(true)}
                className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm">
                <Plus className="h-4 w-4 mr-2" />Add Bank Partner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {partners.slice((page - 1) * LIMIT, page * LIMIT).map(partner => (
                <Card key={partner._id} className="border-0 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-32 bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                    <LogoImage src={partner.image} alt={partner.name} />
                  </div>
                  <div className="px-4 py-3 bg-slate-950">
                    <p className="text-xs font-bold text-white uppercase tracking-wider truncate mb-3">{partner.name}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(partner); setShowModal(true); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">
                        <Edit className="h-3 w-3" />Edit
                      </button>
                      <button onClick={() => setDeleteTarget(partner)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs font-bold transition-colors">
                        <Trash2 className="h-3 w-3" />Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {Math.ceil(partners.length / LIMIT) > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-xs text-gray-400">
                  Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, partners.length)} of {partners.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => p - 1)} disabled={page <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: Math.ceil(partners.length / LIMIT) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors',
                        p === page ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-200')}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(partners.length / LIMIT)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
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
