'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Zap, Mail, Lock, User, UserPlus, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/register', formData);
      toast({ 
        title: 'Account Created', 
        description: 'Successfully registered! You can now log in to your account.', 
        variant: 'success' 
      });
      router.push('/login');
    } catch (error) {
      toast({ 
        title: 'Registration Failed', 
        description: 'We could not create your account. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-mesh p-4 md:p-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-solar-amber/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-solar-teal/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="w-full max-w-[460px] z-10">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-gradient-to-br from-solar-amber to-solar-orange p-3 rounded-2xl shadow-xl shadow-solar-amber/30 mb-4 animate-fade-in-up">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase text-center">
            SOLAR<span className="text-gradient-solar">POWER</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1 tracking-widest uppercase opacity-70">
            Join the Clean Energy Revolution
          </p>
        </div>

        {/* Register Card */}
        <div className="glass shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/10 rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-700 delay-150">
          <div className="p-8 md:p-10">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-bold font-display text-foreground mb-2">Create Account</h2>
              <p className="text-muted-foreground text-sm text-balance">Get started by creating your admin profile today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-solar-orange transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 focus:border-solar-amber/50 focus:ring-4 focus:ring-solar-amber/10 rounded-2xl px-11 py-3.5 outline-none transition-all placeholder:text-muted-foreground/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-solar-orange transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-solar-amber/50 focus:ring-4 focus:ring-solar-amber/10 rounded-2xl px-11 py-3.5 outline-none transition-all placeholder:text-muted-foreground/50"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Secure Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-solar-orange transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 focus:border-solar-amber/50 focus:ring-4 focus:ring-solar-amber/10 rounded-2xl px-11 py-3.5 outline-none transition-all placeholder:text-muted-foreground/50"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-solar-amber to-solar-orange hover:from-solar-orange hover:to-solar-amber text-white font-bold h-12 rounded-2xl shadow-lg shadow-solar-orange/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Create Profile <UserPlus className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>
          
          <div className="bg-white/5 p-6 text-center border-t border-white/10">
            <p className="text-sm text-muted-foreground font-medium">
              Already have an account? <Link href="/login" className="text-solar-orange font-bold hover:underline">Sign in instead</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground mt-8 opacity-50 font-bold">
          Step into the future of energy management
        </p>
      </div>
    </div>
  );
}

