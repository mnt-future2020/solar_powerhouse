'use client';
import { useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ConsultationModal from '@/components/ui/ConsultationModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Target, Eye, Award, Globe, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const values = [
  {
    icon: ShieldCheck,
    title: 'Quality Excellence',
    description: 'We deliver premium solar installations with industry-leading warranties and performance guarantees, ensuring maximum return on your investment.',
    color: 'solar-teal',
    stats: '25+ Years Warranty'
  },
  {
    icon: Award,
    title: 'Certified Expertise',
    description: 'Our team holds official certifications from leading manufacturers and follows international installation standards for optimal system performance.',
    color: 'solar-amber',
    stats: 'ISO 9001 Certified'
  },
  {
    icon: Globe,
    title: 'Sustainable Impact',
    description: 'Every installation contributes to reducing carbon footprint while providing substantial savings on electricity bills for decades.',
    color: 'solar-green',
    stats: '50% Cost Reduction'
  },
  {
    icon: Zap,
    title: 'Innovation Focus',
    description: 'We leverage cutting-edge solar technology and smart monitoring systems to maximize energy production and system efficiency.',
    color: 'solar-orange',
    stats: '99.5% Uptime'
  }
];

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-solar-amber/30">
      <Header />
      
      <main className="flex-1 pt-40 pb-32 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-10 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-16 mb-40 animate-fade-in-up">
            <div className="lg:w-1/2 space-y-10">
              <Badge className="bg-solar-amber/10 text-solar-amber hover:bg-solar-amber/20 border-solar-amber/20 px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
                Corporate identity
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter text-foreground leading-[0.85]">
                PIONEERING <br />
                <span className="text-gradient-solar">RENEWABLE</span> <br />
                MASTERY.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                Solar Power House isn't just an installer—we are energy architects. 
                We specialize in high-performance solar ecosystems that deliver <span className="text-foreground font-bold">maximum resilience</span> for residential and industrial complexes.
              </p>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-solar-amber/5 blur-[100px] rounded-full"></div>
              <div className="relative h-full glass-card rounded-[3.5rem] border border-white/10 p-2 overflow-hidden group">
                <Image 
                  src="/assets/image/hero_solar.png" 
                  width={400}
                  height={400}
                  priority
                  className="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Solar Innovation"
                />
                <div className="absolute inset-0 bg-linear-to-t from-solar-dark/80 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
                  <h3 className="text-3xl font-black">Building Global Sustainability</h3>
                  <p className="font-medium text-gray-300">Empowering 10,000+ homes with next-gen energy autonomy.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who We Are Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-40 animate-fade-in-up">
            <div className="lg:w-1/2">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-black/20 group">
                <Image 
                  src="/assets/image/solar_tech.png" 
                  alt="Who We Are" 
                  width={400}
                  height={400}
                  className="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-linear-to-tr from-solar-amber/20 to-transparent"></div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-5xl md:text-6xl font-black font-display tracking-tight text-foreground">
                WHO <span className="text-gradient-solar">WE ARE</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
                <p>
                  <span className="text-foreground font-bold">Solar Power House</span> specializes in designing, installing, and maintaining solar power systems for homes and businesses. Our goal is to help customers reduce electricity costs while promoting sustainable energy and a greener future.
                </p>
                <p>
                  Our services include rooftop solar installation, on-grid solar systems, net metering support, and subsidy assistance under the <span className="text-solar-amber font-bold">PM Surya Ghar Muft Bijli Yojana</span>, where homeowners can receive subsidies up to <span className="text-foreground font-bold">₹78,000</span>.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {['Rooftop Installation', 'On-Grid Systems', 'Net Metering', 'Subsidy Support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-solar-teal" />
                      <span className="text-foreground font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-40">
            <div className="bg-linear-to-tr from-emerald-600 to-teal-400 p-12 lg:p-16 rounded-[3.5rem] border border-white/10 hover:border-solar-teal/30 group transition-all animate-fade-in-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-3xl rounded-full"></div>
              <div className="w-16 h-16 rounded-2xl bg-white border border-solar-teal/20 flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform">
                <Target className="h-8 w-8 text-solar-teal" />
              </div>
              <h3 className="text-4xl text-white font-bold mb-6">Our Mission</h3>
              <p className="text-lg text-white font-medium leading-relaxed">
                To provide <span className="text-white font-bold">high-quality solar installations</span> and energy solutions that reduce electricity costs, promote environmental sustainability, and deliver long-term value to our customers through innovation, reliability, and excellent service.
              </p>
            </div>
            <div className="bg-linear-to-tr from-orange-600 to-amber-400 p-12 lg:p-16 rounded-[3.5rem] border border-white/10 hover:border-solar-amber/30 group transition-all animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-solar-amber/5 blur-3xl rounded-full"></div>
              <div className="w-16 h-16 rounded-2xl bg-white border border-solar-amber/20 flex items-center justify-center mb-10 group-hover:-rotate-6 transition-transform">
                <Eye className="h-8 w-8 text-solar-amber" />
              </div>
              <h3 className="text-4xl text-white font-bold mb-6">Our Vision</h3>
              <p className="text-lg text-white font-medium leading-relaxed">
                To become a <span className="text-white font-bold">trusted leader</span> in solar energy solutions, empowering homes and businesses with clean, reliable, and affordable renewable power for a sustainable future.
              </p>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="space-y-24 mb-40">
            <div className="text-center space-y-8">
              <Badge className="bg-solar-amber/10 text-solar-amber hover:bg-solar-amber/20 border-solar-amber/20 px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
                Our Core Values
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight">
                WHY CHOOSE <span className="text-gradient-solar">SOLAR POWER HOUSE</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                Our commitment to excellence, innovation, and customer satisfaction sets us apart in the renewable energy industry.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, i) => (
                <div 
                  key={i} 
                  className="group relative p-8 rounded-4xl border border-border bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Background Gradient */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-4xl",
                    v.color === 'solar-teal' && "bg-linear-to-br from-teal-400 to-emerald-600",
                    v.color === 'solar-amber' && "bg-linear-to-br from-amber-400 to-orange-600",
                    v.color === 'solar-green' && "bg-linear-to-br from-emerald-400 to-green-600",
                    v.color === 'solar-orange' && "bg-linear-to-br from-orange-400 to-red-500"
                  )}></div>
                  
                  {/* Icon Container */}
                  <div className={cn(
                    "relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg",
                    v.color === 'solar-teal' && "bg-teal-50 border-teal-200 text-teal-600 group-hover:bg-teal-100 group-hover:border-teal-300",
                    v.color === 'solar-amber' && "bg-amber-50 border-amber-200 text-amber-600 group-hover:bg-amber-100 group-hover:border-amber-300",
                    v.color === 'solar-green' && "bg-emerald-50 border-emerald-200 text-emerald-600 group-hover:bg-emerald-100 group-hover:border-emerald-300",
                    v.color === 'solar-orange' && "bg-orange-50 border-orange-200 text-orange-600 group-hover:bg-orange-100 group-hover:border-orange-300"
                  )}>
                    <v.icon className="h-8 w-8" />
                  </div>

                  {/* Stats Badge */}
                  <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-4 border",
                    v.color === 'solar-teal' && "bg-teal-50 text-teal-700 border-teal-200",
                    v.color === 'solar-amber' && "bg-amber-50 text-amber-700 border-amber-200",
                    v.color === 'solar-green' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                    v.color === 'solar-orange' && "bg-orange-50 text-orange-700 border-orange-200"
                  )}>
                    {v.stats}
                  </div>

                  {/* Content */}
                  <h4 className="text-xl font-black mb-4 tracking-tight text-foreground group-hover:text-foreground transition-colors">
                    {v.title}
                  </h4>
                  <p className="text-muted-foreground font-medium leading-relaxed text-sm group-hover:text-foreground/80 transition-colors">
                    {v.description}
                  </p>

                  {/* Hover Effect Line */}
                  <div className={cn(
                    "absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-4xl",
                    v.color === 'solar-teal' && "bg-linear-to-r from-teal-400 to-emerald-500",
                    v.color === 'solar-amber' && "bg-linear-to-r from-amber-400 to-orange-500",
                    v.color === 'solar-green' && "bg-linear-to-r from-emerald-400 to-green-500",
                    v.color === 'solar-orange' && "bg-linear-to-r from-orange-400 to-red-500"
                  )}></div>
                </div>
              ))}
            </div>

            {/* Additional Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-border/50">
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-solar-amber">500+</div>
                <div className="text-sm font-medium text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-solar-teal">₹2Cr+</div>
                <div className="text-sm font-medium text-muted-foreground">Savings Generated</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-solar-green">98%</div>
                <div className="text-sm font-medium text-muted-foreground">Customer Satisfaction</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-orange-600">24/7</div>
                <div className="text-sm font-medium text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-40 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[4rem] overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-solar-amber/20 blur-[120px] rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-solar-teal/20 blur-[100px] rounded-full -ml-32 -mb-32"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-12 lg:p-20">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                {/* Left Content */}
                <div className="space-y-8 text-white">
                  <div className="space-y-4">
                    <Badge className="bg-solar-amber/20 text-solar-amber hover:bg-solar-amber/30 border-solar-amber/30 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-xs">
                      Get Started Today
                    </Badge>
                    <h3 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight">
                      TRANSFORM YOUR <br />
                      <span className="text-gradient-solar">ENERGY FUTURE</span>
                    </h3>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed">
                      Join thousands of satisfied customers who have made the smart switch to solar energy. 
                      Get a free consultation and discover how much you can save.
                    </p>
                  </div>

                  {/* Benefits List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Free Site Assessment',
                      'Custom System Design',
                      'Government Subsidy Support',
                      '25-Year Performance Warranty'
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-solar-amber"></div>
                        <span className="text-slate-200 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-solar-teal/20 flex items-center justify-center">
                        <span className="text-solar-teal font-bold">📞</span>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Call Us Now</div>
                        <div className="text-white font-bold">+91 98765 43210</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-solar-amber/20 flex items-center justify-center">
                        <span className="text-solar-amber font-bold">✉️</span>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Email Us</div>
                        <div className="text-white font-bold">info@solarpowerhouse.com</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - CTA Buttons */}
                <div className="bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-8 lg:p-10 shadow-2xl border border-white/20">
                  <div className="space-y-8 text-center">
                    <div className="space-y-4">
                      <h4 className="text-3xl font-black text-slate-900">Ready to Go Solar?</h4>
                      <p className="text-slate-600 font-medium text-lg">Get your personalized solar savings report in 24 hours</p>
                    </div>

                    <div className="space-y-6">
                      <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-linear-to-r from-solar-amber to-solar-orange hover:from-solar-orange hover:to-red-500 text-white font-black h-16 rounded-xl text-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl border-none"
                      >
                        GET FREE CONSULTATION
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Button>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <div className="text-2xl font-black text-solar-amber">24hrs</div>
                          <div className="text-xs font-medium text-slate-600">Response Time</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <div className="text-2xl font-black text-solar-teal">₹0</div>
                          <div className="text-xs font-medium text-slate-600">Consultation Fee</div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-200">
                        <p className="text-sm font-bold text-slate-700">What you'll get:</p>
                        <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                          {[
                            '✓ Personalized solar system design',
                            '✓ Accurate savings calculation',
                            '✓ Government subsidy guidance',
                            '✓ Free site assessment'
                          ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-solar-green font-bold">{benefit.charAt(0)}</span>
                              <span className="font-medium">{benefit.slice(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">
                      🔒 No spam, no hidden costs. Get honest advice from solar experts.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
