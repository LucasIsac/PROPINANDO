import { z } from 'zod';
import { UUIDSchema, PercentageSchema, MoneySchema } from './transaction.schema.js';

export const VerificationStatusSchema = z.enum(['PENDIENTE', 'APROBADO', 'RECHAZADO']);
export type VerificationStatusInput = z.infer<typeof VerificationStatusSchema>;
export type VerificationStatusOutput = z.infer<typeof VerificationStatusSchema>;

export const CreateEmployeeSchema = z.object({
  email: z.string().email('Email inválido'),
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
  dni: z
    .string()
    .regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 dígitos'),
  venueId: UUIDSchema.optional(),
  invitationToken: z.string().optional(),
});

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;

export const EmployeeResponseSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  venueId: UUIDSchema,
  sectorId: UUIDSchema.nullable(),
  displayName: z.string(),
  photoUrl: z.string().nullable(),
  splitPercentage: PercentageSchema.nullable(),
  qrPersonalToken: z.string(),
  verificationStatus: VerificationStatusSchema,
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EmployeeResponseOutput = z.infer<typeof EmployeeResponseSchema>;

export const EmployeeWithUserSchema = EmployeeResponseSchema.extend({
  user: z.object({
    id: UUIDSchema,
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    photoUrl: z.string().nullable(),
    role: z.enum(['SUPER_ADMIN', 'STORE_ADMIN', 'EMPLOYEE']),
  }),
  venue: z.object({
    id: UUIDSchema,
    name: z.string(),
    slug: z.string().nullable(),
  }).nullable(),
  sector: z.object({
    id: UUIDSchema,
    name: z.string(),
  }).nullable(),
});

export type EmployeeWithUserOutput = z.infer<typeof EmployeeWithUserSchema>;

export const LinkToVenueSchema = z.object({
  invitationToken: z.string().min(1, 'El token de invitación es requerido'),
});

export type LinkToVenueInput = z.infer<typeof LinkToVenueSchema>;

export const SetSectorSchema = z.object({
  sectorId: UUIDSchema,
});

export type SetSectorInput = z.infer<typeof SetSectorSchema>;

export const DashboardResponseSchema = z.object({
  employeeId: UUIDSchema,
  today: z.object({
    grossAmount: MoneySchema,
    netAmount: MoneySchema,
    tipsCount: z.number().int().nonnegative(),
  }),
  month: z.object({
    grossAmount: MoneySchema,
    netAmount: MoneySchema,
    tipsCount: z.number().int().nonnegative(),
  }),
  allTime: z.object({
    grossAmount: MoneySchema,
    netAmount: MoneySchema,
    tipsCount: z.number().int().nonnegative(),
  }),
});

export type DashboardResponseOutput = z.infer<typeof DashboardResponseSchema>;

export const TipDetailResponseSchema = z.object({
  id: UUIDSchema,
  grossAmount: MoneySchema,
  commissionAmount: MoneySchema,
  netAmount: MoneySchema,
  rating: z.number().int().min(1).max(5).nullable(),
  comment: z.string().nullable(),
  status: z.enum(['INICIADO', 'PAGADO', 'CANCELADO', 'FALLIDO', 'EXPIRADO', 'REEMBOLSADO']),
  createdAt: z.string().datetime(),
  paidAt: z.string().datetime().nullable(),
  venue: z.object({
    id: UUIDSchema,
    name: z.string(),
  }),
  sector: z.object({
    id: UUIDSchema,
    name: z.string(),
  }).nullable(),
  splits: z.array(z.object({
    employeeId: UUIDSchema,
    employeeName: z.string(),
    amount: MoneySchema,
  })),
});

export type TipDetailResponseOutput = z.infer<typeof TipDetailResponseSchema>;
