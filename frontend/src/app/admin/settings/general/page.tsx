'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { Save, Building2, Mail, Phone, MapPin, Loader2, Pencil, X, Lock, Eye, EyeOff } from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface GeneralSettings {
  companyName: string;
  logo: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: AddressInfo;
}

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all';
const textareaCls = `${inputCls} resize-none`;

const empty: GeneralSettings = {
  companyName: '', logo: '', tagline: '', description: '',
  email: '', phone: '',
  address: { street: '', city: '', state: '', zipCode: '', country: '' },
};

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-gray-100 bg-slate-800">
      <Icon className="h-4 w-4 text-amber-500" />
      <h2 className="text-sm font-semibold text-white">{title}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function ReadValue({ value, multiline }: { value: string; multiline?: boolean }) {
  return (
    <div className={cn(
      'w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800 min-h-[42px]',
      multiline && 'whitespace-pre-wrap min-h-[88px]'
    )}>
      {value || <span className="text-gray-400 italic">—</span>}
    </div>
  );
}

export default function GeneralSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [settings, setSettings] = useState<GeneralSettings>(empty);
  const [draft, setDraft] = useState<GeneralSettings>(empty);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/settings/admin');
      setSettings(res.data);
      setDraft(res.data);
    } catch {
      toast({ title: 'Failed to load settings', description: 'Please refresh and try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => { setDraft(settings); setEditing(true); };
  const handleCancel = () => { setDraft(settings); setEditing(false); };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/settings/general', draft);
      setSettings(draft);
      setEditing(false);
      toast({ title: 'Settings saved', description: 'General information updated successfully.' });
    } catch {
      toast({ title: 'Save failed', description: 'Could not update settings. Try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const set = (field: string, value: string) =>
    setDraft(prev => ({ ...prev, [field]: value }));

  const setAddress = (field: string, value: string) =>
    setDraft(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">General Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your company details and contact information</p>
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

      {/* Main content in blue-50 container */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ alignItems: 'stretch' }}>

          {/* LEFT: Company Information — full height */}
          <Card className="bg-white border border-gray-100 overflow-hidden flex flex-col">
            <SectionHeader icon={Building2} title="Company Information" />
            <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
              <Field label="Company Logo">
                {editing ? (
                  <ImageUpload value={draft.logo} onChange={(url: string) => set('logo', url)} className="w-full h-36 p-2" />
                ) : (
                  draft.logo
                    ? <img src={draft.logo} alt="logo" className="h-28 w-auto object-contain rounded-lg border border-gray-100 p-2 bg-white" />
                    : <ReadValue value="" />
                )}
              </Field>
              <Field label="Company Name">
                {editing
                  ? <input type="text" value={draft.companyName} onChange={e => set('companyName', e.target.value)} className={inputCls} placeholder="Enter company name" />
                  : <ReadValue value={settings.companyName} />}
              </Field>
              <Field label="Tagline">
                {editing
                  ? <input type="text" value={draft.tagline} onChange={e => set('tagline', e.target.value)} className={inputCls} placeholder="Enter company tagline" />
                  : <ReadValue value={settings.tagline} />}
              </Field>
              <Field label="Description">
                {editing
                  ? <textarea value={draft.description} onChange={e => set('description', e.target.value)} rows={5} className={textareaCls} placeholder="Enter company description" />
                  : <ReadValue value={settings.description} multiline />}
              </Field>
            </CardContent>
          </Card>

          {/* RIGHT: Contact + Address stacked, filling same height */}
          <div className="flex flex-col gap-6">
            <Card className="bg-white border border-gray-100 overflow-hidden">
              <SectionHeader icon={Mail} title="Contact Information" />
              <CardContent className="p-6 space-y-4">
                <Field label="Email Address">
                  {editing
                    ? <input type="email" value={draft.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="Enter email address" />
                    : <ReadValue value={settings.email} />}
                </Field>
                <Field label="Phone Number">
                  {editing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="tel" value={draft.phone} onChange={e => set('phone', e.target.value)} className={`${inputCls} pl-9`} placeholder="Enter phone number" />
                    </div>
                  ) : <ReadValue value={settings.phone} />}
                </Field>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 overflow-hidden flex-1">
              <SectionHeader icon={MapPin} title="Address Information" />
              <CardContent className="p-6 space-y-4">
                <Field label="Street Address">
                  {editing
                    ? <input type="text" value={draft.address.street} onChange={e => setAddress('street', e.target.value)} className={inputCls} placeholder="Street address" />
                    : <ReadValue value={settings.address.street} />}
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="City">
                    {editing
                      ? <input type="text" value={draft.address.city} onChange={e => setAddress('city', e.target.value)} className={inputCls} placeholder="City" />
                      : <ReadValue value={settings.address.city} />}
                  </Field>
                  <Field label="State / Province">
                    {editing
                      ? <input type="text" value={draft.address.state} onChange={e => setAddress('state', e.target.value)} className={inputCls} placeholder="State" />
                      : <ReadValue value={settings.address.state} />}
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="ZIP / Postal Code">
                    {editing
                      ? <input type="text" value={draft.address.zipCode} onChange={e => setAddress('zipCode', e.target.value)} className={inputCls} placeholder="ZIP code" />
                      : <ReadValue value={settings.address.zipCode} />}
                  </Field>
                  <Field label="Country">
                    {editing
                      ? <input type="text" value={draft.address.country} onChange={e => setAddress('country', e.target.value)} className={inputCls} placeholder="Country" />
                      : <ReadValue value={settings.address.country} />}
                  </Field>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Password Change */}
        <PasswordChangeSection />
      </div>
    </div>
  );
}

// ── Password Change Section ──────────────────────────────────────────────────
function PasswordChangeSection() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      toast({ title: 'Error', description: 'New password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      await axios.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast({ title: 'Success', description: 'Password changed successfully' });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Failed',
        description: error.response?.data?.message || 'Could not change password',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all';

  return (
    <Card className="bg-white border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">Change Password</h2>
        </div>
        {!open && (
          <button onClick={() => setOpen(true)} className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
            Change
          </button>
        )}
      </div>

      {open && (
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={form.currentPassword}
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  className={inputCls}
                  placeholder="Enter current password"
                  required
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  className={inputCls}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className={inputCls}
                  placeholder="Re-enter new password"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={() => { setOpen(false); setForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <Button type="submit" disabled={saving} className="bg-slate-800 hover:bg-slate-700 text-white font-semibold">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
                {saving ? 'Changing...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
