# AGENTS.md - Documentación del Sistema de Agentes

## ¿Qué es AGENTS.md?

`AGENTS.md` es el archivo de configuración central que define cómo OpenCode (el agente de IA) debe comportarse, qué reglas seguir y qué herramientas/skills tiene disponibles al trabajar en el proyecto PropinanDO.

## ¿Por qué existe?

1. **Consistencia**: Define un marco de trabajo uniforme para todas las interacciones con el agente.
2. **Control**: Establece reglas de ingeniería específicas del proyecto (SDD, Zero-Any Policy, etc.).
3. **Autonomía guiada**: Permite que el agente tome decisiones correctas sin preguntar detalles básicos en cada paso.
4. **Skills organizados**: Agrupa las capacidades disponibles por área (seguridad, backend, frontend, calidad).

## ¿Para qué sirve?

- **Configurar el rol**: Define al agente como "Senior Fullstack Engineer" especializado en el stack PERN.
- **Establecer reglas**: Prohíbe el uso de `any`, define el 8% de comisión, el color Carmesí #DC143C.
- **Activar skills**: Permite que el agente cargue y use las skills automáticamente según la tarea.
- **Workflow SDD**: Implementa el flujo Spec-Driven Development para cada funcionalidad.

## ¿Cómo trabaja OpenCode con AGENTS.md?

1. **Al iniciar**: OpenCode lee automáticamente `AGENTS.md` del proyecto.
2. **Interpretación**: Extrae el rol, reglas, workflow y skills disponibles.
3. **Selección de skills**: Según la tarea, OpenCode carga las skills relevantes (ej: si es tarea de dinero, activa Mercado Pago Guard + Zod).
4. **Aplicación**: Sigue las reglas definidas (SDD pipeline, testing con Vitest, etc.).

## Skills del Proyecto

### 🛡️ Seguridad y Blindaje

| Skill | Descripción |
|-------|-------------|
| **Security Architect** (`security-best-practices`) | Inyecta middlewares de seguridad (Helmet, Rate Limit), gestiona secretos en `.env` y rotación de tokens. Protege contra OWASP Top 10. |
| **Mercado Pago Guard** (`skills/mercado-pago-split.skill.md`) | Valida firmas HMAC de webhooks, ejecuta lógica de comisión (8%), garantiza idempotencia en pagos. |

### ⚙️ Backend y Datos

| Skill | Descripción |
|-------|-------------|
| **Prisma Expert** (`prisma-database-setup`) | Diseña schema Prisma v7, gestiona migraciones en PostgreSQL, configura driver adapters. Modelado relacional seguro. |
| **Zod Guardian** (`zod`) | Define contratos de datos en frontera de API. Aplica *Branded Types* para montos monetarios (ej: `type Money = number & Brand<"Money">`). |
| **Layered Architect** (`nodejs-backend-patterns`) | Mantiene separación Controller -> Service -> Repository. Aplica Clean Architecture y manejo global de errores. |

### 🎨 Frontend y UX

| Skill | Descripción |
|-------|-------------|
| **TypeScript Magician** (`typescript-magician`) | Aplica "Zero-Any Policy" en toda la interfaz y lógica de cliente. Elimina tipos `any`, crea tipos estrictos. |
| **React Query Best Practices** (`react-query-best-practices`) | Gestión de cache, Query Key Factories, Optimistic Updates, invalidación correcta de queries. |
| **Motion Designer** (`framer-motion`, `animation-designer`) | Implementa micro-interacciones a 60fps, estados de carga (Skeletons), animaciones con identidad visual #DC143C. |

### 🤖 Automatización y Calidad

| Skill | Descripción |
|-------|-------------|
| **n8n Workflow Expert** (`n8n-workflow-patterns`) | Diseña estructura de payloads para webhooks de reportes y notificaciones externas. |
| **The Shield** (`javascript-testing-patterns`) | Genera suite de tests unitarios en Vitest para cada Service. Asegura cobertura de lógica de negocio. |

## Reglas Clave del Proyecto

- **Comisión:** 8% fijo (P × 0.08 = C)
- **Palabra prohibida:** `any` (Zero-Any Policy)
- **Color primario:** #DC143C (Carmesí)
- **Workflow:** SDD (Spec-Driven Development)
- **Estados de transacción:** INICIADO → PAGADO | CANCELADO | FALLIDO
- **Testing:** Vitest para unit tests

## Activación de Skills

### Regla Principal
> "Si una tarea implica dinero, activar obligatoriamente **Mercado Pago Guard** y **Zod Guardian** antes de proponer cualquier línea de código."

### Prioridad
Si existe conflicto entre una skill automática y una custom (del proyecto), la **Custom Business Skill** siempre tiene prioridad.

## Ejemplo de Flujo de Trabajo

1. Usuario solicita: "Crear endpoint para registrar empleado"
2. OpenCode consulta `docs/tecnica.md` y AGENTS.md
3. Activa skills: Zod Guardian + Layered Architect + Prisma Expert
4. Genera `.spec.md` con contrato Zod, modelo Prisma, lógica
5. Espera aprobación (HITL)
6. Implementa código + tests con Vitest
