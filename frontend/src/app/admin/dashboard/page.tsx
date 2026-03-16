'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Mail } from 'lucide-react';
import axios from '@/lib/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    contacts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, contactsRes] = await Promise.all([
        axios.get('/services'),
        axios.get('/contacts'),
      ]);

      setStats({
        services: servicesRes.data.length,
        contacts: contactsRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Total Services', value: stats.services, icon: Package, color: 'text-blue-600' },
    { title: 'Contact Messages', value: stats.contacts, icon: Mail, color: 'text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
