'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save, Share2, Facebook, Twitter, Instagram, Linkedin, Loader2, Pencil, X } from 'lucide-react';
import axios from '@/lib/axios';

interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all';

const platforms = [
  { key: 'facebook' as const, label: 'Facebook', icon: Facebook, color: 'text-gray-500', placeholder: 'https://facebook.com/yourpage' },
  { key: 'twitter' as const, label: 'Twitter / X', icon: Twitter, color: 'text-gray-500', placeholder: 'https://twitter.com/yourhandle' },
  { key: 'instagram' as const, label: 'Instagram', icon: Instagram, color: 'text-gray-500', placeholder: 'https://instagram.com/yourprofile' },
  { key: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin, color: 'text-gray-500', placeholder: 'https://linkedin.com/company/yourcompany' },
];

const empty: SocialLinks = { facebook: '', twitter: '', instagram: '', linkedin: '' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function ReadValue({ value }: { value: string }) {
  return (
    <div className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800 min-h-[42px] break-all">
      {value || <span className="text-gray-400 italic">—</span>}
    </div>
  );
}

export default function SocialLinksPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState<SocialLinks>(empty);
  const [draft, setDraft] = useState<SocialLinks>(empty);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/settings/admin');
      const links = res.data?.socialMedia || empty;
      setSaved(links);
      setDraft(links);
    } catch {
      toast({ title: 'Failed to load settings', description: 'Please refresh and try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => { setDraft(saved); setEditing(true); };
  const handleCancel = () => { setDraft(saved); setEditing(false); };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/settings/social', { socialMedia: draft });
      setSaved(draft);
      setEditing(false);
      toast({ title: 'Social links saved', description: 'Social media links updated successfully.' });
    } catch {
      toast({ title: 'Save failed', description: 'Could not update social links. Try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Social Links</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your company social media profiles</p>
        </div>
        <div className="flex items-center gap-3">
          {editing ? (
            <>
              <Button onClick={handleCancel} variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 font-bold">
                <X className="h-4 w-4 mr-2" />Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} className="bg-slate-800 hover:bg-slate-700 text-white font-bold shadow-lg">
              <Pencil className="h-4 w-4 mr-2" />Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div>
        <Card className="bg-white border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-gray-100 bg-slate-800">
            <Share2 className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-white">Social Media Links</h2>
          </div>
          <CardContent className="p-6 space-y-5">
            {platforms.map(({ key, label, icon: Icon, color, placeholder }) => (
              <Field key={key} label={label}>
                {editing ? (
                  <div className="relative">
                    <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${color}`} />
                    <input type="url" value={draft[key]}
                      onChange={e => setDraft(prev => ({ ...prev, [key]: e.target.value }))}
                      className={`${inputCls} pl-9`} placeholder={placeholder} />
                  </div>
                ) : (
                  <div className="relative">
                    <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${color}`} />
                    <div className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800 min-h-[42px] break-all">
                      {saved[key] || <span className="text-gray-400 italic">—</span>}
                    </div>
                  </div>
                )}
              </Field>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
