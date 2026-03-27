'use client';
import { useState, KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm transition-all outline-none";
const textareaCls = `${inputCls} resize-none`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
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

  const dotColor  = tagColor === 'teal' ? 'bg-teal-500'  : 'bg-amber-500';
  const textColor = tagColor === 'teal' ? 'text-teal-800' : 'text-amber-800';
  const xColor    = tagColor === 'teal' ? 'text-teal-400 hover:text-teal-700' : 'text-amber-400 hover:text-amber-700';

  return (
    <div className="space-y-1">
      {/* Text input */}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => addTag(input)}
        placeholder={placeholder}
        className={inputCls}
      />

      {/* Points list below the input */}
      {tags.length > 0 && (
        <ul className="mt-2 space-y-1">
          {tags.map((tag, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span className={`text-xs font-medium truncate ${textColor}`}>{tag}</span>
              </div>
              <button
                type="button"
                onClick={() => removeTag(i)}
                className={`shrink-0 transition-colors ${xColor}`}
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AddService({ formData, isEditing, onSet, onSubmit, onDiscard }: AddServiceProps) {
  return (
    <form onSubmit={onSubmit}>
      <Card className="border shadow-md">
        <CardHeader className="bg-amber-50 border-b py-4 px-6">
          <CardTitle className="text-base font-bold text-gray-900">
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </CardTitle>
          <p className="text-xs text-gray-500 mt-0.5">Fill in all the details for this service</p>
        </CardHeader>

        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Service Title */}
          <div className="md:col-span-2">
            <Field label="Service Title *">
              <input
                required
                value={formData.title}
                onChange={e => onSet('title', e.target.value)}
                className={inputCls}
                placeholder="e.g., Residential Solar Installation"
              />
            </Field>
          </div>

          {/* Short Description */}
          <Field label="Short Description *" hint="Shown on service cards">
            <textarea
              required rows={3}
              value={formData.description}
              onChange={e => onSet('description', e.target.value)}
              className={textareaCls}
              placeholder="Brief summary for the card..."
            />
          </Field>

          {/* Full Description */}
          <Field label="Description" hint="Shown on the detail page">
            <textarea
              rows={3}
              value={formData.detailDescription}
              onChange={e => onSet('detailDescription', e.target.value)}
              className={textareaCls}
              placeholder="Comprehensive description for the detail page..."
            />
          </Field>

          {/* Features — tag input */}
          <Field label="Features *" hint="Press Enter or comma to add a point">
            <TagInput
              value={formData.features}
              onChange={val => onSet('features', val)}
              placeholder="e.g. Free Consultation"
              tagColor="amber"
            />
            {/* Hidden required guard */}
            <input
              tabIndex={-1}
              required
              value={formData.features}
              onChange={() => {}}
              className="sr-only"
              aria-hidden
            />
          </Field>

          {/* Benefits — tag input */}
          <Field label="Benefits Points" hint="Press Enter or comma to add a point">
            <TagInput
              value={formData.benefits}
              onChange={val => onSet('benefits', val)}
              placeholder="e.g. Save 80% on bills"
              tagColor="teal"
            />
          </Field>

          {/* What We Do */}
          <div className="md:col-span-2">
            <Field label="What We Do in This Work">
              <textarea
                rows={3}
                value={formData.workProcess}
                onChange={e => onSet('workProcess', e.target.value)}
                className={textareaCls}
                placeholder="Describe the work process, steps, and deliverables..."
              />
            </Field>
          </div>

          {/* Service Image */}
          <Field label="Service Image">
            <ImageUpload
              value={formData.image}
              onChange={url => onSet('image', url)}
              onRemove={() => onSet('image', '')}
            />
            {formData.image && <p className="text-xs text-green-600 mt-1 font-medium">✓ Image uploaded</p>}
          </Field>

          {/* Banner Image */}
          <Field label="Service Banner">
            <ImageUpload
              value={formData.bannerImage}
              onChange={url => onSet('bannerImage', url)}
              onRemove={() => onSet('bannerImage', '')}
            />
            {formData.bannerImage && <p className="text-xs text-green-600 mt-1 font-medium">✓ Banner uploaded</p>}
          </Field>

        </CardContent>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <Button type="button" variant="outline" onClick={onDiscard} className="px-6">
            Discard
          </Button>
          <Button
            type="submit"
            className="px-8 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
          >
            {isEditing ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </Card>
    </form>
  );
}
