import rateLimit from 'express-rate-limit';

export const rateLimitConfig = {
  enableLoginLimit: false, // TODO: Cambiar a true en producción
};

const dummyLimiter = (req: any, res: any, next: any) => next();

export const loginLimiter = rateLimitConfig.enableLoginLimit
  ? rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: 'Too many login attempts, please try again in 15 minutes.',
      },
    })
  : dummyLimiter;

export const forgotPasswordLimiter = rateLimitConfig.enableLoginLimit
  ? rateLimit({
      windowMs: 60 * 60 * 1000,
      limit: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message:
          'Too many password reset requests, please try again in 1 hour.',
      },
    })
  : dummyLimiter;

export const refreshLimiter = rateLimitConfig.enableLoginLimit
  ? rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message:
          'Too many token refresh attempts, please try again in 15 minutes.',
      },
    })
  : dummyLimiter;
