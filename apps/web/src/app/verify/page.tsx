'use client';

import { Shield, ShieldCheck, AlertCircle } from 'lucide-react';
import { VerifyIdentityButton } from '@/components/VerifyIdentityButton';

export default function VerifyPage() {
  // Mock userId - in production would come from session/auth
  const mockUserId = 'user_pending_123';

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-[#1A1A1A]">
            Verificación de Identidad
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Badge de estado PENDIENTE */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-[#FDDC41] text-[#1A1A1A] text-sm font-semibold rounded-full">
              Estado: PENDIENTE
            </span>
          </div>

          {/* Icono y texto explicativo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#FDDC41]/20 flex items-center justify-center mb-4">
              <Shield className="text-[#DC143C]" size={40} />
            </div>
            
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Tu cuenta fue creada
            </h2>
            
            <p className="text-[#4B5563] mb-4">
              Para recibir propinas, necesitás verificar tu identidad. 
              Es un proceso rápido y seguro.
            </p>

            <div className="flex items-start gap-2 text-sm text-[#4B5563] bg-gray-50 p-3 rounded-lg w-full">
              <AlertCircle className="text-[#DC143C] flex-shrink-0 mt-0.5" size={16} />
              <p>
                MetaMap verificará tu DNI y tomara una selfie para confirmar tu identidad.
              </p>
            </div>
          </div>

          {/* Botón de verificación */}
          <div className="flex flex-col items-center">
            <VerifyIdentityButton 
              userId={mockUserId} 
              onVerified={(response) => {
                console.log('Verified:', response);
              }}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center text-sm text-[#6B7280]">
          <p>¿Ya verificaste? <a href="/dashboard" className="text-[#DC143C] font-medium">Ir al dashboard</a></p>
        </div>
      </div>
    </main>
  );
}
