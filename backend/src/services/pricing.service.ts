/**
 * PropinanDO - PricingService
 * 
 * Servicio puro para el cálculo financiero de propinas.
 * Implementa la fórmula: P = N + C (8% comisión)
 * 
 * Precisión: Manejo en centavos (×100) para evitar errores de punto flotante.
 * Redondeo: La comisión (C) se redondea hacia arriba (ceil) en el segundo decimal.
 */

import { z } from 'zod';

// =============================================================================
// CONSTANTS
// =============================================================================

const COMMISSION_PERCENTAGE = 8;
const COMMISSION_RATE = 0.08;
const CENTS_MULTIPLIER = 100;

// =============================================================================
// BRANDED TYPES
// =============================================================================

type Brand<T, B> = T & { readonly [K in symbol]: B };
type Money = Brand<number, 'Money'>;

// =============================================================================
// ZOD SCHEMAS (Desde shared/contracts)
// =============================================================================

const MoneySchema = z
  .number()
  .positive('El monto debe ser mayor a 0')
  .finite('El monto debe ser un número finito')
  .max(9999999999.99, 'El monto máximo es 9,999,999,999.99');

const FeePercentageSchema = z.literal(8);

// =============================================================================
// PRICING RESULT SCHEMA
// =============================================================================

export const PricingResultSchema = z.object({
  grossAmount: MoneySchema,
  commissionAmount: MoneySchema,
  netAmount: MoneySchema,
  feePercentage: FeePercentageSchema,
});

export type PricingResult = z.infer<typeof PricingResultSchema>;

// =============================================================================
// INPUT SCHEMA
// =============================================================================

export const PricingInputSchema = z.object({
  grossAmount: z.number().positive('El monto bruto debe ser mayor a 0'),
});

export type PricingInput = z.infer<typeof PricingInputSchema>;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convierte pesos a centavos (integer)
 */
function toCents(pesos: number): number {
  return Math.round(pesos * CENTS_MULTIPLIER);
}

/**
 * Convierte centavos a pesos con 2 decimales
 */
function toPesos(cents: number): Money {
  return (cents / CENTS_MULTIPLIER) as Money;
}

/**
 * Redondea hacia arriba (ceil) en el segundo decimal
 */
function ceilToTwoDecimals(cents: number): number {
  return Math.ceil(cents);
}

/**
 * Calcula la comisión redondeando hacia arriba
 * Para evitar perder dinero, la comisión siempre se redondea hacia arriba
 */
function calculateCommission(grossAmountCents: number): number {
  const commissionCents = grossAmountCents * COMMISSION_RATE;
  return ceilToTwoDecimals(commissionCents);
}

// =============================================================================
// PRICING SERVICE
// =============================================================================

export class PricingService {
  /**
   * Calcula el desglose financiero de una propina
   * 
   * Fórmula: P = N + C
   * - P (gross_amount): Monto bruto que paga el cliente
   * - C (commission_amount): Comisión del 8% (redondeada hacia arriba)
   * - N (net_amount): Neto para el empleado
   * 
   * @param input - Objeto con el monto bruto
   * @returns PricingResult validado con Zod
   * 
   * @throws ZodError si el monto es inválido
   */
  static calculate(input: PricingInput): PricingResult {
    const validatedInput = PricingInputSchema.parse(input);
    
    const grossAmountCents = toCents(validatedInput.grossAmount);
    
    if (grossAmountCents <= 0) {
      throw new Error('Gross amount must be greater than 0');
    }
    
    const commissionAmountCents = calculateCommission(grossAmountCents);
    const netAmountCents = grossAmountCents - commissionAmountCents;
    
    const result = {
      grossAmount: toPesos(grossAmountCents),
      commissionAmount: toPesos(commissionAmountCents),
      netAmount: toPesos(netAmountCents),
      feePercentage: COMMISSION_PERCENTAGE,
    };
    
    return PricingResultSchema.parse(result);
  }
  
  /**
   * Versión síncrona que retorna el resultado directamente
   * Útil para cálculos batch
   */
  static calculateSync(grossAmount: number): PricingResult {
    return this.calculate({ grossAmount });
  }
  
  /**
   * Valida si un resultado cumple con la fórmula P = N + C
   * Tolerancia de 0.01 para errores de redondeo
   */
  static validateFormula(result: PricingResult): boolean {
    const total = result.commissionAmount + result.netAmount;
    return Math.abs(result.grossAmount - total) < 0.01;
  }
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default PricingService;
