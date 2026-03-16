'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Service from '@/components/Service/Service';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  image?: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const fetchService = async () => {
    try {
      const response = await axios.get(`/services/${params.id}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading service details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button onClick={() => router.push('/services')}>Back to Services</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <Service service={service} variant="detailed" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
