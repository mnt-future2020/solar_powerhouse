'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (token) {
        localStorage.setItem('token', token);
        await refreshUser();
        router.push('/admin/dashboard');
      } else if (error) {
        router.push(`/login?error=${error}`);
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-solar-amber" />
        <p className="text-lg text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-solar-amber" />
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  );
}
