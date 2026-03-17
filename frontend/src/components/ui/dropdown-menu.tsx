'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Option {
  value: string | number;
  label: string | number;
}

interface DropdownProps {
  id?: string;
  label?: string;
  // single string or array for multiple mode
  value: string | string[];
  options: (string | number | Option)[];
  placeholder?: string;
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export default function Dropdown({ id, label, value, options, placeholder, onChange, multiple, disabled }: DropdownProps) {
  const normalized = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: String(opt), label: String(opt) };
    }
    return { value: String(opt.value), label: String(opt.label) };
  });

  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const currentValue = Array.isArray(value) ? value[0] : value;
      const idx = normalized.findIndex(o => o.value === currentValue);
      setFocusedIndex(idx >= 0 ? idx : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [open, value, normalized]);

  const toggleOpen = () => {
    if (!disabled) {
      setOpen(prev => !prev);
    }
  };

  const onSelectSingle = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const onToggleMultiple = (val: string) => {
    const arr = Array.isArray(value) ? [...value] : [];
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(val);
    onChange(arr);
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => (i + 1) % normalized.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => (i - 1 + normalized.length) % normalized.length);
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      const val = normalized[focusedIndex].value;
      if (multiple) onToggleMultiple(val);
      else onSelectSingle(val);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const renderButtonLabel = () => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      if (arr.length === 0) return placeholder || 'Select';
      const labels = normalized.filter(n => arr.includes(n.value)).map(n => n.label);
      return labels.join(', ');
    }
    const val = typeof value === 'string' ? value : (Array.isArray(value) ? value[0] : '');
    return val ? (normalized.find(n => n.value === val)?.label) : (placeholder || 'Select');
  };

  return (
    <div ref={containerRef} className="relative">
      {label && <label htmlFor={id} className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">{label}</label>}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-multiselectable={multiple || undefined}
        disabled={disabled}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'ArrowDown' || e.key === 'Enter')) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`w-full text-left px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg flex items-center justify-between text-sm transition-all ${
          disabled 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
            : 'bg-white cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
        }`}
      >
        <span className={Array.isArray(value) ? (value.length ? 'text-gray-900' : 'text-gray-500') : (value ? 'text-gray-900' : 'text-gray-500')}>
          {renderButtonLabel()}
        </span>
        <svg className={`ml-3 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''} ${disabled ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          aria-activedescendant={focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined}
          tabIndex={0}
          onKeyDown={onListKeyDown}
          aria-multiselectable={multiple || undefined}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto"
        >
          {normalized.map((opt, idx) => {
            const selected = multiple ? (Array.isArray(value) && value.includes(opt.value)) : (value === opt.value);
            return (
              <li
                id={`${id}-option-${idx}`}
                key={opt.value}
                role="option"
                aria-selected={selected}
                onClick={() => (multiple ? onToggleMultiple(opt.value) : onSelectSingle(opt.value))}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm ${
                  focusedIndex === idx 
                    ? 'bg-amber-50 text-amber-900' 
                    : selected 
                      ? 'bg-amber-100 text-amber-900' 
                      : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{opt.label}</span>
                {multiple && selected && <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {!multiple && selected && <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}