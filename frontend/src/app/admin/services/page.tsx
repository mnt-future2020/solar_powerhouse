'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, CheckCircle2, ArrowRight, Zap, Search, X } from 'lucide-react';
import axios from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from '@/components/ui/ImageUpload';
import { cn } from '@/lib/utils';

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
}

const serviceColors = ['solar-amber', 'solar-teal', 'solar-green'];

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '', description: '', features: '', image: '',
    bannerImage: '', detailTitle: '', detailDescription: '', detailFeatures: '',
    workProcess: '',
    isDirtyDetailTitle: false, isDirtyDetailDesc: false, isDirtyDetailFeat: false,
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch services', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const serviceData = {
      title: formData.title,
      description: formData.description,
      features: formData.features.split(',').map(f => f.trim()),
      image: formData.image,
      bannerImage: formData.bannerImage,
      detailTitle: formData.detailTitle || formData.title,
      detailDescription: formData.detailDescription || formData.description,
      detailFeatures: formData.detailFeatures
        ? formData.detailFeatures.split(',').map(f => f.trim())
        : formData.features.split(',').map(f => f.trim()),
      workProcess: formData.workProcess,
    };
    
    console.log('Submitting service data:', serviceData);
    
    try {
      if (editingService) {
        const response = await axios.put(`/services/${editingService._id}`, serviceData);
        console.log('Update response:', response.data);
        toast({ title: 'Success', description: 'Service updated successfully' });
      } else {
        const response = await axios.post('/services', serviceData);
        console.log('Create response:', response.data);
        toast({ title: 'Success', description: 'Service created successfully' });
      }
      resetForm();
      fetchServices();
    } catch (error: any) {
      console.error('Service save error:', error);
      console.error('Error response:', error.response?.data);
      toast({ title: 'Error', description: 'Failed to save service', variant: 'destructive' });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      features: service.features?.join(', ') || '',
      image: service.image || '',
      bannerImage: service.bannerImage || '',
      detailTitle: service.detailTitle || service.title || '',
      detailDescription: service.detailDescription || service.description || '',
      detailFeatures: service.detailFeatures?.join(', ') || service.features?.join(', ') || '',
      workProcess: service.workProcess || '',
      isDirtyDetailTitle: true, isDirtyDetailDesc: true, isDirtyDetailFeat: true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/services/${id}`);
      toast({ title: 'Success', description: 'Service deleted successfully' });
      fetchServices();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', features: '', image: '',
      bannerImage: '', detailTitle: '', detailDescription: '', detailFeatures: '',
      workProcess: '',
      isDirtyDetailTitle: false, isDirtyDetailDesc: false, isDirtyDetailFeat: false,
    });
    setEditingService(null);
    setShowForm(false);
  };

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  // Live preview
  const ServicePreview = ({ data }: { data: typeof formData }) => {
    const featuresArray = data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : [];
    return (
      <div className="bg-[#000c15] p-5 rounded-2xl shadow-xl relative overflow-hidden border border-gray-700">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-amber-400/10 blur-[80px]" />
        </div>
        <div className="group relative z-10 flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg">
          <div className="relative w-full h-36 overflow-hidden border-b border-white/10 bg-black/20">
            {data.image ? (
              <img src={data.image} alt={data.title || 'Preview'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-[#000c15] via-[#000c15]/40 to-transparent" />
            <div className="absolute bottom-2 left-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold text-[10px] uppercase tracking-wide">
                <Zap className="h-2.5 w-2.5 text-amber-400" /> Premium
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1 p-4">
            <h3 className="text-base font-bold text-white mb-1 leading-tight">
              {data.title || 'Service Title'}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-3">
              {data.description || 'Service description appears here...'}
            </p>
            {featuresArray.length > 0 && (
              <div className="space-y-1.5 mb-4">
                {featuresArray.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-white/80 text-xs">{f}</span>
                  </div>
                ))}
                {featuresArray.length > 3 && (
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wide">
                    +{featuresArray.length - 3} more
                  </p>
                )}
              </div>
            )}
            <button className="w-full mt-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wide pointer-events-none">
              Explore System <ArrowRight className="h-3 w-3 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your solar services and solutions</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
        >
          {showForm ? <><X className="h-4 w-4 mr-2" />Cancel</> : <><Plus className="h-4 w-4 mr-2" />Add Service</>}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Side-by-side form panels */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* LEFT — Card Form */}
            <Card className="border shadow-md">
              <CardHeader className="bg-amber-50 border-b py-4 px-6">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">1</span>
                  <CardTitle className="text-base font-bold text-gray-900">Card Overview</CardTitle>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Core info shown on the services grid</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Service Title *</label>
                  <input
                    type="text" required value={formData.title}
                    onChange={e => setFormData(prev => ({
                      ...prev, title: e.target.value,
                      ...(!prev.isDirtyDetailTitle && { detailTitle: e.target.value })
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm transition-all"
                    placeholder="e.g., Residential Solar Installation"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Short Description *</label>
                  <textarea
                    required value={formData.description}
                    onChange={e => setFormData(prev => ({
                      ...prev, description: e.target.value,
                      ...(!prev.isDirtyDetailDesc && { detailDescription: e.target.value })
                    }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm resize-none transition-all"
                    rows={3} placeholder="Brief summary for the card..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Card Features *</label>
                  <input
                    type="text" required value={formData.features}
                    onChange={e => setFormData(prev => ({
                      ...prev, features: e.target.value,
                      ...(!prev.isDirtyDetailFeat && { detailFeatures: e.target.value })
                    }))}
                    placeholder="Free Consultation, 10yr Warranty, ..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    <ImageIcon className="inline h-3.5 w-3.5 mr-1 text-amber-500" />Card Thumbnail
                    {formData.image && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✓ Uploaded
                      </span>
                    )}
                  </label>
                  <ImageUpload
                    value={formData.image}
                    onChange={url => setFormData(prev => ({ ...prev, image: url }))}
                    onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                  />
                  {formData.image && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      Thumbnail ready for service card
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* RIGHT — Detail Form */}
            <Card className="border shadow-md">
              <CardHeader className="bg-teal-50 border-b py-4 px-6">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded">2</span>
                  <CardTitle className="text-base font-bold text-gray-900">Detail Page View</CardTitle>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Shown on the standalone service page</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detail Page Title</label>
                  <input
                    type="text" value={formData.detailTitle}
                    onChange={e => setFormData(prev => ({ ...prev, detailTitle: e.target.value, isDirtyDetailTitle: true }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-sm transition-all"
                    placeholder="Auto-fills from title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Description</label>
                  <textarea
                    value={formData.detailDescription}
                    onChange={e => setFormData(prev => ({ ...prev, detailDescription: e.target.value, isDirtyDetailDesc: true }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-sm resize-none transition-all"
                    rows={3} placeholder="Comprehensive description for the detail page..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Extended Features</label>
                  <input
                    type="text" value={formData.detailFeatures}
                    onChange={e => setFormData(prev => ({ ...prev, detailFeatures: e.target.value, isDirtyDetailFeat: true }))}
                    placeholder="All features, separated by commas"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-sm transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
                </div>

                {/* What we do in this work - now separate field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">What We Do in This Work</label>
                  <textarea
                    value={formData.workProcess}
                    onChange={e => setFormData(prev => ({ ...prev, workProcess: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-sm resize-none transition-all"
                    rows={3} placeholder="Describe the work process, steps, and deliverables..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    <ImageIcon className="inline h-3.5 w-3.5 mr-1 text-teal-600" />Hero Banner Image
                    {formData.bannerImage && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✓ Uploaded
                      </span>
                    )}
                  </label>
                  <ImageUpload
                    value={formData.bannerImage}
                    onChange={url => setFormData(prev => ({ ...prev, bannerImage: url }))}
                    onRemove={() => setFormData(prev => ({ ...prev, bannerImage: '' }))}
                  />
                  {formData.bannerImage && (
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      Banner image ready for detail page
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={resetForm} className="px-6">
              Discard
            </Button>
            <Button type="submit" className="px-8 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold">
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>

          {/* Preview at bottom */}
          <div className="flex flex-col items-center pt-2 pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold text-gray-700">Live Card Preview</span>
            </div>
            <div className="w-full max-w-xs">
              <ServicePreview data={formData} />
            </div>
          </div>
        </form>
      )}

      {/* Search + Services List */}
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gray-50 border-b py-4 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg font-bold text-gray-900">
              All Services ({filtered.length})
            </CardTitle>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
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
              {filtered.map((service, index) => {
                const color = serviceColors[index % 3];
                return (
                  <Card key={service._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border shadow-sm">
                    {service.image && (
                      <div className="h-44 overflow-hidden bg-gray-100 relative">
                        <img
                          src={service.image} alt={service.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className={cn(
                            "text-white border-0 text-xs",
                            color === 'solar-amber' && "bg-amber-500",
                            color === 'solar-teal' && "bg-teal-600",
                            color === 'solar-green' && "bg-emerald-600"
                          )}>Active</Badge>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-base mb-1 text-gray-900 line-clamp-1">{service.title}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-1.5 mb-3">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-xs text-gray-500">{service.features.length} features</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(service)}
                          className="flex-1 text-xs hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700">
                          <Edit className="h-3.5 w-3.5 mr-1" />Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(service._id)}
                          className="text-red-600 hover:bg-red-50 hover:border-red-300">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {search ? 'No services match your search' : 'No services yet'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
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
        </CardContent>
      </Card>
    </div>
  );
}