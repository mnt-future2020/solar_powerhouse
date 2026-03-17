'use client';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
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

export default function ContactPage() {
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
    service: '',
    message: '',
    source: 'Contact Page'
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
      if (response.data) {
        setSettings(response.data);
      }
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
      await axios.post('/contacts', formData);
      toast({
        title: 'Success!',
        description: 'Your message has been sent successfully. We\'ll get back to you within 24 hours.',
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        propertyType: '',
        monthlyBill: '',
        service: '',
        message: '',
        source: 'Contact Page'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-40 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 px-6 py-2 rounded-full mb-6 font-bold uppercase tracking-wider text-xs">
              Get In Touch
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-tight mb-6">
              CONTACT <span className="text-gradient-solar">US</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to start your solar journey? Get in touch with our experts for a free consultation 
              and personalized solar solution for your property.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-5">
                
                {/* Left Panel - Company Info */}
                <div className="lg:col-span-2 bg-linear-to-br from-amber-500 to-orange-600 p-8 lg:p-12 text-white">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-orange-100">
                        Let's Start Your
                      </h3>
                      <h2 className="text-3xl lg:text-4xl font-black mb-6">
                        Solar Journey
                      </h2>
                      <p className="text-orange-100 leading-relaxed">
                        Our solar experts are ready to help you reduce your electricity bills and 
                        contribute to a sustainable future. Get in touch today!
                      </p>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-orange-400">
                      <p className="text-orange-200 font-semibold">Contact Information</p>
                      
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                            <Mail className="h-6 w-6 text-orange-200" />
                          </div>
                          <div>
                            <p className="font-bold text-orange-100 mb-1">Email Us</p>
                            <p className="text-orange-200 break-all">{settings.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                            <Phone className="h-6 w-6 text-orange-200" />
                          </div>
                          <div>
                            <p className="font-bold text-orange-100 mb-1">Call Us</p>
                            <p className="text-orange-200">{settings.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                            <MapPin className="h-6 w-6 text-orange-200" />
                          </div>
                          <div>
                            <p className="font-bold text-orange-100 mb-1">Visit Us</p>
                            <p className="text-orange-200">
                              {settings.address.street},<br />
                              {settings.address.city}, {settings.address.state} - {settings.address.zipCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                            <Clock className="h-6 w-6 text-orange-200" />
                          </div>
                          <div>
                            <p className="font-bold text-orange-100 mb-1">Business Hours</p>
                            <p className="text-orange-200">Mon - Sat: 9:00 AM - 7:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-orange-400">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">24hrs</div>
                        <div className="text-xs text-orange-200">Response Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">500+</div>
                        <div className="text-xs text-orange-200">Happy Customers</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Contact Form */}
                <div className="lg:col-span-3 p-8 lg:p-12">
                  <div className="max-w-2xl">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
                      Send Us a Message
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name and Phone */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            FULL NAME *
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Your full name"
                              required
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                              disabled={isSubmitting}
                            />
                            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            PHONE NUMBER *
                          </label>
                          <div className="relative">
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+91 XXXXX XXXXX"
                              required
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                              disabled={isSubmitting}
                            />
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Email and City */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            EMAIL ADDRESS *
                          </label>
                          <div className="relative">
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="you@example.com"
                              required
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                              disabled={isSubmitting}
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CITY *
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="e.g. Chennai"
                              required
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                              disabled={isSubmitting}
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Property Type and Monthly Bill */}
                      <div className="grid md:grid-cols-2 gap-4">
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
                            placeholder="Select property type"
                            onChange={(value) => handleDropdownChange('propertyType', value)}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Dropdown
                            label="MONTHLY ELECTRICITY BILL *"
                            value={formData.monthlyBill}
                            options={[
                              "Below ₹2,000",
                              "₹2,000 - ₹5,000",
                              "₹5,000 - ₹10,000", 
                              "₹10,000 - ₹50,000",
                              "Above ₹50,000"
                            ]}
                            placeholder="Select bill range"
                            onChange={(value) => handleDropdownChange('monthlyBill', value)}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      {/* Service Selection */}
                      <div>
                        <Dropdown
                          label="INTERESTED SERVICE"
                          value={formData.service}
                          options={services.map(service => service.title)}
                          placeholder="Select a service (optional)"
                          onChange={(value) => handleDropdownChange('service', value)}
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          MESSAGE *
                        </label>
                        <textarea
                          name="message"
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your energy requirements, questions, or how we can help you..."
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending Message...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-3">
                            Send Message
                            <Send className="h-5 w-5" />
                          </span>
                        )}
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

          {/* Additional Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Consultation</h3>
              <p className="text-gray-600 text-sm">Get expert advice on solar solutions at no cost</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-gray-600 text-sm">We respond to all inquiries within 24 hours</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Local Experts</h3>
              <p className="text-gray-600 text-sm">Experienced team serving your local area</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}