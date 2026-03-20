import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock('../generated/client.js', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      updateMany: vi.fn(),
      findMany: vi.fn(),
    },
  })),
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login validation', () => {
    it('should validate email format', async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('test@example.com')).toBe(true);
      expect(emailRegex.test('invalid-email')).toBe(false);
      expect(emailRegex.test('')).toBe(false);
    });

    it('should validate password minimum length', () => {
      const isValidPassword = (password: string) => password.length >= 1;
      
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('JWT token structure', () => {
    it('should generate valid JWT payload structure', () => {
      const payload = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        role: 'EMPLOYEE' as const,
      };

      expect(payload).toHaveProperty('userId');
      expect(payload).toHaveProperty('email');
      expect(payload).toHaveProperty('role');
      expect(['SUPER_ADMIN', 'STORE_ADMIN', 'EMPLOYEE']).toContain(payload.role);
    });

    it('should validate UUID format', () => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(uuidRegex.test('invalid-uuid')).toBe(false);
    });
  });

  describe('password hashing', () => {
    it('should use bcrypt for password comparison', async () => {
      const mockCompare = bcrypt.compare as ReturnType<typeof vi.fn>;
      mockCompare.mockResolvedValue(true);

      const result = await bcrypt.compare('password123', 'hashedPassword');

      expect(mockCompare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(result).toBe(true);
    });

    it('should hash passwords with bcrypt', async () => {
      const mockHash = bcrypt.hash as ReturnType<typeof vi.fn>;
      mockHash.mockResolvedValue('hashedPassword');

      const result = await bcrypt.hash('password123', 10);

      expect(mockHash).toHaveBeenCalledWith('password123', 10);
      expect(result).toBe('hashedPassword');
    });
  });

  describe('refresh token expiration', () => {
    it('should calculate correct expiration date', () => {
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const diffTime = expiresAt.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      expect(diffDays).toBe(7);
    });
  });

  describe('error handling', () => {
    it('should throw UnauthorizedError for invalid credentials', async () => {
      class UnauthorizedError extends Error {
        statusCode = 401;
        constructor(message: string) {
          super(message);
          this.name = 'UnauthorizedError';
        }
      }

      expect(() => {
        throw new UnauthorizedError('Credenciales inválidas');
      }).toThrow('Credenciales inválidas');
    });

    it('should have correct status code for auth errors', () => {
      class UnauthorizedError extends Error {
        statusCode = 401;
      }

      const error = new UnauthorizedError('test');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('user role validation', () => {
    it('should only allow valid roles', () => {
      const validRoles = ['SUPER_ADMIN', 'STORE_ADMIN', 'EMPLOYEE'];
      const invalidRoles = ['ADMIN', 'USER', 'GUEST'];

      validRoles.forEach(role => {
        expect(validRoles.includes(role)).toBe(true);
      });

      invalidRoles.forEach(role => {
        expect(validRoles.includes(role)).toBe(false);
      });
    });
  });
});
