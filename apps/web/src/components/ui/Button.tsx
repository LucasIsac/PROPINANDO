'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'lg',
      loading = false,
      fullWidth = true,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-[0.98]';

    const variantClasses = {
      primary:
        'bg-[#DC143C] hover:bg-[#DC143C]/90 text-white shadow-lg shadow-[#DC143C]/20',
      secondary:
        'bg-[#FDDC41] hover:bg-[#FDDC41]/90 text-gray-900 shadow-lg shadow-[#FDDC41]/20',
      outline:
        'border-2 border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C]/10',
      ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-6 py-4 text-base min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-60 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Cargando...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
