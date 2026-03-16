# Estructura de Base de Datos - PropinanDO

## Descripción General

Este documento define el esquema de base de datos PostgreSQL para el proyecto PropinanDO, basado en la especificación técnica v1.0.0.

---

## Modelo Entidad-Relación

```
┌─────────────────┐
│      users      │
├─────────────────┤
│ id (UUID, PK)  │
│ email           │
│ password_hash   │
│ first_name      │
│ last_name       │
│ phone           │
│ dni (encrypted)│
│ photo_url      │
│ role           │
│ is_active      │
│ identity_verif.│
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐     ┌─────────────────┐
│   venues        │     │  venue_admins   │
├─────────────────┤     ├─────────────────┤
│ id (UUID, PK)  │<───>│ id (UUID, PK)   │
│ name           │     │ user_id         │
│ address        │     │ venue_id        │
│ phone          │     │ is_owner        │
│ type           │     └─────────────────┘
│ logo_url       │
│ qr_code        │           │
│ qr_token       │           │ 1:N
│ is_active      │           ▼
│ is_sandbox     │     ┌─────────────────┐
│ commission_rate│     │    sectors      │
│ mp_access_token│     ├─────────────────┤
└────────┬────────┘     │ id (UUID, PK)   │
         │              │ venue_id        │
         │ 1:N          │ name           │
         ▼              │ split_mode     │
┌─────────────────┐     │ is_active      │
│    employees   │     │ display_order  │
├─────────────────┤     └────────┬────────┘
│ id (UUID, PK)  │              │
│ user_id         │              │ 1:N
│ venue_id        │              ▼
│ sector_id       │     ┌─────────────────┐
│ display_name    │     │      tips       │
│ photo_url      │     ├─────────────────┤
│ split_percentage│     │ id (UUID, PK)   │
│ payment_account│     │ venue_id        │
│ qr_personal_tkn│     │ sector_id       │
│ is_active      │     │ employee_id     │
└────────┬────────┘     │ gross_amount    │
         │              │ commission_rate │
         │ 1:N          │ commission_amt  │
         ▼              │ net_amount      │
┌─────────────────┐     │ rating          │
│   tip_splits    │     │ comment         │
├─────────────────┤     │ status          │
│ id (UUID, PK)  │     │ mp_preference_id│
│ tip_id         │     │ mp_payment_id   │
│ employee_id    │     │ mp_status       │
│ net_amount     │     │ paid_at         │
│ percentage     │     │ created_at      │
│ paid_at        │     └─────────────────┘
└─────────────────┘

┌─────────────────────┐   ┌─────────────────────┐
│  propinando_config │   │   refresh_tokens    │
├─────────────────────┤   ├─────────────────────┤
│ id (UUID, PK)      │   │ id (UUID, PK)      │
│ commission_rate    │   │ user_id            │
│ updated_by         │   │ token_hash         │
│ created_at         │   │ expires_at         │
│ updated_at         │   │ revoked            │
└─────────────────────┘   └─────────────────────┘

┌─────────────────────┐
│      audit_log     │
├─────────────────────┤
│ id (UUID, PK)     │
│ user_id            │
│ action             │
│ entity             │
│ entity_id          │
│ payload (JSONB)   │
│ ip_address         │
│ created_at         │
└─────────────────────┘
```

---

## Entidades

### 1. users (Usuarios del Sistema)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `email` | VARCHAR(255) | Email único |
| `password_hash` | VARCHAR(255) | Hash bcrypt |
| `first_name` | VARCHAR(100) | Nombre |
| `last_name` | VARCHAR(100) | Apellido |
| `phone` | VARCHAR(20) | Teléfono |
| `dni` | VARCHAR | DNI cifrado AES-256 |
| `photo_url` | VARCHAR(500) | URL de foto de perfil |
| `role` | ENUM | `superadmin`, `admin`, `employee` |
| `is_active` | BOOLEAN | Estado de cuenta |
| `identity_verified` | BOOLEAN | Verificación de identidad |

**Índices:** `email` (único)

---

### 2. venues (Locales/Establecimientos)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(255) | Nombre del local |
| `cuit` | VARCHAR(20) | CUIT del establecimiento |
| `address` | VARCHAR(500) | Dirección |
| `type` | VARCHAR(50) | Tipo de negocio |
| `logo_url` | VARCHAR(500) | URL del logo |
| `qr_code` | TEXT | QR generado (base64) |
| `qr_token` | UUID | Token único para QR |
| `is_active` | BOOLEAN | Estado del local |
| `is_sandbox` | BOOLEAN | Modo sandbox de pruebas |
| `commission_rate` | DECIMAL(5,4) | Tasa de comisión (ej: 0.0800) |
| `mp_access_token` | TEXT | Token OAuth MP (cifrado AES-256) |

**Índices:** `qr_token` (único)

---

### 3. venue_admins (Relación Admin-Venue N:M)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK → users |
| `venue_id` | UUID | FK → venues |
| `is_owner` | BOOLEAN | Es propietario del local |

**Índices:** `user_id`, `venue_id`

---

