import { Router, Request, Response, NextFunction } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { extractUserFromToken, AuthenticatedRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/handlers.js';

const router: Router = Router();

router.post(
  '/login',
  asyncHandler(authController.login.bind(authController))
);

router.post(
  '/refresh',
  asyncHandler(authController.refresh.bind(authController))
);

router.post(
  '/logout',
  extractUserFromToken,
  asyncHandler(authController.logout.bind(authController))
);

router.post(
  '/logout-all',
  extractUserFromToken,
  asyncHandler(authController.logoutAll.bind(authController))
);

router.get(
  '/me',
  extractUserFromToken,
  asyncHandler(authController.me.bind(authController))
);

export default router;
