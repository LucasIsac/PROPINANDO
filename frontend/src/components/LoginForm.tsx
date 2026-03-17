'use client';

import { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { LoginSchema, type LoginInput } from '@/schemas/login.schema';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const formData = new FormData(e.currentTarget);
    const data: LoginInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = LoginSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const result = await response.json();
      console.log('Login exitoso:', result);
      window.location.href = '/dashboard';
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC143C] focus:border-transparent transition-colors"
            placeholder="tu@email.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC143C] focus:border-transparent transition-colors"
            placeholder="••••••••"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium bg-[#DC143C] hover:bg-[#B01030] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC143C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  );
}
