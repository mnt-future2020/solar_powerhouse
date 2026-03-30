'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import {
  Save, Building2, Mail, Phone, MapPin, Loader2,
  Search, Globe, LayoutGrid, Share2,
  Facebook, Twitter, Instagram, Linkedin,
  Lock, Eye, EyeOff, Settings,
} from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

// ── Shared helpers ───────────────────────────────────────────────────────────

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all';
const textareaCls = `${inputCls} resize-none`;

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 px-6 py-3.5 bg-slate-800">
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

// ── Interfaces ───────────────────────────────────────────────────────────────

interface AddressInfo { street: string; city: string; state: string; zipCode: string; country: string; }
interface GeneralSettings {
  companyName: string; logo: string; tagline: string; description: string;
  email: string; phone: string; address: AddressInfo;
}
interface SEOItem { metaTitle: string; metaDescription: string; metaKeywords: string; }
interface PageSEO { [key: string]: SEOItem; }
interface SocialLinks { facebook: string; twitter: string; instagram: string; linkedin: string; }
interface ServiceItem { _id: string; title: string; }

const emptyGeneral: GeneralSettings = {
  companyName: '', logo: '', tagline: '', description: '',
  email: '', phone: '',
  address: { street: '', city: '', state: '', zipCode: '', country: '' },
};
const emptySEO: SEOItem = { metaTitle: '', metaDescription: '', metaKeywords: '' };
const emptySocial: SocialLinks = { facebook: '', twitter: '', instagram: '', linkedin: '' };

const staticPages = [
  { value: 'home', label: 'Home', path: '/' },
  { value: 'about', label: 'About', path: '/about' },
  { value: 'services', label: 'Services', path: '/services' },
  { value: 'contact', label: 'Contact', path: '/contact' },
];

