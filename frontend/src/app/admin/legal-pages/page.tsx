'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Shield, FileText, Save, Loader2, Pencil, X, Plus, Trash2, GripVertical } from 'lucide-react';
import axios from '@/lib/axios';

interface Section {
  title: string;
  points: string[];
}

interface PageData {
  intro: string;
  sections: Section[];
  lastUpdated?: string;
}

const inputCls = 'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all';
const textareaCls = `${inputCls} resize-none`;

const emptyPage: PageData = { intro: '', sections: [] };

// ── Default content used when DB is empty ──
const defaultPrivacy: PageData = {
  intro: '',
  sections: [
    {
      title: 'Information We Collect',
      points: [
        'Personal identification details (name, email address, phone number) provided when you request a solar consultation or quote.',
        'Property information including address, roof area, electricity consumption — used solely to generate accurate solar system recommendations.',
        'Technical data such as browser type, IP address, and pages visited, collected automatically to improve our website performance.',
        'Payment and billing information when you proceed with a solar installation order, processed securely through certified payment gateways.',
      ],
    },
    {
      title: 'How We Use Your Information',
      points: [
        'To prepare customised solar system proposals based on your energy consumption, roof area, and applicable government subsidies.',
        'To schedule site surveys, installation appointments, and post-installation maintenance visits.',
        'To process subsidy applications on your behalf with MNRE and DISCOM authorities.',
        'To send service updates, warranty reminders, and information about new solar products or government schemes relevant to your installation.',
      ],
    },
    {
      title: 'Data Security',
      points: [
        'All personal and property data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption.',
        'Access to customer data is restricted to authorised personnel involved in your project.',
        'We do not sell, rent, or trade your personal information to third parties for marketing purposes.',
      ],
    },
    {
      title: 'Sharing With Third Parties',
      points: [
        'DISCOM and state nodal agencies — required for net metering applications and grid connectivity approvals.',
        'MNRE-registered vendors and certified solar installers engaged to fulfil your installation order.',
        'Government portals such as the PM Surya Ghar national portal for subsidy disbursement processing.',
      ],
    },
    {
      title: 'Cookies & Tracking',
      points: [
        'We use essential cookies to maintain your session and remember your solar calculator inputs during a visit.',
        'Analytics cookies help us understand how visitors use our solar calculator and service pages so we can improve them.',
        'You may disable non-essential cookies through your browser settings without affecting core site functionality.',
      ],
    },
    {
      title: 'Your Rights',
      points: [
        'You have the right to access, correct, or request deletion of your personal data.',
        'You may withdraw consent for marketing communications at any time.',
        'Requests will be processed within 30 days in accordance with applicable data protection laws.',
      ],
    },
  ],
};

const defaultTerms: PageData = {
  intro: '',
  sections: [
    {
      title: 'Solar Installation Services',
      points: [
        'We provide design, supply, installation, and commissioning of rooftop solar photovoltaic (PV) systems.',
        'All installations are carried out by MNRE-certified solar engineers and technicians.',
        'Any changes to the agreed system design after work order confirmation may attract additional charges.',
      ],
    },
    {
      title: 'Warranties & Guarantees',
      points: [
        'Solar panels carry a 25-year linear performance warranty from the manufacturer.',
        'Inverters are covered by a 5-year manufacturer warranty, extendable to 10 years.',
        'Mounting structures carry a 10-year structural warranty against corrosion and mechanical failure.',
      ],
    },
    {
      title: 'Payment Terms',
      points: [
        'A booking advance of 30% of the total project cost is required to confirm the work order.',
        'A further 60% is due upon delivery of materials to site and commencement of installation.',
        'The remaining 10% balance is payable upon successful commissioning and handover.',
      ],
    },
    {
      title: 'Cancellation & Refund Policy',
      points: [
        'Cancellations made within 48 hours of booking confirmation are eligible for a full refund.',
        'Cancellations after 48 hours but before material procurement will attract a 10% administrative charge.',
        'Once materials have been procured or installation has commenced, cancellations are not eligible for a refund of material costs.',
      ],
    },
    {
      title: 'Limitations of Liability',
      points: [
        'Solar generation estimates are indicative only and based on average peak sun hours for your region.',
        'We are not liable for delays in DISCOM approvals, subsidy disbursements, or grid connectivity.',
        'We are not responsible for damage caused by acts of God, vandalism, or structural failure of the building.',
      ],
    },
    {
      title: 'Governing Law & Disputes',
      points: [
        'These terms are governed by the laws of India.',
        'Any disputes shall first be attempted to be resolved through mutual negotiation within 30 days.',
        'Unresolved disputes shall be referred to arbitration.',
      ],
    },
  ],
};

type ActiveTab = 'privacy' | 'terms';

