'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Zap, Mail, Lock, ArrowRight, Loader2, User, ShieldCheck, CheckCircle2, BarChart3, Globe2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast({ 
          title: 'Authentication Failed', 
          description: 'The credentials you entered are incorrect.', 
          variant: 'destructive' 
        });
      } else {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          const data = await response.json();
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (err) {
          console.error('Legacy token sync failed', err);
        }
        
        toast({ 
          title: 'Welcome Back!', 
          description: 'Access granted. Redirecting to admin dashboard...', 
          variant: 'success' 
        });
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 md:p-12 overflow-hidden bg-background">
      <div className="container max-w-7xl z-10 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Branding & Content */}
          <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-6">
              <div className="inline-flex bg-gradient-to-br from-solar-amber to-solar-orange p-3.5 rounded-2xl shadow-xl shadow-solar-amber/20 border border-white/20 animate-float w-fit">
                <Zap className="h-10 w-10 text-white fill-white/10" />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-foreground uppercase leading-[0.9]">
                  SOLAR<br />
                  <span className="text-gradient-solar">POWER</span>
                </h1>
                <p className="text-xl lg:text-2xl font-medium text-muted-foreground leading-relaxed max-w-md">
                  Empowering the world through sustainable energy management.
                </p>
              </div>
            </div>

            {/* Feature List */}
            <div className="grid gap-6 max-w-sm">
              {[
                { icon: BarChart3, title: "Real-time Analytics", desc: "Monitor power generation with precision." },
                { icon: ShieldCheck, title: "Secure Infrastructure", desc: "Enterprise-grade safety for your grid." },
                { icon: Globe2, title: "Global Impact", desc: "Driving the transition to clean energy." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="mt-1 bg-foreground/5 p-2 rounded-lg group-hover:bg-solar-amber/10 transition-colors">
                    <item.icon className="h-5 w-5 text-solar-amber" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] uppercase tracking-[0.5em] text-foreground font-black opacity-30 pt-8">
              © 2024 SOLAR POWER HOUSE INC.
            </p>
          </div>

          {/* Right Column: Form Card */}
          <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000">
            {/* Symmetrical Outer Glow */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-solar-orange via-solar-amber to-solar-green rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
            
            <div className="relative bg-white text-black dark:bg-gray-900 dark:text-white border border-border/50 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
              <div className="p-10 md:p-14">
                <div className="mb-12">
                  <h2 className="text-3xl font-black mb-3">Admin Login</h2>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-solar-amber to-solar-orange rounded-full mb-4" />
                  <p className="text-muted-foreground dark:text-gray-400 text-sm font-medium">Please enter your secure access key.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground dark:text-gray-500 ml-1">
                      System Identity
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/input:text-solar-orange transition-colors">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="admin@solarpower.com"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 focus:border-solar-amber/50 focus:ring-8 focus:ring-solar-amber/5 rounded-2xl px-14 py-5 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 font-bold text-lg"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={loading}
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-700 group-focus-within/input:text-solar-orange/20 transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground dark:text-gray-500 ml-1">
                      Security Key
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/input:text-solar-orange transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 focus:border-solar-amber/50 focus:ring-8 focus:ring-solar-amber/5 rounded-2xl px-14 py-5 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 font-bold text-lg"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        disabled={loading}
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-700 group-focus-within/input:text-solar-orange/20 transition-colors">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-black h-16 rounded-2xl shadow-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px] mt-4 flex items-center justify-center gap-4 group/btn" 
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-7 w-7 animate-spin" />
                    ) : (
                      <>
                        <span className="text-xl tracking-tighter">AUTHORIZE ACCESS</span>
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
              
              <div className="bg-gray-50/50 dark:bg-gray-800/20 px-10 py-6 text-center border-t border-gray-50 dark:border-gray-800">
                <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.5em]">
                  Encrypted Admin Session
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
