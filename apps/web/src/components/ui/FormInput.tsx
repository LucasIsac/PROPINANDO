'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, helperText, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[#1A1A1A]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-xl border bg-white p-4 text-base text-[#1A1A1A]',
              'transition-colors duration-200',
              'placeholder:text-[#6B7280]',
              'focus:outline-none focus:ring-2',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              icon && 'pl-12',
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-[#D1D5DB] focus:ring-[#DC143C] focus:border-[#DC143C]',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
