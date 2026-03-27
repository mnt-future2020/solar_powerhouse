"use client";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, MessageSquare, Clock,
  ArrowRight, Zap, Globe, Award, CheckCircle2, XCircle, X, AlertTriangle
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

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const contactFeatures = [
  { icon: Clock,  title: "24-Hour Response",    description: "Lightning-fast response to all inquiries with detailed technical consultation.", iconColor: "text-emerald-400", bgColor: "bg-emerald-500/20", color: "from-emerald-400 to-teal-400" },
  { icon: Award,  title: "Expert Consultation", description: "Direct access to certified solar engineers for personalized system design.",        iconColor: "text-amber-400",   bgColor: "bg-amber-500/20",   color: "from-amber-400 to-orange-400" },
  { icon: Globe,  title: "Local Presence",      description: "Dedicated regional teams ensuring rapid deployment and ongoing support.",          iconColor: "text-sky-400",     bgColor: "bg-sky-500/20",     color: "from-sky-400 to-blue-400" },
  { icon: Zap,    title: "Zero-Cost Analysis",  description: "Comprehensive feasibility studies and ROI projections at no charge.",              iconColor: "text-orange-400",  bgColor: "bg-orange-500/20",  color: "from-orange-400 to-red-400" },
];

// ── Status Modal ──────────────────────────────────────────────────────────────
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        <div className={`mx-auto mb-4 w-16 h-16 rounded-full ${cfg.ring} flex items-center justify-center`}>
          <Icon className={`h-8 w-8 ${cfg.iconCls}`} />
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

// ── Main Component ────────────────────────────────────────────────────────────
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
      await axios.post('/contacts', { ...formData, phone: `+91${formData.phone}` });
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
    `w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white placeholder:text-white/50 outline-none ${err ? 'border-red-500' : 'border-white/20'}`;

  return (
    <>
      <StatusModal modal={modal} onClose={closeModal} />

      <section className="relative py-10 lg:py-16 overflow-hidden bg-linear-to-br from-[#002654] to-[#000c15]">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
            className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-orange-400/10 blur-[120px]" />
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full space-y-16 lg:space-y-24">

          {/* Hero */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center space-y-6">
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide text-white/90 uppercase">Get In Touch</span>
            </motion.div>
            <motion.h1 variants={fadeUpVariant} className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-300">OUR EXPERTS</span>
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-base lg:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
              Ready to start your solar journey? Get in touch for a <strong className="text-white">free consultation</strong> and personalized solar solution.
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
                WHY CHOOSE <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">US</span>
              </h2>
              <p className="text-sm text-white/70">Experience unmatched service quality and technical expertise.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {contactFeatures.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.bgColor} group-hover:scale-110 transition-transform`}>
                    <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{f.title}</h4>
                  <p className="text-sm text-white/60 leading-relaxed">{f.description}</p>
                  <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl bg-linear-to-r ${f.color}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>

         

          {/* Contact Card */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-5">

              {/* Left — Info */}
              <motion.div variants={fadeUpVariant} className="lg:col-span-2 bg-linear-to-br from-[#260f54] to-[#542344] p-8 lg:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full" />
                <div className="relative z-10 space-y-8">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-orange-100">Let's Start Your</h3>
                    <h2 className="text-3xl lg:text-4xl font-black mb-4">SOLAR JOURNEY</h2>
                    <p className="text-orange-100 leading-relaxed text-sm">
                      Our solar experts are ready to help you <strong className="text-white">eliminate electricity bills</strong> and contribute to a sustainable future.
                    </p>
                  </div>
                  <div className="space-y-5 pt-6 border-t border-orange-400/50">
                    <p className="text-orange-200 font-semibold uppercase tracking-wide text-xs">Contact Information</p>
                    {[
                      { icon: Mail,   label: 'Email Us',   value: settings.email },
                      { icon: Phone,  label: 'Call Us',    value: settings.phone },
                      { icon: MapPin, label: 'Visit Us',   value: `${settings.address.street}, ${settings.address.city}, ${settings.address.state} - ${settings.address.zipCode}` },
                      { icon: Clock,  label: 'Hours',      value: 'Mon - Sat: 9:00 AM - 7:00 PM' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-orange-200" />
                        </div>
                        <div>
                          <p className="font-bold text-orange-100 text-sm mb-0.5">{label}</p>
                          <p className="text-orange-200 text-sm">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-orange-400/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">24hrs</div>
                      <div className="text-xs text-orange-200 uppercase tracking-wide">Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">1,200+</div>
                      <div className="text-xs text-orange-200 uppercase tracking-wide">Happy Customers</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right — Form */}
              <motion.div variants={fadeUpVariant} className="lg:col-span-3 p-8 lg:p-12 bg-white/5 backdrop-blur-md">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">Send Us a Message</h3>
                <p className="text-white/60 mb-8 text-sm">Our experts will get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name + Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wide">Full Name *</label>
                      <div className="relative">
                        <Input name="name" value={formData.name} onChange={handleInput} placeholder="Your full name" required disabled={isSubmitting}
                          className={inputCls(formErrors.name)} />
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      </div>
                      {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                      <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${formErrors.phone ? 'border-red-500' : 'border-white/20'} bg-white/10 focus-within:ring-2 focus-within:ring-amber-500`}>
                        <span className="px-3 py-3 text-sm font-semibold text-white/60 bg-white/5 border-r border-white/20 select-none">+91</span>
                        <input type="tel" inputMode="numeric" value={formData.phone} onChange={handlePhone} placeholder="XXXXX XXXXX" maxLength={10} required disabled={isSubmitting}
                          className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-white placeholder:text-white/40" />
                      </div>
                      {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>

                  {/* Email + City */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wide">Email Address *</label>
                      <div className="relative">
                        <Input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required disabled={isSubmitting}
                          className={inputCls(formErrors.email)} />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      </div>
                      {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wide">City *</label>
                      <div className="relative">
                        <Input name="city" value={formData.city} onChange={handleInput} placeholder="e.g. Chennai" required disabled={isSubmitting}
                          className={inputCls(formErrors.city)} />
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      </div>
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
                    <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wide">Message *</label>
                    <textarea name="message" rows={4} value={formData.message} onChange={handleInput} required disabled={isSubmitting}
                      placeholder="Tell us about your energy requirements..."
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none text-white placeholder:text-white/50 outline-none ${formErrors.message ? 'border-red-500' : 'border-white/20'}`}
                    />
                    {formErrors.message && <p className="text-red-400 text-xs mt-1">{formErrors.message}</p>}
                  </div>

                  {/* Submit */}
                  <Button type="submit" disabled={isSubmitting}
                    className="w-full h-14 bg-linear-to-r from-[#260f54] to-[#542344] hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] group">
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        Send Message <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-white/50 text-center">Your information is private and will never be shared.</p>
                </form>
              </motion.div>

            </div>
          </motion.div>

           {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
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
