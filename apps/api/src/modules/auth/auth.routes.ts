import { Router } from 'express';
import { validateSchema } from '@/middlewares/validateSchema.ts';
import { protect } from '@/middlewares/protect.ts';
import { authMiddleware } from '@/middlewares/auth.ts';
import { authController } from '@/bootstrap/container.ts';
import {
  loginRequestSchema,
  registerRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  changePasswordRequestSchema,
  updateProfileRequestSchema,
} from '@modules/auth/auth.schema.ts';
import {
  loginLimiter,
  forgotPasswordLimiter,
  refreshLimiter,
} from '@/middlewares/rateLimit.ts';

const router: Router = Router();

// --- Public Routes ---

router.post(
  '/login',
  loginLimiter,
  validateSchema(loginRequestSchema),
  authController.login,
);
router.post(
  '/register',
  validateSchema(registerRequestSchema),
  authController.register,
);
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  validateSchema(forgotPasswordRequestSchema),
  authController.forgotPassword,
);
router.post(
  '/reset-password',
  validateSchema(resetPasswordRequestSchema),
  authController.resetPassword,
);
router.post('/refresh', refreshLimiter, authController.refreshToken);
router.post('/logout', authController.logout);

// --- Auth-only Routes (no tenant context required) ---

router.get('/me', authMiddleware, authController.getMe);

// --- Tenant-Protected Routes ---

router.use(protect);

router.post(
  '/change-password',
  validateSchema(changePasswordRequestSchema),
  authController.changePassword,
);
router.put(
  '/profile',
  validateSchema(updateProfileRequestSchema),
  authController.updateProfile,
);

export default router;
