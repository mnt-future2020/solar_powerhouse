'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingDown, Leaf, Sun, BadgeCheck, CheckCircle2, XCircle, X, AlertTriangle } from 'lucide-react';
import axios from '@/lib/axios';
import Dropdown from '@/components/ui/dropdown-menu';

interface Service {
  _id: string;
  title: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  propertyType: string;
  monthlyBill: string;
  service: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  propertyType?: string;
  monthlyBill?: string;
}

type ModalState = {
  open: boolean;
  type: 'success' | 'error' | 'validation';
  title: string;
  message: string;
};

const benefits = [
  { icon: TrendingDown, title: 'Cut Bills by up to 80%',  desc: 'Drastically reduce your monthly electricity expenses from day one.' },
  { icon: Leaf,         title: 'Zero Carbon Footprint',   desc: 'Power your home or business with 100% clean, renewable energy.' },
  { icon: Sun,          title: 'Govt. Subsidy Eligible',  desc: 'Avail up to 40% subsidy under national solar schemes.' },
  { icon: BadgeCheck,   title: 'Certified Installation',  desc: 'Every install is done by MNRE-certified solar professionals.' },
];

function StatusModal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal.open) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      iconClass: 'text-emerald-500',
      ringClass: 'bg-emerald-50',
      btnClass: 'bg-emerald-500 hover:bg-emerald-600',
    },
    error: {
      icon: XCircle,
      iconClass: 'text-red-500',
      ringClass: 'bg-red-50',
      btnClass: 'bg-red-500 hover:bg-red-600',
    },
    validation: {
      icon: AlertTriangle,
      iconClass: 'text-amber-500',
      ringClass: 'bg-amber-50',
      btnClass: 'bg-amber-500 hover:bg-amber-600',
    },
  }[modal.type];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0a0a0a]/60" />
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className={`mx-auto mb-4 w-14 h-14 rounded-full ${config.ringClass} flex items-center justify-center`}>
          <Icon className={`h-7 w-7 ${config.iconClass}`} />
        </div>
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-lg font-bold text-gray-900">{modal.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{modal.message}</p>
        </div>
        <button
          onClick={onClose}
          className={`w-full ${config.btnClass} text-white font-semibold py-2.5 rounded-lg transition-colors text-sm`}
        >
          {modal.type === 'success' ? 'Great, thanks!' : 'Got it'}
        </button>
      </div>
    </div>
  );
}

