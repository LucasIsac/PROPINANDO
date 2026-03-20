import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';

export class ForbiddenError extends Error {
  constructor(message: string = 'No tienes permisos para acceder a este recurso') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export function checkTipOwnership(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const { role, userId, employeeId } = req.user;
  const tipId = req.params.id;

  switch (role) {
    case 'SUPER_ADMIN':
      next();
      return;

    case 'STORE_ADMIN':
      next();
      return;

    case 'EMPLOYEE':
      if (employeeId) {
        req.params.employeeId = employeeId;
        next();
        return;
      }
      res.status(403).json({ error: 'Empleado no vinculado a un employee' });
      return;

    default:
      res.status(403).json({ error: 'Rol no autorizado' });
  }
}

export function checkVenueAdminOwnership(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const { role, userId } = req.user;
  const venueId = req.params.venueId || req.body.venueId;

  switch (role) {
    case 'SUPER_ADMIN':
      next();
      return;

    case 'STORE_ADMIN':
      if (venueId) {
        next();
        return;
      }
      res.status(400).json({ error: 'venueId es requerido' });
      return;

    case 'EMPLOYEE':
      res.status(403).json({ error: 'Los empleados no pueden administrar venues' });
      return;

    default:
      res.status(403).json({ error: 'Rol no autorizado' });
  }
}

export function checkEmployeeOwnership(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const { role, userId, employeeId } = req.user;
  const targetEmployeeId = req.params.employeeId || req.params.id;

  switch (role) {
    case 'SUPER_ADMIN':
      next();
      return;

    case 'STORE_ADMIN':
      next();
      return;

    case 'EMPLOYEE':
      if (employeeId === targetEmployeeId) {
        next();
        return;
      }
      res.status(403).json({ error: 'Solo puedes acceder a tu propio perfil' });
      return;

    default:
      res.status(403).json({ error: 'Rol no autorizado' });
  }
}

export function requireEmployee(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  if (req.user.role !== 'EMPLOYEE') {
    res.status(403).json({ error: 'Esta acción es solo para empleados' });
    return;
  }

  if (!req.user.employeeId) {
    res.status(403).json({ error: 'Empleado no vinculado. Usa POST /api/employees/me/venue' });
    return;
  }

  next();
}
