'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Image as ImageIcon, Search, X, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, Layers, LayoutGrid, Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import AddService from '@/components/Admin/Service/AddService';

interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
  image?: string;
  bannerImage?: string;
  detailTitle?: string;
  detailDescription?: string;
  detailFeatures?: string[];
  workProcess?: string;
  benefits?: string[];
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({
  serviceName,
  onConfirm,
  onCancel,
  deleting,
}: {
  serviceName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={deleting ? undefined : onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Service?</h3>
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-700">"{serviceName}"</span> will be permanently removed.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailDescription: '',
    features: '',
    workProcess: '',
    benefits: '',
    image: '',
    bannerImage: '',
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('/services');
      setServices(res.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch services', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof typeof formData, value: string) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    const payload = {
      title: formData.title,
      description: formData.description,
      detailDescription: formData.detailDescription || formData.description,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      workProcess: formData.workProcess,
      benefits: formData.benefits.split(',').map(b => b.trim()).filter(Boolean),
      image: formData.image,
      bannerImage: formData.bannerImage,
    };
    try {
      setSaving(true);
      if (editingService) {
        await axios.put(`/services/${editingService._id}`, payload);
        toast({ title: 'Updated', description: 'Service updated successfully.' });
      } else {
        await axios.post('/services', payload);
        toast({ title: 'Created', description: 'Service created successfully.' });
      }
      resetForm();
      fetchServices();
    } catch {
      toast({ title: 'Error', description: 'Failed to save service.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      detailDescription: service.detailDescription || service.description || '',
      features: service.features?.join(', ') || '',
      workProcess: service.workProcess || '',
      benefits: service.benefits?.join(', ') || '',
      image: service.image || '',
      bannerImage: service.bannerImage || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    const target = deleteTarget;
    try {
      setDeleting(true);
      setServices(prev => prev.filter(s => s._id !== target._id));
      setDeleteTarget(null);
      await axios.delete(`/services/${target._id}`);
      toast({ title: 'Deleted', description: 'Service deleted successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete service.', variant: 'destructive' });
      fetchServices();
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', detailDescription: '', features: '', workProcess: '', benefits: '', image: '', bannerImage: '' });
    setEditingService(null);
    setShowForm(false);
  };

  const [page, setPage] = useState(1);
  const LIMIT = 9;

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  useEffect(() => { setPage(1); }, [search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          serviceName={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => { if (!deleting) setDeleteTarget(null); }}
          deleting={deleting}
        />
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Services</h1>
              <p className="text-gray-400 mt-0.5 text-xs">{services.length} services total</p>
            </div>
          </div>
          <Button
            onClick={() => { showForm ? resetForm() : setShowForm(true); }}
            className={cn(
              "font-semibold",
              showForm
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                : "bg-slate-800 text-white hover:bg-slate-700"
            )}
          >
            {showForm
              ? <><X className="h-4 w-4 mr-2" />Close Form</>
              : <><Plus className="h-4 w-4 mr-2" />Add Service</>}
          </Button>
        </div>

        {/* ── Add / Edit Form ── */}
        {showForm && (
          <AddService
            formData={formData}
            isEditing={!!editingService}
            onSet={set}
            onSubmit={handleSubmit}
            onDiscard={resetForm}
            saving={saving}
          />
        )}

        {/* ── Search Bar ── */}
        {!showForm && services.length > 0 && (
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {/* ── Services List ── */}
        {!showForm && (
          <>
            {filtered.length > 0 ? (
              <div className="space-y-3">
                {paginated.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white border border-gray-100 rounded-xl p-4 hover:border-amber-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex gap-4 items-start">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-800 text-sm truncate">{service.title}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{service.description}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(service)}
                              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 mt-2.5">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-[11px] text-gray-400">{service.features.length} features</span>
                          </div>
                          {service.benefits && service.benefits.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Layers className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-[11px] text-gray-400">{service.benefits.length} benefits</span>
                            </div>
                          )}
                          {service.bannerImage && (
                            <div className="flex items-center gap-1.5">
                              <ImageIcon className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-[11px] text-gray-400">Banner</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-xl py-16 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {search ? 'No services match your search' : 'No services yet'}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  {search ? 'Try a different keyword' : 'Get started by creating your first service'}
                </p>
                {!search && (
                  <Button onClick={() => setShowForm(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-sm">
                    <Plus className="h-4 w-4 mr-2" />Add Your First Service
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">
                  {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, filtered.length)} of {filtered.length}
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
