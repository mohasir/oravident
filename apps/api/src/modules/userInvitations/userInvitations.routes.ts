import { Router } from 'express';
import { validateSchema } from '@/middlewares/validateSchema.ts';
import { protect } from '@/middlewares/protect.ts';
import { userInvitationsController } from '@/bootstrap/container.ts';
import {
  sendInvitationRequestSchema,
  acceptInvitationRequestSchema,
  validateInvitationRequestSchema,
} from '@modules/userInvitations/userInvitations.schema.ts';

const router: Router = Router();

// --- Public Routes ---
router.get(
  '/:token',
  validateSchema(validateInvitationRequestSchema),
  userInvitationsController.validateInvitation,
);
router.post(
  '/:token/accept',
  validateSchema(acceptInvitationRequestSchema),
  userInvitationsController.acceptInvitation,
);

// --- Protected Routes ---
router.use(protect);

router.post(
  '/',
  validateSchema(sendInvitationRequestSchema),
  userInvitationsController.sendInvitation,
);

export default router;
