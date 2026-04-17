import { Router } from 'express';
import { validateSchema } from '@/middlewares/validateSchema.ts';
import { protect } from '@/middlewares/protect.ts';
import { userInvitationsController } from '@/bootstrap/container.ts';
import {
  sendInvitationSchema,
  acceptInvitationSchema,
} from '@modules/userInvitations/userInvitations.schema.ts';

const router: Router = Router();

// --- Public Routes ---
router.get(
  '/:token',
  validateSchema(),
  userInvitationsController.validateInvitation,
);
router.post(
  '/:token/accept',
  validateSchema(acceptInvitationSchema),
  userInvitationsController.acceptInvitation,
);

// --- Protected Routes ---
router.use(protect);

router.post(
  '/',
  validateSchema(sendInvitationSchema),
  userInvitationsController.sendInvitation,
);

export default router;
