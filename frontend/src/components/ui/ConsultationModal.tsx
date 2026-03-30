'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, ArrowRight, Shield, Clock, BadgeCheck } from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import Dropdown from '@/components/ui/dropdown-menu';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Service { _id: string; title: string; }
interface AlertState { show: boolean; type: 'success' | 'error'; message: string; }

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'success', message: '' });
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '',
    propertyType: '', monthlyBill: '', service: '',
    source: 'Consultation Modal'
  });

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const fetchServices = async () => {
    try { const r = await axios.get('/services'); setServices(r.data); } catch {}
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDropdown = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: Array.isArray(value) ? value[0] || '' : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/consultations', formData);
      setFormData({ name: '', email: '', phone: '', city: '', propertyType: '', monthlyBill: '', service: '', source: 'Consultation Modal' });
      setAlert({ show: true, type: 'success', message: 'Our solar experts will contact you within 24 hours with a personalized savings plan.' });
      setTimeout(() => { setAlert(a => ({ ...a, show: false })); onClose(); }, 3500);
    } catch {
      setAlert({ show: true, type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
          onClick={e => e.stopPropagation()}
        >
          {/* Top banner */}
          <div className="relative bg-[#0c1117] px-6 sm:px-8 pt-7 pb-14 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />

            {/* Close button */}
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10">
              <h2
                className="text-2xl sm:text-3xl font-bold text-white leading-snug"
              >
                Get Your Free<br />
                <span className="text-amber-400">Solar Quote</span>
              </h2>
              <p className="text-white/35 text-sm mt-2 max-w-sm">
                Fill in your details and our experts will prepare a customized savings report.
              </p>
            </div>
          </div>

          {/* Trust badges — floating over the banner/form junction */}
          <div className="px-6 sm:px-8 -mt-7 relative z-10 mb-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 px-5 py-3 flex items-center justify-between gap-4">
              {[
                { icon: Clock, label: '24hr Response' },
                { icon: Shield, label: '100% Private' },
                { icon: BadgeCheck, label: 'No Obligation' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-gray-600 hidden sm:inline">{label}</span>
                  <span className="text-[10px] font-semibold text-gray-500 sm:hidden">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-7 space-y-4 max-h-[55vh] overflow-y-auto">
            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input name="name" value={formData.name} onChange={handleInput} required disabled={loading}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone <span className="text-red-400">*</span></label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/10 focus-within:bg-white transition-all">
                  <span className="px-3 py-3 text-sm font-semibold text-gray-400 bg-gray-100 border-r border-gray-200 select-none shrink-0">+91</span>
                  <input name="phone" type="tel" inputMode="numeric" value={formData.phone}
                    onChange={e => { const d = e.target.value.replace(/\D/g, '').slice(0, 10); setFormData(p => ({ ...p, phone: d })); }}
                    placeholder="98765 43210" maxLength={10} required disabled={loading}
                    className="flex-1 px-3 py-3 text-sm bg-transparent outline-none placeholder-gray-400 text-gray-900" />
                </div>
              </div>
            </div>

            {/* Email + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email <span className="text-red-400">*</span></label>
                <input name="email" type="email" value={formData.email} onChange={handleInput} required disabled={loading}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">City <span className="text-red-400">*</span></label>
                <input name="city" value={formData.city} onChange={handleInput} required disabled={loading}
                  placeholder="e.g. Madurai"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 focus:bg-white transition-all" />
              </div>
            </div>

            {/* Property + Bill */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Dropdown label="Property Type *" value={formData.propertyType}
                options={['Home / Villa', 'Apartment Complex', 'Commercial Building', 'Hospital / Clinic', 'School / College', 'Manufacturing / Factory', 'Small Industry / SME']}
                placeholder="Select type" onChange={v => handleDropdown('propertyType', v)} disabled={loading} />
              <Dropdown label="Monthly Bill *" value={formData.monthlyBill}
                options={['Below ₹2,000', '₹2,000 - ₹5,000', '₹5,000 - ₹10,000', '₹10,000 - ₹50,000', 'Above ₹50,000']}
                placeholder="Select range" onChange={v => handleDropdown('monthlyBill', v)} disabled={loading} />
            </div>

            {/* Service */}
            {services.length > 0 && (
              <Dropdown label="Interested Service" value={formData.service}
                options={services.map(s => s.title)} placeholder="Select (optional)"
                onChange={v => handleDropdown('service', v)} disabled={loading} />
            )}

            {/* Submit */}
            <div className="pt-1">
              <button type="submit" disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <>Get My Free Solar Quote <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success/Error Alert */}
      {alert.show && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4" onClick={() => setAlert(a => ({ ...a, show: false }))}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}>
            <div className={cn(
              'w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center',
              alert.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
            )}>
              {alert.type === 'success'
                ? <CheckCircle className="h-8 w-8 text-emerald-500" />
                : <AlertCircle className="h-8 w-8 text-red-500" />
              }
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {alert.type === 'success' ? 'Request Submitted!' : 'Submission Failed'}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{alert.message}</p>
            <button onClick={() => setAlert(a => ({ ...a, show: false }))}
              className={cn(
                'w-full py-3 rounded-xl font-bold text-sm text-white transition-colors',
                alert.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
              )}>
              {alert.type === 'success' ? 'Great, thanks!' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
