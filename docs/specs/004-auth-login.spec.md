# SPEC-004: RF-E03 Login & Authentication

> **Estado:** ✅ IMPLEMENTED  
> **Fecha:** 2026-03-20  
> **Responsable:** Back (Tincho)

---

## 1. Contrato de Datos (Zod)

```typescript
// Login Request
const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Login Response
{
  status: 'success',
  data: {
    user: {
      id: UUID,
      email: string,
      firstName: string,
      lastName: string,
      role: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'EMPLOYEE',
      employeeId?: UUID,
    },
    accessToken: string,  // JWT 15min
    refreshToken: string, // 7 días
  }
}

// Refresh Request
{ refreshToken: string }

// Logout Request (opcional)
{ refreshToken?: string }
```

---

## 2. Modelo de DB (Prisma)

### User
```prisma
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  firstName    String
  lastName     String
  role         UserRole
  isActive     Boolean   @default(true)
  // ...
}
```

### RefreshToken
```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  userId    String
  tokenHash String   // bcrypt hash
  expiresAt DateTime
  revoked   Boolean  @default(false)
  // ...
}
```

---

## 3. Lógica de Negocio

### Flujo Login
```
1. Validar input con Zod (email, password)
2. Buscar usuario por email en DB
3. Si no existe → 401 Unauthorized
4. Verificar isActive → si false → 401
5. Comparar password con bcrypt.compare()
6. Si falla → 401 Unauthorized
7. Generar JWT (15min) + Refresh Token (7d)
8. Guardar hash del refresh token en DB
9. Devolver tokens + datos de usuario
```

### Flujo Refresh
```
1. Validar refreshToken existe
2. Verificar tipo es 'refresh'
3. Buscar refresh tokens activos del usuario
4. Comparar con bcrypt (token rotation)
5. Si válido → invalidar tokens antiguos
6. Generar nuevos access + refresh tokens
7. Devolver nuevos tokens
```

### Flujo Logout
```
1. Marcar todos los refresh tokens del usuario como revoked
2. Opcional: recibe refreshToken específico para revocar solo ese
```

---

## 4. Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Login con email/password |
| POST | `/api/auth/refresh` | No | Refrescar tokens |
| POST | `/api/auth/logout` | JWT | Cerrar sesión actual |
| POST | `/api/auth/logout-all` | JWT | Cerrar todas las sesiones |
| GET | `/api/auth/me` | JWT | Obtener usuario actual |

---

## 5. Archivos Creados

```
apps/api/src/
├── middleware/
│   ├── auth.ts              # JWT verify/generate
│   └── ownership.ts         # RBAC checks
├── services/
│   └── auth.service.ts      # Login, refresh, logout
├── controllers/
│   └── auth.controller.ts   # HTTP handlers
├── routes/
│   └── auth.routes.ts       # Route definitions
├── utils/
│   ├── errors.ts            # Custom errors
│   └── handlers.ts          # Error handler, async wrapper
└── env.d.ts                 # Process.env types
```

---

## 6. Middleware Auth

```typescript
// extractUserFromToken - verifica JWT y agrega user al request
// requireRole(...roles) - verifica que el usuario tenga el rol
```

---

## 7. Tests

| Test | Descripción |
|------|-------------|
| validate email format | Email válido/inválido |
| validate password | Password vacío/válido |
| JWT payload structure | Estructura correcta del payload |
| UUID validation | Formato UUID válido |
| password hashing | bcrypt compare y hash |
| refresh token expiration | Cálculo de 7 días |
| error handling | UnauthorizedError status 401 |
| user role validation | Roles válidos vs inválidos |

**Resultado:** 10 tests ✅

---

## 8. Seguridad

- [x] Rate limiting en `/api/auth/login` (5 intentos/15min)
- [x] bcrypt para passwords (nunca plain text)
- [x] Refresh token rotation
- [x] JWT con expiración corta (15min)
- [x] No exponer passwords en responses
- [x] Validación Zod en input