export default function LegalPagesAdmin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>('privacy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [privacy, setPrivacy] = useState<PageData>(emptyPage);
  const [terms, setTerms] = useState<PageData>(emptyPage);
  const [draft, setDraft] = useState<PageData>(emptyPage);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/legal-pages');
      const p = res.data.privacyPolicy;
      const t = res.data.termsOfService;

      // Use defaults if DB is empty
      const privacyData = p && p.sections && p.sections.length > 0 ? p : defaultPrivacy;
      const termsData = t && t.sections && t.sections.length > 0 ? t : defaultTerms;

      setPrivacy(privacyData);
      setTerms(termsData);
      setDraft(activeTab === 'privacy' ? privacyData : termsData);
    } catch {
      toast({ title: 'Failed to load', description: 'Could not load legal pages.', variant: 'destructive' });
      setPrivacy(defaultPrivacy);
      setTerms(defaultTerms);
      setDraft(defaultPrivacy);
    } finally {
      setLoading(false);
    }
  };

  const currentData = activeTab === 'privacy' ? privacy : terms;

  const switchTab = (tab: ActiveTab) => {
    if (editing) {
      setEditing(false);
    }
    setActiveTab(tab);
    setDraft(tab === 'privacy' ? privacy : terms);
  };

  const handleEdit = () => {
    setDraft(currentData);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(currentData);
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const endpoint = activeTab === 'privacy' ? '/legal-pages/privacy' : '/legal-pages/terms';
      await axios.put(endpoint, { intro: draft.intro, sections: draft.sections });

      if (activeTab === 'privacy') setPrivacy(draft);
      else setTerms(draft);

      setEditing(false);
      toast({ title: 'Saved', description: `${activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} updated successfully.` });
    } catch {
      toast({ title: 'Save failed', description: 'Could not save. Try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // ── Section helpers ──
  const addSection = () => {
    setDraft(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', points: [''] }],
    }));
  };

  const removeSection = (idx: number) => {
    setDraft(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx),
    }));
  };

  const setSectionTitle = (idx: number, title: string) => {
    setDraft(prev => {
      const sections = [...prev.sections];
      sections[idx] = { ...sections[idx], title };
      return { ...prev, sections };
    });
  };

  const addPoint = (sIdx: number) => {
    setDraft(prev => {
      const sections = [...prev.sections];
      sections[sIdx] = { ...sections[sIdx], points: [...sections[sIdx].points, ''] };
      return { ...prev, sections };
    });
  };

  const removePoint = (sIdx: number, pIdx: number) => {
    setDraft(prev => {
      const sections = [...prev.sections];
      sections[sIdx] = { ...sections[sIdx], points: sections[sIdx].points.filter((_, i) => i !== pIdx) };
      return { ...prev, sections };
    });
  };

  const setPoint = (sIdx: number, pIdx: number, value: string) => {
    setDraft(prev => {
      const sections = [...prev.sections];
      const points = [...sections[sIdx].points];
      points[pIdx] = value;
      sections[sIdx] = { ...sections[sIdx], points };
      return { ...prev, sections };
    });
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Legal Pages</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage Privacy Policy and Terms of Service content</p>
        </div>
        <div className="flex items-center gap-3">
          {editing ? (
            <>
              <Button onClick={handleCancel} variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 font-bold">
                <X className="h-4 w-4 mr-2" />Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-slate-800 hover:bg-slate-700 text-white font-bold">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} className="bg-slate-800 hover:bg-slate-700 text-white font-bold shadow-lg">
              <Pencil className="h-4 w-4 mr-2" />Edit Content
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => switchTab('privacy')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'privacy'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield className="h-4 w-4" />
          Privacy Policy
        </button>
        <button
          onClick={() => switchTab('terms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'terms'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="h-4 w-4" />
          Terms of Service
        </button>
      </div>

      {/* Intro */}
      <Card className="bg-white border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-gray-100 bg-slate-800">
          {activeTab === 'privacy'
            ? <Shield className="h-4 w-4 text-amber-500" />
            : <FileText className="h-4 w-4 text-amber-500" />}
          <h2 className="text-sm font-semibold text-white">
            Introduction Paragraph
          </h2>
        </div>
        <CardContent className="p-6">
          {editing ? (
            <textarea
              value={draft.intro}
              onChange={e => setDraft(prev => ({ ...prev, intro: e.target.value }))}
              rows={4}
              className={textareaCls}
              placeholder="Enter the introduction paragraph shown at the top of the page (optional — leave empty for default)"
            />
          ) : (
            <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-lg p-4 min-h-[60px]">
              {currentData.intro || <span className="text-gray-400 italic">Using default introduction text</span>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {(editing ? draft : currentData).sections.map((section, sIdx) => (
          <Card key={sIdx} className="bg-white border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-gray-300" />
                {editing ? (
                  <input
                    type="text"
                    value={section.title}
                    onChange={e => setSectionTitle(sIdx, e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 w-80"
                    placeholder="Section title"
                  />
                ) : (
                  <h3 className="text-sm font-semibold text-gray-800">{section.title}</h3>
                )}
              </div>
              {editing && (
                <button onClick={() => removeSection(sIdx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {section.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-3 shrink-0" />
                    {editing ? (
                      <div className="flex-1 flex gap-2">
                        <textarea
                          value={point}
                          onChange={e => setPoint(sIdx, pIdx, e.target.value)}
                          rows={2}
                          className={`${textareaCls} flex-1`}
                          placeholder="Enter point..."
                        />
                        <button onClick={() => removePoint(sIdx, pIdx)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors self-start mt-1">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600 leading-relaxed">{point}</span>
                    )}
                  </li>
                ))}
              </ul>
              {editing && (
                <button
                  onClick={() => addPoint(sIdx)}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Point
                </button>
              )}
            </CardContent>
          </Card>
        ))}

        {editing && (
          <button
            onClick={addSection}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Section
          </button>
        )}
      </div>
    </div>
  );
}
