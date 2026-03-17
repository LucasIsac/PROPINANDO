# Skill: PropinanDO RBAC (Role-Based Access Control)

## Contexto
Esta skill define las reglas de control de acceso basado en roles para PropinanDO, implementando visibilidad por rol y protección de recursos mediante middleware.

## Roles del Sistema

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **SYSTEM_OWNER** | Administrador máximo del sistema | Total: venues, empleados, comisiones globales, configuración |
| **STORE_ADMIN** | Administrador de un venue | Gestión de empleados del venue, montos brutos (P), reportes |
| **EMPLOYEE** | Empleado del venue | Propinas netas (N) propias, gestión de Alias/CBU |
| **CUSTOMER** | Cliente que da propina | Solo puede realizar propinas, ver historial propio |

## Reglas de Visibilidad por Rol

### SYSTEM_OWNER
- Ver todos los venues
- Ver todas las propinas (gross, commission, net)
- Modificar comisión global (`propinando_config.commission_rate`)
- Acceso a audit_log completo

### STORE_ADMIN
- Ver empleados de **su** venue (`venue_id` === user.venue_id)
- Ver propinas brutas (P) del venue
- Ver comisión aplicada (C) del venue
- **NO** ver netos individuales de otros empleados
- Crear/editar empleados de su venue

### EMPLOYEE
- Ver **solo sus propias** propinas netas (N)
- Ver su Alias y CBU propio
- **NO** puede ver propinas de otros empleados
- **NO** puede ver información del venue

### CUSTOMER
- Solo puede crear propinas (sin registro)
- Ver historial de propinas realizadas (por email/token)

## Middleware: ownership.ts

El middleware debe verificar propiedad de recursos y devolver **403 Forbidden** (nunca 404).

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';

enum UserRole {
  SYSTEM_OWNER = 'SYSTEM_OWNER',
  STORE_ADMIN = 'STORE_ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER'
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    venue_id?: string;
  };
}

export function ownership(
  resource: 'tip' | 'employee' | 'venue' | 'sector',
  ownershipField: string
) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const resourceId = req.params.id;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // SYSTEM_OWNER tiene acceso a todo
    if (user.role === UserRole.SYSTEM_OWNER) {
      return next();
    }

    try {
      let hasAccess = false;

      switch (resource) {
        case 'tip':
          const tip = await prisma.tip.findUnique({
            where: { id: resourceId }
          });
          
          if (user.role === UserRole.STORE_ADMIN) {
            hasAccess = tip?.venue_id === user.venue_id;
          } else if (user.role === UserRole.EMPLOYEE) {
            hasAccess = tip?.employee_id === user.id;
          }
          break;

        case 'employee':
          const employee = await prisma.employee.findUnique({
            where: { id: resourceId }
          });
          
          if (user.role === UserRole.STORE_ADMIN) {
            hasAccess = employee?.venue_id === user.venue_id;
          } else if (user.role === UserRole.EMPLOYEE) {
            hasAccess = employee?.user_id === user.id;
          }
          break;
          
        // ... otros casos
      }

      if (!hasAccess) {
        // SIEMPRE 403, nunca 404
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'No tienes acceso a este recurso'
        });
      }

      next();
    } catch (error) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Error al verificar permisos'
      });
    }
  };
}
```

## Reglas Importantes

1. **403 vs 404:** Si un recurso existe pero no pertenece al usuario, devolver **403 Forbidden** (nunca 404 para evitar enumeration attacks)

2. **Visibilidad de Montos:**
   - STORE_ADMIN: Ve P (bruto) y C (comisión)
   - EMPLOYEE: Solo ve N (neto)
   - CUSTOMER: No ve montos

3. **Middleware Chain:**
   ```
   authMiddleware -> roleMiddleware -> ownershipMiddleware -> controller
   ```

4. **Consultas con Filtrado:**
   ```typescript
   // Siempre filtrar por venue_id para STORE_ADMIN
   const tips = await prisma.tip.findMany({
     where: {
       venue_id: user.venue_id  // Filtrado obligatorio
     }
   });
   ```
