'use client';

import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
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

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="relative w-full max-w-[60%] mx-auto aspect-[3/1]">
            <Image
              src="/images/logo/PROPINANDO.png"
              alt="PROPINANDO"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="mt-4 text-sm text-[#4B5563]">
            Gestiona tus propinas digitales
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <LoginForm />
        </div>

        <div className="text-center">
          <p className="text-sm text-[#6B7280]">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="font-medium text-[#DC143C] hover:text-[#B01030]">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
