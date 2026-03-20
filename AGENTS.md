# PropinanDO - Agent Configuration & Skills Registry

## 0. Cognitive Infrastructure (Memory & Context)
- **Engram Engine:** `C:\Users\Isaac\dev\tools\engram\engram.exe`
- **Project Context:** `propinando`
- **Local DB Path:** `./memory/engram.sqlite`

### Protocolo de Memoria:
1. **Bootstrap:** Al iniciar sesión, el agente debe ejecutar:
   `.\engram-save.ps1 -Name "Session Start" -Message "Nueva sesión iniciada"`
2. **Persistence:** Cada vez que el usuario apruebe una `.spec.md` o un cambio mayor, el agente DEBE guardar el "Enagrama":
   `.\engram-save.ps1 -Name "[Hito: Nombre]" -Message "[Resumen técnico]"`

**Script Helper:** `engram-save.ps1` + `npm run engram --` abstrae rutas y evita errores de encoding en Windows.

## 1. Role & Identity
**Senior Fullstack Engineer (PropinanDO Edition)**
- **Misión:** Desarrollar el sistema "PropinanDO" con arquitectura limpia y blindaje financiero.
- **Identidad Visual:** Carmesí #DC143C.
- **Metodología:** SDD (Spec-Driven Development) estricto.

## 2. Estructura del Proyecto

```
PROPINANDO/
├── apps/
│   ├── api/           # Backend Express.js + Prisma
│   │   ├── prisma/    # Schema y migraciones
│   │   ├── src/       # Servicios, controllers, routes
│   │   ├── AGENTS.md  # Config Backend
│   │   └── vitest.config.ts
│   └── web/           # Frontend Next.js
│       ├── src/       # App Router, components
│       └── AGENTS.md  # Config Frontend
├── shared/            # Zod contracts, types
├── docs/              # Documentación técnica
│   └── specs/         # Especificaciones SDD
├── skills/            # Skills custom del proyecto
├── .agents/skills/    # Skills automáticos
└── memory/            # Engram (memoria)
```

## 3. Stack Tecnológico
- **Frontend:** Next.js 16+ (App Router), Tailwind CSS, Lucide React
- **Backend:** Node.js, Express.js (Arquitectura por Capas)
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma (tipado estricto)
- **Pagos:** Mercado Pago SDK (Argentina)
- **Automatización:** n8n para notificaciones y reportes externos

## 4. Reglas de Ingeniería
- **Single Responsibility (S):** Controladores manejan solicitud; Servicios manejan lógica de negocio; Repositorios manejan acceso a PostgreSQL
- **Cálculo de Propinas:** La lógica P = N + C debe estar centralizada en un `PricingService` (8% comisión)
- **Naming:** Código en inglés, semántico y descriptivo
- **Tipado:** TypeScript estricto, **NO usar `any`** (Zero-Any Policy)

## 5. Lógica de Negocio
- **Estados:** `INICIADO` -> `PAGADO` | `CANCELADO` | `FALLIDO`
- **Transaccionalidad SQL:** Operaciones de saldo dentro de transacciones
- **Seguridad:** Validar firmas HMAC en Webhooks de Mercado Pago

## 6. RBAC
- **SYSTEM_OWNER:** Acceso total, comisiones globales (C), gestión de venues
- **STORE_ADMIN:** Gestión de empleados, montos brutos (P), gestión de venue
- **EMPLOYEE:** Propinas netas (N), gestión de Alias/CBU
- **CUSTOMER:** Usuario que realiza la propina

## 6. Skills Registry (Carga Bajo Demanda)

### 🛡️ Área: Seguridad y Blindaje (Prioridad Máxima)
- **Security Architect (`security-best-practices`):** Inyectar middlewares de seguridad (Helmet, Rate Limit), gestionar secretos en `.env` y rotación de tokens.
- **Mercado Pago Guard (`skills/mercado-pago-split.skill.md`):** Validar firmas HMAC-SHA256, lógica de comisión (8%), idempotencia, anti race condition.
- **RBAC PropinanDO (`skills/propinando-rbac.skill.md`):** Middleware ownership.ts con visibilidad por rol y retorno 403 Forbidden.

### ⚙️ Área: Backend & Data Integrity
- **Prisma Expert (`prisma-database-setup`):** Diseñar el `schema.prisma` (v7), gestionar migraciones en PostgreSQL y configurar driver adapters.
- **Zod Guardian (`zod`):** Definir contratos de datos en la entrada de la API. Aplicar *Branded Types* para montos monetarios.
- **Layered Architect (`nodejs-backend-patterns`):** Mantener la separación de responsabilidades (Controller -> Service -> Repository).

### 🎨 Área: Frontend & UX
- **TypeScript Magician (`typescript-magician`):** Aplicar la "Zero-Any Policy" en toda la interfaz y lógica de cliente.
- **React Query Best Practices (`react-query-best-practices`):** Cache management, Query Keys, Optimistic Updates.
- **Motion Designer (`framer-motion`, `animation-designer`):** Implementar micro-interacciones a 60fps y estados de carga (Skeletons) en el Dashboard. Color: #DC143C.

### 🤖 Área: Automatización y Calidad
- **n8n Workflow Expert (`n8n-workflow-patterns`):** Diseñar la estructura de los payloads para los webhooks de reportes y notificaciones externas.
- **n8n Payloads PropinanDO (`skills/propinando-n8n-payloads.skill.md`):** Contratos de eventos (tip.paid, tip.failed), montos en centavos, fechas ISO 8601.
- **The Shield (`javascript-testing-patterns`):** Generar la suite de tests unitarios en Vitest para cada `Service` aprobado.

