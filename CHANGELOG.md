# Changelog - PROPINANDO

## 18 de Marzo de 2026

---

### Proyecto Inicializado

| Cambio | Descripción |
|--------|-------------|
| Repositorio GitHub | Creado repositorio en https://github.com/LucasIsac/PROPINANDO |
| AGENTS.md | Archivo de configuración del agente con skills y reglas de ingeniería |
| .gitignore | Configuración para ignorar node_modules, .env, .next |

---

### Documentación

| Archivo | Descripción |
|---------|-------------|
| `docs/tecnica.md` | Especificación técnica v1.0.0 con stack PERN |
| `docs/database.md` | Estructura de base de datos PostgreSQL con 10 tablas |
| `docs/AGENTS.md` | Documentación del sistema de agentes |
| `docs/specs/001-database-schema.spec.md` | SPEC-001: Esquema de base de datos |
| `docs/specs/002-pricing-service.spec.md` | SPEC-002: Servicio de pricing |

---

### Skills del Proyecto (Custom)

| Skill | Ubicación | Función |
|-------|-----------|---------|
| **Mercado Pago Guard** | `skills/mercado-pago-split.skill.md` | Validación HMAC-SHA256, lógica de comisión (8%), idempotencia, anti race condition |
| **RBAC PropinanDO** | `skills/propinando-rbac.skill.md` | Middleware ownership.ts con visibilidad por rol, retorno 403 Forbidden |
| **n8n Payloads** | `skills/propinando-n8n-payloads.skill.md` | Contratos de eventos para n8n (tip.paid, tip.failed), montos en centavos, ISO 8601 |

### Skills Automáticos (.agents/skills)

| Skill | Ubicación | Función |
|-------|-----------|---------|
| **Security Architect** | `.agents/skills/security-best-practices/` | Helmet, Rate Limit, HTTPS, CORS, XSS, SQL Injection, CSRF, JWT + Refresh Tokens |
| **Prisma Expert** | `.agents/skills/prisma-database-setup/` | Schema Prisma v7, migraciones PostgreSQL, driver adapters, configuración multi-database |
| **Zod Guardian** | `.agents/skills/zod/` | Branded Types, validación en frontera API, safeParse, exports Tipados |
| **Layered Architect** | `.agents/skills/nodejs-backend-patterns/` | Controller → Service → Repository, Clean Architecture, manejo global de errores |
| **n8n Workflow Expert** | `.agents/skills/n8n-workflow-patterns/` | Webhooks, HTTP API, database ops, AI agents, scheduled tasks |
| **The Shield** | `.agents/skills/javascript-testing-patterns/` | Vitest, Jest, Testing Library, mocking, TDD/BDD workflows |
| **TypeScript Magician** | `.agents/skills/typescript-magician/` | Zero-Any Policy, generic types, type guards, utility types |
| **React Query Best Practices** | `.agents/skills/react-query-best-practices/` | Query Keys, cache management, Optimistic Updates, WebSocket integration |
| **Motion Designer** | `.agents/skills/framer-motion/` | Animaciones 60fps, micro-interacciones, Shared Layout |
| **Animation Designer** | `.agents/skills/animation-designer/` | Patrones UI (Skeletons, Counters), Framer Motion, CSS animations |

---

### Backend

| Archivo | Descripción |
|---------|-------------|
| `backend/.env.example` | Template de variables de entorno (Auth, Redis, AES-256, Mercado Pago, n8n) |
| `backend/src/config/middlewares.ts` | Middlewares de seguridad (Helmet, CORS, Rate Limiter, Morgan) |

---

### Base de Datos (Prisma)

| Archivo | Descripción |
|---------|-------------|
| `backend/prisma/schema.prisma` | Schema para PostgreSQL con 11 modelos y 3 enums |

