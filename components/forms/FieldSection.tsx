import React from 'react';
import Text from '../ui/Text';
import Input from './Input';
import Toggle from '../ui/Toggle';
import { SearchSelect } from '../ui/SearchSelect';

export type FieldItem = {
  label: string;
  value: any;
  name: string;
  type?: string; // allow any type like 'color', 'email', 'async-select', etc.
  colSpan?: 1 | 2;
  icon?: React.ReactNode;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  onSearch?: (query: string) => void; 

  // Toggle only
  leftLabel?: string;
  rightLabel?: string;
};

interface FieldSectionProps {
  title: string;
  fields: FieldItem[];
  mode?: 'view' | 'edit';
  onChange?: (name: string, value: string) => void;
  icon?: React.ReactNode;
}

export default function FieldSection({
  title,
  fields,
  mode = 'view',
  onChange,
  icon,
}: FieldSectionProps) {
  return (
    <div className="bg-ui-card rounded-3xl shadow-sm border border-ui-border">
      {/* Title */}
      <div className="bg-slate-50/50 border-b border-slate-100 p-8 flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-brand-primary/10 rounded-xl">
            {icon}
          </div>
        )}
        <Text variant="h4" weight="bold" color="main">
          {title}
        </Text>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-8 p-8">
        {fields.map((field) => {
          const isTextarea = field.type === 'textarea';

          return (
            <div
              key={field.name}
              className={field.colSpan === 2 ? 'col-span-2' : ''}
            >
              {/* VIEW MODE */}
              {mode === 'view' && (
                <div className="space-y-1">
                  <Text as="p" color="main" weight="bold">
                    {field.label}:
                  </Text>
                  <Text
                    as="p"
                    variant="label"
                    color="main"
                    className="mt-1 whitespace-pre-line block"
                  >
                    {field.value || '—'}
                  </Text>
                </div>
              )}

              {/* EDIT MODE */}
              {mode === 'edit' && (
                <>
                  {isTextarea ? (
                    <div className="flex flex-col gap-2 w-full">
                      <Text as="p" color="main" weight="bold">
                        {field.label}:
                      </Text>
                      <textarea
                        value={field.value}
                        placeholder={field.placeholder}
                        onChange={(e) =>
                          onChange?.(field.name, e.target.value)
                        }
                        
                        ref={(el) => {
                          if (el) {
                            el.style.height = 'auto'; // Reset calculation height base
                            el.style.height = `${el.scrollHeight + 2}px`; // Match content depth precisely
                          }
                        }}
                        
                        className="w-full bg-brand-light/30 border border-ui-border rounded-xl p-4 text-sm font-normal outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none overflow-hidden min-h-[100px]"
                      />
                    </div>
                  ) : field.type === 'select' ? (
                    <div className="flex flex-col gap-2 w-full">
                      <Text as="p" color="main" weight="bold">
                        {field.label}:
                      </Text>
                      <div className="relative">
                        <select
                          value={field.value}
                          onChange={(e) => onChange?.(field.name, e.target.value)}
                          className="w-full rounded-xl border border-ui-border bg-brand-light/30 px-4 py-3 text-sm font-medium text-ui-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none cursor-pointer pr-10 transition-all"
                        >
                          {field.placeholder && (
                            <option value="" disabled>
                              {field.placeholder}
                            </option>
                          )}
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ui-text-muted pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  ) : field.type === 'async-select' ? (
                    <div className="flex flex-col gap-2 w-full">
                      <SearchSelect
                        title={field.label}
                        value={field.value}
                        placeholder={field.placeholder}
                        options={field.options || []}
                        onSearch={field.onSearch}
                        // ✅ Fixed: Added explicit typing string configuration context value
                        onChange={(val: string) => onChange?.(field.name, val)}
                      />
                    </div>
                  ) : field.type === 'toggle' ? (
                    <div className="flex flex-col gap-2 w-full">
                      <Toggle
                        label={field.label}
                        checked={!!field.value}
                        onChange={(checked) => onChange?.(field.name, checked as any)}
                        leftLabel={field.leftLabel}
                        rightLabel={field.rightLabel}
                      />
                    </div>
                  ) : (
                    <Input
                      label={field.label}
                      name={field.name}
                      type={field.type || 'text'}
                      value={field.value}
                      placeholder={field.placeholder}
                      icon={field.icon}
                      helperText={field.helperText}
                      required={field.required}
                      onChange={(e) => onChange?.(field.name, e.target.value)}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
