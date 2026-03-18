/**
 * PropinanDO - Transaction Schemas with Zod
 * 
 * This module defines Zod schemas for transaction validation.
 * Implements Branded Types for monetary amounts to ensure type safety.
 * 
 * Modelo Financiero: P = N + C (8% comisión)
 * - P (gross_amount): Monto bruto
 * - C (commission_amount): Comisión (8%)
 * - N (net_amount): Neto empleado (92%)
 */

import { z } from 'zod';

// =============================================================================
// BRANDED TYPES (Type Safety for Domain Values)
// =============================================================================

type Brand<T, B> = T & { readonly [K in symbol]: B };

type UUID = Brand<string, 'UUID'>;
type Email = Brand<string, 'Email'>;
type Money = Brand<number, 'Money'>;
type MoneyInCents = Brand<number, 'MoneyInCents'>;
type Percentage = Brand<number, 'Percentage'>;
type Slug = Brand<string, 'Slug'>;

// =============================================================================
// UUID SCHEMA
// =============================================================================

export const UUIDSchema = z.string().uuid('ID debe ser un UUID válido');

export type UUIDInput = z.infer<typeof UUIDSchema>;
export type UUIDOutput = UUID;

// =============================================================================
// EMAIL SCHEMA
// =============================================================================

export const EmailSchema = z
  .string()
  .email('Email inválido')
  .transform<Email>((val) => val as Email);

export type EmailInput = z.infer<typeof EmailSchema>;
export type EmailOutput = Email;

// =============================================================================
// SLUG SCHEMA
// =============================================================================

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const SlugSchema = z
  .string()
  .min(1, 'Slug no puede estar vacío')
  .max(100, 'Slug debe tener máximo 100 caracteres')
  .regex(slugRegex, 'Slug debe contener solo letras minúsculas, números y guiones')
  .transform<Slug>((val) => val as Slug);

export type SlugInput = z.infer<typeof SlugSchema>;
export type SlugOutput = Slug;

// =============================================================================
// MONEY SCHEMAS (Branded Types)
// =============================================================================

/**
 * Money schema - validates positive numbers for monetary values
 */
export const MoneySchema = z
  .number()
  .positive('El monto debe ser mayor a 0')
  .finite('El monto debe ser un número finito')
  .max(9999999999.99, 'El monto máximo es 9,999,999,999.99')
  .transform<Money>((val) => Math.round(val * 100) / 100 as Money);

export type MoneyInput = z.infer<typeof MoneySchema>;
export type MoneyOutput = Money;

/**
 * Money in cents schema - validates integer amounts in cents (for Mercado Pago)
 */
export const MoneyInCentsSchema = z
  .number()
  .int('El monto en centavos debe ser un entero')
  .positive('El monto debe ser mayor a 0')
  .max(999999999999, 'El monto máximo en centavos es 999,999,999,999')
  .transform<MoneyInCents>((val) => val as MoneyInCents);

export type MoneyInCentsInput = z.infer<typeof MoneyInCentsSchema>;
export type MoneyInCentsOutput = MoneyInCents;

// =============================================================================
// PERCENTAGE SCHEMA
// =============================================================================

export const PercentageSchema = z
  .number()
  .min(0, 'El porcentaje no puede ser menor a 0')
  .max(100, 'El porcentaje no puede ser mayor a 100')
  .transform<Percentage>((val) => val as Percentage);

export type PercentageInput = z.infer<typeof PercentageSchema>;
export type PercentageOutput = Percentage;

// =============================================================================
// COMMISSION RATE SCHEMA (0.0000 - 1.0000)
// =============================================================================

export const CommissionRateSchema = z
  .number()
  .min(0, 'La tasa de comisión no puede ser menor a 0')
  .max(1, 'La tasa de comisión no puede ser mayor a 1')
  .refine((val) => val.toString().length <= 6, 'Máximo 4 decimales')
  .transform<Percentage>((val) => val as Percentage);

