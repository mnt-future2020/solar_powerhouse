"use client";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle, ArrowRight, Zap, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import DarkDropdown from './DarkDropdown';

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

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const contactFeatures = [
  {
    icon: Clock,
    title: "24-Hour Response",
    description: "Lightning-fast response to all inquiries with detailed technical consultation.",
    color: "from-emerald-400 to-teal-400",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/20"
  },
  {
    icon: Award,
    title: "Expert Consultation",
    description: "Direct access to certified solar engineers for personalized system design.",
    color: "from-amber-400 to-orange-400",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/20"
  },
  {
    icon: Globe,
    title: "Local Presence",
    description: "Dedicated regional teams ensuring rapid deployment and ongoing support.",
    color: "from-sky-400 to-blue-400",
    iconColor: "text-sky-400",
    bgColor: "bg-sky-500/20"
  },
  {
    icon: Zap,
    title: "Zero-Cost Analysis",
    description: "Comprehensive feasibility studies and ROI projections at no charge.",
    color: "from-orange-400 to-red-400",
    iconColor: "text-orange-400",
    bgColor: "bg-orange-500/20"
  }
];

export default function Contact() {
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
    <section className="relative py-10 lg:py-16 overflow-hidden bg-linear-to-br from-[#002654] to-[#000c15]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-orange-400/10 blur-[120px]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full space-y-20 lg:space-y-32">
        
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center space-y-8"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-white/90 uppercase">
              Get In Touch
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeUpVariant} className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-300">
              OUR EXPERTS
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUpVariant} className="text-base lg:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
            Ready to start your solar journey? Get in touch with our experts for a <strong className="text-white">free consultation</strong> 
            and personalized solar solution designed specifically for your property requirements.
          </motion.p>
        </motion.div>

        {/* Contact Features */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="space-y-10"
        >
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              WHY CHOOSE <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-300">US</span>
            </h2>
            <p className="text-sm text-white/70 font-medium">
              Experience unmatched service quality and technical expertise in solar energy solutions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {contactFeatures.map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bgColor} group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  {feature.description}
                </p>
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl bg-linear-to-r ${feature.color}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Contact Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid lg:grid-cols-5">
            
            {/* Left Panel - Company Info */}
            <motion.div variants={fadeUpVariant} className="lg:col-span-2 bg-linear-to-br from-[#260f54] to-[#542344] backdrop-blur-md p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full" />
              <div className="relative z-10 space-y-8">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-orange-100">
                    Let's Start Your
                  </h3>
                  <h2 className="text-3xl lg:text-4xl font-black mb-6">
                    SOLAR JOURNEY
                  </h2>
                  <p className="text-orange-100 leading-relaxed">
                    Our solar experts are ready to help you <strong className="text-white">eliminate electricity bills</strong> and 
                    contribute to a sustainable future. Get in touch today!
                  </p>
                </div>

                <div className="space-y-6 pt-8 border-t border-orange-400/50">
                  <p className="text-orange-200 font-semibold uppercase tracking-wide text-sm">Contact Information</p>
                  
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
                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-orange-400/50">
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

            {/* Right Panel - Contact Form */}
            <motion.div variants={fadeUpVariant} className="lg:col-span-3 p-8 lg:p-12 bg-white/5 backdrop-blur-md">
              <div className="max-w-2xl">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Send Us a Message
                </h3>
                <p className="text-white/60 mb-8 text-sm">
                  Fill out the form below and our experts will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white placeholder:text-white/50"
                          disabled={isSubmitting}
                        />
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white placeholder:text-white/50"
                          disabled={isSubmitting}
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                      </div>
                    </div>
                  </div>

                  {/* Email and City */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="you@example.com"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white placeholder:text-white/50"
                          disabled={isSubmitting}
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">
                        City *
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Chennai"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-white placeholder:text-white/50"
                          disabled={isSubmitting}
                        />
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                      </div>
                    </div>
                  </div>

                  {/* Property Type and Monthly Bill */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">
                        Property Type *
                      </label>
                      <DarkDropdown
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
                      <label className="block text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">
                        Monthly Electricity Bill *
                      </label>
                      <DarkDropdown
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
                    <label className="block text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">
                      Interested Service
                    </label>
                    <DarkDropdown
                      value={formData.service}
                      options={services.map(service => service.title)}
                      placeholder="Select a service (optional)"
                      onChange={(value) => handleDropdownChange('service', value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2 uppercase tracking-wide">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none text-white placeholder:text-white/50"
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
                    className="w-full h-14 bg-linear-to-r from-[#260f54] to-[#542344] hover:from-amber-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-[#000c15]/30 border-t-[#000c15] rounded-full animate-spin"></div>
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        Send Message
                        <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-white/50 text-center">
                    Your information is private and will never be shared.
                  </p>
                </form>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}