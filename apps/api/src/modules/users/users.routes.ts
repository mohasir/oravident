import { Router } from 'express';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { protect } from '@middlewares/protect.ts';
import { guardMiddleware } from '@middlewares/guard.ts';
import { usersController } from '@/bootstrap/container.ts';
import {
  createUserRequestSchema,
  getUsersRequestSchema,
  updateUserRequestSchema,
  getUserRequestSchema,
} from '@modules/users/users.schema.ts';
import { PERMISSIONS } from '@repo/guards';

const router: Router = Router();

router.use(protect);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_USER]),
  validateSchema(getUsersRequestSchema),
  usersController.getAllUsers,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_USER]),
  validateSchema(getUserRequestSchema),
  usersController.getUser,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_USER]),
  validateSchema(createUserRequestSchema),
  usersController.createUser,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_USER]),
  validateSchema(updateUserRequestSchema),
  usersController.updateUser,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_USER]),
  validateSchema(getUserRequestSchema),
  usersController.deleteUser,
);

export default router;
