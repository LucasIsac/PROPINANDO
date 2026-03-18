# SPEC-001: Database Schema - PropinanDO Data Layer

## metadata
- **Spec ID:** 001
- **Module:** Data Layer (Hito 1)
- **Status:** Ready for Implementation
- **Author:** Lead Software Engineer
- **Date:** 2024-01-15

---

## 1. Overview

This specification defines the PostgreSQL database schema for PropinanDO, implementing a multi-tenant tip management system with split payment support via Mercado Pago.

## 2. Modelo Financiero (CRÍTICO)

```
P (gross_amount) = N (net_amount) + C (commission_amount)
     100%         =    92%      +     8%

C = P × 0.08
N = P - C
```

**Validación obligatoria:** `gross_amount = commission_amount + net_amount`

## 3. Entidades

### 3.1 Enum Types

```prisma
enum UserRole {
  SYSTEM_OWNER
  STORE_ADMIN
  EMPLOYEE
  CUSTOMER
}

enum SplitMode {
  equal
  percentage
  manual
}

enum TipStatus {
  INITIATED
  PAID
  CANCELLED
  FAILED
}
```

### 3.2 Users
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| email | String | @unique, @db.VarChar(255) |
| passwordHash | String | @map("password_hash") |
| firstName | String | @db.VarChar(100) |
| lastName | String | @db.VarChar(100) |
| phone | String? | @db.VarChar(20) |
| dniEncrypted | String? | @map("dni_encrypted") |
| photoUrl | String? | @map("photo_url") @db.VarChar(500) |
| role | UserRole | @default(EMPLOYEE) |
| isActive | Boolean | @default(true) @map("is_active") |
| identityVerified | Boolean | @default(false) @map("identity_verified") |
| createdAt | DateTime | @default(now()) @map("created_at") |
| updatedAt | DateTime | @updatedAt @map("updated_at") |

### 3.3 Venues
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| name | String | @db.VarChar(255) |
| slug | String | @unique @db.VarChar(100) |
| cuit | String? | @db.VarChar(20) |
| address | String? | @db.VarChar(500) |
| type | String? | @db.VarChar(50) |
| logoUrl | String? | @map("logo_url") @db.VarChar(500) |
| qrCode | String? | @map("qr_code") @db.Text |
| commissionRate | Decimal | @default(0.08) @db.Decimal(5,4) @map("commission_rate") |
| mpAccessToken | String? | @map("mp_access_token") @db.Text |
| isActive | Boolean | @default(true) @map("is_active") |
| isSandbox | Boolean | @default(true) @map("is_sandbox") |
| createdAt | DateTime | @default(now()) @map("created_at") |
| updatedAt | DateTime | @updatedAt @map("updated_at") |

### 3.4 VenueAdmins
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| userId | UUID | FK → users |
| venueId | UUID | FK → venues |
| isOwner | Boolean | @default(false) @map("is_owner") |
| createdAt | DateTime | @default(now()) @map("created_at") |

### 3.5 Sectors
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| venueId | UUID | FK → venues |
| name | String | @db.VarChar(100) |
| splitMode | SplitMode | @default(equal) @map("split_mode") |
| isActive | Boolean | @default(true) @map("is_active") |
| displayOrder | Int | @default(0) @map("display_order") |

### 3.6 Employees
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| userId | UUID | FK → users, @unique |
| venueId | UUID | FK → venues |
| sectorId | UUID | FK → sectors |
| displayName | String | @map("display_name") @db.VarChar(100) |
| photoUrl | String? | @map("photo_url") @db.VarChar(500) |
| splitPercentage | Decimal | @default(100) @db.Decimal(5,2) @map("split_percentage") |
| paymentAccount | String? | @map("payment_account") @db.Text (cifrado) |
| qrPersonalToken | String | @default(uuid()) @unique @map("qr_personal_token") |
| isActive | Boolean | @default(true) @map("is_active") |
| createdAt | DateTime | @default(now()) @map("created_at") |
| updatedAt | DateTime | @updatedAt @map("updated_at") |