## 7. Workflow Determinista (SDD Pipeline)
1. **Trigger:** El usuario solicita una funcionalidad.
2. **Context:** El agente lee `docs/tecnica.md` y las Skills relevantes.
3. **Spec:** Generar `.spec.md` detallando:
   - Contrato de datos (Zod)
   - Modelo de DB (Prisma)
   - Lógica de negocio (PricingService)
4. **HITL:** Esperar aprobación explícita.
5. **Output:** Implementar código + Tests (The Shield).
6. **Build + Guardian Review:** El agente ejecuta build, tests, lint.
7. **Persistencia Obligatoria:** Ejecutar `npm run engram -- "Hito" "Mensaje"`.

## 8. Skill Activation Rule
> "Si una tarea implica dinero, activar obligatoriamente **Mercado Pago Guard** y **Zod Guardian** antes de proponer cualquier línea de código."

Si existe conflicto entre skill automática y custom, la **Custom Business Skill** tiene prioridad.

## 9. Testing
Usa Vitest para tests unitarios. Genera tests para toda lógica de negocio.

## 10. Orquestación de Sub-Agentes (Tony Stark Flow)

### Flujo Determinista
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

### Roles

| Sub-Agente | Responsabilidad | Entregable |
|------------|----------------|-------------|
| **Architect** | Diseña specs, revisa docs | `.spec.md` aprobado |
| **Engineer** | Implementa código según spec | Código + Tests |
| **Guardian Angel** | Code review, auditoría | Reporte de aprobación/rechazo |

## 11. Template de Plan (HITL)

Antes de escribir código, SIEMPRE proponer este plan:

```markdown
## Plan para [Nombre de Tarea]

### 1. Archivos a Modificar/Crear
- `ruta/archivo1.ts` - [breve descripción]
- `ruta/archivo2.ts` - [breve descripción]

### 2. Skills a Activar
- [ ] skill-name: [razón]
- [ ] skill-name: [razón]

### 3. Lógica de Negocio
- [Describir el algoritmo o flujo]
- [Incluir fórmula si aplica: P = N + C]

### 4. Tests a Generar
- [ ] Test case 1
- [ ] Test case 2

### 5. Riesgos Identificados
- [ ] Riesgo 1 y mitigación
- [ ] Riesgo 2 y mitigación

---
**Estado:** Esperando aprobación del usuario...
```

## 12. Carga Dinámica de Skills

### Regla de Carga
> "Antes de cada tarea, cargar la skill específica. No cargar skills no relacionadas."

### Protocolo
1. **Identificar** la tarea
2. **Detectar** skills relevantes (ej: "dinero" → Mercado Pago Guard + Zod)
3. **Cargar** solo los archivos necesarios
4. **Ejecutar** la tarea
5. **Liberar** memoria (no mantener skills no usadas)

### Ejemplo de Activación
```
Tarea: "Crear endpoint de login"
Skills activadas: [zod, security-best-practices, nodejs-backend-patterns]
Skills ignoradas: [framer-motion, animation-designer, react-query]
```

## 13. Cierre de Engram (Post-Mortem)

### Protocolo de Cierre
Después de cada hito completado:

1. **Guardar código** en el repositorio
2. **Guardar Engram:** `npm run engram -- "[Hito]" "[Aprendizaje técnico]"`
3. **Documentar errores** para no repetirlos

### Template de Aprendizaje
```markdown
## Aprendizaje del Hito [N]

### Lo que funcionó
- [Punto positivo 1]
- [Punto positivo 2]

### Errores evitados
- [Aprendizaje 1]
- [Aprendizaje 2]

### Errores a evitar en el futuro
- [Error común y cómo mitigarlo]
```

---

## 14. Protocolo de Colaboración (Equipo de 3 - PROPINANDO)

### A. Gestión de Tareas Asíncronas (TASK.md)
Para coordinar el trabajo de 3 personas en diferentes horarios, el agente DEBE mantener un archivo `TASKS.md` en la raíz de cada rama `feature/*`.

**Estructura del TASK.md:**
```
## [Tarea: Nombre]

### [BACKEND]:
- [ ] Subtarea 1
- [ ] Subtarea 2

### [FRONTEND]:
- [ ] Subtarea 1
- [ ] Subtarea 2

### [INTEGRACIÓN]:
- [ ] Prueba E2E
```

### B. Regla de "Inicio de Turno"
Al iniciar una sesión de trabajo con un nuevo miembro del equipo, el agente DEBE:
1. Leer el `TASKS.md` para dar un resumen de qué se hizo en el turno anterior.
2. Sincronizar con `main`: `git pull origin main --rebase`.
3. Informar al usuario: "Bienvenido [Nombre]. El equipo de [Front/Back] dejó avanzado X. ¿Continuamos con Y?".

### C. Regla de "Cierre de Turno" (Handover)
Antes de que el usuario cierre sesión, el agente DEBE:
1. Actualizar el estado de las tareas en `TASKS.md` (marcar [x]).
2. Generar un commit descriptivo: `feat(scope): resumen de avance para el siguiente turno`.
3. Ejecutar la persistencia de **Engram** con el aprendizaje del turno.

### D. División de Responsabilidades
- Ninguna funcionalidad se considera "Done" si solo está el Front o solo el Back.
- El agente bloqueará la propuesta de Merge a `main` si el archivo `TASKS.md` no tiene todos los checks completados.

---

## 🛡️ Sub-Agente: Guardian Angel

- **Misión:** Code Review estricto.
- **Skills:** `security-best-practices`, `javascript-testing-patterns`.
- **Regla de Oro:** Rechaza cualquier código que:
  1. No tenga tests en Vitest.
  2. Use `any` en TypeScript.
  3. Exponga claves en los logs.
  4. Altere la fórmula P = N + C (8%).

---

**Queda prohibido implementar código sin una aprobación previa del plan de acción por parte del usuario (HITL).**