export type CommissionRateInput = z.infer<typeof CommissionRateSchema>;
export type CommissionRateOutput = Percentage;

// =============================================================================
// RATING SCHEMA (1-5)
// =============================================================================

export const RatingSchema = z
  .number()
  .int('La calificación debe ser un número entero')
  .min(1, 'La calificación mínima es 1')
  .max(5, 'La calificación máxima es 5')
  .optional()
  .nullable();

export type RatingInput = z.infer<typeof RatingSchema>;
export type RatingOutput = z.infer<typeof RatingSchema>;

// =============================================================================
// ENUMS
// =============================================================================

export const UserRoleSchema = z.enum(['SYSTEM_OWNER', 'STORE_ADMIN', 'EMPLOYEE', 'CUSTOMER']);
export type UserRoleInput = z.infer<typeof UserRoleSchema>;
export type UserRoleOutput = z.infer<typeof UserRoleSchema>;

export const SplitModeSchema = z.enum(['equal', 'percentage', 'manual']);
export type SplitModeInput = z.infer<typeof SplitModeSchema>;
export type SplitModeOutput = z.infer<typeof SplitModeSchema>;

export const TipStatusSchema = z.enum(['INITIATED', 'PAID', 'CANCELLED', 'FAILED']);
export type TipStatusInput = z.infer<typeof TipStatusSchema>;
export type TipStatusOutput = z.infer<typeof TipStatusSchema>;

// =============================================================================
// TIP AMOUNTS SCHEMA (P = N + C)
// =============================================================================

const COMMISSION_RATE = 0.08;
const COMMISSION_MULTIPLIER = 1 - COMMISSION_RATE;
const CENTS_MULTIPLIER = 100;

/**
 * Convierte pesos a centavos (integer)
 * Usa el mismo algoritmo que PricingService
 */
export function toCents(pesos: number): number {
  return Math.round(pesos * CENTS_MULTIPLIER);
}

/**
 * Convierte centavos a pesos con 2 decimales
 */
export function toPesos(cents: number): Money {
  return (cents / CENTS_MULTIPLIER) as Money;
}

/**
 * Calcula la comisión redondeando hacia ARRIBA (Math.ceil)
 * Para evitar perder dinero, la comisión siempre se redondea hacia arriba
 * Usa el mismo algoritmo que PricingService
 */
export function calculateCommissionCents(grossAmountCents: number): number {
  return Math.ceil(grossAmountCents * COMMISSION_RATE);
}

/**
 * Calcula el neto en centavos
 */
export function calculateNetCents(grossAmountCents: number, commissionCents: number): number {
  return grossAmountCents - commissionCents;
}

export const TipAmountsSchema = z
  .object({
    grossAmount: MoneySchema,
    commissionRate: CommissionRateSchema.optional().default(COMMISSION_RATE as PercentageOutput),
    commissionAmount: MoneySchema.optional(),
    netAmount: MoneySchema.optional(),
  })
  .strict()
  .refine(
    (data) => {
      const { grossAmount, commissionAmount, netAmount } = data;
      
      if (commissionAmount !== undefined && netAmount !== undefined) {
        return Math.abs(grossAmount - (commissionAmount + netAmount)) < 0.01;
      }
      
      if (commissionAmount !== undefined && netAmount === undefined) {
        const net = grossAmount - commissionAmount;
        return net >= 0;
      }
      
      if (netAmount !== undefined && commissionAmount === undefined) {
        const commission = grossAmount - netAmount;
        return commission >= 0;
      }
      
      return true;
    },
    {
      message: 'gross_amount debe ser igual a commission_amount + net_amount',
      path: ['grossAmount'],
    }
  )
  .transform((data) => {
    const grossAmount = data.grossAmount;
    const commissionRate = data.commissionRate ?? (COMMISSION_RATE as PercentageOutput);
    
    // Usar algoritmo de centavos para consistencia con PricingService
    const grossAmountCents = toCents(grossAmount);
    const commissionAmountCents = calculateCommissionCents(grossAmountCents);
    const netAmountCents = calculateNetCents(grossAmountCents, commissionAmountCents);
    
    return {
      grossAmount,
      commissionRate,
      commissionAmount: toPesos(commissionAmountCents),
      netAmount: toPesos(netAmountCents),
    };
  });

