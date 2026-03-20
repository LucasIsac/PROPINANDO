import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { authService } from '../services/auth.service.js';
import { ValidationError, UnauthorizedError } from '../utils/errors.js';

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export class AuthController {
  async login(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const parseResult = LoginSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.errors.map((err: { path: (string | number)[]; message: string }) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ValidationError('Validación fallida', errors);
      }

      const { email, password } = parseResult.data;
      const result = await authService.login(email, password);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new ValidationError('refreshToken es requerido');
      }

      const result = await authService.refreshTokens(refreshToken);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('No autenticado');
      }

      const { refreshToken } = req.body;
      await authService.logout(req.user.userId, refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Sesión cerrada correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async logoutAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('No autenticado');
      }

      await authService.logoutAll(req.user.userId);

      res.status(200).json({
        status: 'success',
        message: 'Todas las sesiones cerradas',
      });
    } catch (error) {
      next(error);
    }
  }

  async me(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('No autenticado');
      }

      res.status(200).json({
        status: 'success',
        data: {
          userId: req.user.userId,
          email: req.user.email,
          role: req.user.role,
          employeeId: req.user.employeeId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
