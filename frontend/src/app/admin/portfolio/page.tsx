'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader2, Image as ImageIcon, AlertTriangle, Eye, EyeOff, ChevronLeft, ChevronRight, MapPin, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/compressImage';

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  location: string;
  capacity: string;
  visible: boolean;
  createdAt: string;
}

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all';
const categories = ['Residential', 'Commercial', 'Industrial', 'Government', 'Educational'];

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
          <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Project?</h3>
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-700">"{name}"</span> will be permanently removed.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            <button onClick={onConfirm} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Yes, Delete'}
            </button>
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(editing?.images?.length ? editing.images : editing?.image ? [editing.image] : []);
  const [saving, setSaving] = useState(false);

  const MAX_IMAGES = 3;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = MAX_IMAGES - previews.length;
    if (remaining <= 0) {
      toast({ title: 'Limit reached', description: `Maximum ${MAX_IMAGES} images allowed.`, variant: 'destructive' });
      return;
    }
    const toAdd = files.slice(0, remaining);
    setImageFiles(prev => [...prev, ...toAdd]);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const existingCount = editing?.images?.length ? editing.images.length : editing?.image ? 1 : 0;
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (index >= existingCount) {
      setImageFiles(prev => prev.filter((_, i) => i !== index - existingCount));
    }
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
    if (!title.trim()) return;
    if (previews.length === 0) {
      toast({ title: 'Image required', description: 'Please upload at least one project image.', variant: 'destructive' });
      return;
    }
    try {
      setSaving(true);
      const existingImages = editing?.images?.length ? editing.images : editing?.image ? [editing.image] : [];
      const keptExisting = previews.filter(p => existingImages.includes(p));
      const uploadedUrls = await Promise.all(imageFiles.map(f => uploadImage(f)));
      const allImages = [...keptExisting, ...uploadedUrls].slice(0, MAX_IMAGES);
      const payload = { title: title.trim(), description: description.trim(), images: allImages, image: allImages[0], category, location: location.trim(), capacity: capacity.trim(), visible };
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
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Project Images <span className="text-red-400">*</span> <span className="text-gray-400 font-normal">({previews.length}/{MAX_IMAGES})</span></label>
            {previews.length < MAX_IMAGES && (
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
                <Plus className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload images (max {MAX_IMAGES})</span>
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </label>
            )}
            {previews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative group h-28 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                    <img src={src} className="h-full w-full object-cover" alt={`Preview ${i + 1}`} />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
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
  const [deleting, setDeleting] = useState(false);
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
    if (!deleteTarget || deleting) return;
    const target = deleteTarget;
    try {
      setDeleting(true);
      setItems(prev => prev.filter(i => i._id !== target._id));
      setDeleteTarget(null);
      await axios.delete(`/portfolio/${target._id}`);
      toast({ title: 'Deleted', description: 'Project removed.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
      fetchItems();
    } finally { setDeleting(false); }
  };

  const toggleVisibility = async (item: PortfolioItem) => {
    setItems(prev => prev.map(i => i._id === item._id ? { ...i, visible: !i.visible } : i));
    try {
      await axios.put(`/portfolio/${item._id}`, { visible: !item.visible });
      toast({ title: item.visible ? 'Hidden' : 'Visible', description: `Project ${item.visible ? 'hidden from' : 'shown on'} website.` });
    } catch {
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, visible: item.visible } : i));
      toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-5 w-5 animate-spin text-amber-500" /></div>;

  const totalPages = Math.ceil(items.length / LIMIT);
  const paginated = items.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <>
      {deleteTarget && <DeleteModal name={deleteTarget.title} onConfirm={handleDelete} onCancel={() => { if (!deleting) setDeleteTarget(null); }} deleting={deleting} />}
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
