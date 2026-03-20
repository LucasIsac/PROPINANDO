import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/client.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  JWTPayload,
} from '../middleware/auth.js';
import { UnauthorizedError, NotFoundError, ConflictError } from '../utils/errors.js';

const prisma = new PrismaClient();

export interface LoginResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    employeeId?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employee: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Usuario desactivado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee?.id,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(user.id);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        employeeId: user.employee?.id,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<RefreshResult> {
    const payload = verifyRefreshToken(refreshToken);

    const storedTokens = await prisma.refreshToken.findMany({
      where: {
        userId: payload.userId,
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    let validToken = false;
    for (const stored of storedTokens) {
      const isValid = await bcrypt.compare(refreshToken, stored.tokenHash);
      if (isValid) {
        validToken = true;
        break;
      }
    }

    if (!validToken) {
      throw new UnauthorizedError('Token de refresh inválido o expirado');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        employee: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuario no disponible');
    }

    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee?.id,
    };

    const newAccessToken = generateAccessToken(jwtPayload);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revoked: true },
    });

    const refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async logoutAll(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}

export const authService = new AuthService();
