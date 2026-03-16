'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', formData);
      toast({ title: 'Success', description: 'Registration successful! Please login.', variant: 'success' });
      router.push('/login');
    } catch (error) {
      toast({ title: 'Error', description: 'Registration failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border rounded-md"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border rounded-md"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">Register</Button>
            <p className="text-center text-sm">
              Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
