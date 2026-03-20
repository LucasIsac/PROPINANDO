import { Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export function globalErrorHandler(
  err: Error,
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ERROR]', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err instanceof ValidationError && err.errors && { errors: err.errors }),
    });
    return;
  }

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message;

  res.status(500).json({
    status: 'error',
    message,
  });
}

export function notFoundHandler(
  req: AuthenticatedRequest,
  res: Response
): void {
  res.status(404).json({
    status: 'error',
    message: `Ruta ${req.method} ${req.path} no encontrada`,
  });
}

export function asyncHandler(
  fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
