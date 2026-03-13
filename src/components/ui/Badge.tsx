import React from 'react';
import { cn } from './Button';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'info' | 'warning' | 'primary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className }) => {
  const variants = {
    success: 'bg-success-50 text-success-700 border-success-500/20',
    danger: 'bg-danger-50 text-danger-700 border-danger-500/20',
    warning: 'bg-orange-50 text-orange-700 border-orange-500/20',
    info: 'bg-blue-50 text-blue-700 border-blue-500/20',
    primary: 'bg-primary-50 text-primary-700 border-primary-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
