'use client';

import { Toaster, toast } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#FFFFFF',
          color: '#1A1A1A',
          borderLeft: '4px solid #DC143C',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        className: 'font-sans',
      }}
    />
  );
}

export { toast };
