# 📄 ESPECIFICACIÓN TÉCNICA: PROPINANDO (MVP)
**Versión:** 1.0.0 | **Estado:** Referencia para Desarrollo con IA | **Database:** PostgreSQL

---

## 1. CONTEXTO Y PROPUESTA DE VALOR
- **Misión:** Gestión y transferencia directa de propinas mediante QR.
- **Diferenciador:** Transferencia inmediata al CBU/CVU (Split Payment) y transparencia total vía Dashboards.
- **Automatización:** n8n para flujos de notificación y reportería.

## 2. ARQUITECTURA Y STACK (SSOT)
Cualquier propuesta de código debe respetar estrictamente este stack:
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS.
- **Backend:** Node.js + Express (Arquitectura por Capas/Clean Architecture).
- **Persistence:** PostgreSQL (vía Prisma ORM).
- **Pagos:** Mercado Pago SDK (Argentina) - Modo Marketplace / Split Payment.
- **Infraestructura:** Vercel (FE), Railway (BE/DB), Docker (n8n).

## 3. MODELO FINANCIERO (CRÍTICO)
El agente debe aplicar siempre este desglose para evitar errores impositivos:
- **Fórmula:** `P = N + C`
- **P (Monto Bruto):** Total ingresado por el cliente.
- **C (Comisión Plataforma):** 8% fijo (`P * 0.08`).
- **N (Neto Empleado):** 92% restante (`P - C`).
- **Lógica:** Implementar `application_fee` de Mercado Pago para que el 92% viaje directo al empleado.

## 4. MÁQUINA DE ESTADOS DE TRANSACCIÓN
Las transacciones en PostgreSQL deben seguir este ciclo de vida:
1. `INICIADO`: Registro creado al generar la preferencia de pago.
2. `PAGADO`: Confirmado exclusivamente vía Webhook (HMAC validado).
3. `CANCELADO / FALLIDO`: Si el cliente abandona o el medio es rechazado.

## 5. REGLAS DE SEGURIDAD (HARD CONSTRAINTS)
- **Auth:** JWT con Access Token (15m) + Refresh Token (7d) en `HttpOnly Cookies`.
- **RBAC:** Roles: `SUPER_ADMIN`, `LOCAL_ADMIN`, `EMPLOYEE`. Middleware obligatorio de verificación de permisos por recurso.
- **Cifrado:** Datos sensibles (CBU, DNI) en PostgreSQL bajo cifrado `AES-256`.
- **Pagos:** Validación obligatoria de firma HMAC en todos los Webhooks de Mercado Pago.
- **Idempotencia:** Uso de UUID v4 como `external_reference` para evitar pagos duplicados.

## 6. INTEGRACIÓN n8n (AUTOMATIZACIÓN AGÉNTICA)
n8n actuará como worker externo consumiendo el API o Webhooks:
- **Eventos:** `payment.success` -> Notificación instantánea (WhatsApp/Telegram).
- **Cron Jobs:** Reportes semanales de gestión para `LOCAL_ADMIN` (Lunes 09:00 AM).
- **Alertas:** Notificación de `payment.failed` a soporte técnico.

## 7. ESTRUCTURA DE DATOS (POSTGRESQL) - ENTIDADES CLAVE
1. **Locals:** ID, Name, Address, AdminID.
2. **Employees:** UserID, LocalID, CBU_Encrypted, Alias, Role.
3. **Transactions:** ID (UUID), GrossAmount (P), Commission (C), NetAmount (N), Status, ExternalRef, EmployeeID.

## 8. ESTÁNDAR DE CÓDIGO (CLEAN CODE)
- **Backend:** Controladores (HTTP) -> Servicios (Business Logic) -> Prisma (Data).
- **Frontend:** Atomic Design. Custom hooks para lógica de Mercado Pago.
- **UI:** Colores corporativos (Carmesí #DC143C como color primario).