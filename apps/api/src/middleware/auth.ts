import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'EMPLOYEE';
  employeeId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export function extractUserFromToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error('[AUTH] JWT_SECRET no está configurado');
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }

    const secret: string = process.env.JWT_SECRET;
    // @ts-expect-error - process.env.JWT_SECRET es string después del check
    const decoded = jwt.verify(token, secret) as Record<string, unknown>;
    
    if (
      typeof decoded.userId === 'string' &&
      typeof decoded.email === 'string' &&
      typeof decoded.role === 'string'
    ) {
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role as JWTPayload['role'],
        employeeId: typeof decoded.employeeId === 'string' ? decoded.employeeId : undefined,
      };
      next();
    } else {
      res.status(401).json({ error: 'Token no válido' });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expirado' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }
    console.error('[AUTH] Error verificando token:', error);
    res.status(401).json({ error: 'Token no válido' });
  }
}

export function requireRole(...allowedRoles: JWTPayload['role'][]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'No tienes permisos para esta acción' });
      return;
    }

    next();
  };
}

export function generateAccessToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está configurado');
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(userId: string): string {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET no está configurado');
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign({ userId, type: 'refresh' }, secret, options);
}

export function verifyRefreshToken(token: string): { userId: string } {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET no está configurado');
  }

  const decoded = jwt.verify(token, secret) as { userId: string; type: string };
  
  if (decoded.type !== 'refresh') {
    throw new Error('Token inválido');
  }

  return { userId: decoded.userId };
}
