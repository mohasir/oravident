import { Router } from 'express';
import { validateSchema } from '@/middlewares/validateSchema.ts';
import { protect } from '@/middlewares/protect.ts';
import { authController } from '@modules/auth/auth.controller.ts';
import { 
  loginSchema, 
  registerSchema, 
  inviteWorkerSchema, 
  acceptInvitationSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema
} from '@modules/auth/auth.schema.ts';

const router: Router = Router();

// --- Public Routes ---
router.post('/login', validateSchema(loginSchema), authController.login);
router.post('/register', validateSchema(registerSchema), authController.register);
router.post('/forgot-password', validateSchema(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateSchema(resetPasswordSchema), authController.resetPassword);
router.post('/invitations/accept', validateSchema(acceptInvitationSchema), authController.acceptInvitation);

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// --- Protected Routes ---
router.use(protect);

router.post('/invitations', validateSchema(inviteWorkerSchema), authController.inviteWorker);
router.post('/change-password', validateSchema(changePasswordSchema), authController.changePassword);
router.put('/profile', validateSchema(updateProfileSchema), authController.updateProfile);

export default router;