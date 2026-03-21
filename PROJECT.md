# PROPINANDO - Documentación del Proyecto

> Sistema de propinas digitales con Mercado Pago para Argentina

---

## Índice de Documentación

| Archivo | Descripción |
|---------|-------------|
| `PROJECT.md` | Este archivo - Documentación general del proyecto |
| `README.md` | Instrucciones de uso del sistema (root) |
| `AGENTS.md` | Configuración del framework Tony Stark |
| `AGENTS-ORCHESTRATOR.md` | Protocolo de orquestación con sub-agentes |
| `docs/tecnica.md` | Especificación técnica v1.0.0 |
| `docs/database.md` | Documentación de la base de datos |
| `docs/ENGRAM.md` | Guía de automatización de memoria Engram |
| `docs/ORCHESTRATION.md` | Guía de orquestación y validación cruzada |
| `docs/specs/001-database-schema.spec.md` | SPEC-001: Schema de BD ✅ |
| `docs/specs/002-pricing-service.spec.md` | SPEC-002: PricingService ✅ |
| `docs/specs/003-mercadopago-integration.spec.md` | SPEC-003: Mercado Pago 📋 |
| `apps/api/AGENTS.md` | Configuración Backend Specialist |
| `apps/web/AGENTS.md` | Configuración Frontend Architect |
| `apps/web/README.md` | Documentación del frontend Next.js |
| `.github/workflows/ci.yml` | GitHub Actions CI/CD pipeline |
| `skills/mercado-pago-split.skill.md` | Skill: HMAC + comisión 8% |
| `skills/propinando-rbac.skill.md` | Skill: RBAC middleware |
| `skills/propinando-n8n-payloads.skill.md` | Skill: n8n webhooks |

---

## 19 de Marzo de 2026

---

### Piloto Automático de Memoria (Engram)

| Cambio | Descripción |
|--------|-------------|
| `engram-save.ps1` | Script helper para guardar hitos |
| `npm run engram` | Comando npm para automatización |
| `docs/ENGRAM.md` | Guía completa de configuración |

**Uso:**
```bash
npm run engram -- "Hito" "Mensaje"
```

**Flujo:**
```
Spec aprobada → Engineer → Guardian → npm run engram → Engram guarda
```

---

### Reestructuración a `apps/` (Sprint 0)

| Cambio | Descripción |
|--------|-------------|
| `backend/` → `apps/api/` | Backend Express.js refactorizado |
| `frontend/` → `apps/web/` | Frontend Next.js refactorizado |
| Eliminación de `apps/generated/` | Prisma Client ahora en `apps/api/src/generated/` |

---

## 18 de Marzo de 2026

---

### Proyecto Inicializado

| Cambio | Descripción |
|--------|-------------|
| Repositorio GitHub | Creado en https://github.com/LucasIsac/PROPINANDO |
| Stack | PERN (PostgreSQL, Express, React, Node.js) |

---

## Arquitectura del Proyecto

