import React from 'react';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'label' | 'small' | 'overline';
  color?: 
    | 'primary' 
    | 'secondary' 
    | 'brand-dark' 
    | 'brand-accent' 
    | 'danger' 
    | 'success' 
    | 'warning' 
    | 'info' 
    | 'muted' 
    | 'main'
    | 'white'
    | 'inherit';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  leading?: 'none' | 'tight' | 'normal' | 'relaxed' | 'loose';
  truncate?: boolean;
  lines?: number;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'small';
}

export default function Text({
  children,
  variant = 'body',
  color = 'inherit',
  weight = 'normal',
  align = 'left',
  leading = 'normal',
  truncate = false,
  lines,
  className = '',
  as: Component = 'span',
}: TextProps) {
  // Variant (size) styles
  const variantClasses = {
    h1: 'text-4xl mb-4 font-bold',
    h2: 'text-3xl mb-3 font-bold',
    h3: 'text-2xl mb-3 font-semibold',
    h4: 'text-xl mb-2 font-semibold',
    h5: 'text-lg mb-2 font-medium',
    h6: 'text-base mb-2 font-medium',
    body: 'text-base',
    caption: 'text-sm',
    label: 'text-sm font-medium',
    small: 'text-xs',
    overline: 'text-[10px] uppercase tracking-widest',
  };

  // Color styles - Mapping to Tailwind v4 @theme variables
  const colorClasses = {
    primary: 'text-brand-primary',
    secondary: 'text-brand-secondary',
    'brand-dark': 'text-brand-dark',
    'brand-accent': 'text-brand-accent',
    danger: 'text-status-absent',
    success: 'text-status-active',
    warning: 'text-status-late',
    info: 'text-status-info',
    main: 'text-ui-text-main',
    muted: 'text-ui-text-muted',
    white: 'text-white',
    inherit: 'text-inherit',
  };

  // Weight styles
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  // Align styles
  const alignClasses = {
  left: 'text-left',
  center: 'text-center block',
  right: 'text-right block',
  justify: 'text-justify',
};

  // Leading (line-height) styles
  const leadingClasses = {
    none: 'leading-none',
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  };

  // Truncate styles
  let truncateClasses = '';
  if (truncate) {
    truncateClasses = 'truncate block';
  } else if (lines) {
    truncateClasses = `line-clamp-${lines}`;
  }

  const finalClassName = `${variantClasses[variant]} ${colorClasses[color]} ${weightClasses[weight]} ${alignClasses[align]} ${leadingClasses[leading]} ${truncateClasses} ${className}`.trim();

  return React.createElement(Component, { className: finalClassName }, children);
}
