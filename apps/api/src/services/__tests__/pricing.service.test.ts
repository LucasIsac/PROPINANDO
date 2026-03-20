/**
 * PropinanDO - PricingService Tests
 * 
 * Test suite para el servicio de cálculo financiero de propinas.
 * Cobertura: 100% de los casos definidos en SPEC-002
 * 
 * Casos de prueba:
 * 1. Monto Exacto: $1000 → C=80, N=920
 * 2. Monto con Decimales: $1250.50 → C=100.04, N=1150.46
 * 3. Monto Mínimo: $1.00 → C=0.08, N=0.92
 * 4. Validación de Error: Montos ≤ 0 deben disparar excepción
 */

import { describe, it, expect } from 'vitest';
import { PricingService, PricingInputSchema } from '../pricing.service';

describe('PricingService', () => {
  describe('calculate', () => {
    describe('Caso 1: Monto Exacto', () => {
      it('debe calcular correctamente $1000 → C=80, N=920', () => {
        const result = PricingService.calculate({ grossAmount: 1000 });
        
        expect(result.grossAmount).toBe(1000);
        expect(result.commissionAmount).toBe(80);
        expect(result.netAmount).toBe(920);
        expect(result.feePercentage).toBe(8);
      });
    });

    describe('Caso 2: Monto con Decimales', () => {
      it('debe calcular correctamente $1250.50 → C=100.04, N=1150.46', () => {
        const result = PricingService.calculate({ grossAmount: 1250.50 });
        
        expect(result.grossAmount).toBe(1250.5);
        expect(result.commissionAmount).toBe(100.04);
        expect(result.netAmount).toBe(1150.46);
        expect(result.feePercentage).toBe(8);
      });
    });

    describe('Caso 3: Monto Mínimo', () => {
      it('debe calcular correctamente $1.00 → C=0.08, N=0.92', () => {
        const result = PricingService.calculate({ grossAmount: 1.00 });
        
        expect(result.grossAmount).toBe(1);
        expect(result.commissionAmount).toBe(0.08);
        expect(result.netAmount).toBe(0.92);
        expect(result.feePercentage).toBe(8);
      });
    });

    describe('Caso 4: Validación de Error', () => {
      it('debe rechazar monto igual a 0', () => {
        expect(() => {
          PricingService.calculate({ grossAmount: 0 });
        }).toThrow();
      });

      it('debe rechazar monto negativo', () => {
        expect(() => {
          PricingService.calculate({ grossAmount: -100 });
        }).toThrow();
      });

      it('debe rechazar monto string vacío a través de schema', () => {
        expect(() => {
          PricingInputSchema.parse({ grossAmount: 0 });
        }).toThrow();
      });
    });

    describe('Casos adicionales de precisión', () => {
      it('debe manejar montos pequeños correctamente', () => {
        const result = PricingService.calculate({ grossAmount: 0.50 });
        
        expect(result.grossAmount).toBe(0.5);
        expect(result.commissionAmount).toBe(0.04);
        expect(result.netAmount).toBe(0.46);
      });

      it('debe manejar montos grandes correctamente', () => {
        const result = PricingService.calculate({ grossAmount: 999999.99 });
        
        expect(result.grossAmount).toBe(999999.99);
        expect(result.commissionAmount).toBe(80000);
        expect(result.netAmount).toBe(919999.99);
      });

      it('debe aplicar Math.ceil al segundo decimal de la comisión', () => {
        // 123.45 * 0.08 = 9.876 → ceil → 9.88
        const result = PricingService.calculate({ grossAmount: 123.45 });
        
        expect(result.commissionAmount).toBe(9.88);
        expect(result.netAmount).toBe(113.57);
      });
    });
  });

  describe('calculateSync', () => {
    it('debe retornar el mismo resultado que calculate', () => {
      const input = 1000;
      
      const syncResult = PricingService.calculateSync(input);
      const asyncResult = PricingService.calculate({ grossAmount: input });
      
      expect(syncResult).toEqual(asyncResult);
    });
  });

  describe('validateFormula', () => {
    it('debe retornar true para resultados válidos', () => {
      const result = PricingService.calculate({ grossAmount: 1000 });
      
      expect(PricingService.validateFormula(result)).toBe(true);
    });

    it('debe validar que P = N + C (con tolerancia de 0.01)', () => {
      const result = PricingService.calculate({ grossAmount: 1250.50 });
      
      const total = result.commissionAmount + result.netAmount;
      const difference = Math.abs(result.grossAmount - total);
      
      expect(difference).toBeLessThan(0.01);
    });
  });

  describe('Esquema Zod', () => {
    it('debe validar inputs positivos', () => {
      const validInput = { grossAmount: 100 };
      const result = PricingInputSchema.safeParse(validInput);
      
      expect(result.success).toBe(true);
    });

    it('debe rechazar inputs no numéricos', () => {
      const invalidInput = { grossAmount: 'cien' };
      const result = PricingInputSchema.safeParse(invalidInput);
      
      expect(result.success).toBe(false);
    });

    it('debe rechazar valores no numéricos', () => {
      const invalidInput = { grossAmount: NaN };
      const result = PricingInputSchema.safeParse(invalidInput);
      
      expect(result.success).toBe(false);
    });
  });
});
