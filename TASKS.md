# TASKS - feature/identity-role-transition

> Etapa 1 del Roadmap MVP: Gestión de Identidad y Transición de Roles
> Refs: RF-E01, RF-E02, RF-E03, RF-E04, RF-E08, RFA01 (parcial), RNF-06, RNF-08

---

## [Tarea 1.1: Registro de Empleado Individual]

### [BACKEND]:
- [ ] Endpoint `POST /auth/register` con validación Zod (nombre, apellido, DNI, teléfono, CBU/CVU, foto)
- [ ] Hasheo de contraseña con Bcrypt (factor 12)
- [ ] Cifrado AES-256 de datos sensibles (CBU/CVU, DNI) antes de persistir
- [ ] Estado inicial del empleado: `PENDIENTE` (no disponible como destino de pago)
- [ ] Endpoint `GET /employee/me` con enmascaramiento de CBU en respuesta (`2100****4567`) — nunca el valor completo
- [ ] Middleware `ownership.ts`: validar que el recurso pertenece al usuario del token en cada query

### [FRONTEND]: ✅ COMPLETADO
- [x] Pantalla de registro (`/app/register`) con campos: nombre, apellido, DNI, teléfono, CBU/CVU, foto de perfil
- [x] Validación de formulario en cliente con Zod (mismo contrato que backend)
- [x] Feedback visual de estado `PENDIENTE` post-registro ("Tu cuenta está en revisión") - en alert()
- [x] Selector de categoría/sector al registrarse (Mozo, Cocina, Barra, Delivery, Caja)