### 3.7 Tips
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| externalReference | String | @unique @map("external_reference") |
| venueId | UUID | FK → venues |
| sectorId | UUID | FK → sectors |
| employeeId | UUID | FK → employees |
| grossAmount | Decimal | @db.Decimal(12,2) @map("gross_amount") |
| commissionRate | Decimal | @db.Decimal(5,4) @map("commission_rate") |
| commissionAmount | Decimal | @db.Decimal(12,2) @map("commission_amount") |
| netAmount | Decimal | @db.Decimal(12,2) @map("net_amount") |
| rating | Int? | @db.Int |
| comment | String? | @db.VarChar(500) |
| status | TipStatus | @default(INITIATED) |
| mpPreferenceId | String? | @map("mp_preference_id") @db.VarChar(50) |
| mpPaymentId | String? | @map("mp_payment_id") @db.VarChar(50) |
| mpStatus | String? | @map("mp_status") @db.VarChar(50) |
| paidAt | DateTime? | @map("paid_at") |
| createdAt | DateTime | @default(now()) @map("created_at") |
| updatedAt | DateTime | @updatedAt @map("updated_at") |

**Validaciones:**
- CHECK: `gross_amount > 0`
- CHECK: `rating >= 1 AND rating <= 5`
- CHECK: `gross_amount = commission_amount + net_amount`

### 3.8 TipSplits
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| tipId | UUID | FK → tips |
| employeeId | UUID | FK → employees |
| netAmount | Decimal | @db.Decimal(12,2) @map("net_amount") |
| percentage | Decimal | @db.Decimal(5,2) |
| paidAt | DateTime? | @map("paid_at") |
| createdAt | DateTime | @default(now()) @map("created_at") |

### 3.9 PropinandoConfig
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| commissionRate | Decimal | @default(0.08) @db.Decimal(5,4) @map("commission_rate") |
| updatedById | UUID | FK → users @map("updated_by_id") |
| createdAt | DateTime | @default(now()) @map("created_at") |
| updatedAt | DateTime | @updatedAt @map("updated_at") |

### 3.10 RefreshTokens
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| userId | UUID | FK → users |
| tokenHash | String | @map("token_hash") |
| expiresAt | DateTime | @map("expires_at") |
| revoked | Boolean | @default(false) |
| createdAt | DateTime | @default(now()) @map("created_at") |

### 3.11 AuditLogs
| Campo | Tipo | Constraints |
|-------|------|-------------|
| id | UUID | PK, @default(uuid()) |
| userId | UUID | FK → users |
| action | String | @db.VarChar(100) |
| entity | String | @db.VarChar(50) |
| entityId | String? | @map("entity_id") |
| payload | Json? | |
| ipAddress | String? | @map("ip_address") @db.VarChar(45) |
| createdAt | DateTime | @default(now()) @map("created_at") |

## 4. Índices

```prisma
// users
@@index([email], unique: true)

// venues
@@index([slug], unique: true)

// venue_admins
@@index([userId])
@@index([venueId])

// sectors
@@index([venueId])

// employees
@@index([userId], unique: true)
@@index([venueId])
@@index([qrPersonalToken], unique: true)

// tips
@@index([venueId])
@@index([employeeId])
@@index([status])
@@index([mpPaymentId])
@@index([createdAt])
@@index([externalReference], unique: true)

// tip_splits
@@index([tipId])
@@index([employeeId])

// refresh_tokens
@@index([userId])

// audit_logs
@@index([userId])
@@index([entity])
@@index([entityId])
@@index([createdAt])
```

## 5. Relaciones

```
users (1) ────────── (N) venue_admins ────────── (N) venues (1)
  │                                                    │
  │ (1)                                                │ (1)
  └─────── employees (N)                               │
              │                                       │
              │ (N) ──────── tips (N) ──────── (N) ───┘
              │                        │
              │                        │
              └──── tip_splits (N) ────┘
```

## 6. Notas de Implementación

1. **Cifrado AES-256:** Los campos `dniEncrypted`, `mpAccessToken`, y `paymentAccount` deben ser cifrados a nivel de aplicación
2. **UUID v4:** Usar `@default(uuid())` para todos los IDs
3. **Soft Deletes:** Usar `isActive` en lugar de eliminar registros
4. **Timestamps:** Todos los registros deben tener `createdAt` y `updatedAt`
5. **Multi-tenant:** Todas las consultas deben filtrar por `venueId` para STORE_ADMIN

## 7. Zod Contract Requirements

Los esquemas Zod deben incluir:
- **Branded Types** para montos monetarios: `type Money = number & Brand<"Money">`
- Validación de email con formato válido
- UUID validation para IDs
- Enum validation para status
- Validación P = N + C

## 8. Checklist de Implementación

- [ ] Crear schema.prisma
- [ ] Definir todos los enums
- [ ] Crear todos los modelos con campos correctos
- [ ] Configurar relaciones
- [ ] Agregar índices
- [ ] Crear contratos Zod con Branded Types
- [ ] Validar fórmula P = N + C en schemas
