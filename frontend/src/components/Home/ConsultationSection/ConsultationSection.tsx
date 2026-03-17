'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Phone } from 'lucide-react';
import axios from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import Dropdown from '@/components/ui/dropdown-menu';

interface Settings {
  companyName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
}

export default function ConsultationSection() {
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Solar Power House',
    email: 'accounts@solarpowerhouse.com',
    phone: '+91 98765 43210',
    address: {
      street: 'No 15/A, LMA Courtyard',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600031',
      country: 'India'
    }
  });

  const [services, setServices] = useState<Service[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    propertyType: '',
    monthlyBill: '',
    service: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    fetchServices();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('/consultations', formData);
      toast({
        title: 'Success!',
        description: 'Your consultation request has been submitted successfully.',
        variant: 'default',
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        propertyType: '',
        monthlyBill: '',
        service: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit consultation request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDropdownChange = (name: string, value: string | string[]) => {
    setFormData({
      ...formData,
      [name]: Array.isArray(value) ? value[0] || '' : value
    });
  };

  return (
    <section className="section-padding bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-5">
            {/* Left Panel - Company Info */}
            <div className="lg:col-span-2 bg-linear-to-br from-amber-400 to-orange-600 p-8 lg:p-12 text-white">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-green-100">
                    Get Your Free
                  </h3>
                  <h2 className="text-3xl lg:text-4xl font-black mb-6">
                    Savings Report
                  </h2>
                  <p className="text-green-100 leading-relaxed">
                    Our solar experts will contact you within 24 hours with a personalised analysis for your property.
                  </p>
                </div>

                <div className="space-y-6 pt-8 border-t border-green-600">
                  <p className="text-green-200 font-semibold">Or reach us directly</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-green-300 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-green-100">Email:</p>
                        <p className="text-green-200">{settings.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-green-300 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-green-100">Address:</p>
                        <p className="text-green-200">
                          {settings.address.street},<br />
                          {settings.address.city}, {settings.address.state} - {settings.address.zipCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-green-300 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-green-100">Phone:</p>
                        <p className="text-green-200">{settings.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="max-w-lg">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
                  Request Free Consultation
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        NAME *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PHONE *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      EMAIL *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CITY *
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Chennai"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Dropdown
                        label="PROPERTY TYPE *"
                        value={formData.propertyType}
                        options={[
                          "Home / Villa",
                          "Apartment Complex", 
                          "Commercial Building",
                          "Hospital / Clinic",
                          "School / College",
                          "Manufacturing / Factory",
                          "Small Industry / SME"
                        ]}
                        placeholder="Select"
                        onChange={(value) => handleDropdownChange('propertyType', value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Dropdown
                        label="MONTHLY BILL *"
                        value={formData.monthlyBill}
                        options={[
                          "Below ₹2,000",
                          "₹2,000 - ₹5,000",
                          "₹5,000 - ₹10,000", 
                          "₹10,000 - ₹50,000",
                          "Above ₹50,000"
                        ]}
                        placeholder="Select"
                        onChange={(value) => handleDropdownChange('monthlyBill', value)}
                      />
                    </div>
                    <div>
                      <Dropdown
                        label="SERVICE"
                        value={formData.service}
                        options={services.map(service => service.title)}
                        placeholder="Select"
                        onChange={(value) => handleDropdownChange('service', value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-br from-amber-600 to-orange-400 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Solar Quote →'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    🔒 Your information is private and will never be shared.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}