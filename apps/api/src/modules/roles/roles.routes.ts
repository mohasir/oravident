import { Router } from 'express';
import { validateSchema } from '@/middlewares/validateSchema.ts';
import { protect } from '@/middlewares/protect.ts';
import { rolesController } from '@/bootstrap/container.ts';
import {
  createRoleRequestSchema,
  getRolesRequestSchema,
  getRoleRequestSchema,
  updateRoleRequestSchema,
} from './roles.schema.ts';
import { commonIdParamSchema } from '@/common/types/requests.ts';

const router: Router = Router();

router.use(protect);

router.get(
  '/',
  validateSchema(getRolesRequestSchema),
  rolesController.getRoles,
);

router.get(
  '/:id',
  validateSchema(getRoleRequestSchema),
  rolesController.getRole,
);

router.post(
  '/',
  validateSchema(createRoleRequestSchema),
  rolesController.createRole,
);

router.put(
  '/:id',
  validateSchema(updateRoleRequestSchema),
  rolesController.updateRole,
);

router.delete(
  '/:id',
  validateSchema(commonIdParamSchema),
  rolesController.deleteRole,
);

export default router;
