import { Router } from 'express';
import { validateSchema } from '@middlewares/validateSchema.ts';
import { protect } from '@middlewares/protect.ts';
import { guardMiddleware, roleGuardMiddleware } from '@middlewares/guard.ts';
import { branchesController } from '@/bootstrap/container.ts';
import {
  createBranchRequestSchema,
  createBranchSuperadminRequestSchema,
  updateBranchRequestSchema,
  getBranchesRequestSchema,
  getBranchRequestSchema,
} from '@modules/branches/branches.schema.ts';
import { PERMISSIONS, ROLES } from '@repo/guards';
import { idParamRequest } from '@common/types/requests.ts';
import branchSchedulesRoutes from '@modules/branches/schedule/branch_schedules.routes.ts';

const router: Router = Router();

router.use(protect);

router.get(
  '/',
  guardMiddleware([PERMISSIONS.LIST_BRANCH]),
  validateSchema(getBranchesRequestSchema),
  branchesController.getBranches,
);

router.post(
  '/',
  guardMiddleware([PERMISSIONS.CREATE_BRANCH]),
  validateSchema(createBranchRequestSchema),
  branchesController.createBranch,
);

router.post(
  '/clinic/:clinicId',
  roleGuardMiddleware([ROLES.SUPERADMIN]),
  validateSchema(createBranchSuperadminRequestSchema),
  branchesController.createBranchForSuperadmin,
);

router.get(
  '/:id',
  guardMiddleware([PERMISSIONS.GET_BRANCH]),
  validateSchema(getBranchRequestSchema),
  branchesController.getBranch,
);

router.patch(
  '/:id',
  guardMiddleware([PERMISSIONS.UPDATE_BRANCH]),
  validateSchema(updateBranchRequestSchema),
  branchesController.updateBranch,
);

router.delete(
  '/:id',
  guardMiddleware([PERMISSIONS.DELETE_BRANCH]),
  validateSchema(idParamRequest),
  branchesController.deleteBranch,
);

router.use('/:branchId/schedules', branchSchedulesRoutes);

export default router;
