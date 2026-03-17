# Skill: PropinanDO n8n Payloads

## Contexto
Esta skill define los contratos de eventos y estructura de payloads para la integración con n8n (workflows de notificación y reportería).

## Reglas Generales

1. **Montos en centavos:** Todos los montos deben enviarse como **integer** (centavos), nunca como decimal
2. **Fechas en ISO 8601:** Usar formato `YYYY-MM-DDTHH:mm:ss.sssZ`
3. **Eventos:** n8n consumirá webhooks del backend para procesar flujos automatizados

---

## Contratos de Eventos

### 1. tip.paid (Propina Pagada)

Se dispara cuando una propina es confirmada como pagada.

```json
{
  "event": "tip.paid",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "data": {
    "tip_id": "uuid-v4",
    "external_reference": "uuid-v4",
    "venue": {
      "id": "uuid-v4",
      "name": "Restaurante Ejemplo",
      "cuit": "30-12345678-9"
    },
    "employee": {
      "id": "uuid-v4",
      "display_name": "Juan Pérez",
      "alias": "juan.perez"
    },
    "amounts": {
      "gross_amount": 1000,
      "commission_amount": 80,
      "net_amount": 920
    },
    "payment": {
      "mp_preference_id": "MLA123456789",
      "mp_payment_id": "1234567890",
      "payment_method": "qr",
      "card_brand": null
    },
    "customer": {
      "email": "cliente@email.com"
    },
    "metadata": {
      "rating": 5,
      "comment": "Excelente servicio!"
    }
  }
}
```

### 2. tip.failed (Propina Fallida)

Se dispara cuando falla el pago de una propina.

```json
{
  "event": "tip.failed",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "data": {
    "tip_id": "uuid-v4",
    "external_reference": "uuid-v4",
    "venue": {
      "id": "uuid-v4",
      "name": "Restaurante Ejemplo"
    },
    "employee": {
      "id": "uuid-v4",
      "display_name": "Juan Pérez"
    },
    "amounts": {
      "gross_amount": 1000,
      "commission_amount": 80,
      "net_amount": 920
    },
    "failure": {
      "reason": "payment_method_rejected",
      "detail": "Card rejected by issuer"
    }
  }
}
```

### 3. tip.cancelled (Propina Cancelada)

Se dispara cuando el usuario cancela el pago.

```json
{
  "event": "tip.cancelled",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "data": {
    "tip_id": "uuid-v4",
    "external_reference": "uuid-v4",
    "venue": {
      "id": "uuid-v4",
      "name": "Restaurante Ejemplo"
    },
    "employee": {
      "id": "uuid-v4",
      "display_name": "Juan Pérez"
    },
    "amounts": {
      "gross_amount": 1000
    },
    "cancelled_by": "customer"
  }
}
```

### 4. employee.registered (Empleado Registrado)

Notificación cuando un nuevo empleado se registra en el sistema.

```json
{
  "event": "employee.registered",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "data": {
    "employee_id": "uuid-v4",
    "venue": {
      "id": "uuid-v4",
      "name": "Restaurante Ejemplo"
    },
    "employee": {
      "display_name": "María González",
      "alias": "maria.gonzalez",
      "sector": "Mozo"
    }
  }
}
```

### 5. weekly.report (Reporte Semanal)

Reporte semanal de propinas para STORE_ADMIN.

```json
{
  "event": "weekly.report",
  "timestamp": "2024-01-15T09:00:00.000Z",
  "data": {
    "period": {
      "start": "2024-01-08T00:00:00.000Z",
      "end": "2024-01-14T23:59:59.999Z"
    },
    "venue": {
      "id": "uuid-v4",
      "name": "Restaurante Ejemplo"
    },
    "summary": {
      "total_tips": 150,
      "total_gross_amount": 150000,
      "total_commission_amount": 12000,
      "total_net_amount": 138000,
      "average_rating": 4.5,
      "top_employees": [
        { "display_name": "Juan Pérez", "total_net": 45000 },
        { "display_name": "María González", "total_net": 38000 }
      ]
    },
    "by_sector": [
      {
        "sector": "Mozo",
        "tips_count": 80,
        "total_gross": 80000
      },
      {
        "sector": "Cocina",
        "tips_count": 70,
        "total_gross": 70000
      }
    ]
  }
}
```

---

## Webhook Configuration (n8n)

### Endpoint de Recepción
```
POST /api/webhooks/n8n
```

### Headers Requeridos
```http
Content-Type: application/json
X-Webhook-Secret: ${N8N_WEBHOOK_SECRET}
```

### Configuración de n8n

1. **Webhook Node:** Configurar como receptor "Response Mode: on Received"
2. **Filter:** Usar `{{ $json.event }}` para filtrar tipos de eventos
3. **Send Email / Telegram:** Conectar según tipo de evento

---

## Errores y Retry

- n8n debe responder con **2xx** dentro de 10 segundos
- Si falla, el backend reintentará hasta 3 veces con backoff exponencial
- Logs de errores se almacenan en `audit_log` con `entity: 'n8n_webhook'`