```
PROPINANDO/
├── apps/
│   ├── api/                    # Backend Express.js + Prisma
│   │   ├── AGENTS.md           # Configuración Backend Specialist
│   │   ├── .env                # Variables de entorno
│   │   ├── vitest.config.ts    # Configuración Vitest
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # 11 modelos, 3 enums
│   │   │   └── migrations/     # Historial de migraciones
│   │   └── src/
│   │       ├── config/
│   │       │   └── middlewares.ts  # Helmet, CORS, Rate Limit
│   │       ├── generated/      # Prisma Client (tipado)
│   │       └── services/
│   │           ├── pricing.service.ts          # P = N + C (8%)
│   │           └── __tests__/
│   │               └── pricing.service.test.ts # 15 tests, 95.65% coverage
│   │
│   └── web/                    # Frontend Next.js 16+
│       ├── AGENTS.md           # Configuración Frontend Architect
│       ├── README.md           # Documentación del frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx  # Root layout (Poppins)
│       │   │   ├── page.tsx    # Redirect → /login
│       │   │   └── login/
│       │   │       └── page.tsx
│       │   ├── components/
│       │   │   └── LoginForm.tsx
│       │   └── schemas/
│       │       └── login.schema.ts
│       └── public/
│           └── Adumu.ttf        # Fuente Carmesí
│
├── shared/                     # Zod contracts (tipado compartido)
│   └── contracts/
│       └── transaction.schema.ts
│
├── docs/
│   ├── tecnica.md              # Especificación técnica v1.0.0
│   ├── database.md             # Documentación DB
│   ├── ENGRAM.md               # Guía de automatización Engram
│   ├── ORCHESTRATION.md        # Guía de orquestación con sub-agentes
│   ├── TASK-template.md        # Template para tareas en equipo
│   └── specs/                  # SDD Pipeline
│       ├── 001-database-schema.spec.md      # ✅ IMPLEMENTED
│       ├── 002-pricing-service.spec.md      # ✅ IMPLEMENTED
│       └── 003-mercadopago-integration.spec.md # 📋 READY
│
├── skills/                     # Custom Business Skills
│   ├── mercado-pago-split.skill.md    # HMAC, comisión 8%
│   ├── propinando-rbac.skill.md        # RBAC middleware
│   └── propinando-n8n-payloads.skill.md # n8n webhooks
│
├── memory/                     # Engram (memoria SQLite)
│   └── engram.db               # 12 hitos guardados
│
├── engram-save.ps1             # Script helper para automatización
│
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
│
├── AGENTS.md                   # Configuración Tony Stark
├── AGENTS-ORCHESTRATOR.md      # Protocolo de orquestación
└── PROJECT.md                  # Este archivo
└── PROJECT.md                  # Este archivo
```

---

## Hitos Implementados

| Hito | Estado | Descripción |
|------|--------|-------------|
| Hito 1 | ✅ IMPLEMENTED | Schema Prisma (11 modelos, 3 enums) |
| Hito 2 | ✅ IMPLEMENTED | PricingService (P=N+C, 15 tests, 95.65% cobertura) |
| Hito 3 | 📋 READY | Mercado Pago (Checkout + Webhooks + HMAC) |

---

## Base de Datos (Prisma)

### Modelos

| Modelo | Descripción |
|--------|-------------|
| `User` | Usuarios (SYSTEM_OWNER, STORE_ADMIN, EMPLOYEE, CUSTOMER) |
| `Venue` | Establecimientos con slug único |
| `VenueAdmin` | Relación N:M admin-venue |
| `Sector` | Áreas (Mozo, Cocina, Barra) |
| `Employee` | Staff del local |
| `Tip` | Propinas (P=N+C) |
| `TipSplit` | Distribución entre empleados |
| `PropinandoConfig` | Configuración global (comisión, etc.) |
| `RefreshToken` | Sesiones |
| `AuditLog` | Auditoría |

### Enums

| Enum | Valores |
|------|---------|
| `UserRole` | SYSTEM_OWNER, STORE_ADMIN, EMPLOYEE, CUSTOMER |
| `SplitMode` | EQUAL, PROPORTIONAL, CUSTOM |
| `TipStatus` | INICIADO, PAGADO, CANCELADO, FALLIDO |

---

## PricingService (Hito 2)

### Fórmula

```
P = N + C
C = P × 0.08 (Math.ceil en centavos)
N = P - C
```

### Ejemplo

| Input (P) | Comisión (C) | Neto (N) |
|-----------|--------------|----------|
| $1000.00 | $80.00 | $920.00 |
| $1250.50 | $100.04 | $1150.46 |
| $1.00 | $0.08 | $0.92 |

### Tests

- 15 tests unitarios en Vitest
- 95.65% cobertura de código
- Casos: montos exactos, decimales, mínimos, errores

---

## Shared Contracts (Zod)

| Branded Type | Descripción |
|--------------|-------------|
| `UUID` | Identificadores únicos |
| `Money` | Montos monetarios (2 decimales) |
| `MoneyInCents` | Montos en centavos (integer) |
| `Percentage` | Porcentajes |

### Funciones

- `toCents(pesos)` - Convierte pesos a centavos
- `toPesos(cents)` - Convierte centavos a pesos
- `calculateCommissionCents(grossAmountCents)` - Calcula comisión con Math.ceil
- `validateTipFormula(grossAmount, commissionAmount, netAmount)` - Valida P=N+C

