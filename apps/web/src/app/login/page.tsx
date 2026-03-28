'use client';

import LoginForm from '@/components/LoginForm';
import { Navbar } from '@/components/Navbar';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] pt-14 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-[#DC143C] rounded-full flex items-center justify-center">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              PROPINANDO
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona tus propinas digitales
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            <LoginForm />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="font-medium text-[#DC143C] hover:text-[#B01030]">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
