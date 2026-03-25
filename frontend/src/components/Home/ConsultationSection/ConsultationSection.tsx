'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, TrendingDown, Leaf, ShieldCheck, Sun, BadgeCheck } from 'lucide-react';
import axios from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import Dropdown from '@/components/ui/dropdown-menu';

interface Settings {
  companyName: string;
  email: string;
  phone: string;
  address: { street: string; city: string; state: string; zipCode: string; country: string };
}

interface Service {
  _id: string;
  title: string;
}

const benefits = [
  { icon: TrendingDown, title: 'Cut Bills by up to 80%', desc: 'Drastically reduce your monthly electricity expenses from day one.' },
  { icon: Leaf,         title: 'Zero Carbon Footprint',  desc: 'Power your home or business with 100% clean, renewable energy.' },
  { icon: ShieldCheck,  title: '25-Year Panel Warranty',  desc: 'Industry-leading warranty backed by certified solar engineers.' },
  { icon: Zap,          title: 'Grid Independence',       desc: 'Store excess energy and stay powered even during outages.' },
  { icon: Sun,          title: 'Govt. Subsidy Eligible',  desc: 'Avail up to 40% subsidy under national solar schemes.' },
  { icon: BadgeCheck,   title: 'Certified Installation',  desc: 'Every install is done by MNRE-certified solar professionals.' },
];

export default function ConsultationSection() {
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Solar Power House',
    email: 'accounts@solarpowerhouse.com',
    phone: '+91 98765 43210',
    address: { street: 'No 15/A, LMA Courtyard', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600031', country: 'India' },
  });

  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', propertyType: '', monthlyBill: '', service: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    axios.get('/settings').then(r => setSettings(r.data)).catch(() => {});
    axios.get('/services').then(r => setServices(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/consultations', formData);
      toast({ title: 'Success!', description: 'Consultation request submitted successfully.' });
      setFormData({ name: '', phone: '', email: '', city: '', propertyType: '', monthlyBill: '', service: '' });
    } catch {
      toast({ title: 'Error', description: 'Failed to submit. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDropdown = (name: string, value: string | string[]) =>
    setFormData(prev => ({ ...prev, [name]: Array.isArray(value) ? value[0] || '' : value }));

  return (
    <section className="flex flex-col lg:flex-row" style={{ height: '65vh' }}>

      {/* LEFT — Pure white form */}
      <div className="lg:w-[35%] bg-white flex items-center justify-center px-6 py-4 lg:px-10 overflow-y-auto h-full">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Request Free Consultation</h2>
          <p className="text-sm text-gray-500 mb-6">Our experts will reach you within 24 hours.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">NAME *</label>
                <Input name="name" value={formData.name} onChange={handleInput} placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">PHONE *</label>
                <Input name="phone" type="tel" value={formData.phone} onChange={handleInput} placeholder="+91 XXXXX XXXXX" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">EMAIL *</label>
              <Input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">CITY *</label>
                <Input name="city" value={formData.city} onChange={handleInput} placeholder="e.g. Chennai" required />
              </div>
              <Dropdown
                label="PROPERTY TYPE *"
                value={formData.propertyType}
                options={['Home / Villa','Apartment Complex','Commercial Building','Hospital / Clinic','School / College','Manufacturing / Factory','Small Industry / SME']}
                placeholder="Select"
                onChange={v => handleDropdown('propertyType', v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Dropdown
                label="MONTHLY BILL *"
                value={formData.monthlyBill}
                options={['Below ₹2,000','₹2,000 - ₹5,000','₹5,000 - ₹10,000','₹10,000 - ₹50,000','Above ₹50,000']}
                placeholder="Select"
                onChange={v => handleDropdown('monthlyBill', v)}
              />
              <Dropdown
                label="SERVICE"
                value={formData.service}
                options={services.map(s => s.title)}
                placeholder="Select"
                onChange={v => handleDropdown('service', v)}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-5 text-base transition-all duration-300 hover:shadow-lg mt-2"
            >
              {isSubmitting ? 'Submitting...' : 'Get My Free Solar Quote →'}
            </Button>

            <p className="text-xs text-gray-400 text-center">🔒 Your information is private and will never be shared.</p>
          </form>
        </div>
      </div>

      {/* RIGHT — contact.jpg bg with benefits overlay */}
      <div className="lg:w-[65%] relative flex items-center justify-center px-8 py-6 lg:px-12 overflow-hidden h-full">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/assets/image/banner/contact.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 text-white w-full max-w-2xl">
          <div className="mb-4">
            <p className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-1">Why Go Solar?</p>
            <h2 className="text-2xl lg:text-3xl font-bold leading-snug">
              Reduce Your Electricity Bill <span className="text-amber-400">Significantly</span>
            </h2>
            <p className="text-white/70 mt-1 text-sm leading-relaxed">
              Join thousands of homes and businesses already saving with clean solar energy.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg p-3 hover:bg-white/15 transition-all duration-300">
                <div className="shrink-0 w-7 h-7 bg-amber-500/20 rounded-md flex items-center justify-center">
                  <Icon className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-white">{title}</p>
                  <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
