import React from "react";
import Text from "./Text";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  title?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

const Select: React.FC<SelectProps> = ({ 
  title, 
  value, 
  onChange, 
  options, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 min-w-[160px] ${className}`}>
      
      {title && (
        <Text 
          variant="overline" 
          color="muted" 
          weight="bold" 
          as="span"
          className="select-none pl-1"
        >
          {title}
        </Text>
      )}

      <div className="bg-brand-light/30 px-4 py-3 rounded-xl border border-ui-border hover:border-brand-primary/40 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all relative w-full">
        <select
          className="w-full bg-transparent text-sm font-medium text-ui-text-main outline-none appearance-none cursor-pointer pr-8"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
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
  );
};

export default Select;