export default function ConsultationSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '', phone: '', email: '', city: '', propertyType: '', monthlyBill: '', service: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    axios.get('/services').then(r => setServices(r.data)).catch(() => {});
  }, []);

  const showModal = (type: ModalState['type'], title: string, message: string) =>
    setModal({ open: true, type, title, message });

  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone = (v: string) => /^[6-9]\d{9}$/.test(v);
  const validateName  = (v: string) => v.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(v.trim());
  const validateCity  = (v: string) => v.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(v.trim());

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name.trim())               errors.name = 'Name is required';
    else if (!validateName(formData.name))   errors.name = 'Letters only, min 2 characters';
    if (!formData.phone.trim())              errors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) errors.phone = 'Enter a valid 10-digit mobile number';
    if (!formData.email.trim())              errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Enter a valid email address';
    if (!formData.city.trim())               errors.city = 'City is required';
    else if (!validateCity(formData.city))   errors.city = 'Enter a valid city name';
    if (!formData.propertyType)              errors.propertyType = 'Select a property type';
    if (!formData.monthlyBill)               errors.monthlyBill = 'Select your monthly bill range';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showModal('validation', 'Check Your Inputs', 'Please fix the highlighted errors in the form before submitting.');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post('/consultations', { ...formData, phone: `+91${formData.phone}` });
      showModal('success', 'Request Submitted!', 'Your consultation request has been received. Our experts will reach you within 24 hours.');
      setFormData({ name: '', phone: '', email: '', city: '', propertyType: '', monthlyBill: '', service: '' });
      setFormErrors({});
    } catch {
      showModal('error', 'Submission Failed', 'Something went wrong while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleDropdown = (name: string, value: string | string[]) => {
    const finalValue = Array.isArray(value) ? value[0] || '' : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (formErrors[name as keyof FormErrors]) setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <>
      <StatusModal modal={modal} onClose={closeModal} />

      <section className="relative min-h-[75vh] w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src="/assets/image/banner/contact.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0a0a0a]/75" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT — Benefits */}
            <div className="text-white space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-amber-400" />
                  <p className="text-amber-400/70 font-semibold text-xs uppercase tracking-[0.15em]">
                    Why Go Solar?
                  </p>
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Reduce Your Electricity Bill{' '}
                  <span className="text-amber-400">Significantly</span>
                </h2>
                <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-lg">
                  Join thousands of homes and businesses already saving with clean solar energy.
                  Get a free consultation and discover how much you can save.
                </p>
              </div>

              <div className="space-y-1">
                {benefits.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-4 items-start py-4 border-b border-white/6 last:border-0"
                  >
                    <div className="shrink-0 w-9 h-9 bg-amber-500/10 flex items-center justify-center mt-0.5">
                      <Icon className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{title}</p>
                      <p className="text-xs text-white/35 mt-0.5 leading-relaxed hidden sm:block">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-2xl w-full">
              <h4
                className="text-xl font-bold text-[#1a1a1a] mb-1"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Request Free Consultation
              </h4>
              <p className="text-sm text-gray-400 mb-5">Our experts will reach you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">NAME *</label>
                    <Input name="name" value={formData.name} onChange={handleInput} placeholder="Your name" required
                      className={formErrors.name ? 'border-red-500 focus:ring-red-500' : ''} />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">PHONE *</label>
                    <div className={`flex items-center border rounded-md overflow-hidden ${formErrors.phone ? 'border-red-500' : 'border-input'} bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0`}>
                      <span className="px-3 py-2 text-sm font-semibold text-gray-400 bg-gray-50 border-r border-gray-200 select-none">+91</span>
                      <input
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={e => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData(prev => ({ ...prev, phone: digits }));
                          if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: undefined }));
                        }}
                        placeholder="XXXXX XXXXX"
                        maxLength={10}
                        required
                        className="flex-1 px-3 py-2 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL *</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required
                    className={formErrors.email ? 'border-red-500 focus:ring-red-500' : ''} />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">CITY *</label>
                    <Input name="city" value={formData.city} onChange={handleInput} placeholder="e.g. Chennai" required
                      className={formErrors.city ? 'border-red-500 focus:ring-red-500' : ''} />
                    {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                  </div>
                  <div>
                    <Dropdown label="PROPERTY TYPE *" value={formData.propertyType}
                      options={['Home / Villa','Apartment Complex','Commercial Building','Hospital / Clinic','School / College','Manufacturing / Factory','Small Industry / SME']}
                      placeholder="Select" onChange={v => handleDropdown('propertyType', v)} error={!!formErrors.propertyType} />
                    {formErrors.propertyType && <p className="text-red-500 text-xs mt-1">{formErrors.propertyType}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Dropdown label="MONTHLY BILL *" value={formData.monthlyBill}
                      options={['Below ₹2,000','₹2,000 - ₹5,000','₹5,000 - ₹10,000','₹10,000 - ₹50,000','Above ₹50,000']}
                      placeholder="Select" onChange={v => handleDropdown('monthlyBill', v)} error={!!formErrors.monthlyBill} />
                    {formErrors.monthlyBill && <p className="text-red-500 text-xs mt-1">{formErrors.monthlyBill}</p>}
                  </div>
                  <div>
                    <Dropdown label="SERVICE" value={formData.service}
                      options={services.map(s => s.title)} placeholder="Select"
                      onChange={v => handleDropdown('service', v)} />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-[#0a0a0a] font-bold py-5 text-sm sm:text-base transition-colors duration-200 mt-2">
                  {isSubmitting ? 'Submitting...' : 'Get My Free Solar Quote →'}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  Your information is private and will never be shared.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
