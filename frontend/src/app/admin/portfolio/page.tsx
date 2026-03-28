'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader2, Image as ImageIcon, AlertTriangle, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  capacity: string;
  visible: boolean;
  createdAt: string;
}

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all';

const categories = ['Residential', 'Commercial', 'Industrial', 'Government', 'Educational'];

// ── Delete Modal ──────────────────────────────────────────────────────────────
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
          <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Project?</h3>
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-700">&quot;{name}&quot;</span> will be permanently removed.
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
function PortfolioModal({
  editing, onClose, onSaved,
}: {
  editing: PortfolioItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [category, setCategory] = useState(editing?.category ?? 'Residential');
  const [location, setLocation] = useState(editing?.location ?? '');
  const [capacity, setCapacity] = useState(editing?.capacity ?? '');
  const [visible, setVisible] = useState(editing?.visible ?? true);
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
    if (!title.trim()) return;
    if (!preview && !imageFile) {
      toast({ title: 'Image required', description: 'Please upload a project image.', variant: 'destructive' });
      return;
    }
    try {
      setSaving(true);
      let imageUrl = editing?.image ?? '';
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const payload = { title: title.trim(), description: description.trim(), image: imageUrl, category, location: location.trim(), capacity: capacity.trim(), visible };
      if (editing) {
        await axios.put(`/portfolio/${editing._id}`, payload);
        toast({ title: 'Updated', description: 'Portfolio project updated.' });
      } else {
        await axios.post('/portfolio', payload);
        toast({ title: 'Added', description: 'Portfolio project added.' });
      }
      onSaved();
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to save project.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              <ImageIcon className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {editing ? 'Edit Project' : 'Add Project'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Project Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              className={inputCls} placeholder="e.g. 5kW Rooftop Installation" required />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              className={`${inputCls} resize-none`} rows={3} placeholder="Brief description of the project..." />
          </div>

          {/* Category + Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity</label>
              <input type="text" value={capacity} onChange={e => setCapacity(e.target.value)}
                className={inputCls} placeholder="e.g. 5 kW" />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
              className={inputCls} placeholder="e.g. Madurai, Tamil Nadu" />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Project Image *</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
              <Plus className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {preview && (
              <div className="relative w-full h-40 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <img src={preview} className="h-full w-full object-cover" alt="Preview"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          {/* Visibility toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              {visible ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
              <span className="text-sm font-semibold text-gray-700">
                {visible ? 'Visible on website' : 'Hidden from website'}
              </span>
            </div>
            <button type="button" onClick={() => setVisible(!visible)}
              className={`w-10 h-6 rounded-full transition-colors ${visible ? 'bg-emerald-500' : 'bg-gray-300'} relative`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${visible ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}
              className="flex-1 border-gray-200 text-gray-600">
              Cancel
            </Button>
            <Button type="submit" disabled={saving}
              className="flex-1 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PortfolioAdmin() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [page, setPage] = useState(1);
  const LIMIT = 9;

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/portfolio?all=true');
      setItems(res.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load portfolio.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/portfolio/${deleteTarget._id}`);
      toast({ title: 'Deleted', description: 'Project removed.' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleVisibility = async (item: PortfolioItem) => {
    try {
      await axios.put(`/portfolio/${item._id}`, { visible: !item.visible });
      toast({ title: item.visible ? 'Hidden' : 'Visible', description: `Project ${item.visible ? 'hidden from' : 'shown on'} website.` });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' });
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
        <DeleteModal name={deleteTarget.title} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      {showModal && (
        <PortfolioModal
          editing={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSaved={fetchItems}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Portfolio</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your completed solar projects</p>
          </div>
          <Button onClick={() => { setEditing(null); setShowModal(true); }}
            className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20">
            <Plus className="h-4 w-4 mr-2" />Add Project
          </Button>
        </div>

        {/* Grid */}
        {items.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400 mb-1">No projects yet</p>
              <p className="text-xs text-gray-300 mb-5">Showcase your completed solar installations</p>
              <Button onClick={() => setShowModal(true)}
                className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm">
                <Plus className="h-4 w-4 mr-2" />Add Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.slice((page - 1) * LIMIT, page * LIMIT).map(item => (
              <Card key={item._id} className="border-0 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                  {!item.visible && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-gray-900/70 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                      <EyeOff className="h-3 w-3" /> Hidden
                    </div>
                  )}
                  {item.category && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 rounded-lg text-xs font-bold text-white">
                      {item.category}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{item.title}</h3>
                  {(item.location || item.capacity) && (
                    <p className="text-xs text-gray-400">
                      {[item.location, item.capacity].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                  )}
                </div>
                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                  <button onClick={() => toggleVisibility(item)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition-colors">
                    {item.visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {item.visible ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => { setEditing(item); setShowModal(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors">
                    <Edit className="h-3 w-3" />Edit
                  </button>
                  <button onClick={() => setDeleteTarget(item)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {Math.ceil(items.length / LIMIT) > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, items.length)} of {items.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => p - 1)} disabled={page <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.ceil(items.length / LIMIT) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors',
                      p === page ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-200')}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(items.length / LIMIT)}
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