### 4. sectors (Categorías/Áreas)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `venue_id` | UUID | FK → venues |
| `name` | VARCHAR(100) | Mozo, Cocina, Barra, Equipo |
| `split_mode` | ENUM | `equal`, `percentage`, `manual` |
| `is_active` | BOOLEAN | Estado activo |
| `display_order` | INT | Orden de visualización |

**Índices:** `venue_id`

---

### 5. employees (Staff del Local)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK → users |
| `venue_id` | UUID | FK → venues |
| `sector_id` | UUID | FK → sectors |
| `display_name` | VARCHAR(100) | Nombre a mostrar |
| `photo_url` | VARCHAR(500) | URL de foto |
| `split_percentage` | DECIMAL(5,2) | Porcentaje de división (%) |
| `payment_account` | TEXT | CBU/CVU cifrado AES-256 |
| `qr_personal_token` | UUID | Token QR personal |
| `is_active` | BOOLEAN | Estado activo |

**Índices:** `user_id` (único), `venue_id`, `qr_personal_token`

---

### 6. tips (Propinas)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `venue_id` | UUID | FK → venues |
| `sector_id` | UUID | FK → sectors |
| `employee_id` | UUID | FK → employees |
| `gross_amount` | DECIMAL(12,2) | P - Monto Bruto |
| `commission_rate` | DECIMAL(5,4) | Tasa de comisión aplicada |
| `commission_amount` | DECIMAL(12,2) | C - Comisión (P × rate) |
| `net_amount` | DECIMAL(12,2) | N - Neto Empleado |
| `rating` | INT | Calificación (1-5) |
| `comment` | VARCHAR(500) | Comentario del cliente |
| `status` | ENUM | `initiated`, `paid`, `cancelled`, `failed` |
| `mp_preference_id` | VARCHAR(50) | ID preferencia MP |
| `mp_payment_id` | VARCHAR(50) | ID pago MP |
| `mp_status` | VARCHAR(50) | Estado en MP |
| `paid_at` | TIMESTAMP | Fecha de confirmación |

**Validaciones:**
```sql
CHECK (gross_amount > 0)
CHECK (rating >= 1 AND rating <= 5)
```

**Índices:** `venue_id`, `employee_id`, `status`, `mp_payment_id`, `created_at`

---

### 7. tip_splits (Distribución entre Empleados)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `tip_id` | UUID | FK → tips |
| `employee_id` | UUID | FK → employees |
| `net_amount` | DECIMAL(12,2) | Monto neto a recibir |
| `percentage` | DECIMAL(5,2) | Porcentaje de división |
| `paid_at` | TIMESTAMP | Fecha de pago |

**Índices:** `tip_id`, `employee_id`

---

### 8. propinando_config (Configuración Global)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `commission_rate` | DECIMAL(5,4) | Comisión global (ej: 0.0800 = 8%) |
| `updated_by` | UUID | FK → users |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

---

### 9. refresh_tokens (Sesiones)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK → users |
| `token_hash` | VARCHAR(255) | Hash del token |
| `expires_at` | TIMESTAMP | Fecha de expiración |
| `revoked` | BOOLEAN | Token revocado |

**Índices:** `user_id`

---

### 10. audit_log (Auditoría)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK → users |
| `action` | VARCHAR(100) | Acción realizada |
| `entity` | VARCHAR(50) | Entidad afectada |
| `entity_id` | UUID | ID de la entidad |
| `payload` | JSONB | Datos anteriores/nuevos |
| `ip_address` | VARCHAR(45) | IP del cliente |
| `created_at` | TIMESTAMP | Fecha de la acción |

**Índices:** `user_id`, `entity`, `entity_id`, `created_at`

---

## Enums

```sql
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'employee');

CREATE TYPE split_mode AS ENUM ('equal', 'percentage', 'manual');

CREATE TYPE tip_status AS ENUM ('initiated', 'paid', 'cancelled', 'failed');
```

---

## Modelo Financiero

```
P (gross_amount) = N (net_amount) + C (commission_amount)
     100%         =    92%      +     8%

gross_amount * commission_rate = commission_amount
gross_amount - commission_amount = net_amount
```

**Prioridad de Comisión:**
1. `employees.split_percentage` (por empleado)
2. `venues.commission_rate` (por local)
3. `propinando_config.commission_rate` (global)

---

## Seguridad

### Cifrado AES-256
Campos cifrados:
- `users.dni`
- `venues.mp_access_token`
- `employees.payment_account`

### Notas
- Clave de cifrado en variable de entorno: `ENCRYPTION_KEY`
- No almacenar clave en la base de datos
- Usar funciones PostgreSQL para cifrado/descifrado

---

## Diferencias con Propuesta Inicial

| Original | Actual | Razón |
|----------|--------|-------|
| `Locals` | `venues` + `venue_admins` | Relación N:M admins-venues |
| `Transactions` | `tips` | Nombre más apropiado |
| ❌ | `sectors` | División por área (Mozo, Cocina) |
| ❌ | `tip_splits` | Distribución entre empleados |
| ❌ | `propinando_config` | Comisión global configurable |
