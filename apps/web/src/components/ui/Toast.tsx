'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: 'none',
        },
        className: 'font-sans',
      }}
    />
  );
}

export { toast } from 'sonner';
