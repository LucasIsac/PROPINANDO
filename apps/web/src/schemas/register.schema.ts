import { z } from 'zod';

export const sectorEnum = z.enum(['MOZO', 'COCINA', 'BARRA', 'DELIVERY', 'CAJA']);

export type Sector = z.infer<typeof sectorEnum>;

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'Mínimo 2 caracteres')
      .max(50, 'Máximo 50 caracteres'),
    apellido: z
      .string()
      .min(2, 'Mínimo 2 caracteres')
      .max(50, 'Máximo 50 caracteres'),
    dni: z
      .string()
      .length(8, 'DNI debe tener 8 dígitos')
      .regex(/^\d+$/, 'Solo números'),
    email: z.string().email('Email inválido'),
    telefono: z
      .string()
      .min(10, 'Mínimo 10 dígitos')
      .max(15, 'Máximo 15 dígitos'),
    cbu: z
      .string()
      .refine(
        (val) => /^\d{22}$/.test(val) || (val.length >= 6 && val.length <= 20),
        'CBU inválido (22 dígitos) o Alias (6-20 caracteres)'
      ),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número'),
    confirmPassword: z.string(),
    sector: sectorEnum,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