---

## Framework Tony Stark

### Orquestación con Sub-Agentes

El proyecto utiliza un **Orquestador** (este agente) que coordina **Sub-Agentes** especializados para maximizar eficiencia y minimizar uso de contexto.

**Ver documentación completa:** `AGENTS-ORCHESTRATOR.md`

```
┌─────────────────────┐
│    ORQUESTADOR      │  ← Este agente (opencode)
│  (Coordinación SDD) │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
Sub-Agente   Sub-Agente   → Delegar tareas simultáneas
Backend      Frontend        ↓
    │           │        Engram (memoria compartida)
    └─────┬─────┘
          ▼
    Validar consistencia
          │
          ▼
        HITL (Usuario)
          │
          ▼
    npm run engram
```

### Responsabilidades del Orquestador

1. **Delegar** tareas a Sub-Agentes especializados
2. **Validar** consistencia cruzada de outputs
3. **Recopilar** resultados en Engram
4. **Presentar** HITL al usuario
5. **Persistir** hitos + actualizar PROJECT.md

### Protocolos

| Protocolo | Descripción |
|-----------|-------------|
| **HITL** | Aprobación de plan antes de código |
| **SDD** | Spec-Driven Development |
| **Guardian** | Code review (Zero-Any Policy, tests) |
| **Engram** | Persistencia de hitos en SQLite |
| **PROJECT.md** | Actualización obligatoria tras completar |
| **Confirm Git** | Confirmación explícita antes de git push |

---

## Skills Registry

### Custom Skills

| Skill | Ubicación | Función |
|-------|-----------|---------|
| **Mercado Pago Guard** | `skills/mercado-pago-split.skill.md` | HMAC-SHA256, lógica 8%, idempotencia |
| **RBAC PropinanDO** | `skills/propinando-rbac.skill.md` | Middleware ownership, 403 Forbidden |
| **n8n Payloads** | `skills/propinando-n8n-payloads.skill.md` | tip.paid, tip.failed, centavos, ISO 8601 |

### Automatic Skills

| Skill | Función |
|-------|---------|
| **Security Architect** | Helmet, Rate Limit, JWT, HTTPS |
| **Prisma Expert** | Schema v7, migraciones PostgreSQL |
| **Zod Guardian** | Branded Types, safeParse |
| **Layered Architect** | Controller → Service → Repository |
| **The Shield** | Vitest, TDD/BDD |
| **TypeScript Magician** | Zero-Any Policy |
| **React Query Best Practices** | Cache, Optimistic Updates |
| **Motion Designer** | 60fps animations |

---

## Frontend

### Login Page

- Validación Zod (email, password min 6 chars)
- Color Carmesí #DC143C
- Iconos Lucide React
- Loading spinner
- API: `POST /api/auth/login`

---

## Reglas del Proyecto

| Regla | Valor |
|-------|-------|
| Comisión | 8% fijo |
| Fórmula | P = N + C |
| Tipado | Zero-Any Policy (NO `any`) |
| Color | #DC143C |
| Workflow | SDD (Spec-Driven Development) |
| Testing | Vitest obligatorio |
| Redondeo | Math.ceil en centavos |

---

## GitHub Actions CI/CD

### Pipeline

```yaml
Trigger: PR → main
Node: 20 LTS
Cache: pnpm

Steps:
1. pnpm install
2. pnpm lint
3. pnpm audit --prod
4. pnpm test -- --coverage
```

### Cobertura

- Provider: v8
- Reporters: text, json, html, lcov

---

## Tecnologías

| Área | Tecnología |
|------|------------|
| Frontend | Next.js 16+, Tailwind CSS, Lucide React |
| Backend | Node.js, Express.js |
| DB | PostgreSQL, Prisma ORM |
| Pagos | Mercado Pago SDK |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Automatización | n8n |
| Tipado | TypeScript, Zod |
| Memoria | Engram |

---

## Próximos Pasos

1. Implementar SPEC-003: Mercado Pago Integration
2. Webhook handler con HMAC validation
3. Checkout redirects
4. Tests de integración
