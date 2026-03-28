'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { ProgressStepper, toast } from '@/components/ui';
import { RegisterForm } from '@/components/RegisterForm';
import { Navbar } from '@/components/Navbar';

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
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8F9FA] pt-20 px-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center text-[#1A1A1A]">
              Registro de Empleado
            </h1>
            <p className="text-center text-[#6B7280] mt-2">
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
    </>
  );
}