### [CONTRATO API - FRONTEND → BACKEND]:
**Endpoint:** `POST /api/auth/register`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "12345678",
  "email": "juan@email.com",
  "telefono": "1134567890",
  "cbu": "0000003100012345678901",
  "password": "Password123",
  "sector": "MOZO",
  "fotoUrl": "https://cloudinary.com/..."
}
```

**Response Exitoso:**
```json
{
  "success": true,
  "message": "Tu cuenta está en revisión",
  "user": {
    "id": "uuid",
    "email": "juan@email.com",
    "status": "PENDIENTE"
  }
}
```

**Validaciones Zod (schema en `apps/web/src/schemas/register.schema.ts`):**
- nombre: 2-50 caracteres
- apellido: 2-50 caracteres
- dni: 8 dígitos exactos
- email: válido
- telefono: 10-15 dígitos
- cbu: 22 dígitos O alias 6-20 caracteres
- password: mínimo 8 caracteres, 1 mayúscula, 1 número
- sector: enum ['MOZO', 'COCINA', 'BARRA', 'DELIVERY', 'CAJA']

### [INTEGRACIÓN]:
- [ ] E2E: registro completo → verificar estado `PENDIENTE` en DB → verificar CBU cifrado en DB → verificar respuesta enmascarada del endpoint

---

## [Tarea 1.2: Verificación de Identidad (Automatizada con MetaMap)]

### [BACKEND]:
- [ ] Endpoint `POST /webhooks/metamap` para recibir resultado de verificación de MetaMap
- [ ] Validar firma HMAC del webhook de MetaMap (igual que con Mercado Pago)
- [ ] Si resultado `approved`: cambiar estado empleado de `PENDIENTE` a `ACTIVO`
- [ ] Si resultado `rejected` o `manual_review`: mantener `PENDIENTE`, notificar a SYSTEM_OWNER
- [ ] Guardar `metamap_identity_id` en tabla `users` para trazabilidad
- [ ] Registro en `audit_log`: "verificado automáticamente por MetaMap" + identityId + timestamp
- [ ] Endpoint `PATCH /admin/employees/:id/verify` se mantiene restringido a `STORE_ADMIN` y `SYSTEM_OWNER` solo para casos `manual_review`

### [FRONTEND]:
- [ ] Reemplazar formulario de verificación manual por SDK de MetaMap (componente React oficial)
- [ ] **Flujo integrado al registro:** Después de completar el paso 3 (confirmar datos), lanzar automáticamente el flujo MetaMap embebido (foto DNI frente/dorso + selfie con liveness detection)
- [ ] Feedback visual post-flujo: "Verificando tu identidad, en breve te confirmamos"
- [ ] Badge de estado visible: `PENDIENTE` / `ACTIVO` / `INACTIVO` (sin cambios)
- [ ] Panel admin mantiene listado de `PENDIENTE` solo para casos que MetaMap derive a `manual_review`

### [INTEGRACIÓN]:
- [ ] E2E: empleado completa flujo MetaMap → webhook llega al backend → firma HMAC válida → estado cambia a `ACTIVO` → empleado disponible como destino de pago → audit_log registra identityId de MetaMap
- [ ] E2E caso edge: MetaMap devuelve `manual_review` → estado queda `PENDIENTE` → SYSTEM_OWNER ve el caso en panel admin → aprueba manualmente → audit_log registra acción humana

---

## [Tarea 1.3: Login y Gestión de Sesión (BFF + Doble Token)]

### [BACKEND]:
- [ ] Endpoint `POST /auth/login` → genera Access Token (15 min) + Refresh Token (7 días)
- [ ] Access Token en cookie `HttpOnly`, `Secure`, `SameSite=Strict` (NO en localStorage)
- [ ] Refresh Token almacenado en tabla `refresh_tokens` (hash, expires_at, revoked)
- [ ] Endpoint `POST /auth/refresh` para renovar Access Token usando Refresh Token válido
- [ ] Endpoint `POST /auth/logout` → marcar Refresh Token como `revoked=true` en DB (blacklist)
- [ ] Rate limiting: bloqueo temporal tras 5 intentos fallidos de login (RNF-11)
- [ ] Endpoint de reset de contraseña: JWT firmado (15 min), un solo uso, invalidado en Redis post-consumo

### [FRONTEND]:
- [x] Pantalla de login (`/app/login`) existe (pendiente integración con backend)
- [ ] Manejo silencioso del refresh de token (interceptor de requests)
- [ ] Redirección automática post-login según rol (`/app/dashboard` para empleado, `/app/admin` para admin)
- [ ] Pantalla de "Olvidé mi contraseña" con flujo de email

### [INTEGRACIÓN]:
- [ ] E2E: login → verificar cookie HttpOnly presente → Access Token expira → refresh automático → logout → refresh token invalidado

---

## [Tarea 1.4: Dashboard de Ganancias Individual (Tiempo Real)]

### [BACKEND]:
- [ ] Endpoint SSE `GET /employee/tips/stream` para actualización en tiempo real (latencia < 2s, RNF-02)
- [ ] Endpoint `GET /employee/tips/summary` → total del día, total del mes, neto estimado
- [ ] Endpoint `GET /employee/tips` → listado paginado de propinas con detalle (fecha, monto neto, estrellas, comentario)
- [ ] Todos los endpoints con middleware `ownership.ts`: `WHERE employee_id = :tokenUserId`
- [ ] Respuesta nunca expone comisión bruta ni monto de Propinando (RNF-10)

### [FRONTEND]:
- [ ] Dashboard del empleado (`/app/dashboard`) con: total del día, total del mes, neto estimado
- [ ] Feed en tiempo real de últimas propinas (SSE)
- [ ] Tarjeta de detalle por propina: fecha/hora, monto neto, estrellas, comentario (si existe)
- [ ] Skeleton loaders durante carga inicial

### [INTEGRACIÓN]:
- [ ] E2E: empleado logueado recibe propina de prueba → SSE actualiza dashboard en < 2s → detalle muestra monto neto (nunca bruto)

---

## [Tarea 1.5: Módulo de Upgrade a Dueño]

### [BACKEND]:
- [ ] Endpoint `POST /employee/upgrade-request` con formulario: CUIT, dirección, nombre de fantasía, tipo de negocio
- [ ] Estado de solicitud: `UPGRADE_PENDIENTE` (campo en tabla `users` o tabla `upgrade_requests`)
- [ ] Endpoint `PATCH /admin/upgrade-requests/:id/approve` restringido a `SYSTEM_OWNER`
- [ ] Al aprobar: cambiar `role` de `EMPLOYEE` a `STORE_ADMIN`, crear registro en `venues`
- [ ] Registro en `audit_log` del cambio de rol

### [FRONTEND]:
- [ ] Pantalla de solicitud de upgrade (`/app/dashboard/upgrade`) con formulario de verificación
- [ ] Estado visible post-solicitud: "Tu solicitud está siendo revisada"
- [ ] Vista en backoffice (`/app/admin/upgrade-requests`) para que `SYSTEM_OWNER` apruebe o rechace

### [INTEGRACIÓN]:
- [ ] E2E: empleado solicita upgrade → SYSTEM_OWNER aprueba → rol cambia a STORE_ADMIN → acceso a `/app/admin` habilitado

---

## [Tarea 1.6: Generador de QR Personal del Empleado]

### [BACKEND]:
- [ ] Endpoint `POST /employee/qr/generate` → genera JWT firmado con `employee_id` y `venue_id` (si aplica)
- [ ] El QR generado debe contener el JWT firmado (no UUID plano) para validación en backend al escanearlo
- [ ] Endpoint `GET /employee/qr` → retorna el QR activo del empleado
- [ ] Validación del JWT del QR en el endpoint de inicio del flujo de cliente

### [FRONTEND]:
- [ ] Sección "Mi QR" en el dashboard del empleado
- [ ] Visualización del QR generado (imagen o SVG) lista para imprimir o compartir
- [ ] Indicación del nombre y foto del empleado en la pantalla destino post-escaneo (para verificación visual del cliente, mitigación de suplantación física)

### [INTEGRACIÓN]:
- [ ] E2E: empleado genera QR → cliente escanea → backend valida JWT del QR → carga pantalla de propina con nombre/foto del empleado correctos

---

## Reglas

- Ninguna funcionalidad es "Done" sin Front + Back + Integración
- Bloquear PR si TASKS.md tiene checks pendientes
- `ownership.ts` es obligatorio en TODOS los endpoints del dashboard del empleado sin excepción
- El CBU nunca viaja completo en respuestas JSON (enmascarar en backend, no en frontend)
- Todo cambio de rol o verificación de identidad debe quedar en `audit_log`
