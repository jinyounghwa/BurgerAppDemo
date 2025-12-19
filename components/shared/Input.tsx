'use client';

import React from 'react';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2 rounded-lg border transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${className || ''}
          `}
          {...props}
        />

        {error && (
          <p className="text-red-600 text-sm mt-1">{error}</p>
        )}

        {helpText && !error && (
          <p className="text-gray-500 text-sm mt-1">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
