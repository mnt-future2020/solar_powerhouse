'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save, Search, Tag, Loader2, Globe, Pencil, X, LayoutGrid } from 'lucide-react';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

interface PageSEO {
  [key: string]: SEOSettings;
}

interface Service {
  _id: string;
  title: string;
}

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all';

const staticPages = [
  { value: 'home',     label: 'Home',     path: '/' },
  { value: 'about',    label: 'About',    path: '/about' },
  { value: 'services', label: 'Services', path: '/services' },
  { value: 'contact',  label: 'Contact',  path: '/contact' },
];

const emptySEO: SEOSettings = { metaTitle: '', metaDescription: '', metaKeywords: '' };

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-gray-100 bg-slate-800">
      <Icon className="h-4 w-4 text-amber-500" />
      <h2 className="text-sm font-semibold text-white">{title}</h2>
    </div>
  );
}

function ReadValue({ value }: { value: string }) {
  return (
    <div className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800 min-h-[42px]">
      {value || <span className="text-gray-400 italic">—</span>}
    </div>
  );
}

function Badge({
  label, path, active, clickable, onClick,
}: {
  label: string; path: string; active: boolean; clickable: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200',
        active
          ? 'bg-slate-800 text-white border-gray-900 shadow-md'
          : clickable
            ? 'bg-white text-gray-500 border-gray-200 hover:border-slate-400 hover:text-slate-600 cursor-pointer'
            : 'bg-white text-gray-400 border-gray-100 cursor-default'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', active ? 'bg-amber-400' : 'bg-gray-300')} />
      {label}
      <span className={cn('text-[10px] font-normal', active ? 'text-slate-400' : 'text-gray-300')}>{path}</span>
    </button>
  );
}

export default function SEOSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const [savedData, setSavedData] = useState<PageSEO>({});
  const [draft, setDraft] = useState<PageSEO>({});
  const [services, setServices] = useState<Service[]>([]);

  // All pages: static + dynamic service detail pages
  const servicePages = services.map(s => ({
    value: `service-${s._id}`,
    label: s.title,
    path: `/services/${s._id}`,
    isService: true,
  }));

  const allPages = [
    ...staticPages.map(p => ({ ...p, isService: false })),
    ...servicePages,
  ];

  const selectedPageMeta = allPages.find(p => p.value === selectedPage) ?? allPages[0];
  const currentSEO: SEOSettings = (editing ? draft : savedData)[selectedPage] || emptySEO;

  useEffect(() => {
    fetchSettings();
    fetchServices();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/settings/seo');
      setSavedData(res.data || {});
      setDraft(res.data || {});
    } catch {
      toast({ title: 'Failed to load SEO settings', description: 'Please refresh and try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('/services');
      setServices(res.data || []);
    } catch {
      // non-critical, silently fail
    }
  };

  const handleEdit = () => { setDraft(savedData); setEditing(true); };
  const handleCancel = () => { setDraft(savedData); setEditing(false); };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/settings/seo', draft);
      setSavedData(draft);
      setEditing(false);
      toast({ title: 'SEO settings saved', description: `${selectedPageMeta.label} updated successfully.` });
    } catch {
      toast({ title: 'Save failed', description: 'Could not update SEO settings. Try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const setField = (field: string, value: string) =>
    setDraft(prev => ({ ...prev, [selectedPage]: { ...(prev[selectedPage] || emptySEO), [field]: value } }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage meta tags for each page</p>
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

      <div className="space-y-6">

        {/* Page Selector */}
        <Card className="bg-white border border-gray-100 overflow-hidden">
          <SectionHeader icon={Globe} title="Select Page" />
          <CardContent className="p-6 space-y-4">

            {/* Static pages */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Static Pages</p>
              <div className="flex flex-wrap gap-2">
                {staticPages.map(page => (
                  <Badge
                    key={page.value}
                    label={page.label}
                    path={page.path}
                    active={selectedPage === page.value}
                    clickable={true}
                    onClick={() => setSelectedPage(page.value)}
                  />
                ))}
              </div>
            </div>

            {/* Service detail pages */}
            {servicePages.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                  <LayoutGrid className="h-3 w-3" /> Service Detail Pages
                </p>
                <div className="flex flex-wrap gap-2">
                  {servicePages.map(page => (
                    <Badge
                      key={page.value}
                      label={page.label}
                      path={page.path}
                      active={selectedPage === page.value}
                      clickable={true}
                      onClick={() => setSelectedPage(page.value)}
                    />
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Meta Fields */}
        <Card className="bg-white border border-gray-100 overflow-hidden">
          <SectionHeader icon={Search} title={`Meta Information — ${selectedPageMeta.label}`} />
          <CardContent className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Title</label>
              {editing ? (
                <>
                  <input type="text" value={currentSEO.metaTitle} onChange={e => setField('metaTitle', e.target.value)}
                    className={inputCls} placeholder="Enter meta title (50–60 characters)" maxLength={60} />
                  <p className={cn('text-xs mt-1', currentSEO.metaTitle.length > 55 ? 'text-orange-500' : 'text-gray-400')}>
                    {currentSEO.metaTitle.length}/60 characters
                  </p>
                </>
              ) : <ReadValue value={currentSEO.metaTitle} />}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Description</label>
              {editing ? (
                <>
                  <textarea value={currentSEO.metaDescription} onChange={e => setField('metaDescription', e.target.value)}
                    rows={3} className={`${inputCls} resize-none`} placeholder="Enter meta description (150–160 characters)" maxLength={160} />
                  <p className={cn('text-xs mt-1', currentSEO.metaDescription.length > 150 ? 'text-orange-500' : 'text-gray-400')}>
                    {currentSEO.metaDescription.length}/160 characters
                  </p>
                </>
              ) : <ReadValue value={currentSEO.metaDescription} />}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Keywords</label>
              {editing
                ? <input type="text" value={currentSEO.metaKeywords} onChange={e => setField('metaKeywords', e.target.value)}
                    className={inputCls} placeholder="solar energy, renewable power, green technology" />
                : <ReadValue value={currentSEO.metaKeywords} />}
              {editing && <p className="text-xs text-gray-400 mt-1">Separate keywords with commas</p>}
            </div>
          </CardContent>
        </Card>



      </div>
    </div>
  );
}
