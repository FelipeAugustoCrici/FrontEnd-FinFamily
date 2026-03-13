import React from 'react';
import _ from 'lodash';
import { cn } from './Button';

type FormError = string | { message?: string } | undefined;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FormError;
  helperText?: string;
  icon?: React.ReactNode;
}

const getErrorMessage = (error?: FormError) => {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && 'message' in error) {
    return error.message;
  }
  return undefined;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    const errorMessage = getErrorMessage(error);

    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-primary-700 ml-0.5">{label}</label>}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2 bg-white border rounded-lg text-primary-800 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-primary-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              errorMessage
                ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500'
                : 'border-primary-200',
              className,
            )}
            {...props}
          />
        </div>

        {(errorMessage || helperText) && (
          <p
            className={cn('text-xs ml-0.5', errorMessage ? 'text-danger-600' : 'text-primary-500')}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: FormError;
  options: { value: string | number; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    const errorMessage = getErrorMessage(error);

    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-primary-700 ml-0.5">{label}</label>}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 bg-white border rounded-lg text-primary-800 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-primary-50 disabled:cursor-not-allowed',
            error
              ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500'
              : 'border-primary-200',
            className,
          )}
          {...props}
        >
          {_.map(options, (opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errorMessage && (
          <p
            className={cn('text-xs ml-0.5', errorMessage ? 'text-danger-600' : 'text-primary-500')}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
