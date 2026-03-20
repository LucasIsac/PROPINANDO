# ORCHESTRATION.md

> Guía de Orquestación con Sub-Agentes para PROPINANDO

## Arquitectura del Orquestador

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORQUESTADOR (opencode)                        │
│  - Coordina flujo SDD                                           │
│  - Pide HITL al usuario                                         │
│  - Delega tareas pesadas a sub-agentes                          │
│  - Engram = memoria de largo plazo                              │
│  - Contexto AGENTE = solo estado vivo                          │
└─────────────────┬───────────────────────────────────────────────┘
                  │
          ┌───────┼───────────┐
          ▼       ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ SUB-AGENT│ │ SUB-AGENT│ │ SUB-AGENT│
    │ Backend  │ │ Frontend │ │  Tests   │
    │ Specialist│ │ Expert   │ │  Shield  │
    └──────────┘ └──────────┘ └──────────┘
          │       │           │
          └───────┼───────────┘
                  ▼
              ┌──────────────┐
              │ Engram (MEM) │
              │ Contexto     │
              │ Compartido   │
              └──────────────┘
```

## Flujo de Trabajo

### Paso 1: Delegación Simultánea
El orquestador envía tareas específicas a sub-agentes usando el tool `task`:
```javascript
// Ejemplo: SPEC-003 Mercado Pago
task({
  description: "Backend: Webhook + HMAC validación",
  prompt: "...instrucciones detalladas...",
  subagent_type: "general"
})

task({
  description: "Frontend: Checkout redirect + status polling", 
  prompt: "...instrucciones detalladas...",
  subagent_type: "general"
})
```

### Paso 2: Ejecución Paralela
Cada sub-agente:
1. Recibe su task específica
2. Trabaja con contexto liviano (solo lo necesario)
3. Valida su output contra `shared/contracts/` (obligatorio)
4. Guarda resultado en Engram con mensaje específico
5. Finaliza

### Paso 3: Validación de Consistencia Cruzada (Orquestador)
**Esta es la responsabilidad crítica del orquestador después de recibir ambos Engram saves.**

#### Checklist de Consistencia Cruzada:
El orquestador DEBE verificar que los outputs de diferentes sub-agentes sean compatibles usando los contratos compartidos como referencia.

| Contrato | Backend debe usar | Frontend debe usar | Verificación |
|----------|------------------|-------------------|--------------|
| **TipStatus** | `PAGADO`, `FALLIDO`, etc. | `PAGADO`, `FALLIDO`, etc. | Mismo valor enum |
| **TipId** | UUID (ej: "550e8400-e29b-41d4-a716-446655440000") | UUID (mismo formato) | Formato UUID válido |
| **MoneyInCents** | Integer (ej: 125050 para $1250.50) | Integer (mismo formato) | Número entero, sin decimales |
| **Usuario ID** | UUID reference | UUID reference | Misma entidad |
| **Venue ID** | UUID reference | UUID reference | Misma entidad |

#### Cómo verificar:
1. **Leer de Engram**: Obtener los últimos mensajes guardados por cada sub-agente
2. **Revisar outputs**: Checkear los archivos que cada sub-agente creó/modificó
3. **Validar contratos**: Confirmar que ambos usan los mismos tipos de `shared/contracts/`
4. **Confirmar compatibilidad**: Que lo que backend guarda es lo que frontend puede leer

#### Ejemplo concreto (SPEC-003):
- **Backend guarda**: Tip con `status = 'PAGADO'`, `amountInCents = 125050`
- **Frontend debe leer**: Mismo tip con `status === 'PAGADO'`, `amountInCents === 125050`
- **Verificación**: Orquestador confirma que ambos usan los valores idénticos de los contratos

### Paso 4: HITL al Usuario
Solo después de validar la consistencia cruzada, el orquestador presenta:
```
"SPEC-003 listo para review: 
- Backend: Webhook service con HMAC validación 
- Frontend: Checkout redirect y status polling
Consistencia verificada: TipStatus, TipId, MoneyInCents alineados"
```

### Paso 5: Aprobación y Persistencia
Tras aprobación explícita del usuario:
```bash
npm run engram -- "Hito: Nombre" "Descripción técnica del logro"
```

## Comandos de Ejemplo

### Delegar tarea a Backend Specialist:
```bash
task(description="Implementar validación HMAC para webhooks", 
     prompt="Crear service que valide HMAC-SHA256 de webhooks de Mercado Pago. Usar shared/contracts/ para TipStatus. Guardar en Engram cuando tests pasen.",
     subagent_type="general")
```

### Delegar tarea a Frontend Architect:
```bash
task(description="Implementar componente de estado de propina",
     prompt="Crear TipStatus.tsx que haga polling a /api/tips/[id]/status. Mostrar estados PENDING/PAID/FAILED. Usar mismos TipStatus que backend.",
     subagent_type="general")
```

### Verificar Engram save de sub-agente:
```bash
# Después de que sub-agente termine, verificar en Engram:
npm run engram -- list  # o consultar memory/engram.db directamente
```

## Troubleshooting

### Problema: Sub-agente no guarda en Engram
**Solución:** 
1. Recordarle en el prompt re-enviado: "Recuerda: DEBES guardar tu resultado en Engram con npm run engram -- '[Hito]' '[Mensaje]'"
2. Especificar exactamente qué mensaje esperar
3. Si persiste, escalar a HITL con evidencia de lo que sí hizo

### Problema: Inconsistencia de contratos detectada
**Solución:**
1. Identificar qué sub-agente tiene el error
2. Re-delegar tarea específica: "Corregir [archivo] para usar TipStatus de shared/contracts/ en lugar de [valor incorrecto]"
3. Proveer ejemplo correcto del contrato
3. Esperar su Engram save corregido

### Problema: Timeout en sub-agente
**Solución:**
1. Revisar si la tarea era demasiado grande
2. Re-delegar con subtareas más pequeñas y específicas
3. Proveer starting point o código base si es necesario
4. Escalar a HITL si 2 intentos fallan

## Buenas Prácticas

### Para el Orquestador:
- Siempre definir tareas acotadas (15 minutos max estimados)
- Ser específico en los prompts: qué archivos crear, qué validar, qué guardar en Engram
- Verificar que cada sub-agente menciona su uso de `shared/contracts/` en su Engram save
- Nunca asumir consistencia: siempre verificar el Paso 3

### Para los Sub-Agentes:
- Antes de guardar en Engram, confirmar que usaste los tipos de `shared/contracts/`
- Tu Engram save debe incluir: ubicación de archivos cambiados, qué implementaste, estado de tests
- Si no estás seguro de un contrato, pregunta antes de asumir

### Engram como memoria compartida:
- Los sub-agentes escriben sus resultados individuales
- El orquestador lee y verifica la consistencia
- Engram se convierte en el "acuerdo de hechos" entre sub-agentes
- El HITL ve el trabajo ya validado y consistente

## Integración con existentes

Este flujo se integra con:
- **AGENTS.md**: Protocolo de memoria (Engram save)
- **PROJECT.md**: Documentación de arquitectura
- **docs/ENGRAM.md**: Guía de automatización de memoria
- **AGENTS-ORCHESTRATOR.md**: Rol detallado del orquestador

---
*Última actualización: $(date)*