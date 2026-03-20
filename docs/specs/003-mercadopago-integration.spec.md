# SPEC-003: Mercado Pago Integration - Checkout & Webhooks

## Metadata
- **Spec ID:** 003
- **Module:** Payment Integration
- **Status:** READY FOR IMPLEMENTATION
- **Dependencies:** SPEC-001 (DB), SPEC-002 (Pricing)
- **Author:** Lead Software Engineer
- **Date:** 2024-01-15

---

## 1. Overview

**Estado:** READY FOR IMPLEMENTATION  
**Prioridad:** Crítica (Financiera)  
**Dependencias:** SPEC-001 (DB), SPEC-002 (Pricing)

Implementar el flujo de pago: desde la creación de la "Preferencia" hasta la confirmación vía Webhook (IPN), asegurando que el estado de la propina en la DB pase de `INITIATED` a `PAID`.

---

## 2. Fórmula Financiera

```
P (gross_amount) = N (net_amount) + C (commission_amount)
     100%         =    92%      +     8%

C = P × 0.08
N = P - C
```

---

## 3. Flujo de Implementación (SDD)

```
Frontend ──→ POST /api/checkout ──→ CheckoutService
                                        │
                                        ├── PricingService.calculate()
                                        ├── prisma.tip.create()
                                        ├── mp.preferences.create()
                                        └── Response: init_point

Mercado Pago ──→ POST /api/webhooks/mp ──→ HMAC Middleware
                                                     │
                                                     ├── verifyHMAC() ← CRÍTICO
                                                     │
                                                     └── webhookController
                                                           │
                                                           ├── updateMany (idempotencia)
                                                           ├── AuditLog
                                                           └── n8n notification
```

### 3.1 Checkout Flow

1. Validar input con Zod (`amount`, `employeeId`)
2. Obtener employee de DB para obtener `mp_collector_id`
3. Llamar `PricingService.calculate({ grossAmount: amount })`
4. Crear tip en DB con `status: INITIATED`
5. Crear preferencia en MP con `external_reference = tip.id`
6. Devolver `init_point` al frontend

### 3.2 Webhook Flow

1. Obtener raw body y headers (`x-signature`)
2. `HMAC.verify(payload, signature, WEBHOOK_SECRET)` ← SIEMPRE PRIMERO
3. Parsear `topic` y `resource.id`
4. `updateMany` condicional: `status NOT IN ['PAID', 'CANCELLED', 'FAILED']`
5. Si `count === 0` → ya procesado, ignorar
6. Si success → crear AuditLog
7. Notificar a n8n (`tip.paid`)

---

## 4. Componentes Técnicos

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| CheckoutService | `apps/api/src/services/checkout.service.ts` | Lógica de preferencia MP |
| WebhookController | `apps/api/src/controllers/webhook.controller.ts` | Handler del webhook |
| HMACMiddleware | `apps/api/src/middlewares/hmac.middleware.ts` | Validación HMAC-SHA256 |
| WebhookRoutes | `apps/api/src/routes/webhook.routes.ts` | Rutas del webhook |

---

## 5. Seguridad (Guardian Angel Focus) 🛡️

### 5.1 HMAC Validation (CRÍTICO)

Validar firma HMAC-SHA256 **antes** de procesar cualquier cambio de estado:

```typescript
import crypto from 'crypto';

function verifyMercadoPagoSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}
```

### 5.2 Idempotencia (Anti Race Condition)

```typescript
// ❌ NO USAR: update directo
await prisma.tip.update({
  where: { id: tipId },
  data: { status: 'paid' }
});

// ✅ USAR: updateMany condicional
const result = await prisma.tip.updateMany({
  where: {
    id: tipId,
    status: { notIn: ['PAID', 'CANCELLED', 'FAILED'] }
  },
  data: { status: 'PAID', paid_at: new Date() }
});

if (result.count === 0) {
  return { processed: false, reason: 'duplicate_or_invalid' };
}
```

### 5.3 Validaciones Post-Pago

- Verificar que el monto pagado coincida con `gross_amount`
- Actualizar status solo si el pago en MP está aprobado
- Crear registros en `tip_splits` si hay distribución entre empleados

---

## 6. Contrato de Datos (Zod)

### 6.1 Checkout Input

```typescript
const CheckoutInputSchema = z.object({
  employeeId: UUIDSchema,
  grossAmount: MoneySchema,
  customerEmail: EmailSchema.optional().nullable(),
  comment: z.string().max(500).optional(),
  rating: RatingSchema,
});
```

### 6.2 Checkout Response

```typescript
const CheckoutResponseSchema = z.object({
  tipId: UUIDSchema,
  initPoint: z.string().url(),
  externalReference: UUIDSchema,
});
```

---

## 7. Tests (The Shield / Vitest)

| Test | Descripción |
|------|-------------|
| `should create checkout preference` | Verifica que se crea la preferencia MP |
| `should validate HMAC signature` | Verifica que rechaza requests sin firma válida |
| `should handle duplicate webhooks` | Verifica idempotencia con updateMany |
| `should update tip status on payment` | Verifica transición INITIATED → PAID |
| `should reject invalid amounts` | Verifica validación con Zod |

---

## 8. Definición de Hecho (DoD)

- [ ] `apps/api/src/services/checkout.service.ts` creado
- [ ] `apps/api/src/controllers/webhook.controller.ts` creado
- [ ] `apps/api/src/middlewares/hmac.middleware.ts` creado
- [ ] Endpoint de checkout genera URL válida de Mercado Pago
- [ ] Webhook actualiza el estado en PostgreSQL correctamente
- [ ] HMAC validation implementada
- [ ] Idempotencia con `updateMany` implementada
- [ ] AuditLog registra el cambio de estado
- [ ] Suite de tests con cobertura del 100%

---

## 9. Archivos a Crear

| Archivo | Descripción |
|---------|-------------|
| `apps/api/src/services/checkout.service.ts` | CheckoutService con lógica de preferencia MP |
| `apps/api/src/controllers/webhook.controller.ts` | Webhook handler con validación HMAC |
| `apps/api/src/middlewares/hmac.middleware.ts` | Middleware de validación HMAC-SHA256 |
| `apps/api/src/routes/webhook.routes.ts` | Rutas del webhook |
| `apps/api/src/__tests__/checkout.service.test.ts` | Tests del checkout service |
| `apps/api/src/__tests__/webhook.controller.test.ts` | Tests del webhook |
