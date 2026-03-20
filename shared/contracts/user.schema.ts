import { z } from 'zod';
import { UUIDSchema, EmailSchema } from './transaction.schema.js';

export const UserRoleSchema = z.enum(['SUPER_ADMIN', 'STORE_ADMIN', 'EMPLOYEE']);
export type UserRoleInput = z.infer<typeof UserRoleSchema>;
export type UserRoleOutput = z.infer<typeof UserRoleSchema>;

export const CreateUserSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña debe tener máximo 100 caracteres'),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre debe tener máximo 100 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido debe tener máximo 100 caracteres'),
  phone: z.string().max(20).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CreateUserOutput = z.infer<typeof CreateUserSchema>;

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const UserResponseSchema = z.object({
  id: UUIDSchema,
  email: EmailSchema,
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  photoUrl: z.string().nullable(),
  role: UserRoleSchema,
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserResponseOutput = z.infer<typeof UserResponseSchema>;

export const RefreshTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.string().datetime(),
});

export type RefreshTokenOutput = z.infer<typeof RefreshTokenSchema>;