const socialPlatforms = [
  { key: 'facebook' as const, label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
  { key: 'twitter' as const, label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/yourhandle' },
  { key: 'instagram' as const, label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourprofile' },
  { key: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/yourcompany' },
];

// ── General Tab ──────────────────────────────────────────────────────────────

const generalSubTabs = [
  { key: 'company', label: 'Company', icon: Building2 },
  { key: 'contact', label: 'Contact', icon: Mail },
  { key: 'address', label: 'Address', icon: MapPin },
] as const;

type GeneralSubTab = typeof generalSubTabs[number]['key'];

function GeneralTab({ draft, set, setAddress }: {
  draft: GeneralSettings;
  set: (f: string, v: string) => void;
  setAddress: (f: string, v: string) => void;
}) {
  const [subTab, setSubTab] = useState<GeneralSubTab>('company');

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {generalSubTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px',
                subTab === tab.key
                  ? 'border-amber-500 text-slate-800'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', subTab === tab.key ? 'text-amber-500' : 'text-gray-400')} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {subTab === 'company' && (
        <Card className="bg-white border border-gray-100 overflow-hidden">
          <SectionHeader icon={Building2} title="Company Information" />
          <CardContent className="p-6 space-y-4">
            <Field label="Company Logo">
              <ImageUpload value={draft.logo} onChange={(url: string) => set('logo', url)} className="w-full h-36 p-2" />
            </Field>
            <Field label="Company Name">
              <input type="text" value={draft.companyName} onChange={e => set('companyName', e.target.value)} className={inputCls} placeholder="Enter company name" />
            </Field>
            <Field label="Tagline">
              <input type="text" value={draft.tagline} onChange={e => set('tagline', e.target.value)} className={inputCls} placeholder="Enter company tagline" />
            </Field>
            <Field label="Description">
              <textarea value={draft.description} onChange={e => set('description', e.target.value)} rows={5} className={textareaCls} placeholder="Enter company description" />
            </Field>
          </CardContent>
        </Card>
      )}

      {subTab === 'contact' && (
        <Card className="bg-white border border-gray-100 overflow-hidden">
          <SectionHeader icon={Mail} title="Contact Information" />
          <CardContent className="p-6 space-y-4">
            <Field label="Email Address">
              <input type="email" value={draft.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="Enter email address" />
            </Field>
            <Field label="Phone Number">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                <input type="tel" value={draft.phone} onChange={e => set('phone', e.target.value)} className={`${inputCls} pl-9`} placeholder="Enter phone number" />
              </div>
            </Field>
          </CardContent>
        </Card>
      )}

      {subTab === 'address' && (
        <Card className="bg-white border border-gray-100 overflow-hidden">
          <SectionHeader icon={MapPin} title="Address Information" />
          <CardContent className="p-6 space-y-4">
            <Field label="Street Address">
              <input type="text" value={draft.address.street} onChange={e => setAddress('street', e.target.value)} className={inputCls} placeholder="Street address" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <input type="text" value={draft.address.city} onChange={e => setAddress('city', e.target.value)} className={inputCls} placeholder="City" />
              </Field>
              <Field label="State / Province">
                <input type="text" value={draft.address.state} onChange={e => setAddress('state', e.target.value)} className={inputCls} placeholder="State" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="ZIP / Postal Code">
                <input type="text" value={draft.address.zipCode} onChange={e => setAddress('zipCode', e.target.value)} className={inputCls} placeholder="ZIP code" />
              </Field>
              <Field label="Country">
                <input type="text" value={draft.address.country} onChange={e => setAddress('country', e.target.value)} className={inputCls} placeholder="Country" />
              </Field>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password Change — always visible */}
      <PasswordChangeCard />
    </div>
  );
}

function PasswordChangeCard() {
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
      toast({ title: 'Failed', description: error.response?.data?.message || 'Could not change password', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const pwInputCls = 'w-full px-3 py-2.5 pr-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all';

  return (
    <Card className="bg-white border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-800">
        <div className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-white">Change Password</h2>
        </div>
        {!open && (
          <button onClick={() => setOpen(true)} className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
            Change
          </button>
        )}
      </div>

      {open && (
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} value={form.currentPassword}
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  className={pwInputCls} placeholder="Enter current password" required />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={form.newPassword}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  className={pwInputCls} placeholder="At least 6 characters" required minLength={6} />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className={pwInputCls} placeholder="Re-enter new password" required />
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

// ── SEO Tab ──────────────────────────────────────────────────────────────────

function SEOTab({ draft, setField, services }: {
  draft: PageSEO;
  setField: (page: string, field: string, value: string) => void;
  services: ServiceItem[];
}) {
  const [selectedPage, setSelectedPage] = useState('home');

  const servicePages = services.map(s => ({
    value: `service-${s._id}`, label: s.title, path: `/services/${s._id}`,
  }));
  const allPages = [...staticPages, ...servicePages];
  const pageMeta = allPages.find(p => p.value === selectedPage) ?? allPages[0];
  const current: SEOItem = draft[selectedPage] || emptySEO;

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-100 overflow-hidden">
        <SectionHeader icon={Search} title="SEO Meta Information" />
        <CardContent className="p-6 space-y-5">
          {/* Page selector dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Select Page</label>
            <select
              value={selectedPage}
              onChange={e => setSelectedPage(e.target.value)}
              className={inputCls}
            >
              <optgroup label="Static Pages">
                {staticPages.map(page => (
                  <option key={page.value} value={page.value}>
                    {page.label} ({page.path})
                  </option>
                ))}
              </optgroup>
              {servicePages.length > 0 && (
                <optgroup label="Service Pages">
                  {servicePages.map(page => (
                    <option key={page.value} value={page.value}>
                      {page.label} ({page.path})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Title</label>
            <input type="text" value={current.metaTitle} onChange={e => setField(selectedPage, 'metaTitle', e.target.value)}
              className={inputCls} placeholder="Enter meta title (50–60 characters)" maxLength={60} />
            <p className={cn('text-xs mt-1', current.metaTitle.length > 55 ? 'text-amber-500' : 'text-gray-400')}>
              {current.metaTitle.length}/60
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Description</label>
            <textarea value={current.metaDescription} onChange={e => setField(selectedPage, 'metaDescription', e.target.value)}
              rows={3} className={`${inputCls} resize-none`} placeholder="Enter meta description (150–160 characters)" maxLength={160} />
            <p className={cn('text-xs mt-1', current.metaDescription.length > 150 ? 'text-amber-500' : 'text-gray-400')}>
              {current.metaDescription.length}/160
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Keywords</label>
            <input type="text" value={current.metaKeywords} onChange={e => setField(selectedPage, 'metaKeywords', e.target.value)}
              className={inputCls} placeholder="solar energy, renewable power, green technology" />
            <p className="text-xs text-gray-400 mt-1">Separate keywords with commas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Social Tab ───────────────────────────────────────────────────────────────

function SocialTab({ draft, setDraft }: {
  draft: SocialLinks;
  setDraft: React.Dispatch<React.SetStateAction<SocialLinks>>;
}) {
  return (
    <Card className="bg-white border border-gray-100 overflow-hidden">
      <SectionHeader icon={Share2} title="Social Media Links" />
      <CardContent className="p-6 space-y-5">
        {socialPlatforms.map(({ key, label, icon: Icon, placeholder }) => (
          <Field key={key} label={label}>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
              <input type="url" value={draft[key]}
                onChange={e => setDraft(prev => ({ ...prev, [key]: e.target.value }))}
                className={`${inputCls} pl-9`} placeholder={placeholder} />
            </div>
          </Field>
        ))}
      </CardContent>
    </Card>
  );
}

// ── Main Settings Page ───────────────────────────────────────────────────────

const tabs = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'seo', label: 'SEO', icon: Search },
  { key: 'social', label: 'Social Links', icon: Share2 },
] as const;

type TabKey = typeof tabs[number]['key'];

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General state
  const [generalSaved, setGeneralSaved] = useState<GeneralSettings>(emptyGeneral);
  const [generalDraft, setGeneralDraft] = useState<GeneralSettings>(emptyGeneral);

  // SEO state
  const [seoSaved, setSeoSaved] = useState<PageSEO>({});
  const [seoDraft, setSeoDraft] = useState<PageSEO>({});
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Social state
  const [socialSaved, setSocialSaved] = useState<SocialLinks>(emptySocial);
  const [socialDraft, setSocialDraft] = useState<SocialLinks>(emptySocial);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settingsRes, seoRes, servicesRes] = await Promise.allSettled([
          axios.get('/settings/admin'),
          axios.get('/settings/seo'),
          axios.get('/services'),
        ]);

        if (settingsRes.status === 'fulfilled') {
          const d = settingsRes.value.data;
          setGeneralSaved(d);
          setGeneralDraft(d);
          const social = d?.socialMedia || emptySocial;
          setSocialSaved(social);
          setSocialDraft(social);
        }
        if (seoRes.status === 'fulfilled') {
          setSeoSaved(seoRes.value.data || {});
          setSeoDraft(seoRes.value.data || {});
        }
        if (servicesRes.status === 'fulfilled') {
          setServices(servicesRes.value.data || []);
        }
      } catch { }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  // Detect changes
  const hasChanges =
    JSON.stringify(generalDraft) !== JSON.stringify(generalSaved) ||
    JSON.stringify(seoDraft) !== JSON.stringify(seoSaved) ||
    JSON.stringify(socialDraft) !== JSON.stringify(socialSaved);

  const handleSave = async () => {
    try {
      setSaving(true);
      const promises = [];

      if (JSON.stringify(generalDraft) !== JSON.stringify(generalSaved)) {
        promises.push(axios.put('/settings/general', generalDraft).then(() => setGeneralSaved(generalDraft)));
      }
      if (JSON.stringify(seoDraft) !== JSON.stringify(seoSaved)) {
        promises.push(axios.put('/settings/seo', seoDraft).then(() => setSeoSaved(seoDraft)));
      }
      if (JSON.stringify(socialDraft) !== JSON.stringify(socialSaved)) {
        promises.push(axios.put('/settings/social', { socialMedia: socialDraft }).then(() => setSocialSaved(socialDraft)));
      }

      await Promise.all(promises);
      toast({ title: 'Saved', description: 'Settings updated successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save. Try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const setGeneral = (f: string, v: string) => setGeneralDraft(prev => ({ ...prev, [f]: v }));
  const setAddress = (f: string, v: string) => setGeneralDraft(prev => ({ ...prev, address: { ...prev.address, [f]: v } }));
  const setSeoField = (page: string, field: string, value: string) =>
    setSeoDraft(prev => ({ ...prev, [page]: { ...(prev[page] || emptySEO), [field]: value } }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <Settings className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Settings</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your site configuration</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className={cn('h-4 w-4', activeTab === tab.key ? 'text-amber-500' : 'text-gray-400')} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <GeneralTab draft={generalDraft} set={setGeneral} setAddress={setAddress} />
      )}
      {activeTab === 'seo' && (
        <SEOTab draft={seoDraft} setField={setSeoField} services={services} />
      )}
      {activeTab === 'social' && (
        <SocialTab draft={socialDraft} setDraft={setSocialDraft} />
      )}

      {/* Save bar — appears when changes detected */}
      {hasChanges && (
        <div className="sticky bottom-0 -mx-6 lg:-mx-8 px-6 lg:px-8 py-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <p className="text-sm text-gray-500">You have unsaved changes</p>
          <Button onClick={handleSave} disabled={saving} className="bg-slate-800 hover:bg-slate-700 text-white font-bold">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}
