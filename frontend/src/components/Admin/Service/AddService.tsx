'use client';
import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

export interface ServiceFormData {
  title: string;
  description: string;
  detailDescription: string;
  features: string;
  workProcess: string;
  benefits: string;
  image: string;
  bannerImage: string;
}

interface AddServiceProps {
  formData: ServiceFormData;
  isEditing: boolean;
  onSet: (key: keyof ServiceFormData, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDiscard: () => void;
  saving?: boolean;
}

const inputCls = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm transition-all outline-none";
const textareaCls = `${inputCls} resize-none`;

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ── Tag Input ─────────────────────────────────────────────────────────────────
function TagInput({
  value,
  onChange,
  placeholder,
  tagColor = 'amber',
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  tagColor?: 'amber' | 'teal';
}) {
  const [input, setInput] = useState('');

  const tags = value
    ? value.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const addTag = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed].join(', '));
    setInput('');
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index).join(', '));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const dotColor  = tagColor === 'teal' ? 'bg-slate-500'  : 'bg-amber-500';
  const textColor = tagColor === 'teal' ? 'text-slate-700' : 'text-amber-700';
  const xColor    = tagColor === 'teal' ? 'text-slate-400 hover:text-slate-700' : 'text-amber-400 hover:text-amber-700';
  const bgColor   = tagColor === 'teal' ? 'bg-slate-50 border-slate-100' : 'bg-amber-50 border-amber-100';

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => addTag(input)}
        placeholder={placeholder}
        className={inputCls}
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${bgColor} ${textColor}`}
            >
              <span className={`w-1 h-1 rounded-full ${dotColor}`} />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className={`ml-0.5 transition-colors ${xColor}`}
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AddService({ formData, isEditing, onSet, onSubmit, onDiscard, saving }: AddServiceProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-900">
            {isEditing ? 'Edit Service' : 'New Service'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the details below</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Basic Information</p>

            <Field label="Service Title" required>
              <input
                required
                value={formData.title}
                onChange={e => onSet('title', e.target.value)}
                className={inputCls}
                placeholder="e.g., Residential Solar Installation"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Short Description" required hint="Shown on the service card">
                <textarea
                  required rows={3}
                  value={formData.description}
                  onChange={e => onSet('description', e.target.value)}
                  className={textareaCls}
                  placeholder="Brief summary for the card..."
                />
              </Field>

              <Field label="Detail Description" hint="Shown on the detail page">
                <textarea
                  rows={3}
                  value={formData.detailDescription}
                  onChange={e => onSet('detailDescription', e.target.value)}
                  className={textareaCls}
                  placeholder="Full description for the detail page..."
                />
              </Field>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Section: Features & Benefits */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Features & Benefits</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Features" required hint="Press Enter or comma to add">
                <TagInput
                  value={formData.features}
                  onChange={val => onSet('features', val)}
                  placeholder="e.g. Free Consultation"
                  tagColor="amber"
                />
                <input
                  tabIndex={-1}
                  required
                  value={formData.features}
                  onChange={() => {}}
                  className="sr-only"
                  aria-hidden
                />
              </Field>

              <Field label="Benefits" hint="Press Enter or comma to add">
                <TagInput
                  value={formData.benefits}
                  onChange={val => onSet('benefits', val)}
                  placeholder="e.g. Save 80% on bills"
                  tagColor="teal"
                />
              </Field>
            </div>

            <Field label="Work Process" hint="Describe how this service is delivered">
              <textarea
                rows={3}
                value={formData.workProcess}
                onChange={e => onSet('workProcess', e.target.value)}
                className={textareaCls}
                placeholder="Describe the work process, steps, and deliverables..."
              />
            </Field>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Section: Images */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Images</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Service Image" hint="Main thumbnail image">
                <ImageUpload
                  value={formData.image}
                  onChange={url => onSet('image', url)}
                  onRemove={() => onSet('image', '')}
                />
                {formData.image && <p className="text-[11px] text-amber-600 mt-1 font-medium">Image uploaded</p>}
              </Field>

              <Field label="Banner Image" hint="Displayed on the detail page">
                <ImageUpload
                  value={formData.bannerImage}
                  onChange={url => onSet('bannerImage', url)}
                  onRemove={() => onSet('bannerImage', '')}
                />
                {formData.bannerImage && <p className="text-[11px] text-amber-600 mt-1 font-medium">Banner uploaded</p>}
              </Field>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onDiscard}
            className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            disabled={saving}
            className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold"
          >
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : isEditing ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </div>
    </form>
  );
}
