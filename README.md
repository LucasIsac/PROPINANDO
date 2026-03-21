# PROPINANDO

> Sistema de propinas digitales con Mercado Pago para Argentina

![CI](https://github.com/LucasIsac/PROPINANDO/workflows/CI/badge.svg)

Sistema de propinas digitales que permite a clientes de bares y restaurantes enviar propinas a empleados mediante código QR, con distribución automática y comisiones.

## 🏗️ Arquitectura

Monorepo con pnpm workspaces:

```
PROPINANDO/
├── apps/
│   ├── api/          # Backend: Express.js + Prisma
│   └── web/          # Frontend: Next.js 16+
├── shared/           # Zod contracts (tipado compartido)
├── docs/             # Documentación técnica
├── skills/           # Custom skills del proyecto
└── memory/           # Engram (memoria SQLite)
```

## 🚀 Inicio Rápido

### Requisitos

- Node.js 20 LTS
- pnpm 9+
- PostgreSQL (para desarrollo local)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/LucasIsac/PROPINANDO.git
cd PROPINANDO

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
# Editar .env con tus credenciales

# Ejecutar migraciones
pnpm --filter api db:migrate

# Iniciar desarrollo
pnpm dev
```

### URLs de Desarrollo

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001 |
| Prisma Studio | `pnpm --filter api db:studio` |

## 📦 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar frontend
pnpm dev:api          # Iniciar backend

# Calidad de código
pnpm lint             # Lint todos los workspaces
pnpm audit           # Security audit (nivel critical)
pnpm test            # Tests unitarios
pnpm test:coverage    # Tests con cobertura

# Build
pnpm build            # Build producción

# Memoria (Engram)
pnpm engram -- "Hito" "Mensaje"
```

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests con cobertura (80% threshold)
pnpm test:coverage

# UI de tests
pnpm --filter web test:ui
```

**Cobertura actual:**
- API: 15 tests (pricing service)
- Web: 3 tests (QR visualization)

## 🔒 Seguridad

- **Linting:** ESLint Airbnb (API) + ESLint Next.js (Web)
- **Audit:** pnpm audit --prod --audit-level=critical
- **HMAC:** Validación SHA256 en webhooks de Mercado Pago
- **RBAC:** Middleware de permisos por rol

## 📁 Documentación

| Archivo | Descripción |
|---------|-------------|
| `PROJECT.md` | Documentación completa del proyecto |
| `AGENTS.md` | Configuración del framework Tony Stark |
| `AGENTS-ORCHESTRATOR.md` | Protocolo de orquestación con sub-agentes |
| `docs/ORCHESTRATION.md` | Guía de orquestación y validación cruzada |
| `docs/ENGRAM.md` | Guía de automatización de memoria |
| `docs/specs/` | Especificaciones SDD |

## 🛠️ Stack Tecnológico

| Área | Tecnología |
|------|------------|
| Frontend | Next.js 16+, Tailwind CSS, Lucide React |
| Backend | Node.js, Express.js |
| DB | PostgreSQL, Prisma ORM |
| Pagos | Mercado Pago SDK |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Tipado | TypeScript, Zod |
| Memoria | Engram |

## 📊 Workflow SDD (Spec-Driven Development)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  ARCHITECT  │───>│    HUMAN    │───>│  ENGINEER   │───>│  GUARDIAN   │
│   (Spec)    │    │   (HITL)    │    │   (Code)    │    │   (Audit)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                   │
                                                                   ▼
                                                            ┌─────────────┐
                                                            │   ENGRAM    │
                                                            │  (Memory)   │
                                                            └─────────────┘
```

## 📝 Reglas del Proyecto

- **Comisión:** 8% fijo
- **Fórmula:** P = N + C (Precio = Neto + Comisión)
- **Tipado:** Zero-Any Policy (NO `any`)
- **Color primario:** #DC143C (Carmesí)
- **Testing:** Vitest obligatorio
- **Redondeo:** Math.ceil en centavos

## 🤝 Contribuir

1. Crear branch: `git checkout -b feature/nueva-funcionalidad`
2. Implementar siguiendo SDD Pipeline
3. Asegurar que tests pasan: `pnpm test`
4. Asegurar que lint pasa: `pnpm lint`
5. Crear PR a `main`

## 📄 Licencia

ISC
