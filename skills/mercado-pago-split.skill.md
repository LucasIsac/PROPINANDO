# Skill: Mercado Pago Split Payment (PropinanDO Standard)

## Contexto
Esta skill rige la creación de preferencias de pago y la división de fondos entre Empleado y Plataforma para cumplir con el modelo financiero de PropinanDO.

## Fórmula Financiera (OBLIGATORIA)

```
C = P × 0.08
N = P - C

Donde:
- P = gross_amount (Monto Bruto)
- C = commission_amount (Comisión Plataforma = 8%)
- N = net_amount (Neto Empleado = 92%)
```

**Validación requerida:** `N + C === P` antes de llamar al SDK.

## Instrucciones de Ejecución

### 1. Cálculo de Fondos
- Siempre calcular la Comisión (C) como: `gross_amount * 0.08`
- Siempre calcular el Neto (N) como: `gross_amount - commission_amount`
- Validar que `net_amount + commission_amount === gross_amount` antes de llamar al SDK
- **Montos en centavos:** El SDK de Mercado Pago requiere montos en integer (cents)

### 2. Anti Race Condition (CRÍTICO)
Para evitar condiciones de carrera en webhooks:

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
    status: { notIn: ['paid', 'cancelled', 'failed'] }
  },
  data: { status: 'paid', paid_at: new Date() }
});

if (result.count === 0) {
  // Ya estaba procesado o no existe
  return { processed: false, reason: 'duplicate_or_invalid' };
}
```

### 3. Seguridad de Webhooks (HMAC-SHA256)

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

**Flujo de webhook:**
1. Validar firma HMAC
2. Verificar idempotencia (external_reference no procesado)
3. Ejecutar updateMany condicional
4. Si es `payment.paid`, ejecutar distribución de fondos

### 4. Configuración del Marketplace
- La transacción DEBE usar el modelo de `application_fee`
- El `collector_id` debe ser el ID de Mercado Pago del Empleado obtenido mediante OAuth
- El `external_reference` debe ser un UUID v4 generado en el backend y guardado en PostgreSQL

## Capacidades
- Conocimiento de los endpoints de `/checkout/preferences` de Mercado Pago Argentina
- Gestión de tokens OAuth para vendedores (empleados)
- Implementación de split payment con `application_fee`

## Validaciones Post-Pago
- Verificar que el monto pagado coincida con el gross_amount
- Actualizar status solo si el pago en MP está aprobado
- Crear registros en `tip_splits` si hay distribución entre empleados
