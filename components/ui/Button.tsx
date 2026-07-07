import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'link' | 'neutral' | 'brand' | 'active';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  shadow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'lg',
  disabled = false,
  loading = false,
  fullWidth = false,
  shadow = false,
  icon,
  iconPosition = 'left',
  ...props
}: ButtonProps) {

  const variantClasses = {
    primary:
      'bg-brand-primary text-white hover:bg-brand-secondary disabled:bg-brand-light disabled:text-gray-400',

    secondary:
      'bg-black text-white hover:bg-gray-800 disabled:bg-gray-400',

    brand:
      'bg-ui-text-main text-white hover:opacity-90 shadow-md shadow-ui-border/50 disabled:bg-gray-400',

    danger:
      'bg-danger-500 text-white hover:bg-danger-600 disabled:bg-red-300 transition-colors shadow-sm',

    ghost:
      'bg-transparent text-brand-primary border border-brand-primary hover:bg-brand-light disabled:text-gray-400 disabled:border-gray-200',

    outline:
      'border border-ui-border text-gray-700 hover:bg-gray-100 hover:text-brand-primary disabled:border-gray-200 disabled:text-gray-400',

    active:
      'bg-ui-text-main text-white border border-ui-text-main hover:opacity-90 shadow-sm disabled:opacity-50',

    neutral:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400',

    link:
      'bg-transparent text-brand-primary underline font-bold p-0 hover:opacity-80 disabled:text-gray-400',
  };

  const sizeClasses = {
    xs: variant === 'link' ? 'text-xs' : 'px-2 py-1 text-xs',
    sm: variant === 'link' ? 'text-sm' : 'px-3 py-1.5 text-sm',
    md: variant === 'link' ? 'text-base' : 'px-4 py-2 text-base',
    lg: variant === 'link' ? 'text-lg' : 'px-6 py-3 text-lg',
    xl: variant === 'link' ? 'text-xl' : 'px-8 py-4 text-xl',
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium transition duration-200 cursor-pointer disabled:cursor-not-allowed relative';

  const widthClass = fullWidth ? 'w-full' : '';
  const opacityClass = loading ? 'opacity-70' : '';
  const cursorClass = loading ? 'cursor-wait' : '';
  const shadowClass = shadow ? 'shadow-lg shadow-brand-dark/10' : '';

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]} ${widthClass} ${opacityClass} ${cursorClass} ${shadowClass}`;

  return (
    <button
      disabled={disabled || loading}
      className={finalClassName}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={loading ? 'opacity-0' : ''}>{icon}</span>
      )}

      {children && <span>{children}</span>}

      {icon && iconPosition === 'right' && (
        <span className={loading ? 'opacity-0' : ''}>{icon}</span>
      )}

      {loading && (
        <div className="absolute w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
    </button>
  );
}