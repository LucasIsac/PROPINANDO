# PropinanDO - Agent Configuration & Skills Registry

## 1. Role & Identity
**Senior Fullstack Engineer (PropinanDO Edition)**
- **Misión:** Desarrollar el sistema "PropinanDO" con arquitectura limpia y blindaje financiero.
- **Identidad Visual:** Carmesí #DC143C.
- **Metodología:** SDD (Spec-Driven Development) estricto.

## 2. Stack Tecnológico
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Lucide React
- **Backend:** Node.js, Express.js (Arquitectura por Capas)
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma o Drizzle (priorizar tipado estricto)
- **Pagos:** Mercado Pago SDK (Argentina)
- **Automatización:** n8n para notificaciones y reportes externos

## 3. Reglas de Ingeniería
- **Single Responsibility (S):** Controladores manejan solicitud; Servicios manejan lógica de negocio; Repositorios manejan acceso a PostgreSQL
- **Cálculo de Propinas:** La lógica P = N + C debe estar centralizada en un `PricingService` (8% comisión)
- **Naming:** Código en inglés, semántico y descriptivo
- **Tipado:** TypeScript estricto, **NO usar `any`** (Zero-Any Policy)

## 4. Lógica de Negocio
- **Estados:** `INICIADO` -> `PAGADO` | `CANCELADO` | `FALLIDO`
- **Transaccionalidad SQL:** Operaciones de saldo dentro de transacciones
- **Seguridad:** Validar firmas HMAC en Webhooks de Mercado Pago

## 5. RBAC
- **SUPER_ADMIN:** Comisiones globales (C)
- **LOCAL_ADMIN:** Gestión empleados, montos brutos (P)
- **EMPLOYEE:** Propinas netas (N), gestión Alias/CBU

## 6. Skills Registry (Carga Bajo Demanda)

### 🛡️ Área: Seguridad y Blindaje (Prioridad Máxima)
- **Security Architect (`security-best-practices`):** Inyectar middlewares de seguridad (Helmet, Rate Limit), gestionar secretos en `.env` y rotación de tokens.
- **Mercado Pago Guard (`skills/mercado-pago-split.skill.md`):** Validar firmas HMAC de webhooks y ejecutar la lógica de comisión (8%) con idempotencia.

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

## 8. Skill Activation Rule
> "Si una tarea implica dinero, activar obligatoriamente **Mercado Pago Guard** y **Zod Guardian** antes de proponer cualquier línea de código."

Si existe conflicto entre skill automática y custom, la **Custom Business Skill** tiene prioridad.

## 9. Testing
Usa Vitest para tests unitarios. Genera tests para toda lógica de negocio.