export type TipAmountsInput = z.infer<typeof TipAmountsSchema>;
export type TipAmountsOutput = {
  grossAmount: MoneyOutput;
  commissionRate: CommissionRateOutput;
  commissionAmount: MoneyOutput;
  netAmount: MoneyOutput;
};

// =============================================================================
// CREATE TIP SCHEMA
// =============================================================================

export const CreateTipSchema = z.object({
  venueId: UUIDSchema,
  sectorId: UUIDSchema,
  employeeId: UUIDSchema,
  amounts: TipAmountsSchema,
  rating: RatingSchema,
  comment: z.string().max(500, 'El comentario debe tener máximo 500 caracteres').optional(),
  customerEmail: EmailSchema.optional().nullable(),
  externalReference: UUIDSchema.optional(),
}).strict();

export type CreateTipInput = z.infer<typeof CreateTipSchema>;
export type CreateTipOutput = z.infer<typeof CreateTipSchema> & TipAmountsOutput;

// =============================================================================
// UPDATE TIP STATUS SCHEMA
// =============================================================================

export const UpdateTipStatusSchema = z.object({
  status: TipStatusSchema,
  mpPaymentId: z.string().optional(),
  mpStatus: z.string().optional(),
  paidAt: z.string().datetime().optional(),
}).strict();

export type UpdateTipStatusInput = z.infer<typeof UpdateTipStatusSchema>;
export type UpdateTipStatusOutput = z.infer<typeof UpdateTipStatusSchema>;

// =============================================================================
// TIP SPLIT SCHEMA
// =============================================================================

export const TipSplitSchema = z.object({
  employeeId: UUIDSchema,
  percentage: PercentageSchema,
  netAmount: MoneySchema,
}).strict();

export type TipSplitInput = z.infer<typeof TipSplitSchema>;
export type TipSplitOutput = z.infer<typeof TipSplitSchema>;

// =============================================================================
// TIP RESPONSE SCHEMA
// =============================================================================

export const TipResponseSchema = z.object({
  id: UUIDSchema,
  externalReference: z.string().uuid(),
  venueId: UUIDSchema,
  sectorId: UUIDSchema,
  employeeId: UUIDSchema,
  grossAmount: MoneySchema,
  commissionRate: CommissionRateSchema,
  commissionAmount: MoneySchema,
  netAmount: MoneySchema,
  rating: RatingSchema,
  comment: z.string().max(500).optional().nullable(),
  status: TipStatusSchema,
  mpPreferenceId: z.string().optional().nullable(),
  mpPaymentId: z.string().optional().nullable(),
  mpStatus: z.string().optional().nullable(),
  customerEmail: EmailSchema.optional().nullable(),
  paidAt: z.string().datetime().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type TipResponseInput = z.infer<typeof TipResponseSchema>;
export type TipResponseOutput = z.infer<typeof TipResponseSchema>;

// =============================================================================
// HELPER: Convert Pesos to Cents
// =============================================================================

export function pesosToCents(pesos: MoneyInput): MoneyInCentsOutput {
  return MoneyInCentsSchema.parse(Math.round(pesos * 100));
}

export function centsToPesos(cents: MoneyInCentsInput): MoneyOutput {
  return MoneySchema.parse(cents / 100);
}

// =============================================================================
// HELPER: Validate P = N + C
// =============================================================================

export function validateTipFormula(
  grossAmount: MoneyOutput,
  commissionAmount: MoneyOutput,
  netAmount: MoneyOutput
): boolean {
  return Math.abs(grossAmount - (commissionAmount + netAmount)) < 0.01;
}
