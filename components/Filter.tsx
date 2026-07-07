import { Search, ChevronDown } from 'lucide-react';
import Text from './ui/Text';
import Input from './forms/Input';
import Button from './ui/Button';

export interface FilterSelectConfig {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export interface FilterInputConfig {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: string | number;
}

interface FilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  disabled?: boolean;
  selects?: FilterSelectConfig[];
  inputs?: FilterInputConfig[];
  children?: React.ReactNode;
  className?: string;
  bordered?: boolean;
  onClear?: () => void;
}

export default function Filter({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  disabled = false,
  selects = [],
  inputs = [],
  children,
  className = '',
  bordered = false,
  onClear,
}: FilterProps) {
  return (
    <div
      className={`
        flex flex-col md:flex-row md:items-end gap-4 w-full
        ${bordered ? 'bg-ui-card p-4 rounded-4xl shadow-sm border border-ui-border' : ''}
        ${className}
      `}
    >
      {/* SEARCH */}
      {onSearchChange && (
        <div className="relative flex-1 min-w-48 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ui-text-muted w-4 h-4 group-focus-within:text-brand-primary transition-colors" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              w-full bg-brand-light/20 border border-ui-border rounded-xl
              py-3 pl-11 pr-4 text-sm font-semibold text-ui-text-main
              placeholder:text-ui-text-muted transition-all
              focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary/30
            "
            disabled={disabled}
          />
        </div>
      )}

      {/* SELECT FILTERS */}
      {selects.map((select) => (
        <div key={select.name} className="flex flex-col gap-1 min-w-35">
          <Text variant="overline" color="muted" weight="bold" className="px-3">
            {select.label}
          </Text>
          <div className="relative group">
            <select
              value={select.value}
              onChange={(e) => select.onChange(e.target.value)}
              className="
                w-full bg-brand-light/20 border border-ui-border
                rounded-xl appearance-none pr-10 py-2.5 px-3
                text-sm font-semibold text-ui-text-main
                hover:bg-brand-light/40
                focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary/30
                transition-all cursor-pointer disabled:opacity-50
              "
              disabled={disabled || select.disabled}
            >
              {select.options.map((option) => (
                <option key={option.value} value={option.value} className="bg-white text-ui-text-main">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center border-l border-ui-border/50 pl-2">
              <ChevronDown className="w-4 h-4 text-ui-text-muted group-hover:text-brand-primary transition-colors" />
            </div>
          </div>
        </div>
      ))}

      {/* INPUT FILTERS — inline with selects */}
      {inputs.map((input) => (
        <div key={input.name} className="min-w-36 max-w-44">
          <Input
            variant="filter" // <-- Add this line here
            label={input.label}
            type={input.type ?? 'text'}
            placeholder={input.placeholder}
            value={input.value}
            onChange={(e) => input.onChange(e.target.value)}
            disabled={disabled || input.disabled}
            min={input.min}
          />
        </div>
      ))}
      
      {/* ACTIONS */}
      <div className="flex items-center self-end gap-3 md:ml-auto md:self-end">
        {children}
        {onClear && (
          <Button variant="secondary" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
