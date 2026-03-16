'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch contacts', variant: 'destructive' });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`/contacts/${id}`, { status });
      toast({ title: 'Success', description: 'Status updated', variant: 'success' });
      fetchContacts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await axios.delete(`/contacts/${id}`);
      toast({ title: 'Success', description: 'Contact deleted', variant: 'success' });
      fetchContacts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Messages ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={contact.status}
                      onChange={(e) => updateStatus(contact._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contact.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(contact._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-2">Subject: {contact.subject}</p>
                  <p className="text-gray-700">{contact.message}</p>
                  <p className="text-gray-500 mt-2">
                    {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
