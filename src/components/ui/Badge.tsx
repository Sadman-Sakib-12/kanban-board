import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline';
  customColor?: string;
}

export function Badge({ className = '', variant = 'default', customColor, style, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary';
  
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-muted text-foreground',
    outline: 'text-foreground border-border',
  };

  const customStyle = customColor ? { backgroundColor: customColor, color: '#fff', border: 'none', ...style } : style;

  return (
    <div 
      className={`${baseStyles} ${customColor ? '' : variants[variant]} ${className}`} 
      style={customStyle}
      {...props} 
    />
  );
}
