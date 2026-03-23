'use client';

import { ProgressStepper } from '@/components/ui';
import { RegisterForm } from '@/components/RegisterForm';

export default function RegisterPage() {
  const handleComplete = (data: unknown, fotoUrl: string) => {
    console.log('Form submitted:', { data, fotoUrl });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Registro de Empleado
          </h1>
          <p className="text-center text-gray-500 mt-2">
            Completa los datos para comenzar
          </p>
        </div>

        <ProgressStepper currentStep={1} totalSteps={3} labels={['Datos', 'Foto', 'Confirmar']} />

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <RegisterForm onComplete={handleComplete} />
        </div>
      </div>
    </main>
  );
}
