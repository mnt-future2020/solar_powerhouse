'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string | number;
  label: string | number;
}

interface DarkDropdownProps {
  id?: string;
  value: string | string[];
  options: (string | number | Option)[];
  placeholder?: string;
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export default function DarkDropdown({ id, value, options, placeholder, onChange, multiple, disabled }: DarkDropdownProps) {
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
        className={`w-full text-left px-4 py-3 bg-white/10 border border-white/20 rounded-xl flex items-center justify-between text-white transition-all ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:bg-white/15 focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
        }`}
      >
        <span className={Array.isArray(value) ? (value.length ? 'text-white' : 'text-white/50') : (value ? 'text-white' : 'text-white/50')}>
          {renderButtonLabel()}
        </span>
        <ChevronDown className={`ml-3 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''} ${disabled ? 'text-white/30' : 'text-white/60'}`} />
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          aria-activedescendant={focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined}
          tabIndex={0}
          onKeyDown={onListKeyDown}
          aria-multiselectable={multiple || undefined}
          className="absolute z-50 mt-1 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl max-h-48 overflow-auto"
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
                className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm transition-colors ${
                  focusedIndex === idx 
                    ? 'bg-amber-500/20 text-white' 
                    : selected 
                      ? 'bg-amber-500/10 text-amber-300' 
                      : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span>{opt.label}</span>
                {selected && (
                  <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}