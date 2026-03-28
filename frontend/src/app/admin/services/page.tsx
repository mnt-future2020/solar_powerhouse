'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon, CheckCircle2, Search, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
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
}: {
  serviceName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
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
            This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Field component for DRY labels ────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm transition-all outline-none";
const textareaCls = `${inputCls} resize-none`;

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
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
    }
  };

  const set = (key: keyof typeof formData, value: string) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    if (!deleteTarget) return;
    try {
      await axios.delete(`/services/${deleteTarget._id}`);
      toast({ title: 'Deleted', description: 'Service deleted successfully.' });
      fetchServices();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete service.', variant: 'destructive' });
    } finally {
      setDeleteTarget(null);
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

  // Reset page when search changes
  useEffect(() => { setPage(1); }, [search]);

  return (
    <>
      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          serviceName={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Manage your solar services and solutions</p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowForm(v => !v); }}
            className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
          >
            {showForm
              ? <><X className="h-4 w-4 mr-2" />Cancel</>
              : <><Plus className="h-4 w-4 mr-2" />Add Service</>}
          </Button>
        </div>

        {/* ── Single Form Card ── */}
        {showForm && (
          <AddService
            formData={formData}
            isEditing={!!editingService}
            onSet={set}
            onSubmit={handleSubmit}
            onDiscard={resetForm}
          />
        )}

        {/* ── Services List ── */}
        <Card className="shadow-md border-0">
          <CardHeader className="bg-gray-50 border-b py-4 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-base font-bold text-gray-900">
                All Services ({filtered.length})
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search services..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {filtered.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map((service, index) => (
                  <Card key={service._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border shadow-sm">
                    {service.image && (
                      <div className="h-40 overflow-hidden bg-gray-100 relative">
                        <img
                          src={service.image} alt={service.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={cn(
                            "text-white border-0 text-xs",
                            index % 3 === 0 && "bg-amber-500",
                            index % 3 === 1 && "bg-teal-600",
                            index % 3 === 2 && "bg-emerald-600",
                          )}>Active</Badge>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-sm mb-1 text-gray-900 line-clamp-1">{service.title}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs text-gray-500">{service.features.length} features</span>
                        </div>
                        {service.benefits && service.benefits.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                            <span className="text-xs text-gray-500">{service.benefits.length} benefits</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(service)}
                          className="flex-1 text-xs hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700">
                          <Edit className="h-3.5 w-3.5 mr-1" />Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteTarget(service)}
                          className="text-red-600 hover:bg-red-50 hover:border-red-300">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {search ? 'No services match your search' : 'No services yet'}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {search ? 'Try a different keyword' : 'Get started by creating your first solar service'}
                </p>
                {!search && (
                  <Button onClick={() => setShowForm(true)}
                    className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm">
                    <Plus className="h-4 w-4 mr-2" />Add Your First Service
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => p - 1)} disabled={page <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors',
                        p === page ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-200')}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
