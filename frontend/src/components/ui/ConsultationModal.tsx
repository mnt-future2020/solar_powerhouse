'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Send, CheckCircle, AlertCircle, ChevronDown, Zap, ShieldCheck, Mail, Phone, MessageSquare } from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

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
  price: number;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'success', message: '' });
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Free Solar Consultation',
    message: '',
    source: 'Consultation Modal',
    services: [] as string[]
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

  const handleServiceSelect = (serviceId: string) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    setSelectedServices(updatedServices);
    setFormData({ ...formData, services: updatedServices });
    setDropdownOpen(false);
  };

  const getServiceTitle = (serviceId: string) => {
    const service = services.find(s => s._id === serviceId);
    return service ? service.title : '';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/contacts', formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Free Solar Consultation',
        message: '',
        source: 'Consultation Modal',
        services: []
      });
      setSelectedServices([]);
      showAlert('success', 'Transmission Received! Our solar architects will connect with you shortly.');
    } catch (error) {
      showAlert('error', 'Transmission Failed. Please check your data nodes and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 lg:p-8">
        {/* Backdrop - High depth blur */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-3xl animate-fade-in"
          onClick={onClose}
        ></div>

        {/* Modal Container - Responsive width & constrained height */}
        <div className="relative w-full max-w-5xl h-[85vh] lg:h-[80vh] bg-card dark:bg-zinc-950 rounded-[2rem] lg:rounded-[4rem] shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] border border-border/50 overflow-hidden flex flex-col lg:flex-row animate-scale-in">
          
          {/* Left Side - Visual Story (Shown only on lg) */}
          <div className="lg:w-[38%] bg-zinc-900 relative overflow-hidden hidden lg:flex flex-col border-r border-border/10">
            <div className="absolute inset-0 bg-mesh opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-solar-amber/20 via-transparent to-solar-teal/20"></div>
            <img 
              src="/assets/image/solar_tech.png" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Solar Technology"
            />
            
            <div className="relative z-10 h-full p-10 xl:p-14 flex flex-col justify-between">
              <div className="space-y-6">
                <Badge className="bg-solar-amber/20 text-solar-amber border-solar-amber/30 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">
                  Next-Gen Consultation
                </Badge>
                <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tighter shadow-sm">
                  DESIGN YOUR <br />
                  <span className="text-gradient-solar">ENERGY</span> <br />
                  FUTURE.
                </h2>
                <p className="text-zinc-400 font-medium leading-relaxed text-base xl:text-lg">
                  Empower your infrastructure with high-performance solar ecosystems. Lead architects are ready.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-solar-amber transition-all duration-500">
                    <ShieldCheck className="h-6 w-6 text-solar-amber group-hover:text-white" />
                  </div>
                  <div className="text-xs font-black text-white uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">Certified Quality</div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-solar-teal transition-all duration-500">
                    <Zap className="h-6 w-6 text-solar-teal group-hover:text-white" />
                  </div>
                  <div className="text-xs font-black text-white uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">Rapid Protocol</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Control */}
          <div className="flex-1 relative flex flex-col min-h-0 bg-card dark:bg-zinc-950">
            {/* Stick Header with Close Button */}
            <div className="p-6 md:p-8 flex justify-between items-center z-30 bg-card/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-border/5 lg:border-none">
               <div className="block">
                  <Badge className="bg-solar-amber/10 text-solar-amber mb-1 lg:hidden">Inquiry Mode</Badge>
                  <h2 className="text-xl lg:text-3xl font-black tracking-tighter uppercase text-foreground leading-none">Consultation Nodes</h2>
               </div>
               <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted border border-border text-foreground transition-all shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content - Internal Scroll Only */}
            <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 pt-4 custom-scrollbar scroll-smooth">
              <div className="max-w-2xl mx-auto lg:mx-0">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
                  {/* Identification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Identity Node</label>
                      <div className="relative group">
                        <Input
                          required
                          className="w-full bg-muted/20 border-border rounded-xl h-14 pl-12 text-foreground focus:ring-2 focus:ring-solar-amber/20 focus:border-solar-amber transition-all shadow-none placeholder:text-muted-foreground/30 font-bold"
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                          disabled={loading}
                          placeholder="Project Lead"
                        />
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-solar-amber transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Communication Hub</label>
                      <div className="relative group">
                        <Input
                          type="email"
                          required
                          className="w-full bg-muted/20 border-border rounded-xl h-14 pl-12 text-foreground focus:ring-2 focus:ring-solar-amber/20 focus:border-solar-amber transition-all shadow-none placeholder:text-muted-foreground/30 font-bold"
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                          disabled={loading}
                          placeholder="architecture@domain.com"
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-solar-amber transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Connection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Direct Link</label>
                      <div className="relative group">
                        <Input
                          type="tel"
                          required
                          className="w-full bg-muted/20 border-border rounded-xl h-14 pl-12 text-foreground focus:ring-2 focus:ring-solar-amber/20 focus:border-solar-amber transition-all shadow-none placeholder:text-muted-foreground/30 font-bold"
                          value={formData.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={loading}
                          placeholder="+91 Phone"
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-solar-amber transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">System Architecture</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className={cn(
                            "w-full px-5 h-14 text-left bg-muted/20 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-solar-amber/30 focus:border-solar-amber flex items-center justify-between transition-all",
                            dropdownOpen && "ring-2 ring-solar-amber/20 border-solar-amber"
                          )}
                          disabled={loading}
                        >
                          <span className="text-xs font-black text-foreground truncate max-w-[85%] uppercase tracking-widest">
                            {selectedServices.length > 0 
                              ? `${selectedServices.length} Configured` 
                              : 'Select Modules'
                            }
                          </span>
                          <ChevronDown className={cn("h-4 w-4 transition-transform text-solar-amber", dropdownOpen && "rotate-180")} />
                        </button>
                        
                        {/* Dropdown Menu - Floats above scroll */}
                        {dropdownOpen && (
                          <div className="absolute left-0 right-0 z-[110] mt-2 bg-popover/95 backdrop-blur-xl border-2 border-solar-amber/30 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] p-2 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                            {services.length > 0 ? services.map((service) => (
                              <button
                                key={service._id}
                                type="button"
                                onClick={() => handleServiceSelect(service._id)}
                                className={cn(
                                  "w-full text-left px-5 py-4 rounded-xl transition-all mb-1 last:mb-0 group/item",
                                  selectedServices.includes(service._id) 
                                    ? "bg-solar-amber text-white" 
                                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <div className="flex items-center justify-between pointer-events-none">
                                  <span className="text-xs font-black uppercase tracking-widest">{service.title}</span>
                                  {selectedServices.includes(service._id) ? (
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-border group-hover/item:border-solar-amber/50"></div>
                                  )}
                                </div>
                              </button>
                            )) : (
                              <div className="p-4 text-center text-[10px] font-black uppercase tracking-tighter opacity-40">Syncing Grid...</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Inquiry Blueprint</label>
                    <textarea
                      rows={4}
                      className="w-full bg-muted/20 border border-border rounded-xl p-6 text-foreground focus:outline-none focus:ring-2 focus:ring-solar-amber/20 focus:border-solar-amber transition-all resize-none shadow-none placeholder:text-muted-foreground/30 font-medium"
                      value={formData.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your architectural energy goals..."
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 lg:h-20 bg-gradient-to-r from-solar-amber to-solar-orange hover:from-solar-orange hover:to-solar-amber text-white font-black text-base lg:text-xl rounded-2xl shadow-xl shadow-solar-amber/30 transition-all hover:scale-[1.01] active:scale-[0.98] group"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        LINKING...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3 tracking-[0.2em] uppercase w-full">
                        INITIATE TRANSMISSION
                        <Send className="h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-3 group-hover:-translate-y-2 transition-transform duration-700" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Overlay */}
      {alert.show && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-solar-dark/60 backdrop-blur-md animate-fade-in">
          <div className={cn(
            "max-w-md w-full glass-card p-10 rounded-[3rem] text-center space-y-8 animate-scale-in border-2",
            alert.type === 'success' ? "border-solar-teal/30" : "border-destructive/30"
          )}>
            <div className={cn(
              "w-24 h-24 rounded-3xl mx-auto flex items-center justify-center animate-bounce",
              alert.type === 'success' ? "bg-solar-teal/20 text-solar-teal" : "bg-destructive/20 text-destructive"
            )}>
              {alert.type === 'success' ? <CheckCircle className="h-12 w-12" /> : <AlertCircle className="h-12 w-12" />}
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">
                {alert.type === 'success' ? 'Link Established' : 'System Error'}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {alert.message}
              </p>
            </div>
            <Button
              onClick={() => setAlert({ show: false, type: 'success', message: '' })}
              className={cn(
                "w-full h-14 rounded-2xl font-black",
                alert.type === 'success' ? "bg-solar-teal hover:bg-solar-teal/80" : "bg-destructive hover:bg-destructive/80"
              )}
            >
              ACKNOWLEDGE
            </Button>
          </div>
        </div>
      )}
    </>
  );
}