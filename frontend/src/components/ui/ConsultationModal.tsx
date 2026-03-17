'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Send, CheckCircle, AlertCircle, Mail, Phone, MessageSquare, MapPin, Home, Zap, ShieldCheck } from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import Dropdown from '@/components/ui/dropdown-menu';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper component for Input to maintain consistency
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input {...props} />;
};

interface AlertState {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  features?: string[];
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'success', message: '' });
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    propertyType: '',
    monthlyBill: '',
    service: '',
    message: '',
    source: 'About Page Modal'
  });

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ show: true, type, message });
    if (type === 'success') {
      setTimeout(() => {
        setAlert({ show: false, type: 'success', message: '' });
        onClose();
      }, 3000);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/consultations', formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        propertyType: '',
        monthlyBill: '',
        service: '',
        message: '',
        source: 'About Page Modal'
      });
      showAlert('success', 'Your consultation request has been submitted successfully! Our solar experts will contact you within 24 hours.');
    } catch (error) {
      showAlert('error', 'Failed to submit consultation request. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={onClose}
        ></div>

        {/* Modal Container - Fixed height with proper responsive sizing */}
        <div className="relative w-full max-w-6xl h-[90vh] max-h-[800px] bg-white rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-scale-in">
          
          {/* Left Side - Visual Panel */}
          <div className="lg:w-2/5 bg-linear-to-br from-amber-500 to-orange-600 relative overflow-hidden hidden lg:flex flex-col">
            <div className="absolute inset-0 bg-[url('/assets/image/solar_tech.png')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/90 to-orange-600/90"></div>
            
            <div className="relative z-10 h-full p-8 xl:p-10 flex flex-col justify-between text-white">
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-xs w-fit">
                  Free Consultation
                </Badge>
                <h2 className="text-3xl xl:text-4xl font-black leading-tight">
                  GET YOUR <br />
                  <span className="text-yellow-200">SOLAR SAVINGS</span> <br />
                  REPORT
                </h2>
                <p className="text-orange-100 font-medium leading-relaxed">
                  Our solar experts will contact you within 24 hours with a personalised analysis for your property.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                    <ShieldCheck className="h-5 w-5 text-yellow-200" />
                  </div>
                  <div className="text-sm font-bold text-orange-100 uppercase tracking-wide">25+ Years Warranty</div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                    <Zap className="h-5 w-5 text-yellow-200" />
                  </div>
                  <div className="text-sm font-bold text-orange-100 uppercase tracking-wide">Up to 90% Savings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header with Close Button - Fixed */}
            <div className="shrink-0 p-4 lg:p-6 flex justify-between items-center border-b border-gray-100">
               <div>
                  <Badge className="bg-amber-100 text-amber-700 mb-2 lg:hidden">Free Consultation</Badge>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Request Free Quote</h2>
                  <p className="text-gray-600 text-sm mt-1">Start saving on electricity bills today</p>
               </div>
               <button
                onClick={onClose}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all shrink-0"
              >
                <X className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5 max-w-2xl">
                {/* Name and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      FULL NAME *
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                        placeholder="Your full name"
                        disabled={loading}
                      />
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      PHONE NUMBER *
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                        placeholder="+91 XXXXX XXXXX"
                        disabled={loading}
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Email and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      EMAIL ADDRESS *
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                        placeholder="you@example.com"
                        disabled={loading}
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      CITY *
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                        placeholder="e.g. Chennai"
                        disabled={loading}
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Property Type and Monthly Bill */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
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
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
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
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-1.5">
                  <Dropdown
                    label="INTERESTED SERVICE"
                    value={formData.service}
                    options={services.map(service => service.title)}
                    placeholder="Select a service (optional)"
                    onChange={(value) => handleDropdownChange('service', value)}
                    disabled={loading}
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    ADDITIONAL MESSAGE
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none text-sm"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your energy requirements, roof space, or any specific questions..."
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 lg:h-14 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-base lg:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting Request...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Get Free Solar Quote
                        <Send className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-2">
                  🔒 Your information is private and will never be shared.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Overlay */}
      {alert.show && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className={cn(
            "max-w-sm w-full bg-white p-6 lg:p-8 rounded-2xl text-center space-y-4 lg:space-y-6 animate-scale-in shadow-2xl",
            alert.type === 'success' ? "border-t-4 border-green-500" : "border-t-4 border-red-500"
          )}>
            <div className={cn(
              "w-12 h-12 lg:w-16 lg:h-16 rounded-full mx-auto flex items-center justify-center",
              alert.type === 'success' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            )}>
              {alert.type === 'success' ? <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8" /> : <AlertCircle className="h-6 w-6 lg:h-8 lg:w-8" />}
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                {alert.type === 'success' ? 'Request Submitted!' : 'Submission Failed'}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                {alert.message}
              </p>
            </div>
            <Button
              onClick={() => setAlert({ show: false, type: 'success', message: '' })}
              className={cn(
                "w-full h-10 lg:h-12 rounded-lg font-semibold text-sm lg:text-base",
                alert.type === 'success' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              )}
            >
              {alert.type === 'success' ? 'Great!' : 'Try Again'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}