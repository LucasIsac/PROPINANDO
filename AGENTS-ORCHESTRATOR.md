# AGENTS-ORCHESTRATOR.md

> Rol del Orquestador en el flujo Tony Stark con Sub-Agentes

## 1. Rol y Responsabilidades

El Orquestador coordina el flujo de trabajo SDD (Spec-Driven Development) delegando tareas específicas a Sub-Agentes especializados, manteniendo el contexto compartido en Engram y asegurando la consistencia antes del HITL.

### Responsabilidades principales:
- **Declarar intención**: Antes de cada tarea, definir qué Sub-Agente participa y qué entregable espera.
- **Delegar tareas**: Enviar tareas claras y acotadas a Sub-Agentes mediante el tool `task`.
- **Recopilar resultados**: Esperar que cada Sub-Agente guarde su output en Engram.
- **Validar consistencia**: Verificar que los outputs de diferentes Sub-Agentes sean compatibles (contratos compartidos).
- **Gestión de fallos**: Aplicar retry, timeout o escalar a HITL según corresponda.
- **HITL final**: Presentar el trabajo ensamblado al usuario para aprobación explícita.
- **Persistencia**: Ejecutar `npm run engram` tras cada hito aprobado.

## 2. Flujo de Orquestación

```
┌─────────────────────┐
│  ORQUESTADOR        │
│  (Este agente)      │
└─────────┬───────────┘
          │
  ┏━━━━━━━┻━━━━━━━┓
  ▼               ▼
Sub-Agente A   Sub-Agente B
  │               │
  ▼               ▼
Engram:       Engram:
[Output A]    [Output B]
  │               │
  └───────┬───────┘
          ▼
   Validar consistencia (Paso 3)
          │
          ▼
        HITL (Usuario)
          │
          ▼
   npm run engram -- "Hito" "Mensaje"
```

## 3. Protocolo de Delegación

### Formato de task para Sub-Agente:
```bash
task(description="[Breve descripción]", prompt="[Instrucciones específicas]", subagent_type="[tipo]")
```

### Requisitos de la task:
- **Objetivo claro**: Qué debe producir el Sub-Agente.
- **Entradas**: Qué datos o archivos puede leer.
- **Salidas**: Qué debe guardar en Engram y/o en el sistema de archivos.
- **Límites**: Qué NO debe hacer (evitar alcance excesivo).
- **Engram save**: Mensaje esperado que debe guardar en Engram.

### Tipos de Sub-Agente disponibles:
- `general`: Agent de propósito completo para tareas complejas.
- `explore`: Agent especializado en exploration de código (búsqueda, lectura).

## 4. Manejo de Fallos

### Escenarios y acciones:

| Situación | Acción del Orquestador |
|-----------|------------------------|
| **Timeout** (> 5 min sin respuesta) | Reintentar hasta 2 veces con prompt simplificado, luego escalar a HITL con mensaje: `[Sub-Agente] no respondió tras 2 intentos.` |
| **Sub-Agente falla** (error en task output) | Analizar error, re-delegar con más detalles en prompt. Si falla 2da vez, escalar a HITL con trace. |
| **No guarda en Engram** | Recordarle al Sub-Agente: `Debes guardar resultado en Engram con npm run engram`. Reintentar task. Si falla, escalar a HITL. |
| **Output inconsistente** | Orquestador verifica contratos y pide corrección específica al Sub-Agente correspondiente. |
| **Engram save fallido** | Verificar `memory/` existe y permisos. Reintentar save manualmente. Si falla, escalar a HITL con error de sistema. |

### Escalada a HITL:
El Orquestador debe presentar al usuario:
- Qué Sub-Agente falló
- Qué intentó hacer (task prompt resumido)
- Cuál fue el error concreto
- Sugerencia de corrección o decisión de continuar/abortar.

## 5. Buenas Prácticas

### Antes de delegar:
- Confirmar que la tarea es lo suficientemente acotada para un Sub-Agente (máx 15 minutos estimados).
- Verificar que los skills necesarios están disponibles para ese tipo de agente.
- Definir exactamente qué debe guardarse en Engram (formato esperado del mensaje).

### Después de recibir output:
- Validar que el mensaje de Engram save se recibió en memoria.
- Verificar que los archivos esperados existen y son correctos (ls, cat).
- Confirmar consistencia con otros Sub-Agentes antes de HITL (ver Paso 3).

### Comunicación:
- Mantener lenguaje claro y técnico en las tasks.
- Usar formato Markdown en prompts cuando sea necesario para claridad (listas, código).
- Siempre especificar el proyecto `"propinando"` en llamadas a Engram.

## 6. Ejemplo Completo

### Tarea: Implementar webhook de Mercado Pago (SPEC-003)

**Orquestador:**
```bash
# Delegación simultánea de ambas tareas
task(description="Backend: Implementar webhook con HMAC validación", prompt="Crear service y controller para webhook de Mercado Pago con validación HMAC-SHA256 y idempotencia. Guardar en Engram cuando tests pasen.", subagent_type="general")
task(description="Frontend: Implementar redirect post-pago", prompt="Crear páginas de success/failure y componente TipStatus para polling. Guardar en Engram cuando UI esté lista.", subagent_type="general")
```

**Sub-Agente Backend Specialist (recibe):**
- Implementa `apps/api/src/services/webhook.service.ts` con `validateHmacSignature`, `processPaymentNotification`
- Implementa `apps/api/src/controllers/webhook.controller.ts`
- Crea tests en `__tests__/webhook.service.test.ts`
- **Antes de Engram save:** Valida que usa `shared/contracts/` para TipStatus, MoneyInCents
- Guarda en Engram: `"SPEC-003-Backend: Webhook service con HMAC validación y idempotencia implementados. Tests pasan."`

**Sub-Agente Frontend Architect (recibe):**
- Implementa `apps/web/src/app/tip/[tipId]/success/page.tsx`
- Implementa `apps/web/src/app/tip/[tipId]/failure/page.tsx`
- Implementa `apps/web/src/components/TipStatus.tsx` con polling
- **Antes de Engram save:** Valida que usa mismos TipStatus y MoneyInCents que backend
- Guarda en Engram: `"SPEC-003-Frontend: Páginas de success/failure y componente TipStatus con polling implementados."`

**Orquestador (después de recibir ambos Engram saves):**
1. Verifica que ambos mensajes de Engram save existen
2. **Paso 3 - Validación de consistencia cruzada:**
   - Confirma que ambos usan `TipStatus.PAGADO` (de shared/contracts)
   - Confirma que ambos usan `TipId` como UUID (de shared/contracts)
   - Confirma que ambos usan montos en `MoneyInCents` (de shared/contracts)
3. HITL al usuario: `"SPEC-003 listo para review: Backend (webhook+HMAC) + Frontend (redirects)"`
4. Tras aprobación explícita: Ejecuta `npm run engram -- "SPEC-003 Mercado Pago" "Webhook HMAC + redirect completados. Consistencia verificada."`
