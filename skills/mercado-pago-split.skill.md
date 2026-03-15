# Skill: Mercado Pago Split Payment (PropinanDO Standard)

## Contexto
Esta skill rige la creación de preferencias de pago y la división de fondos entre Empleado y Plataforma para cumplir con el punto 9.1 y 9.2 de la documentación técnica.

## Instrucciones de Ejecución
1. **Cálculo de Fondos (P, C, N):**
   - Siempre calcular la Comisión (C) como: `Monto Bruto * 0.08`.
   - Siempre calcular el Neto (N) como: `Monto Bruto - C`.
   - Validar que `N + C === Monto Bruto` antes de llamar al SDK.

2. **Configuración del Marketplace:**
   - La transacción DEBE usar el modelo de `application_fee`.
   - El `collector_id` debe ser el ID de Mercado Pago del Empleado obtenido mediante OAuth.
   - El `external_reference` debe ser un UUID v4 generado en el backend y guardado en PostgreSQL.

3. **Seguridad de Webhooks:**
   - No procesar estados `PAGADO` sin validar la firma HMAC.
   - Implementar lógica de idempotencia: si el UUID ya está marcado como `PAGADO`, ignorar notificaciones duplicadas.

## Capacidades
- Conocimiento de los endpoints de `/checkout/preferences` de Mercado Pago Argentina.
- Gestión de tokens OAuth para vendedores (empleados).