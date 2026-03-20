declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;
      JWT_REFRESH_SECRET?: string;
      JWT_REFRESH_EXPIRES_IN?: string;
      DATABASE_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
      FRONTEND_URL?: string;
      RATE_LIMIT_MAX_REQUESTS?: string;
      AUTH_RATE_LIMIT_MAX_REQUESTS?: string;
      MP_ACCESS_TOKEN?: string;
      MP_CLIENT_ID?: string;
      MP_CLIENT_SECRET?: string;
      MP_WEBHOOK_SECRET?: string;
    }
  }
}

export {};
