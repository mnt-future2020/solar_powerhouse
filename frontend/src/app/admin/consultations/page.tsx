'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  MapPin,
  X,
  Save
} from 'lucide-react';
import axios from '@/lib/axios';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  services?: string[];
  source: string;
  status: 'new' | 'read' | 'replied';
  notes: string;
  createdAt: string;
}

interface ContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Contact>) => void;
  getServiceTitle: (serviceId: string) => string;
}

function ContactModal({ contact, isOpen, onClose, onUpdate, getServiceTitle }: ContactModalProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'new' | 'read' | 'replied'>('new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setNotes(contact.notes || '');
      setStatus(contact.status);
    }
  }, [contact]);

  const handleSave = async () => {
    if (!contact) return;
    
    setSaving(true);
    try {
      await axios.patch(`/contacts/${contact._id}`, { notes, status });
      onUpdate(contact._id, { notes, status });
      toast({
        title: 'Success',
        description: 'Contact updated successfully'
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update contact',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Consultation Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-semibold text-gray-900">{contact.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{contact.email}</p>
                </div>
              </div>

              {contact.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{contact.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900">{contact.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Source</label>
                <p className="text-gray-900">{contact.source}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">
                    {new Date(contact.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-500">Message</label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Selected Services */}
          {contact.services && contact.services.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Services Interested In</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {contact.services.map((serviceId, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    {getServiceTitle(serviceId)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'new' | 'read' | 'replied')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add your notes here..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsultationsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const getServiceTitle = (serviceId: string) => {
    const service = services.find(s => s._id === serviceId);
    return service ? service.title : 'Unknown Service';
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load consultations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleUpdateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => 
      prev.map(contact => 
        contact._id === id ? { ...contact, ...updates } : contact
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'bg-red-100 text-red-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.new}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Consultation Requests</h1>
        <p className="text-gray-600">Manage and respond to customer consultation requests</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No consultation requests found
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                        {contact.phone && (
                          <div className="text-sm text-gray-500">{contact.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{contact.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {contact.message}
                      </div>
                      {contact.services && contact.services.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {contact.services.slice(0, 2).map((serviceId, index) => (
                            <Badge key={index} className="text-xs border border-gray-300 bg-gray-50 text-gray-700">
                              {getServiceTitle(serviceId)}
                            </Badge>
                          ))}
                          {contact.services.length > 2 && (
                            <Badge className="text-xs border border-gray-300 bg-gray-50 text-gray-700">
                              +{contact.services.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => handleViewContact(contact)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateContact}
        getServiceTitle={getServiceTitle}
      />
    </div>
  );
}