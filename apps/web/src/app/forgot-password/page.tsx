'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setIsSubmitted(true);
    } catch (err) {
      setError('Error al enviar el email. Intentalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#F8F9FA] pt-20 px-4 pb-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-[#10B981]" />
              </div>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
                Email enviado
              </h2>
              <p className="text-[#4B5563] mb-6">
                Te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
              </p>
              <Link 
                href="/login"
                className="inline-flex items-center text-[#DC143C] font-medium hover:text-[#B01030]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al login
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8F9FA] pt-20 px-4 pb-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-[#4B5563] mb-6">
              Ingresa tu email y te enviaremos un enlace para restablecerla.
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-[#DC143C] text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#DC143C] focus:border-[#DC143C] transition-colors bg-white text-[#1A1A1A] placeholder-[#6B7280]"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white font-medium bg-[#DC143C] hover:bg-[#B01030] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC143C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar enlace'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