**Modelos:**
- `User` - Usuarios del sistema (roles: SYSTEM_OWNER, STORE_ADMIN, EMPLOYEE, CUSTOMER)
- `Venue` - Establecimientos con slug único
- `VenueAdmin` - Relación N:M admin-venue
- `Sector` - Áreas (Mozo, Cocina, Barra)
- `Employee` - Staff del local
- `Tip` - Propinas (P=N+C)
- `TipSplit` - Distribución entre empleados
- `PropinandoConfig` - Configuración global
- `RefreshToken` - Sesiones
- `AuditLog` - Auditoría

**Enums:**
- `UserRole`
- `SplitMode`
- `TipStatus`

---

### Shared Contracts (Zod)

| Archivo | Descripción |
|---------|-------------|
| `shared/contracts/transaction.schema.ts` | Zod schemas con Branded Types para montos monetarios |

**Branded Types:**
- `UUID` - Identificadores únicos
- `Money` - Montos monetarios (2 decimales)
- `MoneyInCents` - Montos en centavos (integer)
- `Percentage` - Porcentajes
- `Email`, `Slug` - Validaciones

**Funciones:**
- `toCents(pesos)` - Convierte pesos a centavos
- `toPesos(cents)` - Convierte centavos a pesos
- `calculateCommissionCents(grossAmountCents)` - Calcula comisión con Math.ceil
- `calculateNetCents(grossAmountCents, commissionCents)` - Calcula neto
- `validateTipFormula(grossAmount, commissionAmount, netAmount)` - Valida P=N+C

---

### PricingService (Hito 2)

| Archivo | Descripción |
|---------|-------------|
| `backend/src/services/pricing.service.ts` | Clase pura para cálculo de propinas |
| `backend/src/services/__tests__/pricing.service.test.ts` | Suite de 15 tests Vitest |
| `backend/vitest.config.ts` | Configuración de Vitest |

**Fórmula:**
```
P = N + C
C = P × 0.08 (Math.ceil en centavos)
N = P - C
```

**Tests:**
- Monto Exacto: $1000 → C=80, N=920 ✅
- Monto con Decimales: $1250.50 → C=100.04, N=1150.46 ✅
- Monto Mínimo: $1.00 → C=0.08, N=0.92 ✅
- Validación de Error: Montos ≤ 0 ✅

---

### Frontend

| Archivo | Descripción |
|---------|-------------|
| `frontend/` | Proyecto Next.js 16+ con App Router |

**Estructura:**
- `src/app/login/page.tsx` - Página de login con Poppins font
- `src/app/layout.tsx` - Layout principal
- `src/app/page.tsx` - Redirección a /login
- `src/components/LoginForm.tsx` - Formulario con validación Zod
- `src/schemas/login.schema.ts` - Schema de validación
- `public/Adumu.ttf` - Fuente Adumu

**Features:**
- Validación con Zod (email, password min 6 chars)
- Color Carmesí #DC143C
- Iconos Lucide React
- Loading spinner durante submit
- Conexión a `/api/auth/login`

---

### Memory (Engram)

| Archivo | Descripción |
|---------|-------------|
| `memory/engram.db` | Base de datos SQLite local para memoria del proyecto |

**Hitos guardados:**
1. Hito 1 Verificado
2. Hito 2: Pricing Logic

---

## Resumen de Tecnologías

| Área | Tecnología |
|------|------------|
| Frontend | Next.js 16+, Tailwind CSS, Lucide React |
| Backend | Node.js, Express.js |
| DB | PostgreSQL, Prisma ORM |
| Pagos | Mercado Pago SDK |
| Testing | Vitest |
| Automatización | n8n |
| Tipado | TypeScript, Zod |
| Memoria | Engram |

---

## Reglas del Proyecto

- **Comisión:** 8% fijo
- **Fórmula:** P = N + C
- **Tipado:** Zero-Any Policy (NO usar `any`)
- **Color:** #DC143C (Carmesí)
- **Workflow:** SDD (Spec-Driven Development)
- **Testing:** Vitest para unit tests
