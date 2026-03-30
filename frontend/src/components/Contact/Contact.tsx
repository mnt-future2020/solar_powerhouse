"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, Clock,
  CheckCircle2, XCircle, X, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import Dropdown from "@/components/ui/dropdown-menu";

interface Settings {
  companyName: string;
  email: string;
  phone: string;
  address: { street: string; city: string; state: string; zipCode: string; country: string };
}

interface Service { _id: string; title: string; }

interface FormData {
  name: string; phone: string; email: string; city: string;
  propertyType: string; monthlyBill: string; service: string;
  message: string; source: string;
}

interface FormErrors {
  name?: string; phone?: string; email?: string; city?: string;
  propertyType?: string; monthlyBill?: string; message?: string;
}

type ModalState = { open: boolean; type: 'success' | 'error' | 'validation'; title: string; message: string };

const contactFeatures = [
  { icon: Clock, title: "24-Hour Response", description: "Lightning-fast response to all inquiries with detailed technical consultation." },
  { icon: CheckCircle2, title: "Expert Consultation", description: "Direct access to certified solar engineers for personalized system design." },
  { icon: MapPin, title: "Local Presence", description: "Dedicated regional teams ensuring rapid deployment and ongoing support." },
  { icon: Send, title: "Zero-Cost Analysis", description: "Comprehensive feasibility studies and ROI projections at no charge." },
];

// ── Status Modal ──
function StatusModal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal.open) return null;
  const cfg = {
    success:    { icon: CheckCircle2,  ring: 'bg-emerald-50', iconCls: 'text-emerald-500', btn: 'bg-emerald-500 hover:bg-emerald-600', label: 'Great, thanks!' },
    error:      { icon: XCircle,       ring: 'bg-red-50',     iconCls: 'text-red-500',     btn: 'bg-red-500 hover:bg-red-600',         label: 'Got it' },
    validation: { icon: AlertTriangle, ring: 'bg-amber-50',   iconCls: 'text-amber-500',   btn: 'bg-amber-500 hover:bg-amber-600',     label: 'Got it' },
  }[modal.type];
  const Icon = cfg.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0a0a0a]/60" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        <div className={`mx-auto mb-4 w-14 h-14 rounded-full ${cfg.ring} flex items-center justify-center`}>
          <Icon className={`h-7 w-7 ${cfg.iconCls}`} />
        </div>
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-lg font-bold text-gray-900">{modal.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{modal.message}</p>
        </div>
        <button onClick={onClose} className={`w-full ${cfg.btn} text-white font-semibold py-2.5 rounded-xl transition-colors text-sm`}>{cfg.label}</button>
      </div>
    </div>
  );
}

