'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, User, Mail, Phone, CreditCard, Lock, Info } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/schemas/register.schema';
import { FormInput, Button } from '@/components/ui';
import { RoleSelector } from '@/components/RoleSelector';
import { PhotoUpload } from '@/components/PhotoUpload';

interface RegisterFormProps {
  onComplete: (data: RegisterFormData, fotoUrl: string) => void;
}

export function RegisterForm({ onComplete }: RegisterFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      cbu: '',
      password: '',
      confirmPassword: '',
      sector: undefined,
    },
  });

  const watchedData = watch();

  const handleNext = async () => {
    const fieldsToValidate: (keyof RegisterFormData)[] = [
      'nombre', 'apellido', 'dni', 'email', 'telefono', 'cbu', 'password', 'confirmPassword', 'sector',
    ];
    const result = await trigger(fieldsToValidate);
    if (result) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!fotoUrl) {
      return;
    }
    onComplete(data, fotoUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Paso 1: Datos Personales */}
      {step === 1 && (
        <>
          <FormInput
            {...register('nombre')}
            label="Nombre completo"
            placeholder="Ej. Juan"
            icon={<User size={20} />}
            error={errors.nombre?.message}
            autoComplete="given-name"
            autoFocus
          />

          <FormInput
            {...register('apellido')}
            label="Apellido"
            placeholder="Ej. Pérez"
            icon={<User size={20} />}
            error={errors.apellido?.message}
            autoComplete="family-name"
          />

          <FormInput
            {...register('dni')}
            label="DNI"
            placeholder="Ej. 12345678"
            icon={<Info size={20} />}
            error={errors.dni?.message}
            autoComplete="off"
            inputMode="numeric"
            maxLength={8}
          />

          <FormInput
            {...register('email')}
            label="Correo electrónico"
            placeholder="tu@email.com"
            type="email"
            icon={<Mail size={20} />}
            error={errors.email?.message}
            autoComplete="email"
          />

          <FormInput
            {...register('telefono')}
            label="Teléfono"
            placeholder="Ej. 1134567890"
            type="tel"
            icon={<Phone size={20} />}
            error={errors.telefono?.message}
            autoComplete="tel"
            inputMode="tel"
          />

          <FormInput
            {...register('cbu')}
            label="CBU o Alias"
            placeholder="00000031000... o mi.alias"
            icon={<CreditCard size={20} />}
            error={errors.cbu?.message}
            autoComplete="off"
            helperText="CBU de 22 dígitos o Alias de tu banco"
          />

          <div className="relative">
            <FormInput
              {...register('password')}
              label="Contraseña"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock size={20} />}
              error={errors.password?.message}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <FormInput
              {...register('confirmPassword')}
              label="Confirmar contraseña"
              placeholder="••••••••"
              type={showConfirmPassword ? 'text' : 'password'}
              icon={<Lock size={20} />}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-9 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <RoleSelector
            value={watchedData.sector}
            onChange={(value) => setValue('sector', value)}
            error={errors.sector?.message}
          />

          <div className="pt-4">
            <Button type="button" onClick={handleNext} fullWidth>
              Continuar
            </Button>
          </div>
        </>
      )}

      {/* Paso 2: Foto de Perfil */}
      {step === 2 && (
        <>
          <div className="flex flex-col items-center py-8">
            <PhotoUpload
              onCapture={(url: string) => setFotoUrl(url)}
              onError={(errorMsg: string) => console.error(errorMsg)}
            />
            <p className="text-sm text-gray-500 mt-4 text-center">
              Sube una foto clara de tu rostro para que los clientes te identifiquen
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              Volver
            </Button>
            <Button
              type="submit"
              disabled={!fotoUrl || isSubmitting}
              loading={isSubmitting}
            >
              {fotoUrl ? 'Continuar' : 'Sube tu foto primero'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
