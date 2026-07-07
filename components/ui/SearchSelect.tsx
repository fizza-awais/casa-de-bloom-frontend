import React, { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

interface SearchSelectProps {
  title?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchSelect({
  title,
  placeholder = "Select option...",
  options,
  value,
  onChange,
  onSearch,
  className = "",
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Only show a label when there's a matching option — never show a raw ID as placeholder
  const selectedOption = options.find((o) => o.value === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div ref={containerRef} className={`flex flex-col gap-2 w-full relative ${className}`}>
      {/* 1. Normal external text label rendering matched to your reference image */}
      {title && (
        <label className="text-base font-bold text-[#0f172a] block select-none">
          {title}
        </label>
      )}

      {/* 2. Main interactive layout window wrapper container */}
      <div className="relative bg-white border border-slate-200 rounded-2xl hover:border-slate-300 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all w-full flex items-center justify-between px-5 h-14 gap-3">
        <input
          type="text"
          className="w-full bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-600"
          placeholder={displayValue || placeholder}
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
        />
        
        {/* Balanced structural asset placement */}
        <svg
          className={`h-5 w-5 text-slate-400 shrink-0 pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Options Box Layer Overlay */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
          {options.length === 0 ? (
            <div className="p-4 text-sm text-slate-400 text-center">No options found</div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="w-full text-left px-5 py-3.5 text-base font-medium text-slate-800 hover:bg-slate-50 transition-colors block"
                onClick={() => {
                  onChange(opt.value);
                  setSearchQuery("");
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}