// ── Main ──
export default function Contact() {
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Solar Power House', email: 'accounts@solarpowerhouse.com', phone: '+91 98765 43210',
    address: { street: 'No 15/A, LMA Courtyard', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600031', country: 'India' }
  });
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', email: '', city: '', propertyType: '', monthlyBill: '', service: '', message: '', source: 'Contact Page' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    axios.get('/settings').then(r => setSettings(r.data)).catch(() => {});
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
    if (!formData.message.trim())            errors.message = 'Message is required';
    else if (formData.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showModal('validation', 'Check Your Inputs', 'Please fix the highlighted errors before submitting.');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post('/consultations', { ...formData, phone: `+91${formData.phone}` });
      showModal('success', 'Message Sent!', "Your message has been received. We'll get back to you within 24 hours.");
      setFormData({ name: '', phone: '', email: '', city: '', propertyType: '', monthlyBill: '', service: '', message: '', source: 'Contact Page' });
      setFormErrors({});
    } catch {
      showModal('error', 'Submission Failed', 'Failed to send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: digits }));
    if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: undefined }));
  };

  const handleDropdown = (name: string, value: string | string[]) => {
    const v = Array.isArray(value) ? value[0] || '' : value;
    setFormData(prev => ({ ...prev, [name]: v }));
    if (formErrors[name as keyof FormErrors]) setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const inputCls = (err?: string) =>
    `w-full pl-4 pr-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 transition-all text-white placeholder:text-white/30 outline-none text-sm ${err ? 'border-red-500' : 'border-white/10'}`;

  return (
    <>
      <StatusModal modal={modal} onClose={closeModal} />

      <section className="relative py-14 lg:py-24 overflow-hidden bg-linear-to-b from-[#001a2e] to-[#000c15]">
        {/* Subtle texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full space-y-16 lg:space-y-24">

          {/* Hero — left-aligned */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-2xl"
          >
            <p className="text-amber-400/70 text-xs font-semibold tracking-[0.15em] uppercase mb-3">
              Get In Touch
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            >
              Let's Start Your<br />
              <span className="text-amber-400">Solar Journey</span>
            </h1>
            <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-lg">
              Ready to start your solar journey? Get in touch for a <strong className="text-white/70">free consultation</strong> and personalized solar solution.
            </p>
          </motion.div>

          {/* Features — horizontal strip */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="p-5 rounded-2xl bg-white/3 border border-white/8 hover:border-white/15 transition-colors duration-300"
              >
                <f.icon className="h-5 w-5 text-amber-400 mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">{f.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact section — 2 column */}
          <div className="grid lg:grid-cols-5 gap-6">

            {/* Left — Info panel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6 lg:p-8 space-y-6"
            >
              <div>
                <h3
                  className="text-xl font-bold text-white mb-2"
                >
                  Contact Information
                </h3>
                <p className="text-sm text-white/40">
                  Our solar experts are ready to help you eliminate electricity bills.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/8">
                {[
                  { icon: Mail,   label: 'Email',   value: settings.email },
                  { icon: Phone,  label: 'Phone',   value: settings.phone },
                  { icon: MapPin, label: 'Address', value: `${settings.address.street}, ${settings.address.city}, ${settings.address.state} - ${settings.address.zipCode}` },
                  { icon: Clock,  label: 'Hours',   value: 'Mon - Sat: 9:00 AM - 7:00 PM' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-amber-400/70" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-sm text-white/70">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/8">
                <div>
                  <div className="text-2xl font-bold text-amber-400 font-display">24hrs</div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider font-medium">Response Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400 font-display">1,200+</div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider font-medium">Happy Customers</div>
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              id="contact-form"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-3 bg-white/3 border border-white/8 rounded-2xl p-6 lg:p-8"
            >
              <h3
                className="text-xl font-bold text-white mb-1"
              >
                Send Us a Message
              </h3>
              <p className="text-sm text-white/40 mb-6">Our experts will get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name + Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Full Name *</label>
                    <Input name="name" value={formData.name} onChange={handleInput} placeholder="Your full name" required disabled={isSubmitting}
                      className={inputCls(formErrors.name)} />
                    {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Phone Number *</label>
                    <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${formErrors.phone ? 'border-red-500' : 'border-white/10'} bg-white/5 focus-within:ring-2 focus-within:ring-amber-500`}>
                      <span className="px-3 py-3 text-sm font-semibold text-white/35 bg-white/3 border-r border-white/8 select-none">+91</span>
                      <input type="tel" inputMode="numeric" value={formData.phone} onChange={handlePhone} placeholder="XXXXX XXXXX" maxLength={10} required disabled={isSubmitting}
                        className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-white placeholder:text-white/30" />
                    </div>
                    {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                {/* Email + City */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email Address *</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required disabled={isSubmitting}
                      className={inputCls(formErrors.email)} />
                    {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">City *</label>
                    <Input name="city" value={formData.city} onChange={handleInput} placeholder="e.g. Chennai" required disabled={isSubmitting}
                      className={inputCls(formErrors.city)} />
                    {formErrors.city && <p className="text-red-400 text-xs mt-1">{formErrors.city}</p>}
                  </div>
                </div>

                {/* Property + Bill */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Dropdown label="Property Type *" value={formData.propertyType}
                      options={['Home / Villa','Apartment Complex','Commercial Building','Hospital / Clinic','School / College','Manufacturing / Factory','Small Industry / SME']}
                      placeholder="Select property type" onChange={v => handleDropdown('propertyType', v)} error={!!formErrors.propertyType} />
                    {formErrors.propertyType && <p className="text-red-400 text-xs mt-1">{formErrors.propertyType}</p>}
                  </div>
                  <div>
                    <Dropdown label="Monthly Electricity Bill *" value={formData.monthlyBill}
                      options={['Below ₹2,000','₹2,000 - ₹5,000','₹5,000 - ₹10,000','₹10,000 - ₹50,000','Above ₹50,000']}
                      placeholder="Select bill range" onChange={v => handleDropdown('monthlyBill', v)} error={!!formErrors.monthlyBill} />
                    {formErrors.monthlyBill && <p className="text-red-400 text-xs mt-1">{formErrors.monthlyBill}</p>}
                  </div>
                </div>

                {/* Service */}
                <Dropdown label="Interested Service" value={formData.service}
                  options={services.map(s => s.title)} placeholder="Select a service (optional)"
                  onChange={v => handleDropdown('service', v)} />

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Message *</label>
                  <textarea name="message" rows={4} value={formData.message} onChange={handleInput} required disabled={isSubmitting}
                    placeholder="Tell us about your energy requirements..."
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 transition-all resize-none text-white text-sm placeholder:text-white/30 outline-none ${formErrors.message ? 'border-red-500' : 'border-white/10'}`}
                  />
                  {formErrors.message && <p className="text-red-400 text-xs mt-1">{formErrors.message}</p>}
                </div>

                {/* Submit */}
                <Button type="submit" disabled={isSubmitting}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-solar-warm font-bold text-sm rounded-xl transition-colors duration-200 group">
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-solar-warm/30 border-t-solar-warm rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-white/30 text-center">Your information is private and will never be shared.</p>
              </form>
            </motion.div>

          </div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full rounded-2xl overflow-hidden border border-white/8"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4661.752922668547!2d78.11969928393354!3d9.93430024882778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c5bd887762e9%3A0x8ff006ce938385fe!2sSOLAR%20POWER%20HOUSE!5e1!3m2!1sen!2sin!4v1774522898287!5m2!1sen!2sin"
              width="100%"
              height="380"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Solar Power House Location"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
