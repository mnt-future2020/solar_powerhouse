'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
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
}

const serviceColors = ['solar-amber', 'solar-teal', 'solar-green'];

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: '',
    image: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch services', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      title: formData.title,
      description: formData.description,
      features: formData.features.split(',').map(f => f.trim()),
      image: formData.image,
    };

    try {
      if (editingService) {
        await axios.put(`/services/${editingService._id}`, serviceData);
        toast({ title: 'Success', description: 'Service updated successfully' });
      } else {
        await axios.post('/services', serviceData);
        toast({ title: 'Success', description: 'Service created successfully' });
      }
      
      resetForm();
      fetchServices();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save service', variant: 'destructive' });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      features: service.features.join(', '),
      image: service.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await axios.delete(`/services/${id}`);
      toast({ title: 'Success', description: 'Service deleted successfully' });
      fetchServices();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', features: '', image: '' });
    setEditingService(null);
    setShowForm(false);
  };

  // Preview component that matches the services page design
  const ServicePreview = ({ data }: { data: typeof formData }) => {
    const color = serviceColors[0]; // Use first color for preview
    const featuresArray = data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : [];
    
    return (
      <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
        {/* Image Section */}
        <div className="h-64 overflow-hidden relative bg-gray-100">
          {data.image ? (
            <img 
              src={data.image} 
              alt={data.title || 'Service preview'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
              <ImageIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Service Badge */}
          <div className="absolute top-6 left-6">
            <Badge className="bg-amber-500/90 text-white px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider border-0">
              Premium Solution
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-amber-600 transition-colors">
              {data.title || 'Service Title'}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {data.description || 'Service description will appear here...'}
            </p>
          </div>

          {/* Features List */}
          {featuresArray.length > 0 && (
            <div className="space-y-3">
              {featuresArray.slice(0, 4).map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-gray-700 font-medium text-sm leading-relaxed">{feature}</span>
                </div>
              ))}
              {featuresArray.length > 4 && (
                <div className="text-sm text-gray-500 font-medium">
                  +{featuresArray.length - 4} more features
                </div>
              )}
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-4">
            <Button className="w-full h-12 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg hover:shadow-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-1">Manage your solar services and solutions</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Service'}
        </Button>
      </div>

      {showForm && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50 border-b">
              <CardTitle className="text-xl font-bold text-gray-900">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </CardTitle>
              <p className="text-sm text-gray-600">Fill in the details below to create or update a service</p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    placeholder="e.g., Residential Solar Installation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                    rows={4}
                    placeholder="Detailed description of the service and its benefits..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Features (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Free consultation, 25-year warranty, Professional installation, Maintenance support"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate each feature with a comma</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <ImageIcon className="inline h-4 w-4 mr-1" />
                    Service Image
                  </label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    onRemove={() => setFormData({ ...formData, image: '' })}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a high-quality image that represents your service. Recommended size: 800x600px
                  </p>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <Button 
                    type="submit"
                    className="flex-1 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold h-12"
                  >
                    {editingService ? 'Update Service' : 'Create Service'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="px-6 h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
              <Badge variant="outline" className="text-xs">How it appears on services page</Badge>
            </div>
            <div className="max-w-sm">
              <ServicePreview data={formData} />
            </div>
          </div>
        </div>
      )}

      {/* Services List */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl font-bold text-gray-900">
            All Services ({services.length})
          </CardTitle>
          <p className="text-sm text-gray-600">Manage your existing services</p>
        </CardHeader>
        <CardContent className="p-6">
          {services.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const color = serviceColors[index % 3];
                return (
                  <Card key={service._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                    {service.image && (
                      <div className="h-48 overflow-hidden bg-gray-100 relative">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className={cn(
                            "text-white border-0 text-xs",
                            color === 'solar-amber' && "bg-amber-500",
                            color === 'solar-teal' && "bg-teal-600",
                            color === 'solar-green' && "bg-emerald-600"
                          )}>
                            Active
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-gray-500 font-medium">
                          {service.features.length} features included
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(service)}
                          className="flex-1 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(service._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No services yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first solar service</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
