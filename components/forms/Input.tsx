import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Text from '../ui/Text';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  error?: string;
  showPasswordToggle?: boolean;
  variant?: 'default' | 'filter';
}

export default function Input({
  label,
  helperText,
  icon,
  error,
  showPasswordToggle = false,
  type = 'text',
  disabled,
  variant = 'default',
  className = '', // 1. Set a default empty string for className
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password' && showPasswordToggle;
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const isFilter = variant === 'filter';

  return (
    /* 2. Merged the custom className into the outermost wrapper container string template */
    <div className={`flex flex-col gap-1 w-full ${className}`}>

      {/* LABEL */}
      {isFilter ? (
        <Text variant="overline" color="muted" weight="bold" className="px-3">
          {label}
        </Text>
      ) : (
        label !== undefined && (
          <Text as="p" color="main" weight="bold">
            {label}:
          </Text>
        )
      )}

      {/* INPUT WRAPPER */}
      <div
        className={`
          flex items-center gap-3 border transition-all rounded-xl
          ${isFilter ? 'py-2 px-3' : 'py-3 px-4'} 
          ${
            disabled
              ? 'bg-ui-bg-page border-ui-border'
              : 'bg-brand-light/20 border-ui-border hover:bg-brand-light/40' 
          }
          focus-within:ring-2 focus-within:ring-brand-primary/10 focus-within:border-brand-primary/30
        `}
      >

        {/* ICON */}
        {icon && (
          <span className="text-ui-text-muted">
            {icon}
          </span>
        )}

        {/* INPUT */}
        <input
          type={inputType}
          disabled={disabled}
          min={type === 'number' ? (props.min ?? 0) : undefined}
          className={`
            w-full bg-transparent outline-none text-sm
            ${isFilter ? 'font-semibold' : 'font-medium'}
            ${disabled ? 'text-ui-text-muted' : 'text-ui-text-main'}
          `}
          {...props}
        />

        {/* PASSWORD TOGGLE */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-ui-text-muted hover:text-brand-primary transition cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* HELPER TEXT */}
      {helperText && !error && (
        <span className="text-xs text-ui-text-muted px-1">
          {helperText}
        </span>
      )}

      {/* ERROR */}
      {error && (
        <span className="text-xs text-status-absent font-medium px-1">
          {error}
        </span>
      )}
    </div>
  );
}