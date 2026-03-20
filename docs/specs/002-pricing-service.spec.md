# SPEC-002: PricingService - Lógica de Negocio

## Metadata
- **Spec ID:** 002
- **Module:** Business Logic
- **Status:** IMPLEMENTED ✅
- **Author:** Lead Software Engineer
- **Date:** 2024-01-15

---

## 1. Overview

**Estado:** READY FOR IMPLEMENTATION  
**Prioridad:** Crítica (Financiera)  
**Relación:** Cubre la lógica de negocio para la fórmula `P = N + C`

El PricingService es una clase pura (Stateless) encargada de realizar el desglose financiero de una propina antes de que esta sea enviada a Mercado Pago o registrada en la base de datos.

---

## 2. Reglas de Cálculo Estrictas

### Comisión PropinanDO (C)
- 8% del monto bruto (P)

### Neto Empleado (N)
- El resto del monto: `P - C`

### Precisión
- Se deben manejar 2 decimales
- Para evitar que el sistema pierda dinero, la comisión (C) se redondeará usando **Math.ceil** (hacia arriba) en el segundo decimal
- Alternativa: cálculo de "centavos" (multiplicar por 100, calcular, y dividir por 100)

---

## 3. Contrato de Datos (Zod)

El servicio debe devolver un objeto validado que garantice la integridad:

```typescript
const PricingResultSchema = z.object({
  grossAmount: MoneySchema,        // P (Lo que paga el cliente)
  commissionAmount: MoneySchema,   // C (El 8% para PropinanDO)
  netAmount: MoneySchema,          // N (Lo que recibe el empleado)
  feePercentage: z.literal(8),     // Constante
});
```

---

## 4. Casos de Prueba (The Shield / Vitest)

Para que la implementación se considere exitosa, debe pasar estos tests:

| Test | Input | Expected Output | Estado |
|------|-------|-----------------|--------|
| Monto Exacto | $1000 | C=80, N=920 | ✅ Implementado |
| Monto con Decimales | $1250.50 | C=100.04, N=1150.46 | ✅ Implementado |
| Monto Mínimo | $1.00 | C=0.08, N=0.92 | ✅ Implementado |
| Validación de Error | Montos ≤ 0 | Excepción Zod | ✅ Implementado |

---

## 5. Definición de Hecho (DoD)

- [x] Archivo `apps/api/src/services/pricing.service.ts` creado
- [x] Suite de tests `apps/api/src/services/__tests__/pricing.service.test.ts` con cobertura del 100%
- [x] Uso de Branded Types para todos los montos devueltos

---

## 6. Implementación

### Fórmula
```
P = N + C
C = P × 0.08
N = P - C
```

### Algoritmo (Centavos)
```typescript
// 1. Convertir a centavos
const cents = Math.round(pesos * 100);

// 2. Calcular comisión con Math.ceil
const commissionCents = Math.ceil(cents * 0.08);

// 3. Calcular neto
const netCents = cents - commissionCents;

// 4. Convertir a pesos
const commission = commissionCents / 100;
const net = netCents / 100;
```

### Resultados de Tests
```
✓ 15 tests passed
✓ 1 test file passed
✓ Coverage: 95.65% statements
```

---

## 7. Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `apps/api/src/services/pricing.service.ts` | PricingService con lógica P = N + C |
| `apps/api/src/services/__tests__/pricing.service.test.ts` | Suite de tests Vitest |
| `apps/api/vitest.config.ts` | Configuración de Vitest |
| `shared/contracts/transaction.schema.ts` | Zod schemas con Branded Types |

---

## 8. Code Review - Guardian Angel

### Verificación Zero-Any Policy
| Archivo | Tipos `any` | Estado |
|---------|-------------|--------|
| `backend/prisma/schema.prisma` | 0 | ✅ APROBADO |
| `shared/contracts/transaction.schema.ts` | 0 | ✅ APROBADO |

### Consistencia de Algoritmo
| Componente | Algoritmo | Estado |
|------------|-----------|--------|
| PricingService | `Math.ceil` en centavos | ✅ CONSISTENTE |
| TipAmountsSchema | `Math.ceil` en centavos | ✅ CORREGIDO |

### Correcciones Aplicadas
- ✅ `TipAmountsSchema` ahora usa el mismo algoritmo de centavos que `PricingService`
- ✅ Validación refine mejorada para cubrir todos los casos de `commissionAmount` y `netAmount`
- ✅ Funciones auxiliares exportadas (`toCents`, `toPesos`, `calculateCommissionCents`, `calculateNetCents`)

### Estado Final: ✅ APROBADO
