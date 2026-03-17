import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const app = express();

/**
 * Middleware Order (CRÍTICO para seguridad)
 * 
 * 1. Helmet - Security Headers
 * 2. CORS - Cross-Origin Resource Sharing
 * 3. Body Parser - Parse request bodies
 * 4. Cookie Parser - Parse cookies
 * 5. Morgan/Winston - Logging
 * 6. Rate Limiter - DDoS protection
 */

export function setupMiddlewares(app: express.Application): void {
  
  // 1. Helmet - Security Headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.mercadopago.com"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // 2. CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
  }));

  // 3. Body Parser (limit 10kb)
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // 4. Cookie Parser
  app.use(cookieParser());

  // 5. Morgan - HTTP Logging
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  // 6. Rate Limiter - Global
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', globalLimiter);

  // 7. Rate Limiter - Auth (stricter)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5'),
    skipSuccessfulRequests: true,
    message: { error: 'Too many login attempts, please try again later.' },
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
}
