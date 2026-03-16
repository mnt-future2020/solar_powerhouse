'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import axios from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from '@/components/ui/ImageUpload';

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  image?: string;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
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
      price: Number(formData.price),
      features: formData.features.split(',').map(f => f.trim()),
      image: formData.image,
    };

    try {
      if (editingService) {
        await axios.put(`/services/${editingService._id}`, serviceData);
        toast({ title: 'Success', description: 'Service updated successfully', variant: 'success' });
      } else {
        await axios.post('/services', serviceData);
        toast({ title: 'Success', description: 'Service created successfully', variant: 'success' });
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
      price: service.price.toString(),
      features: service.features.join(', '),
      image: service.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await axios.delete(`/services/${id}`);
      toast({ title: 'Success', description: 'Service deleted successfully', variant: 'success' });
      fetchServices();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', features: '', image: '' });
    setEditingService(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Service'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingService ? 'Edit Service' : 'Add New Service'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Roof Top Solar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 150000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Detailed description of the service..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Free consultation, 25-year warranty, Professional installation"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Service Image
                </label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  onRemove={() => setFormData({ ...formData, image: '' })}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image to showcase your service. Images are automatically optimized and stored securely.
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit">
                  {editingService ? 'Update Service' : 'Create Service'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Services ({services.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {service.image && (
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {service.description}
                  </p>
                  <p className="text-xl font-bold text-blue-600 mb-3">
                    ₹{service.price.toLocaleString()}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    {service.features.length} features
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(service._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No services added yet. Click "Add Service" to create one.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
