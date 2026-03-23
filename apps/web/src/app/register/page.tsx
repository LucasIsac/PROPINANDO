'use client';

import { useState } from 'react';
import { ProgressStepper } from '@/components/ui';
import { RegisterForm } from '@/components/RegisterForm';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [fotoUrl, setFotoUrl] = useState('');

  const handleComplete = (data: unknown, url: string) => {
    console.log('Form submitted:', { data, url });
    alert('¡Registro exitoso! Tu cuenta está en revisión.');
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-8 px-4">
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
  );
}
