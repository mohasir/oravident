import { Router } from 'express';
import { validateSchema } from '@/middlewares/validateSchema.ts';
import { protect } from '@/middlewares/protect.ts';
import { authController } from '@/bootstrap/container.ts';
import {
  loginRequestSchema,
  registerRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  changePasswordRequestSchema,
  updateProfileRequestSchema,
} from '@modules/auth/auth.schema.ts';

const router: Router = Router();

// --- Public Routes ---

router.post('/login', validateSchema(loginRequestSchema), authController.login);
router.post(
  '/register',
  validateSchema(registerRequestSchema),
  authController.register,
);
router.post(
  '/forgot-password',
  validateSchema(forgotPasswordRequestSchema),
  authController.forgotPassword,
);
router.post(
  '/reset-password',
  validateSchema(resetPasswordRequestSchema),
  authController.resetPassword,
);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// --- Protected Routes ---

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
