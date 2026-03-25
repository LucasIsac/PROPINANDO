'use client';

import { useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, toast } from '@/components/ui';

interface VerifyIdentityButtonProps {
  userId: string;
  onVerified?: (response: unknown) => void;
}

export function VerifyIdentityButton({ userId, onVerified }: VerifyIdentityButtonProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Placeholder: simulates MetaMap flow without SDK
  // TODO: replace with real MetaMap SDK when credentials are available
  const handleVerify = async () => {
    setIsVerifying(true);

    try {
      const response = await fetch('/api/auth/verify-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        toast.success('', {
          description: (
            <div className="flex items-start gap-3">
              <CheckCircle className="text-[#10B981] flex-shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-semibold text-[#1A1A1A] block">¡Identidad verificada!</span>
                <span className="text-[#4B5563]">Ya podés recibir propinas.</span>
              </div>
            </div>
          ),
          duration: 5000,
          style: {
            background: '#FFFFFF',
            borderLeft: '4px solid #DC143C',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '12px 16px',
          },
        });
        onVerified?.(data);
      } else {
        toast.error('', {
          description: (
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-semibold text-[#1A1A1A] block">Error en la verificación</span>
                <span className="text-[#4B5563]">Por favor intentá nuevamente.</span>
              </div>
            </div>
          ),
          duration: 5000,
          style: {
            background: '#FFFFFF',
            borderLeft: '4px solid #DC143C',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '12px 16px',
          },
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Error al verificar identidad');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-green-50 rounded-xl border-2 border-[#10B981]">
        <CheckCircle className="text-[#10B981]" size={48} />
        <p className="text-lg font-semibold text-[#1A1A1A]">¡Identidad verificada!</p>
        <p className="text-sm text-[#4B5563]">Ya podés recibir propinas.</p>
      </div>
    );
  }

  return (
    <Button
      onClick={handleVerify}
      disabled={isVerifying}
      loading={isVerifying}
      className="min-h-[48px]"
    >
      <ShieldCheck className="mr-2" size={20} />
      {isVerifying ? 'Verificando...' : 'Verificar identidad'}
    </Button>
  );
}
