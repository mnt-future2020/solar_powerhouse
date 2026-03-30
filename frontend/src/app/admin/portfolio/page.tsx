'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader2, Image as ImageIcon, AlertTriangle, Eye, EyeOff, ChevronLeft, ChevronRight, MapPin, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all';
const categories = ['Residential', 'Commercial', 'Industrial', 'Government', 'Educational'];

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
            <span className="font-semibold text-gray-700">"{name}"</span> will be permanently removed.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors">Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioModal({ editing, onClose, onSaved }: { editing: PortfolioItem | null; onClose: () => void; onSaved: () => void }) {
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
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-sm font-bold text-gray-900">{editing ? 'Edit Project' : 'Add Project'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Project Title <span className="text-red-400">*</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="e.g. 5kW Rooftop Installation" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputCls} resize-none`} rows={3} placeholder="Brief description..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Capacity</label>
              <input type="text" value={capacity} onChange={e => setCapacity(e.target.value)} className={inputCls} placeholder="e.g. 5 kW" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className={inputCls} placeholder="e.g. Madurai, Tamil Nadu" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Project Image <span className="text-red-400">*</span></label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
              <Plus className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {preview && (
              <div className="mt-2 w-full h-36 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                <img src={preview} className="h-full w-full object-cover" alt="Preview" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {visible ? <Eye className="h-4 w-4 text-amber-500" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
              <span className="text-sm font-medium text-gray-700">{visible ? 'Visible on website' : 'Hidden from website'}</span>
            </div>
            <button type="button" onClick={() => setVisible(!visible)}
              className={`w-10 h-6 rounded-full transition-colors ${visible ? 'bg-amber-500' : 'bg-gray-300'} relative`}>
              <span className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white shadow transition-transform ${visible ? 'translate-x-[16px]' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <Button type="submit" disabled={saving} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/portfolio/${deleteTarget._id}`);
      toast({ title: 'Deleted', description: 'Project removed.' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    } finally { setDeleteTarget(null); }
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

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-5 w-5 animate-spin text-amber-500" /></div>;

  const totalPages = Math.ceil(items.length / LIMIT);
  const paginated = items.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <>
      {deleteTarget && <DeleteModal name={deleteTarget.title} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {showModal && <PortfolioModal editing={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSaved={fetchItems} />}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Portfolio</h1>
              <p className="text-xs text-gray-400 mt-0.5">{items.length} projects total</p>
            </div>
          </div>
          <Button onClick={() => { setEditing(null); setShowModal(true); }} className="bg-slate-800 hover:bg-slate-700 text-white font-semibold">
            <Plus className="h-4 w-4 mr-2" />Add Project
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl py-16 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">No projects yet</h3>
            <p className="text-xs text-gray-400 mb-4">Showcase your completed solar installations</p>
            <Button onClick={() => setShowModal(true)} className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm">
              <Plus className="h-4 w-4 mr-2" />Add Project
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginated.map(item => (
                <div key={item._id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-amber-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-gray-300" /></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800 text-sm truncate">{item.title}</h3>
                            {!item.visible && (
                              <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Hidden</span>
                            )}
                          </div>
                          {item.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</p>}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => toggleVisibility(item)}
                            className={cn("p-2 rounded-lg transition-colors", item.visible ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100")} title={item.visible ? 'Hide' : 'Show'}>
                            {item.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button onClick={() => { setEditing(item); setShowModal(true); }}
                            className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(item)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2.5">
                        {item.category && (
                          <span className="text-[11px] font-medium text-white bg-amber-500 px-2 py-0.5 rounded">{item.category}</span>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-[11px] text-gray-400">{item.location}</span>
                          </div>
                        )}
                        {item.capacity && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-gray-400" />
                            <span className="text-[11px] text-gray-400">{item.capacity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, items.length)} of {items.length}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => p - 1)} disabled={page <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors', p === page ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' : 'text-gray-500 hover:bg-gray-100')}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
