'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProgressStepper, toast } from '@/components/ui';
import { RegisterForm } from '@/components/RegisterForm';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [fotoUrl, setFotoUrl] = useState('');

  const handleComplete = (data: unknown, url: string) => {
    console.log('Form submitted:', { data, url });
    toast('', {
      icon: <CheckCircle className="text-[#10B981]" size={24} />,
      description: (
        <div className="flex items-start gap-3">
          <div>
            <span className="font-semibold text-[#1A1A1A] block">¡Registro exitoso!</span>
            <span className="text-[#4B5563]">Tu cuenta está en revisión. Te notificaremos cuando esté activa.</span>
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
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 pb-8">
      <Link href="/" className="absolute top-4 left-4">
        <div className="w-8 h-8 relative">
          <Image
            src="/images/isotipo/isotipo.png"
            alt="PROPINANDO"
            fill
            className="object-contain"
          />
        </div>
      </Link>

      <main className="pt-16">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <div className="relative w-full max-w-[60%] mx-auto aspect-[3/1]">
              <Image
                src="/images/logo/PROPINANDO.png"
                alt="PROPINANDO"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-4 text-sm text-[#6B7280]">
              Completa los datos para comenzar
            </p>
          </div>

          <ProgressStepper currentStep={step} totalSteps={3} labels={['Datos', 'Foto', 'Confirmar']} />

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <RegisterForm 
              step={step} 
              fotoUrl={fotoUrl}
              onFotoChange={setFotoUrl}
              onStepChange={setStep} 
              onComplete={handleComplete} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
